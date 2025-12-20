'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Download, Loader2, RotateCcw, Square } from 'lucide-react';

interface RecorderOptions {
  fps?: number;
  videoBitsPerSecond?: number;
}

interface RecordableChartProps {
  children: (canvasRef: React.RefObject<HTMLCanvasElement>, isRecordingSession: boolean) => React.ReactNode;
  filename?: string;
  options?: RecorderOptions;
  onReplayRequest?: () => void;
}

export function RecordableChart({
  children,
  filename = 'chart-recording',
  options = {},
}: RecordableChartProps) {
  const { fps = 30, videoBitsPerSecond = 5000000 } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [recordingKey, setRecordingKey] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    chunksRef.current = [];

    const stream = canvas.captureStream(fps);

    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
    ];

    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }

    if (!selectedMimeType) {
      console.error('No supported MIME type found for recording');
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      setIsProcessing(true);

      const blob = new Blob(chunksRef.current, { type: selectedMimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      setIsProcessing(false);
      setIsRecording(false);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
    setIsRecording(true);
  }, [fps, videoBitsPerSecond, downloadUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const handleRecordClick = useCallback(() => {
    setRecordingKey(prev => prev + 1);
    setTimeout(() => {
      startRecording();
    }, 100);
  }, [startRecording]);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) return;

    const extension = 'webm';
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [downloadUrl, filename]);

  const reset = useCallback(() => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    chunksRef.current = [];
  }, [downloadUrl]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <div className="relative">
      <div key={recordingKey}>
        {children(canvasRef, isRecording)}
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        {!isRecording && !downloadUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecordClick}
            className="bg-slate-700/50 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400"
          >
            <Video className="h-4 w-4 mr-2" />
            Record Animation
          </Button>
        )}

        {isRecording && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopRecording}
            className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}

        {isProcessing && (
          <Button variant="outline" size="sm" disabled className="bg-slate-700/50">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </Button>
        )}

        {downloadUrl && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                handleRecordClick();
              }}
              className="bg-slate-700/50 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Re-record
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
