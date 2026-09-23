/**
 * Unit tests for the API service layer (src/lib/api.ts).
 *
 * The site is a static export: "API calls" are fetches of JSON files under
 * /api. These tests lock in the endpoint contract (URL shape per year),
 * error handling, and the parallel fan-out of getAllLaunchData, so a bad
 * refactor can't silently break every data-driven page.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllLaunchData, getSpaceXLaunches, getWorldLaunches } from './api';

const okResponse = (data: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => data,
  }) as Response;

const errResponse = (status: number, statusText: string) =>
  ({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  }) as Response;

describe('api service layer', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches SpaceX launches for the default year (2025)', async () => {
    const launches = [{ flight: 1, mission: 'Test Flight' }];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      okResponse(launches),
    );

    const result = await getSpaceXLaunches();

    expect(fetch).toHaveBeenCalledWith('/api/f9_launches_2025.json');
    expect(result).toEqual(launches);
  });

  it('builds the SpaceX endpoint URL from the requested year', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      okResponse([]),
    );

    await getSpaceXLaunches(2026);

    expect(fetch).toHaveBeenCalledWith('/api/f9_launches_2026.json');
  });

  it('fetches world launches from the world endpoint', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      okResponse([]),
    );

    await getWorldLaunches(2025);

    expect(fetch).toHaveBeenCalledWith('/api/world_launches_2025.json');
  });

  it('throws a descriptive error on non-ok HTTP responses', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      errResponse(404, 'Not Found'),
    );

    await expect(getSpaceXLaunches()).rejects.toThrow(
      'API Error: 404 Not Found for /api/f9_launches_2025.json',
    );
  });

  it('propagates network failures instead of swallowing them', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new TypeError('fetch failed'),
    );

    await expect(getWorldLaunches()).rejects.toThrow('fetch failed');
  });

  it('getAllLaunchData fetches both datasets and merges them', async () => {
    const spaceX = [{ flight: 7, mission: 'Seven' }];
    const world = [{ time: '2025-01-01', org: { info: 'x', country: 'US' } }];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (url: string) =>
        Promise.resolve(okResponse(url.includes('f9_launches') ? spaceX : world)),
    );

    const result = await getAllLaunchData(2025);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ spaceX, world });
  });
});
