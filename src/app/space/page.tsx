'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Rocket, Video, Download, Loader2, RotateCcw, Square } from 'lucide-react';
import {
  getAllLaunchData,
  type SpaceXLaunch,
  type WorldLaunch,
} from '@/lib/api';

interface BoosterData {
  name: string;
  flights: number;
}

const CHART_CONFIG = {
  BAR_HEIGHT: 30,
  BAR_GAP: 10,
  ANIMATION_DURATION: 1000,
  MIN_CANVAS_HEIGHT: 400,
  SCALE_FACTOR: 2, // 2x resolution for crisp text
  COLORS: {
    PRIMARY_BAR: '#00ff88',
    BACKGROUND_BAR: '#3a4156',
    TEXT: '#e0e6ed',
    TEXT_EXPENDED: '#ff4444', // Red color for expended boosters
    COUNT_LINE: '#00d9ff',
    MASS_LINE: '#ff2e97',
    LEADER_HIGHLIGHT: '#ffd700',
    AXIS_COLOR: '#8b95a8',
    DATE_TEXT: '#00d9ff'
  }
};

// List of expended boosters (no longer in service)
const EXPENDED_BOOSTERS = new Set([
  'B1076', // Expended in 2025
]);

// Helper to setup high-resolution canvas
function setupHighResCanvas(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasRenderingContext2D | null {
  const scale = CHART_CONFIG.SCALE_FACTOR;

  // Set actual size in memory (scaled up)
  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;

  // Set display size (CSS pixels)
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Scale all drawing operations
    ctx.scale(scale, scale);
  }

  return ctx;
}

function getSortedUniqueData(data: BoosterData[]): BoosterData[] {
  const sortedData = [...data].sort((a, b) => b.flights - a.flights);
  const uniqueNames = new Set<string>();
  return sortedData.filter(item => {
    if (uniqueNames.has(item.name)) return false;
    uniqueNames.add(item.name);
    return true;
  });
}

interface RecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  downloadUrl: string | null;
  fileExtension: string;
}

function useChartRecorder() {
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

    // Prioritize MP4 for better compatibility (Safari, iOS, social media)
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

function RecordButton({
  recorder,
  onRecord,
  filename,
}: {
  recorder: ReturnType<typeof useChartRecorder>;
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
          onClick={onRecord}
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

export default function SpacePage() {
  const [spaceXData, setSpaceXData] = useState<SpaceXLaunch[] | null>(null);
  const [worldData, setWorldData] = useState<WorldLaunch[] | null>(null);
  const [worldTitle, setWorldTitle] = useState('World Counts 2025');
  const [spaceXTitle, setSpaceXTitle] = useState('SpaceX Launches and Mass 2025');
  const [f9Title, setF9Title] = useState('F9 Boosters Flight Counts');

  const worldCanvasRef = useRef<HTMLCanvasElement>(null);
  const countMassCanvasRef = useRef<HTMLCanvasElement>(null);
  const barChartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animation key states for triggering replays
  const [worldAnimKey, setWorldAnimKey] = useState(0);
  const [spaceXAnimKey, setSpaceXAnimKey] = useState(0);
  const [f9AnimKey, setF9AnimKey] = useState(0);

  // Recording states
  const worldRecorder = useChartRecorder();
  const spaceXRecorder = useChartRecorder();
  const f9Recorder = useChartRecorder();

  useEffect(() => {
    getAllLaunchData()
      .then(({ spaceX, world }) => {
        setSpaceXData(spaceX);
        setWorldData(world);
      })
      .catch(console.error);
  }, []);

  // World Launches Animation
  useEffect(() => {
    if (!worldData || !worldCanvasRef.current) return;
    const canvas = worldCanvasRef.current;

    const barHeight = CHART_CONFIG.BAR_HEIGHT;
    const barGap = CHART_CONFIG.BAR_GAP;
    const currentYear = new Date().getFullYear();
    const logicalWidth = 800;

    const parsedData = worldData.map(d => ({
      time: new Date(`${d.time} ${currentYear}`),
      org: d.org.info,
      country: d.org.country
    }));

    setWorldTitle(`World Counts 2025 (Total: ${parsedData.length})`);
    parsedData.sort((a, b) => a.time.getTime() - b.time.getTime());

    const groupbyCountry = parsedData.reduce((acc, item) => {
      const key = item.org === 'SpaceX' ? 'SpaceX' : item.country;
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof parsedData>);

    const dataToDraw = Object.keys(groupbyCountry).map(name => ({
      name,
      launches: groupbyCountry[name]
    })).sort((a, b) => b.launches.length - a.launches.length);

    const logicalHeight = Math.max(400, (dataToDraw.length + 1) * (barHeight + barGap) + barGap);
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;

    const hoursPerRender = 10;
    const startDate = new Date(2025, 0, 1);
    let hours = 0;
    const interplant = 2;
    const cumulativeIndex: Record<string, number> = {};
    const currentCounts: Record<string, number> = {};

    dataToDraw.forEach(org => {
      cumulativeIndex[org.name] = 0;
      currentCounts[org.name] = 0;
    });

    let animationId: number;
    let animationComplete = false;

    function animate() {
      ctx.save();
      ctx.setTransform(CHART_CONFIG.SCALE_FACTOR, 0, 0, CHART_CONFIG.SCALE_FACTOR, 0, 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);

      const currentDate = new Date(startDate);
      currentDate.setHours(startDate.getHours() + hours);
      hours += hoursPerRender;

      let maxCurrentLaunches = 0;
      let leaderName: string | null = null;

      dataToDraw.forEach(org => {
        const launches = org.launches;
        const stepsSoFar = cumulativeIndex[org.name] ?? 0;
        const dataIdx = Math.floor(stepsSoFar / interplant);

        if (dataIdx < launches.length && currentDate >= launches[dataIdx].time) {
          cumulativeIndex[org.name] = stepsSoFar + 1;
        }

        const updatedIdx = Math.floor((cumulativeIndex[org.name] ?? 0) / interplant);
        currentCounts[org.name] = Math.min(updatedIdx + 1, launches.length);

        if (currentCounts[org.name] > maxCurrentLaunches) {
          maxCurrentLaunches = currentCounts[org.name];
          leaderName = org.name;
        }
      });

      if (maxCurrentLaunches === 0) {
        ctx.fillStyle = CHART_CONFIG.COLORS.DATE_TEXT;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);
        ctx.restore();
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = CHART_CONFIG.COLORS.DATE_TEXT;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);

      dataToDraw.forEach((org, index) => {
        const count = currentCounts[org.name];
        const isLeader = org.name === leaderName;
        const fullWidth = chartWidth - 150;
        const barLength = isLeader ? fullWidth : (count / maxCurrentLaunches) * fullWidth;
        const x = 80;
        const y = (index + 1) * (barHeight + barGap) + barGap;

        ctx.fillStyle = CHART_CONFIG.COLORS.BACKGROUND_BAR;
        ctx.fillRect(x, y, fullWidth, barHeight);

        ctx.fillStyle = CHART_CONFIG.COLORS.PRIMARY_BAR;
        ctx.fillRect(x, y, barLength, barHeight);

        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        const displayName = org.name === 'United States' ? 'US' : org.name;
        ctx.fillText(displayName, 5, y + barHeight / 2 + 5);
        ctx.fillText(String(count), x + barLength + 5, y + barHeight / 2 + 5);

        if (isLeader) {
          ctx.strokeStyle = CHART_CONFIG.COLORS.LEADER_HIGHLIGHT;
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, barLength, barHeight);
        }
      });

      ctx.restore();

      const anyLeft = dataToDraw.some(org => {
        const steps = cumulativeIndex[org.name] ?? 0;
        return Math.floor(steps / interplant) < org.launches.length;
      });

      if (anyLeft) {
        animationId = requestAnimationFrame(animate);
      } else if (!animationComplete) {
        animationComplete = true;
        if (worldRecorder.isRecording) {
          setTimeout(() => worldRecorder.stopRecording(), 500);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [worldData, worldAnimKey]);

  // SpaceX Chart Animation
  useEffect(() => {
    if (!spaceXData || !countMassCanvasRef.current) return;
    const canvas = countMassCanvasRef.current;

    const logicalWidth = 800;
    const logicalHeight = 600;
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    const parsedData = spaceXData.map(d => ({
      time: new Date(d.time),
      mass: parseFloat(d.mass)
    })).sort((a, b) => a.time.getTime() - b.time.getTime());

    let cumulativeMass = 0;
    const chartData = parsedData.map((d, i) => ({
      time: d.time,
      count: i + 1,
      mass: Math.floor((cumulativeMass += d.mass) / 1000)
    }));

    setSpaceXTitle(`SpaceX Launches and Mass 2025 (${parsedData.length}/${Math.floor(cumulativeMass / 1000)} ton)`);

    const minTime = chartData[0].time;
    const maxTime = chartData[chartData.length - 1].time;
    const maxCount = chartData.length;
    const maxMass = Math.max(...chartData.map(d => d.mass));

    const animationDuration = 10000;
    const startTime = performance.now();
    let animationComplete = false;

    let animationId: number;
    function animate(currentTime: number) {
      ctx.save();
      ctx.setTransform(CHART_CONFIG.SCALE_FACTOR, 0, 0, CHART_CONFIG.SCALE_FACTOR, 0, 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const visiblePoints = Math.min(Math.ceil(chartData.length * progress), chartData.length);

      ctx.beginPath();
      ctx.strokeStyle = CHART_CONFIG.COLORS.AXIS_COLOR;
      ctx.lineWidth = 1;
      ctx.moveTo(margin.left, chartHeight - margin.bottom);
      ctx.lineTo(chartWidth - margin.right, chartHeight - margin.bottom);
      ctx.stroke();

      ctx.moveTo(margin.left, chartHeight - margin.bottom);
      ctx.lineTo(margin.left, margin.top);
      ctx.stroke();

      ctx.moveTo(chartWidth - margin.right, chartHeight - margin.bottom);
      ctx.lineTo(chartWidth - margin.right, margin.top);
      ctx.stroke();

      ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Time', chartWidth / 2, chartHeight - 10);

      ctx.save();
      ctx.translate(margin.left - 40, chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Cumulative Event Count', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(chartWidth - margin.right + 50, chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Cumulative Mass (Ton)', 0, 0);
      ctx.restore();

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      ctx.font = 'bold 12px Arial';
      ctx.fillText(formatDate(chartData[0].time), margin.left, chartHeight - margin.bottom + 20);
      ctx.fillText(formatDate(chartData[chartData.length - 1].time), chartWidth - margin.right, chartHeight - margin.bottom + 20);

      ctx.textAlign = 'right';
      for (let i = 0; i <= maxCount; i += Math.ceil(maxCount / 5)) {
        const y = chartHeight - margin.bottom - (i / maxCount) * plotHeight;
        ctx.fillText(String(i), margin.left - 10, y + 5);
      }

      ctx.textAlign = 'left';
      for (let i = 0; i <= maxMass; i += Math.ceil(maxMass / 5)) {
        const y = chartHeight - margin.bottom - (i / maxMass) * plotHeight;
        ctx.fillText(i.toLocaleString(), chartWidth - margin.right + 10, y + 5);
      }

      ctx.beginPath();
      ctx.strokeStyle = CHART_CONFIG.COLORS.COUNT_LINE;
      ctx.lineWidth = 2;
      for (let i = 0; i < visiblePoints; i++) {
        const x = margin.left + ((chartData[i].time.getTime() - minTime.getTime()) / (maxTime.getTime() - minTime.getTime())) * plotWidth;
        const y = chartHeight - margin.bottom - (chartData[i].count / maxCount) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = CHART_CONFIG.COLORS.MASS_LINE;
      ctx.lineWidth = 2;
      for (let i = 0; i < visiblePoints; i++) {
        const x = margin.left + ((chartData[i].time.getTime() - minTime.getTime()) / (maxTime.getTime() - minTime.getTime())) * plotWidth;
        const y = chartHeight - margin.bottom - (chartData[i].mass / maxMass) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = CHART_CONFIG.COLORS.COUNT_LINE;
      ctx.fillRect(chartWidth - margin.right + 25, margin.top + 10, 10, 10);
      ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Count', chartWidth - margin.right + 40, margin.top + 20);

      ctx.fillStyle = CHART_CONFIG.COLORS.MASS_LINE;
      ctx.fillRect(chartWidth - margin.right + 25, margin.top + 30, 10, 10);
      ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
      ctx.fillText('Mass', chartWidth - margin.right + 40, margin.top + 40);

      ctx.restore();

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else if (!animationComplete) {
        animationComplete = true;
        if (spaceXRecorder.isRecording) {
          setTimeout(() => spaceXRecorder.stopRecording(), 500);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [spaceXData, spaceXAnimKey]);

  // F9 Boosters Animation
  useEffect(() => {
    if (!spaceXData || !barChartCanvasRef.current) return;
    const canvas = barChartCanvasRef.current;

    const boosterData: BoosterData[] = spaceXData.map(x => {
      const r = x.rocket.split(/[-\.‑]/);
      return { name: r[0].trim(), flights: Number(r[1]) };
    });

    const data = getSortedUniqueData(boosterData);
    const expendedCount = data.filter(b => EXPENDED_BOOSTERS.has(b.name)).length;
    setF9Title(`F9 Boosters Flight Counts (${data.length} boosters, ${expendedCount} expended)`);

    const logicalWidth = 800;
    const logicalHeight = Math.max(CHART_CONFIG.MIN_CANVAS_HEIGHT, data.length * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP);
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;

    const maxFlights = Math.max(...data.map(b => b.flights));
    const startTime = performance.now();
    let animationComplete = false;

    let animationId: number;
    function animate(currentTime: number) {
      ctx.save();
      ctx.setTransform(CHART_CONFIG.SCALE_FACTOR, 0, 0, CHART_CONFIG.SCALE_FACTOR, 0, 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / CHART_CONFIG.ANIMATION_DURATION, 1);

      data.forEach((booster, index) => {
        const finalBarWidth = (booster.flights / maxFlights) * (chartWidth - 100);
        const currentBarWidth = finalBarWidth * progress;
        const x = 50;
        const y = index * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP;
        const isExpended = EXPENDED_BOOSTERS.has(booster.name);

        ctx.fillStyle = CHART_CONFIG.COLORS.PRIMARY_BAR;
        ctx.fillRect(x, y, currentBarWidth, CHART_CONFIG.BAR_HEIGHT);

        // Use red color for expended boosters
        ctx.fillStyle = isExpended ? CHART_CONFIG.COLORS.TEXT_EXPENDED : CHART_CONFIG.COLORS.TEXT;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(booster.name, 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);

        if (progress === 1) {
          ctx.fillText(String(booster.flights), x + currentBarWidth + 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);
        }
      });

      ctx.restore();

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else if (!animationComplete) {
        animationComplete = true;
        if (f9Recorder.isRecording) {
          setTimeout(() => f9Recorder.stopRecording(), 500);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [spaceXData, f9AnimKey]);

  // Record handlers
  const handleWorldRecord = useCallback(() => {
    setWorldAnimKey(k => k + 1);
    setTimeout(() => {
      if (worldCanvasRef.current) {
        worldRecorder.startRecording(worldCanvasRef.current);
      }
    }, 100);
  }, [worldRecorder]);

  const handleSpaceXRecord = useCallback(() => {
    setSpaceXAnimKey(k => k + 1);
    setTimeout(() => {
      if (countMassCanvasRef.current) {
        spaceXRecorder.startRecording(countMassCanvasRef.current);
      }
    }, 100);
  }, [spaceXRecorder]);

  const handleF9Record = useCallback(() => {
    setF9AnimKey(k => k + 1);
    setTimeout(() => {
      if (barChartCanvasRef.current) {
        f9Recorder.startRecording(barChartCanvasRef.current);
      }
    }, 100);
  }, [f9Recorder]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(2px_2px_at_20%_30%,white,transparent),radial-gradient(2px_2px_at_60%_70%,white,transparent),radial-gradient(1px_1px_at_50%_50%,white,transparent)] bg-[length:200%_200%] animate-pulse opacity-20 pointer-events-none" />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Space Launch Analytics
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Real-time Mission Data Visualization</p>
        </header>

        {/* Charts */}
        <div className="space-y-8">
          {/* World Launches Chart */}
          <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {worldTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <canvas ref={worldCanvasRef} width={800} className="rounded-lg bg-slate-900/50" />
                <RecordButton
                  recorder={worldRecorder}
                  onRecord={handleWorldRecord}
                  filename="world-launches-2025"
                />
              </div>
            </CardContent>
          </Card>

          {/* SpaceX Chart */}
          <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {spaceXTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <canvas ref={countMassCanvasRef} width={800} className="rounded-lg bg-slate-900/50" />
                <div className="flex justify-center gap-8 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-1 bg-cyan-400 rounded" />
                    <span className="text-slate-400">Launch Count</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-1 bg-pink-500 rounded" />
                    <span className="text-slate-400">Cumulative Mass (Tons)</span>
                  </div>
                </div>
                <RecordButton
                  recorder={spaceXRecorder}
                  onRecord={handleSpaceXRecord}
                  filename="spacex-launches-2025"
                />
              </div>
            </CardContent>
          </Card>

          {/* Boosters Chart */}
          <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {f9Title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <canvas ref={barChartCanvasRef} width={800} className="rounded-lg bg-slate-900/50" />
                <RecordButton
                  recorder={f9Recorder}
                  onRecord={handleF9Record}
                  filename="f9-boosters-2025"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
          <p>Data sourced from Wikipedia Launch Tables | Visualization powered by Canvas API</p>
          <p className="mt-2">
            Made with ❤️ for space enthusiasts |{' '}
            <Button variant="link" className="text-cyan-400 p-0 h-auto" asChild>
              <Link href="/">
                <Home className="inline h-4 w-4 mr-1" />
                Return to Home
              </Link>
            </Button>
          </p>
        </footer>
      </div>
    </div>
  );
}
