type InsulationType = 'fiberglass-batt' | 'blown-in-fiberglass' | 'cellulose' | 'spray-foam' | 'rigid-board';

/** R-value per inch by type */
const R_PER_INCH: Record<InsulationType, number> = {
  'fiberglass-batt': 3.14,
  'blown-in-fiberglass': 2.5,
  cellulose: 3.7,
  'spray-foam': 6.5,
  'rigid-board': 5.0,
};

/** Cost range per sq ft installed */
const COST_RANGES: Record<InsulationType, [number, number]> = {
  'fiberglass-batt': [0.64, 1.19],
  'blown-in-fiberglass': [1.0, 2.1],
  cellulose: [0.85, 1.8],
  'spray-foam': [1.5, 3.0],
  'rigid-board': [1.0, 2.5],
};

const BATT_ROLL_COVERAGE_SQFT = 40;
const LOOSE_FILL_BAG_COVERAGE_SQFT = 40; // at R-30 base

export interface InsulationInput {
  /** ft (imperial) or m (metric) */
  length: number;
  width: number;
  /** Target R-value (numeric, e.g. 30) */
  targetRValue: number;
  insulationType: InsulationType;
  units: 'imperial' | 'metric';
}

export interface InsulationResult {
  areaSqFt: number;
  thicknessInches: number;
  thicknessCm: number;
  rollsOrBags: number;
  costLow: number;
  costHigh: number;
}

/** Calculate insulation thickness, material quantity, and cost. */
export function calculateInsulation(input: InsulationInput): InsulationResult {
  const { length, width, targetRValue, insulationType, units } = input;

  const areaInInputUnits = length * width;
  const areaSqFt = units === 'metric' ? areaInInputUnits * 10.7639 : areaInInputUnits;

  const rPerInch = R_PER_INCH[insulationType];
  const thicknessInches = targetRValue / rPerInch;
  const thicknessCm = thicknessInches * 2.54;

  let rollsOrBags: number;
  if (insulationType === 'fiberglass-batt') {
    rollsOrBags = Math.ceil(areaSqFt / BATT_ROLL_COVERAGE_SQFT);
  } else if (insulationType === 'blown-in-fiberglass' || insulationType === 'cellulose') {
    const rRatio = targetRValue / 30;
    const adjustedCoverage = LOOSE_FILL_BAG_COVERAGE_SQFT / rRatio;
    rollsOrBags = Math.ceil(areaSqFt / adjustedCoverage);
  } else if (insulationType === 'spray-foam') {
    const boardFeet = areaSqFt * thicknessInches;
    rollsOrBags = Math.ceil(boardFeet / 600);
  } else {
    rollsOrBags = Math.ceil(areaSqFt / 32);
  }

  const [lowRate, highRate] = COST_RANGES[insulationType];
  const costLow = areaSqFt * lowRate;
  const costHigh = areaSqFt * highRate;

  return { areaSqFt, thicknessInches, thicknessCm, rollsOrBags, costLow, costHigh };
}
