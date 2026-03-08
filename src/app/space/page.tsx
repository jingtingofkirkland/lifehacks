'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Rocket, Loader2 } from 'lucide-react';
import {
  getAllLaunchData,
  SUPPORTED_YEARS,
  type SupportedYear,
  type SpaceXLaunch,
  type WorldLaunch,
} from '@/lib/api';
import { useChartRecorder } from './useChartRecorder';
import { WorldChart } from './WorldChart';
import { SpaceXChart } from './SpaceXChart';
import { BoosterChart } from './BoosterChart';

function YearTabs({
  selectedYear,
  onYearChange,
  isLoading,
}: {
  selectedYear: SupportedYear;
  onYearChange: (year: SupportedYear) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {SUPPORTED_YEARS.map((year) => (
        <Button
          key={year}
          variant="outline"
          size="lg"
          disabled={isLoading}
          onClick={() => onYearChange(year)}
          className={`
            px-6 py-2 font-bold transition-all duration-300
            ${selectedYear === year
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300'
            }
          `}
        >
          {year}
        </Button>
      ))}
    </div>
  );
}

export default function SpacePage() {
  const [selectedYear, setSelectedYear] = useState<SupportedYear>(SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]);
  const [isLoading, setIsLoading] = useState(false);
  const [spaceXData, setSpaceXData] = useState<SpaceXLaunch[] | null>(null);
  const [worldData, setWorldData] = useState<WorldLaunch[] | null>(null);
  const [worldTitle, setWorldTitle] = useState(`World Counts ${selectedYear}`);
  const [spaceXTitle, setSpaceXTitle] = useState(`SpaceX Launches and Mass ${selectedYear}`);
  const [f9Title, setF9Title] = useState('F9 Boosters Flight Counts');

  const [worldAnimKey, setWorldAnimKey] = useState(0);
  const [spaceXAnimKey, setSpaceXAnimKey] = useState(0);
  const [f9AnimKey, setF9AnimKey] = useState(0);

  const worldRecorder = useChartRecorder();
  const spaceXRecorder = useChartRecorder();
  const f9Recorder = useChartRecorder();

  useEffect(() => {
    setIsLoading(true);
    getAllLaunchData(selectedYear)
      .then(({ spaceX, world }) => {
        setSpaceXData(spaceX);
        setWorldData(world);
        setWorldAnimKey(k => k + 1);
        setSpaceXAnimKey(k => k + 1);
        setF9AnimKey(k => k + 1);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedYear]);

  const handleYearChange = useCallback((year: SupportedYear) => {
    if (year !== selectedYear) {
      worldRecorder.reset();
      spaceXRecorder.reset();
      f9Recorder.reset();
      setSelectedYear(year);
    }
  }, [selectedYear, worldRecorder, spaceXRecorder, f9Recorder]);

  const handleWorldRecord = useCallback(() => {
    setWorldAnimKey(k => k + 1);
  }, []);

  const handleSpaceXRecord = useCallback(() => {
    setSpaceXAnimKey(k => k + 1);
  }, []);

  const handleF9Record = useCallback(() => {
    setF9AnimKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(2px_2px_at_20%_30%,white,transparent),radial-gradient(2px_2px_at_60%_70%,white,transparent),radial-gradient(1px_1px_at_50%_50%,white,transparent)] bg-[length:200%_200%] animate-pulse opacity-20 pointer-events-none" />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Space Launch Analytics
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Real-time Mission Data Visualization</p>
        </header>

        <YearTabs selectedYear={selectedYear} onYearChange={handleYearChange} isLoading={isLoading} />

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mr-3" />
            <span className="text-slate-400 text-lg">Loading {selectedYear} data...</span>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-8">
            <WorldChart
              data={worldData}
              selectedYear={selectedYear}
              animKey={worldAnimKey}
              recorder={worldRecorder}
              title={worldTitle}
              onTitleChange={setWorldTitle}
              onRecord={handleWorldRecord}
            />
            <SpaceXChart
              data={spaceXData}
              selectedYear={selectedYear}
              animKey={spaceXAnimKey}
              recorder={spaceXRecorder}
              title={spaceXTitle}
              onTitleChange={setSpaceXTitle}
              onRecord={handleSpaceXRecord}
            />
            <BoosterChart
              data={spaceXData}
              selectedYear={selectedYear}
              animKey={f9AnimKey}
              recorder={f9Recorder}
              title={f9Title}
              onTitleChange={setF9Title}
              onRecord={handleF9Record}
            />
          </div>
        )}

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
