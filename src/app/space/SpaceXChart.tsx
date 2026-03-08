'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CHART_CONFIG, setupHighResCanvas } from './chart-config';
import { RecordButton, type ChartRecorder } from './useChartRecorder';
import { type SpaceXLaunch } from '@/lib/api';

interface SpaceXChartProps {
  data: SpaceXLaunch[] | null;
  selectedYear: number;
  animKey: number;
  recorder: ChartRecorder;
  title: string;
  onTitleChange: (title: string) => void;
  onRecord: () => void;
}

export function SpaceXChart({ data, selectedYear, animKey, recorder, title, onTitleChange, onRecord }: SpaceXChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recordRequestedRef = useRef(false);

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

    const logicalWidth = 800;
    const logicalHeight = 600;
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    if (data.length === 0) {
      ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`No SpaceX launch data available for ${selectedYear}`, logicalWidth / 2, logicalHeight / 2);
      onTitleChange(`SpaceX Launches and Mass ${selectedYear} (0/0 ton)`);
      return;
    }

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    const parsedData = data.map(d => ({
      time: new Date(d.time),
      mass: parseFloat(d.mass)
    })).sort((a, b) => a.time.getTime() - b.time.getTime());

    let cumulativeMass = 0;
    const chartData = parsedData.map((d, i) => ({
      time: d.time,
      count: i + 1,
      mass: Math.floor((cumulativeMass += d.mass) / 1000)
    }));

    onTitleChange(`SpaceX Launches and Mass ${selectedYear} (${parsedData.length}/${Math.floor(cumulativeMass / 1000)} ton)`);

    const minTime = chartData[0].time;
    const maxTime = chartData[chartData.length - 1].time;
    const maxCount = chartData.length;
    const maxMass = Math.max(...chartData.map(d => d.mass));

    const animationDuration = 10000;
    const startTime = performance.now();
    let animationComplete = false;

    let animationId: number;
    function animate(currentTime: number) {
      if (!ctx) return;
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
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} className="rounded-lg bg-slate-900/50 max-w-full h-auto" />
          {data && data.length > 0 && (
            <>
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
              <RecordButton recorder={recorder} onRecord={handleRecord} filename={`spacex-launches-${selectedYear}`} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
