/* ─────────────────── Holiday Data for 2026 ─────────────────── */

export type HolidayType = 'holiday' | 'bsd';

export interface Holiday {
  date: string;
  name: string;
  color: string;
  sticker?: string;
  type?: HolidayType;
}

export const HOLIDAYS: Holiday[] = [
  /* ── US Holidays ── */
  { date: '2026-01-01', name: "New Year's Day",             color: 'blue',   sticker: 'fireworks' },
  { date: '2026-01-19', name: 'MLK Jr. Day',                color: 'purple', sticker: 'dove' },
  { date: '2026-02-14', name: "Valentine's Day",            color: 'pink',   sticker: 'heart' },
  { date: '2026-02-16', name: "Presidents' Day",            color: 'blue',   sticker: 'scroll' },
  { date: '2026-04-05', name: 'Easter Sunday',              color: 'pink',   sticker: 'bunny' },
  { date: '2026-05-25', name: 'Memorial Day',               color: 'red',    sticker: 'flag' },
  { date: '2026-06-19', name: 'Juneteenth',                 color: 'green',  sticker: 'fist' },
  { date: '2026-07-04', name: 'Independence Day',           color: 'red',    sticker: 'flag' },
  { date: '2026-09-07', name: 'Labor Day',                  color: 'blue',   sticker: 'star' },
  { date: '2026-10-12', name: 'Columbus Day',               color: 'orange', sticker: 'scroll' },
  { date: '2026-10-31', name: 'Halloween',                  color: 'orange', sticker: 'cat' },
  { date: '2026-11-11', name: 'Veterans Day',               color: 'red',    sticker: 'poppy' },
  { date: '2026-11-26', name: 'Thanksgiving',               color: 'orange', sticker: 'turkey' },
  { date: '2026-12-25', name: 'Christmas Day',              color: 'green',  sticker: 'tree' },
  { date: '2026-12-31', name: "New Year's Eve",             color: 'blue',   sticker: 'partyHat' },

  /* ── BSD 405 No-School Days (2025-2026) ── */
  { date: '2026-01-02', name: 'BSD No School',              color: 'yellow', type: 'bsd' },
  { date: '2026-01-26', name: 'BSD No School',              color: 'yellow', type: 'bsd' },
  { date: '2026-02-17', name: 'BSD Mid-Winter Break',       color: 'yellow', type: 'bsd' },
  { date: '2026-02-18', name: 'BSD Mid-Winter Break',       color: 'yellow', type: 'bsd' },
  { date: '2026-02-19', name: 'BSD Mid-Winter Break',       color: 'yellow', type: 'bsd' },
  { date: '2026-02-20', name: 'BSD Mid-Winter Break',       color: 'yellow', type: 'bsd' },
  { date: '2026-03-27', name: 'BSD Non-School Day',         color: 'yellow', type: 'bsd' },
  { date: '2026-04-03', name: 'BSD End of Q3',              color: 'yellow', type: 'bsd' },
  { date: '2026-04-06', name: 'BSD Spring Break',           color: 'yellow', type: 'bsd' },
  { date: '2026-04-07', name: 'BSD Spring Break',           color: 'yellow', type: 'bsd' },
  { date: '2026-04-08', name: 'BSD Spring Break',           color: 'yellow', type: 'bsd' },
  { date: '2026-04-09', name: 'BSD Spring Break',           color: 'yellow', type: 'bsd' },
  { date: '2026-04-10', name: 'BSD Spring Break',           color: 'yellow', type: 'bsd' },
  { date: '2026-05-26', name: 'BSD Non-School Day',         color: 'yellow', type: 'bsd' },
  { date: '2026-06-23', name: 'BSD Last Day',               color: 'yellow', type: 'bsd' },
  { date: '2026-06-24', name: 'BSD Non-School Day',         color: 'yellow', type: 'bsd' },
  { date: '2026-06-25', name: 'BSD Non-School Day',         color: 'yellow', type: 'bsd' },
  { date: '2026-07-03', name: 'BSD Offices Closed',         color: 'yellow', type: 'bsd' },
];

/* ─────────────────── Style Maps ─────────────────── */
export const DOT: Record<string, string> = {
  red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-green-600',
  purple: 'bg-purple-500', orange: 'bg-orange-500', pink: 'bg-pink-500', yellow: 'bg-yellow-500',
};

export const BADGE: Record<string, string> = {
  red:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  blue:   'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  green:  'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
  pink:   'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800',
};

/* ─────────────────── Constants ─────────────────── */
export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
export const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ─────────────────── Helpers ─────────────────── */
export function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
export function startDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
export function pad(n: number) { return n.toString().padStart(2, '0'); }
export function dk(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
