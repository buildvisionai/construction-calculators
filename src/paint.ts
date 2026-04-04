const DOOR_AREA = { imperial: 21, metric: 1.95 };
const WINDOW_AREA = { imperial: 15, metric: 1.4 };

/** Coverage in sq ft per gallon (imperial) or m² per liter (metric) */
const PAINT_COVERAGE = {
  standard: { imperial: 400, metric: 10 },
  primer: { imperial: 350, metric: 8.5 },
  gloss: { imperial: 350, metric: 8.5 },
  matte: { imperial: 450, metric: 11 },
};

/** Application rate in sq ft/hr or m²/hr */
const PAINT_RATE = { imperial: 150, metric: 14 };

export interface PaintInput {
  /** ft (imperial) or m (metric) */
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  includeCeiling: boolean;
  coats: number;
  paintType: keyof typeof PAINT_COVERAGE;
  includePrimer: boolean;
  units: 'imperial' | 'metric';
}

export interface PaintResult {
  netWallArea: number;
  ceilingArea: number;
  totalPaintableArea: number;
  gallonsNeeded: number;
  quartsNeeded: number;
  primerGallons: number;
  costLow: number;
  costHigh: number;
  timeEstimateHours: number;
}

/** Calculate paint quantities, primer, cost, and time estimate. */
export function calculatePaint(input: PaintInput): PaintResult {
  const { length, width, height, doors, windows, includeCeiling, coats, paintType, includePrimer, units } = input;

  const perimeter = 2 * (length + width);
  const totalWallArea = perimeter * height;
  const doorDeduction = doors * (units === 'imperial' ? DOOR_AREA.imperial : DOOR_AREA.metric);
  const windowDeduction = windows * (units === 'imperial' ? WINDOW_AREA.imperial : WINDOW_AREA.metric);
  const netWallArea = Math.max(0, totalWallArea - doorDeduction - windowDeduction);
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalPaintableArea = (netWallArea + ceilingArea) * coats;

  const coverage = units === 'imperial'
    ? PAINT_COVERAGE[paintType].imperial
    : PAINT_COVERAGE[paintType].metric;

  const gallonsNeeded = Math.ceil(totalPaintableArea / coverage);
  const quartsNeeded = gallonsNeeded * 4;

  const primerCoverage = units === 'imperial' ? PAINT_COVERAGE.primer.imperial : PAINT_COVERAGE.primer.metric;
  const primerGallons = includePrimer ? Math.ceil((netWallArea + ceilingArea) / primerCoverage) : 0;

  const costLow = gallonsNeeded * 25;
  const costHigh = gallonsNeeded * 50;

  const rate = units === 'imperial' ? PAINT_RATE.imperial : PAINT_RATE.metric;
  const timeEstimateHours = totalPaintableArea / rate;

  return { netWallArea, ceilingArea, totalPaintableArea, gallonsNeeded, quartsNeeded, primerGallons, costLow, costHigh, timeEstimateHours };
}
