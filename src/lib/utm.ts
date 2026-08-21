export type Utm = Partial<{
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}>;

const KEY = 'utm';

export function getStoredUtm(): Utm {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}') as Utm;
  } catch {
    return {};
  }
}
