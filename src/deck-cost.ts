const BOARD_COVERAGE_SQFT = 0.833; // sq ft per board (standard 5/4x6x8)
const WASTE_FACTOR = 1.15;
const JOIST_SPACING_IN = 16;
const POST_AREA_SQFT = 64;
const FOOTING_PER_POST = 1;
const SCREWS_PER_100_SQFT = 350;

/** Material and installed prices per sq ft by deck material */
const DECK_PRICES: Record<string, { materialLow: number; materialHigh: number; installedLow: number; installedHigh: number }> = {
  pressure_treated: { materialLow: 15, materialHigh: 25, installedLow: 30, installedHigh: 60 },
  composite: { materialLow: 30, materialHigh: 60, installedLow: 50, installedHigh: 100 },
  cedar: { materialLow: 25, materialHigh: 40, installedLow: 40, installedHigh: 80 },
  redwood: { materialLow: 30, materialHigh: 50, installedLow: 50, installedHigh: 100 },
  hardwood: { materialLow: 35, materialHigh: 65, installedLow: 60, installedHigh: 120 },
};

const RAILING_PRICES = { low: 150, high: 400 }; // per linear ft
const STAIR_PRICES = { low: 600, high: 2000 };  // per step

export interface DeckCostInput {
  /** ft (imperial) or m (metric) */
  length: number;
  width: number;
  height: number;
  deckMaterial: keyof typeof DECK_PRICES;
  includeRailing: boolean;
  includeStairs: boolean;
  steps: number;
  units: 'imperial' | 'metric';
}

export interface DeckCostResult {
  areaSqFt: number;
  areaM2: number;
  boardsNeeded: number;
  joistsNeeded: number;
  postsNeeded: number;
  footingsNeeded: number;
  fastenersNeeded: number;
  railingLinearFt: number;
  totalMaterialLow: number;
  totalMaterialHigh: number;
  totalInstalledLow: number;
  totalInstalledHigh: number;
}

/** Calculate deck materials, framing, and cost range. */
export function calculateDeckCost(input: DeckCostInput): DeckCostResult {
  const { length, width, height, deckMaterial, includeRailing, includeStairs, steps, units } = input;

  const lengthFt = units === 'metric' ? length * 3.28084 : length;
  const widthFt = units === 'metric' ? width * 3.28084 : width;
  const heightFt = units === 'metric' ? height * 3.28084 : height;

  const areaSqFt = lengthFt * widthFt;
  const areaM2 = areaSqFt / 10.7639;

  const boardsNeeded = Math.ceil((areaSqFt / BOARD_COVERAGE_SQFT) * WASTE_FACTOR);
  const joistsNeeded = Math.ceil((lengthFt * 12) / JOIST_SPACING_IN) + 1;
  const heightMultiplier = heightFt > 4 ? 1.5 : 1;
  const postsNeeded = Math.max(4, Math.ceil((areaSqFt / POST_AREA_SQFT) * heightMultiplier));
  const footingsNeeded = postsNeeded * FOOTING_PER_POST;
  const fastenersNeeded = Math.ceil((areaSqFt / 100) * SCREWS_PER_100_SQFT);

  const perimeter = 2 * lengthFt + 2 * widthFt;
  const railingLinearFt = includeRailing ? Math.ceil(perimeter - widthFt) : 0;

  const prices = DECK_PRICES[deckMaterial] ?? DECK_PRICES.pressure_treated;
  const materialCostLow = areaSqFt * prices.materialLow;
  const materialCostHigh = areaSqFt * prices.materialHigh;
  const installedCostLow = areaSqFt * prices.installedLow;
  const installedCostHigh = areaSqFt * prices.installedHigh;

  const railingCostLow = railingLinearFt * RAILING_PRICES.low;
  const railingCostHigh = railingLinearFt * RAILING_PRICES.high;
  const stairCostLow = includeStairs ? steps * STAIR_PRICES.low : 0;
  const stairCostHigh = includeStairs ? steps * STAIR_PRICES.high : 0;

  const totalMaterialLow = materialCostLow + (includeRailing ? railingCostLow * 0.5 : 0) + (includeStairs ? stairCostLow * 0.4 : 0);
  const totalMaterialHigh = materialCostHigh + (includeRailing ? railingCostHigh * 0.5 : 0) + (includeStairs ? stairCostHigh * 0.4 : 0);
  const totalInstalledLow = installedCostLow + railingCostLow + stairCostLow;
  const totalInstalledHigh = installedCostHigh + railingCostHigh + stairCostHigh;

  return { areaSqFt, areaM2, boardsNeeded, joistsNeeded, postsNeeded, footingsNeeded, fastenersNeeded, railingLinearFt, totalMaterialLow, totalMaterialHigh, totalInstalledLow, totalInstalledHigh };
}
