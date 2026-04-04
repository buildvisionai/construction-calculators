export interface ConcreteInput {
  shape: 'rectangular' | 'circular';
  /** For rectangular: length × width × depth. For circular: radius × depth. All in same unit. */
  length?: number;
  width?: number;
  radius?: number;
  depth: number;
  units: 'imperial' | 'metric';
}

export interface ConcreteResult {
  volumeCuFt: number;
  volumeCuM: number;
  bagsNeeded: number;
  sand: number;
  gravel: number;
  /** Water in gallons (imperial) or liters (metric) */
  water: number;
}

/**
 * Calculate concrete volume and materials.
 * Imperial: dimensions in feet, depth in feet.
 * Metric: dimensions in meters.
 */
export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const { shape, depth, units } = input;

  let volume: number;
  if (shape === 'circular') {
    const r = input.radius ?? 0;
    volume = Math.PI * r * r * depth;
  } else {
    volume = (input.length ?? 0) * (input.width ?? 0) * depth;
  }

  const volumeCuFt = units === 'metric' ? volume * 35.3147 : volume;
  const volumeCuM = units === 'metric' ? volume : volume * 0.0283168;

  // 60 lb bags: ~0.45 cu ft; 40 kg bags: ~0.0127 m³
  const bagsNeeded = units === 'metric'
    ? Math.ceil(volume / 0.0127)
    : Math.ceil(volume / 0.45);

  const sand = volume * 0.4;
  const gravel = volume * 0.6;
  const water = units === 'metric' ? bagsNeeded * 2.5 : bagsNeeded * 0.66;

  return { volumeCuFt, volumeCuM, bagsNeeded, sand, gravel, water };
}
