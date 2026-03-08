export interface BoosterData {
  name: string;
  flights: number;
}

export const CHART_CONFIG = {
  BAR_HEIGHT: 30,
  BAR_GAP: 10,
  ANIMATION_DURATION: 1000,
  MIN_CANVAS_HEIGHT: 400,
  SCALE_FACTOR: 2,
  COLORS: {
    PRIMARY_BAR: '#00ff88',
    BACKGROUND_BAR: '#3a4156',
    TEXT: '#e0e6ed',
    TEXT_EXPENDED: '#ff4444',
    COUNT_LINE: '#00d9ff',
    MASS_LINE: '#ff2e97',
    LEADER_HIGHLIGHT: '#ffd700',
    AXIS_COLOR: '#8b95a8',
    DATE_TEXT: '#00d9ff'
  }
};

export const EXPENDED_BOOSTERS = new Set([
  'B1076',
]);

export function setupHighResCanvas(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number
): CanvasRenderingContext2D | null {
  const scale = CHART_CONFIG.SCALE_FACTOR;
  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(scale, scale);
  }
  return ctx;
}

export function getSortedUniqueData(data: BoosterData[]): BoosterData[] {
  const sortedData = [...data].sort((a, b) => b.flights - a.flights);
  const uniqueNames = new Set<string>();
  return sortedData.filter(item => {
    if (uniqueNames.has(item.name)) return false;
    uniqueNames.add(item.name);
    return true;
  });
}
