'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CHART_CONFIG, setupHighResCanvas } from './chart-config';
import { RecordButton, type ChartRecorder } from './useChartRecorder';
import { type WorldLaunch } from '@/lib/api';

interface WorldChartProps {
  data: WorldLaunch[] | null;
  selectedYear: number;
  animKey: number;
  recorder: ChartRecorder;
  title: string;
  onTitleChange: (title: string) => void;
  onRecord: () => void;
}

export function WorldChart({ data, selectedYear, animKey, recorder, title, onTitleChange, onRecord }: WorldChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recordRequestedRef = useRef(false);

  // Start recording after animKey changes if recording was requested
  useEffect(() => {
    if (!recordRequestedRef.current) return;
    recordRequestedRef.current = false;
    const timer = setTimeout(() => {
      if (canvasRef.current) recorder.startRecording(canvasRef.current);
    }, 100);
    return () => clearTimeout(timer);
  }, [animKey]);

  const handleRecord = useCallback(() => {
    recordRequestedRef.current = true;
    onRecord();
  }, [onRecord]);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const barHeight = CHART_CONFIG.BAR_HEIGHT;
    const barGap = CHART_CONFIG.BAR_GAP;
    const dataYear = selectedYear;
    const logicalWidth = 800;

    const parsedData = data.map(d => ({
      time: new Date(`${d.time} ${dataYear}`),
      org: d.org.info,
      country: d.org.country
    }));

    onTitleChange(`World Counts ${dataYear} (Total: ${parsedData.length})`);

    if (parsedData.length === 0) {
      const ctx = setupHighResCanvas(canvas, logicalWidth, 200);
      if (ctx) {
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`No launch data available for ${dataYear}`, logicalWidth / 2, 100);
      }
      return;
    }

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
    const startDate = new Date(dataYear, 0, 1);
    const endDate = new Date(dataYear + 1, 0, 1);
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
      if (!ctx) return;
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

      const dateStillInYear = currentDate < endDate;

      if (anyLeft && dateStillInYear) {
        animationId = requestAnimationFrame(animate);
      } else if (!animationComplete) {
        animationComplete = true;
        if (recorder.isRecording) {
          setTimeout(() => recorder.stopRecording(), 500);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [data, animKey, selectedYear]);

  return (
    <Card className="bg-slate-800/70 border-cyan-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} className="rounded-lg bg-slate-900/50 max-w-full h-auto" />
          {data && data.length > 0 && (
            <RecordButton recorder={recorder} onRecord={handleRecord} filename={`world-launches-${selectedYear}`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
