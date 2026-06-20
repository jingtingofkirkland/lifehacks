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

    // Countries collapsed into the single "Europe" bucket — covers EU members,
    // ESA participants (Norway, UK), and other European launchers.
    const EUROPE_COUNTRIES = new Set([
      'France', 'Germany', 'Italy', 'United Kingdom', 'Spain', 'Netherlands',
      'Belgium', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Portugal', 'Poland',
      'Austria', 'Ireland', 'Greece', 'Czech Republic', 'Hungary', 'Romania',
      'European Space Agency', 'ESA', 'Europe',
    ]);
    const EUROPE_ORGS = new Set(['Arianespace', 'ESA', 'European Space Agency']);
    const groupKey = (item: { org: string; country: string }) => {
      if (item.org === 'SpaceX') return 'SpaceX';
      if (EUROPE_ORGS.has(item.org) || EUROPE_COUNTRIES.has(item.country)) return 'Europe';
      return item.country;
    };

    const parsedData = data
      .map(d => ({
        time: new Date(`${d.time} ${dataYear}`),
        org: d.org.info,
        country: d.org.country,
      }))
      // Drop entries with unparseable timestamps (e.g. time ranges like
      // "18 March 00:00 - 04:00") — otherwise NaN downstream breaks the chart.
      .filter(d => !isNaN(d.time.getTime()));

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

    // Tag each launch with its global time-ordered index, then bucket by display group.
    const indexedData = parsedData.map((d, i) => ({ ...d, globalIdx: i }));
    const groupbyCountry = indexedData.reduce((acc, item) => {
      const key = groupKey(item);
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof indexedData>);

    const dataToDraw = Object.keys(groupbyCountry).map(name => ({
      name,
      launches: groupbyCountry[name],
      // Global indices of this group's launches, ascending — used to compute
      // smooth fractional counts as the animation progresses launch-by-launch.
      positions: groupbyCountry[name].map(d => d.globalIdx),
    })).sort((a, b) => b.launches.length - a.launches.length);

    const logicalHeight = Math.max(400, (dataToDraw.length + 1) * (barHeight + barGap) + barGap);
    const ctx = setupHighResCanvas(canvas, logicalWidth, logicalHeight);
    if (!ctx) return;

    const chartWidth = logicalWidth;
    const chartHeight = logicalHeight;
    const totalLaunches = indexedData.length;
    // Pace the animation by launch count, not calendar days. ~12 launches/sec
    // gives a comfortable ~14s run for a typical full year (~165 launches).
    const LAUNCHES_PER_SEC = 12;
    const animationDuration = Math.max(5000, (totalLaunches / LAUNCHES_PER_SEC) * 1000);
    const startTime = performance.now();

    let animationId: number;
    let animationComplete = false;

    // For each group, compute the smooth count at a given fractional global index.
    // Integer part = launches already passed; fractional part credits the in-progress
    // launch only to its own group, so the bar grows continuously instead of jumping.
    const countAt = (group: typeof dataToDraw[number], shownF: number) => {
      const shownInt = Math.floor(shownF);
      const frac = shownF - shownInt;
      const positions = group.positions;
      let count = 0;
      for (const pos of positions) {
        if (pos < shownInt) count += 1;
        else if (pos === shownInt) { count += frac; break; }
        else break;
      }
      return count;
    };

    function animate(now: number) {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(CHART_CONFIG.SCALE_FACTOR, 0, 0, CHART_CONFIG.SCALE_FACTOR, 0, 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);

      const progress = Math.min((now - startTime) / animationDuration, 1);
      const shownF = progress * totalLaunches;
      const shownInt = Math.min(Math.floor(shownF), totalLaunches - 1);
      const currentDate = indexedData[Math.max(shownInt, 0)].time;

      let maxCurrentLaunches = 0;
      let leaderName: string | null = null;
      const counts: Record<string, number> = {};

      dataToDraw.forEach(group => {
        const c = countAt(group, shownF);
        counts[group.name] = c;
        if (c > maxCurrentLaunches) {
          maxCurrentLaunches = c;
          leaderName = group.name;
        }
      });

      ctx.fillStyle = CHART_CONFIG.COLORS.DATE_TEXT;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);

      if (maxCurrentLaunches > 0) {
        dataToDraw.forEach((group, index) => {
          const count = counts[group.name];
          const isLeader = group.name === leaderName;
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
          const displayName = group.name === 'United States' ? 'US' : group.name;
          ctx.fillText(displayName, 5, y + barHeight / 2 + 5);
          ctx.fillText(String(Math.round(count)), x + barLength + 5, y + barHeight / 2 + 5);

          if (isLeader) {
            ctx.strokeStyle = CHART_CONFIG.COLORS.LEADER_HIGHLIGHT;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barLength, barHeight);
          }
        });
      }

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
