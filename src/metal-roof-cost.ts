/** Price ranges in $/sq ft for metal roofing types */
const METAL_PRICES: Record<string, { low: number; high: number }> = {
  standing_seam: { low: 10, high: 17 },
  corrugated: { low: 5, high: 12 },
  metal_shingle: { low: 7, high: 14 },
  ribbed: { low: 4, high: 10 },
};

const LABOR_FRACTION = { low: 0.35, high: 0.5 };
const ASPHALT_PRICE = { low: 3.5, high: 5.5 };
const ASPHALT_LIFESPAN = 25;

const METAL_LIFESPAN: Record<string, number> = {
  standing_seam: 60,
  corrugated: 40,
  metal_shingle: 45,
  ribbed: 35,
};

function getWasteFactor(pitchDeg: number): number {
  if (pitchDeg <= 0) return 1.0;
  if (pitchDeg <= 15) return 1.05;
  if (pitchDeg <= 25) return 1.10;
  if (pitchDeg <= 35) return 1.15;
  if (pitchDeg <= 45) return 1.20;
  return 1.25;
}

export interface MetalRoofCostInput {
  /** Square feet (imperial) or m² (metric) */
  roofArea: number;
  metalType: keyof typeof METAL_PRICES;
  /** Roof pitch in degrees */
  pitchDegrees: number;
  regionMultiplier: number;
  units: 'imperial' | 'metric';
}

export interface MetalRoofCostResult {
  areaSqFt: number;
  wasteFactor: number;
  materialCostLow: number;
  materialCostHigh: number;
  laborCostLow: number;
  laborCostHigh: number;
  totalLow: number;
  totalHigh: number;
  metalLifespanYears: number;
  /** Cost over 50-year horizon compared to asphalt */
  comparison50yr: {
    metalLow: number;
    metalHigh: number;
    asphaltLow: number;
    asphaltHigh: number;
  };
}

/** Estimate metal roof installation cost and compare to asphalt over 50 years. */
export function calculateMetalRoofCost(input: MetalRoofCostInput): MetalRoofCostResult {
  const { roofArea, metalType, pitchDegrees, regionMultiplier, units } = input;

  const areaSqFt = units === 'metric' ? roofArea * 10.7639 : roofArea;
  const priceRange = METAL_PRICES[metalType] ?? METAL_PRICES.standing_seam;
  const wasteFactor = getWasteFactor(pitchDegrees);

  const adjustedLow = priceRange.low * wasteFactor * regionMultiplier;
  const adjustedHigh = priceRange.high * wasteFactor * regionMultiplier;

  const materialCostLow = adjustedLow * (1 - LABOR_FRACTION.high) * areaSqFt;
  const materialCostHigh = adjustedHigh * (1 - LABOR_FRACTION.low) * areaSqFt;
  const laborCostLow = adjustedLow * LABOR_FRACTION.low * areaSqFt;
  const laborCostHigh = adjustedHigh * LABOR_FRACTION.high * areaSqFt;
  const totalLow = materialCostLow + laborCostLow;
  const totalHigh = materialCostHigh + laborCostHigh;

  const metalLife = METAL_LIFESPAN[metalType] ?? 50;
  const metalReplacements50 = Math.ceil(50 / metalLife);
  const asphaltReplacements50 = Math.ceil(50 / ASPHALT_LIFESPAN);
  const asphaltInstalledLow = ASPHALT_PRICE.low * areaSqFt;
  const asphaltInstalledHigh = ASPHALT_PRICE.high * areaSqFt;

  return {
    areaSqFt,
    wasteFactor,
    materialCostLow,
    materialCostHigh,
    laborCostLow,
    laborCostHigh,
    totalLow,
    totalHigh,
    metalLifespanYears: metalLife,
    comparison50yr: {
      metalLow: totalLow * metalReplacements50,
      metalHigh: totalHigh * metalReplacements50,
      asphaltLow: asphaltInstalledLow * asphaltReplacements50,
      asphaltHigh: asphaltInstalledHigh * asphaltReplacements50,
    },
  };
}
