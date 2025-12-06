/**
 * API Service Layer
 *
 * Abstracts data fetching to simulate backend API calls.
 * In production (GitHub Pages), this fetches from static JSON files.
 * The structure mimics real API endpoints for easy migration to a real backend.
 */

// Base path for API endpoints - adjust if using basePath in next.config.js
const API_BASE = '/api';

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
 * Fetch SpaceX/Falcon 9 launch data
 */
export async function getSpaceXLaunches(): Promise<SpaceXLaunch[]> {
  return fetchJSON<SpaceXLaunch[]>('/f9_launches.json');
}

/**
 * Fetch world launch data
 */
export async function getWorldLaunches(): Promise<WorldLaunch[]> {
  return fetchJSON<WorldLaunch[]>('/world_launches.json');
}

/**
 * Fetch all launch data in parallel
 */
export async function getAllLaunchData(): Promise<LaunchData> {
  const [spaceX, world] = await Promise.all([
    getSpaceXLaunches(),
    getWorldLaunches(),
  ]);

  return { spaceX, world };
}

/**
 * API endpoints reference (for documentation)
 *
 * GET /api/f9_launches.json     - SpaceX Falcon 9 launches
 * GET /api/world_launches.json  - World orbital launches
 */
