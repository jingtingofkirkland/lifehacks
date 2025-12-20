'use client';

import { useRef, useState, useCallback } from 'react';

interface RecorderOptions {
  fps?: number;
  videoBitsPerSecond?: number;
}

interface UseCanvasRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  downloadUrl: string | null;
  reset: () => void;
}

export function useCanvasRecorder(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: RecorderOptions = {}
): UseCanvasRecorderReturn {
  const { fps = 30, videoBitsPerSecond = 5000000 } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clear previous recording URL
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    chunksRef.current = [];

    // Create a stream from the canvas
    const stream = canvas.captureStream(fps);

    // Determine the best supported MIME type
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
    mediaRecorder.start(100); // Collect data every 100ms
    setIsRecording(true);
  }, [canvasRef, fps, videoBitsPerSecond, downloadUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const reset = useCallback(() => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    chunksRef.current = [];
  }, [downloadUrl]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    downloadUrl,
    reset,
  };
}
