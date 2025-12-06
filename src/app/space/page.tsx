'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Rocket } from 'lucide-react';
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
  COLORS: {
    PRIMARY_BAR: '#00ff88',
    BACKGROUND_BAR: '#3a4156',
    TEXT: '#e0e6ed',
    COUNT_LINE: '#00d9ff',
    MASS_LINE: '#ff2e97',
    LEADER_HIGHLIGHT: '#ffd700',
    AXIS_COLOR: '#8b95a8',
    DATE_TEXT: '#00d9ff'
  }
};

function getSortedUniqueData(data: BoosterData[]): BoosterData[] {
  const sortedData = [...data].sort((a, b) => b.flights - a.flights);
  const uniqueNames = new Set<string>();
  return sortedData.filter(item => {
    if (uniqueNames.has(item.name)) return false;
    uniqueNames.add(item.name);
    return true;
  });
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

  useEffect(() => {
    getAllLaunchData()
      .then(({ spaceX, world }) => {
        setSpaceXData(spaceX);
        setWorldData(world);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!worldData || !worldCanvasRef.current) return;
    const canvas = worldCanvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;

    const chartWidth = canvas.width;
    const barHeight = CHART_CONFIG.BAR_HEIGHT;
    const barGap = CHART_CONFIG.BAR_GAP;
    const currentYear = new Date().getFullYear();

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

    const calculatedHeight = Math.max(400, (dataToDraw.length + 1) * (barHeight + barGap) + barGap);
    canvas.height = calculatedHeight;

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
    function animate() {
      ctx.clearRect(0, 0, chartWidth, canvas.height);
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
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = CHART_CONFIG.COLORS.DATE_TEXT;
      ctx.font = '14px Arial';
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
        ctx.font = '12px Arial';
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

      const anyLeft = dataToDraw.some(org => {
        const steps = cumulativeIndex[org.name] ?? 0;
        return Math.floor(steps / interplant) < org.launches.length;
      });

      if (anyLeft) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [worldData]);

  useEffect(() => {
    if (!spaceXData || !countMassCanvasRef.current) return;
    const canvas = countMassCanvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;

    const chartWidth = canvas.width;
    const chartHeight = 600;
    canvas.height = chartHeight;
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

    let animationId: number;
    function animate(currentTime: number) {
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
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Time', chartWidth / 2, chartHeight - 10);

      ctx.save();
      ctx.translate(margin.left - 40, chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Cumulative Event Count', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(chartWidth - margin.right + 40, chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Cumulative Mass (Ton)', 0, 0);
      ctx.restore();

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
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
      ctx.fillText('Count', chartWidth - margin.right + 25, margin.top + 30);

      ctx.fillStyle = CHART_CONFIG.COLORS.MASS_LINE;
      ctx.fillRect(chartWidth - margin.right + 25, margin.top + 30, 10, 10);
      ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
      ctx.fillText('Mass', chartWidth - margin.right + 25, margin.top + 50);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [spaceXData]);

  useEffect(() => {
    if (!spaceXData || !barChartCanvasRef.current) return;
    const canvas = barChartCanvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;

    const boosterData: BoosterData[] = spaceXData.map(x => {
      const r = x.rocket.split(/[-\.‑]/);
      return { name: r[0].trim(), flights: Number(r[1]) };
    });

    const data = getSortedUniqueData(boosterData);
    setF9Title(`F9 Boosters Flight Counts (${data.length} boosters)`);

    const chartWidth = canvas.width;
    const calculatedHeight = Math.max(CHART_CONFIG.MIN_CANVAS_HEIGHT, data.length * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP);
    canvas.height = calculatedHeight;

    const maxFlights = Math.max(...data.map(b => b.flights));
    const startTime = performance.now();

    let animationId: number;
    function animate(currentTime: number) {
      ctx.clearRect(0, 0, chartWidth, calculatedHeight);
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / CHART_CONFIG.ANIMATION_DURATION, 1);

      data.forEach((booster, index) => {
        const finalBarWidth = (booster.flights / maxFlights) * (chartWidth - 100);
        const currentBarWidth = finalBarWidth * progress;
        const x = 50;
        const y = index * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP;

        ctx.fillStyle = CHART_CONFIG.COLORS.PRIMARY_BAR;
        ctx.fillRect(x, y, currentBarWidth, CHART_CONFIG.BAR_HEIGHT);

        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.font = '12px Arial';
        ctx.fillText(booster.name, 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);

        if (progress === 1) {
          ctx.fillText(String(booster.flights), x + currentBarWidth + 5, y + CHART_CONFIG.BAR_HEIGHT / 2 + 5);
        }
      });

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [spaceXData]);

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
              <canvas ref={worldCanvasRef} width={800} className="w-full rounded-lg bg-slate-900/50" />
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
              <canvas ref={countMassCanvasRef} width={800} className="w-full rounded-lg bg-slate-900/50" />
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
              <canvas ref={barChartCanvasRef} width={800} className="w-full rounded-lg bg-slate-900/50" />
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
