export interface DrywallInput {
  /** ft (imperial) or m (metric) */
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  includeCeiling: boolean;
  /** '4x8', '4x10', or '4x12' */
  sheetSize: '4x8' | '4x10' | '4x12';
  units: 'imperial' | 'metric';
}

export interface DrywallResult {
  wallArea: number;
  ceilingArea: number;
  totalArea: number;
  sheets: number;
  tapeRolls: number;
  compoundBuckets: number;
  screws: number;
}

const SHEET_AREAS_IMPERIAL: Record<string, number> = { '4x8': 32, '4x10': 40, '4x12': 48 };
const SHEET_AREAS_METRIC: Record<string, number> = { '4x8': 2.97, '4x10': 3.72, '4x12': 4.46 };

/** Calculate drywall sheets, tape, compound, and screws. */
export function calculateDrywall(input: DrywallInput): DrywallResult {
  const { length, width, height, doors, windows, includeCeiling, sheetSize, units } = input;

  const doorArea = units === 'imperial' ? 21 : 1.95;
  const windowArea = units === 'imperial' ? 15 : 1.4;
  const perimeter = 2 * (length + width);

  const wallArea = perimeter * height - doors * doorArea - windows * windowArea;
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalArea = wallArea + ceilingArea;

  const sheetAreas = units === 'imperial' ? SHEET_AREAS_IMPERIAL : SHEET_AREAS_METRIC;
  const sheetArea = sheetAreas[sheetSize] ?? sheetAreas['4x8'];
  const sheets = Math.ceil((totalArea * 1.10) / sheetArea);

  const tapeRolls = Math.ceil(totalArea / (units === 'imperial' ? 500 : 46));
  const compoundBuckets = Math.ceil(totalArea / (units === 'imperial' ? 480 : 45));
  const screws = sheets * 32;

  return { wallArea, ceilingArea, totalArea, sheets, tapeRolls, compoundBuckets, screws };
}
