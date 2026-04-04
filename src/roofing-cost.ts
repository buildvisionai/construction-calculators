/** Cost ranges in $/sq ft installed */
const PRICE_RANGES: Record<string, { low: number; high: number }> = {
  asphalt: { low: 3.5, high: 5.5 },
  metal: { low: 7, high: 14 },
  tile: { low: 10, high: 20 },
  slate: { low: 15, high: 30 },
  wood: { low: 6, high: 12 },
  flat: { low: 5, high: 10 },
};

const LABOR_FRACTION = { low: 0.4, high: 0.6 };
const TEAR_OFF_COST = { low: 1, high: 2 };

const LIFESPAN_DATA: Record<string, { low: number; high: number }> = {
  asphalt: { low: 15, high: 30 },
  metal: { low: 40, high: 70 },
  tile: { low: 50, high: 100 },
  slate: { low: 75, high: 150 },
  wood: { low: 20, high: 40 },
  flat: { low: 15, high: 25 },
};

export interface RoofingCostInput {
  /** Square feet (imperial) or m² (metric) */
  roofArea: number;
  materialType: keyof typeof PRICE_RANGES;
  /** Multiplier for regional labor/material costs (e.g. 1.0 = average) */
  regionMultiplier: number;
  /** Multiplier for roof pitch difficulty (e.g. 1.0 = low pitch) */
  pitchMultiplier: number;
  /** Multiplier for number of stories (e.g. 1.0 = single story) */
  storiesMultiplier: number;
  includeTearOff: boolean;
  units: 'imperial' | 'metric';
}

export interface RoofingCostResult {
  areaSqFt: number;
  materialCostLow: number;
  materialCostHigh: number;
  laborCostLow: number;
  laborCostHigh: number;
  tearOffLow: number;
  tearOffHigh: number;
  totalLow: number;
  totalHigh: number;
  costPerSquareLow: number;
  costPerSquareHigh: number;
  lifespanYears: { low: number; high: number };
  costPerYearLow: number;
  costPerYearHigh: number;
}

/** Estimate roofing installation cost including materials, labor, and tear-off. */
export function calculateRoofingCost(input: RoofingCostInput): RoofingCostResult {
  const { roofArea, materialType, regionMultiplier, pitchMultiplier, storiesMultiplier, includeTearOff, units } = input;

  const areaSqFt = units === 'metric' ? roofArea * 10.7639 : roofArea;
  const priceRange = PRICE_RANGES[materialType] ?? PRICE_RANGES.asphalt;

  const adjustedLow = priceRange.low * regionMultiplier * pitchMultiplier * storiesMultiplier;
  const adjustedHigh = priceRange.high * regionMultiplier * pitchMultiplier * storiesMultiplier;

  const materialCostLow = adjustedLow * (1 - LABOR_FRACTION.high) * areaSqFt;
  const materialCostHigh = adjustedHigh * (1 - LABOR_FRACTION.low) * areaSqFt;
  const laborCostLow = adjustedLow * LABOR_FRACTION.low * areaSqFt;
  const laborCostHigh = adjustedHigh * LABOR_FRACTION.high * areaSqFt;

  const tearOffLow = includeTearOff ? TEAR_OFF_COST.low * areaSqFt * regionMultiplier : 0;
  const tearOffHigh = includeTearOff ? TEAR_OFF_COST.high * areaSqFt * regionMultiplier : 0;

  const totalLow = materialCostLow + laborCostLow + tearOffLow;
  const totalHigh = materialCostHigh + laborCostHigh + tearOffHigh;
  const costPerSquareLow = (totalLow / areaSqFt) * 100;
  const costPerSquareHigh = (totalHigh / areaSqFt) * 100;

  const lifespan = LIFESPAN_DATA[materialType] ?? LIFESPAN_DATA.asphalt;
  const avgLifespan = (lifespan.low + lifespan.high) / 2;
  const costPerYearLow = totalLow / avgLifespan;
  const costPerYearHigh = totalHigh / avgLifespan;

  return { areaSqFt, materialCostLow, materialCostHigh, laborCostLow, laborCostHigh, tearOffLow, tearOffHigh, totalLow, totalHigh, costPerSquareLow, costPerSquareHigh, lifespanYears: lifespan, costPerYearLow, costPerYearHigh };
}
