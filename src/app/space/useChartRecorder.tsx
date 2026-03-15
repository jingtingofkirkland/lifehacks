'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Download, Loader2, RotateCcw, Square } from 'lucide-react';

interface RecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  downloadUrl: string | null;
  fileExtension: string;
}

export function useChartRecorder() {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isProcessing: false,
    downloadUrl: null,
    fileExtension: 'mp4',
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((canvas: HTMLCanvasElement) => {
    if (state.downloadUrl) {
      URL.revokeObjectURL(state.downloadUrl);
    }

    chunksRef.current = [];
    const stream = canvas.captureStream(30);

    const mimeTypes = [
      { type: 'video/mp4;codecs=avc1', ext: 'mp4' },
      { type: 'video/mp4', ext: 'mp4' },
      { type: 'video/webm;codecs=vp9', ext: 'webm' },
      { type: 'video/webm;codecs=vp8', ext: 'webm' },
      { type: 'video/webm', ext: 'webm' },
    ];

    let selectedMimeType = '';
    let selectedExtension = 'mp4';
    for (const { type, ext } of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        selectedExtension = ext;
        break;
      }
    }

    if (!selectedMimeType) {
      console.error('No supported MIME type found');
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 5000000,
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      setState(s => ({ ...s, isProcessing: true }));
      const blob = new Blob(chunksRef.current, { type: selectedMimeType });
      const url = URL.createObjectURL(blob);
      setState({ isRecording: false, isProcessing: false, downloadUrl: url, fileExtension: selectedExtension });
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
    setState(s => ({ ...s, isRecording: true, downloadUrl: null, fileExtension: selectedExtension }));
  }, [state.downloadUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  const reset = useCallback(() => {
    if (state.downloadUrl) {
      URL.revokeObjectURL(state.downloadUrl);
    }
    setState({ isRecording: false, isProcessing: false, downloadUrl: null, fileExtension: 'mp4' });
  }, [state.downloadUrl]);

  return { ...state, startRecording, stopRecording, reset };
}

export type ChartRecorder = ReturnType<typeof useChartRecorder>;

export function RecordButton({
  recorder,
  onRecord,
  filename,
}: {
  recorder: ChartRecorder;
  onRecord: () => void;
  filename: string;
}) {
  const handleDownload = () => {
    if (!recorder.downloadUrl) return;
    const a = document.createElement('a');
    a.href = recorder.downloadUrl;
    a.download = `${filename}.${recorder.fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex gap-2 mt-3 justify-center flex-wrap">
      {!recorder.isRecording && !recorder.downloadUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
              (window as any).fbq('trackCustom', 'RecordAnimation', { chart: filename });
            }
            onRecord();
          }}
          className="bg-slate-700/50 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400"
        >
          <Video className="h-4 w-4 mr-2" />
          Record Animation
        </Button>
      )}

      {recorder.isRecording && (
        <Button
          variant="outline"
          size="sm"
          onClick={recorder.stopRecording}
          className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </Button>
      )}

      {recorder.isProcessing && (
        <Button variant="outline" size="sm" disabled className="bg-slate-700/50">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </Button>
      )}

      {recorder.downloadUrl && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
                (window as any).fbq('trackCustom', 'DownloadRecording', { chart: filename });
              }
              handleDownload();
            }}
            className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              recorder.reset();
              onRecord();
            }}
            className="bg-slate-700/50 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Re-record
          </Button>
        </>
      )}
    </div>
  );
}
