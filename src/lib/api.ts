/**
 * API Service Layer
 *
 * Abstracts data fetching to simulate backend API calls.
 * In production (GitHub Pages), this fetches from static JSON files.
 * The structure mimics real API endpoints for easy migration to a real backend.
 */

// Base path for API endpoints - adjust if using basePath in next.config.js
const API_BASE = '/api';

// Supported years for launch data
export const SUPPORTED_YEARS = [2025, 2026] as const;
export type SupportedYear = (typeof SUPPORTED_YEARS)[number];

// Types
export interface SpaceXLaunch {
  flight: number;
  time: string;
  rocket: string;
  site: string;
  mission: string;
  mass: string;
  orbit: string;
}

export interface WorldLaunch {
  time: string;
  org: {
    info: string;
    country: string;
  };
}

export interface LaunchData {
  spaceX: SpaceXLaunch[];
  world: WorldLaunch[];
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchJSON<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} for ${url}`);
  }

  return response.json();
}

/**
 * Fetch SpaceX/Falcon 9 launch data for a specific year
 */
export async function getSpaceXLaunches(year: SupportedYear = 2025): Promise<SpaceXLaunch[]> {
  return fetchJSON<SpaceXLaunch[]>(`/f9_launches_${year}.json`);
}

/**
 * Fetch world launch data for a specific year
 */
export async function getWorldLaunches(year: SupportedYear = 2025): Promise<WorldLaunch[]> {
  return fetchJSON<WorldLaunch[]>(`/world_launches_${year}.json`);
}

/**
 * Fetch all launch data for a specific year in parallel
 */
export async function getAllLaunchData(year: SupportedYear = 2025): Promise<LaunchData> {
  const [spaceX, world] = await Promise.all([
    getSpaceXLaunches(year),
    getWorldLaunches(year),
  ]);

  return { spaceX, world };
}

/**
 * API endpoints reference (for documentation)
 *
 * GET /api/f9_launches_2025.json     - SpaceX Falcon 9 launches 2025
 * GET /api/f9_launches_2026.json     - SpaceX Falcon 9 launches 2026
 * GET /api/world_launches_2025.json  - World orbital launches 2025
 * GET /api/world_launches_2026.json  - World orbital launches 2026
 */
