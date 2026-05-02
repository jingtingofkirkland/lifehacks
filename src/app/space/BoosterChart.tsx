'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CHART_CONFIG, EXPENDED_BOOSTERS, setupHighResCanvas, getSortedUniqueData, type BoosterData } from './chart-config';
import { RecordButton, type ChartRecorder } from './useChartRecorder';
import { type SpaceXLaunch } from '@/lib/api';

interface BoosterChartProps {
  data: SpaceXLaunch[] | null;
  selectedYear: number;
  animKey: number;
  recorder: ChartRecorder;
  title: string;
  onTitleChange: (title: string) => void;
  onRecord: () => void;
}

export function BoosterChart({ data, selectedYear, animKey, recorder, title, onTitleChange, onRecord }: BoosterChartProps) {
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

    if (data.length === 0) {
      const logicalWidth = 800;
      const ctx = setupHighResCanvas(canvas, logicalWidth, 200);
      if (ctx) {
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`No booster data available for ${selectedYear}`, logicalWidth / 2, 100);
      }
      onTitleChange(`F9 Boosters Flight Counts (0 boosters)`);
      return;
    }

    const boosterData: BoosterData[] = data.flatMap(x => {
      return x.rocket.split(/\s*\/\s*/).map(part => {
        const r = part.trim().split(/[-\.‑]/);
        return { name: r[0].trim(), flights: Number(r[1]) || 1 };
      });
    });

    // Count how many flights each booster did this year
    const yearlyCount: Record<string, number> = {};
    boosterData.forEach(b => { yearlyCount[b.name] = (yearlyCount[b.name] || 0) + 1; });

    const sortedData = getSortedUniqueData(boosterData).map(b => ({
      ...b,
      yearlyFlights: yearlyCount[b.name] || 1,
    }));
    const expendedCount = sortedData.filter(b => EXPENDED_BOOSTERS.has(b.name)).length;
    onTitleChange(`F9 Boosters Flight Counts (${sortedData.length} boosters, ${expendedCount} expended)`);

    const logicalWidth = 800;
    const logicalHeight = Math.max(CHART_CONFIG.MIN_CANVAS_HEIGHT, sortedData.length * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP);
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;

    const maxFlights = Math.max(...sortedData.map(b => b.flights));
    const startTime = performance.now();
    let animationComplete = false;

    let animationId: number;
    function animate(currentTime: number) {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(CHART_CONFIG.SCALE_FACTOR, 0, 0, CHART_CONFIG.SCALE_FACTOR, 0, 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / CHART_CONFIG.ANIMATION_DURATION, 1);

      sortedData.forEach((booster, index) => {
        const finalBarWidth = (booster.flights / maxFlights) * (chartWidth - 100);
        const currentBarWidth = finalBarWidth * progress;
        const x = 50;
        const y = index * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP;
        const isExpended = EXPENDED_BOOSTERS.has(booster.name);

        ctx.fillStyle = CHART_CONFIG.COLORS.PRIMARY_BAR;
        ctx.fillRect(x, y, currentBarWidth, CHART_CONFIG.BAR_HEIGHT);

        ctx.fillStyle = isExpended ? CHART_CONFIG.COLORS.TEXT_EXPENDED : CHART_CONFIG.COLORS.TEXT;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(booster.name, 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);

        if (progress === 1) {
          const label = booster.yearlyFlights && booster.yearlyFlights > 1
            ? `${booster.flights} (×${booster.yearlyFlights})`
            : String(booster.flights);
          ctx.fillText(label, x + currentBarWidth + 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);
          if (booster.yearlyFlights && booster.yearlyFlights > 1) {
            // Highlight yearly count in cyan
            const totalWidth = ctx.measureText(String(booster.flights) + ' ').width;
            ctx.fillStyle = CHART_CONFIG.COLORS.COUNT_LINE;
            ctx.fillText(`(×${booster.yearlyFlights})`, x + currentBarWidth + 5 + totalWidth, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);
          }
        }
      });

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
            <RecordButton recorder={recorder} onRecord={handleRecord} filename={`f9-boosters-${selectedYear}`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
