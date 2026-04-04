export interface GravelInput {
  shape: 'rectangular' | 'circular';
  /** ft (imperial) or m (metric) */
  length?: number;
  width?: number;
  radius?: number;
  /** ft (imperial) or m (metric) */
  depth: number;
  pricePerTon?: number;
  units: 'imperial' | 'metric';
}

export interface GravelResult {
  /** yd³ (imperial) or m³ (metric) */
  volume: number;
  /** Converted to the other unit */
  alternativeVolume: number;
  tonnage: number;
  bags50lb: number;
  estimatedCost: number;
}

/** Calculate gravel/aggregate volume, weight, and cost. */
export function calculateGravel(input: GravelInput): GravelResult {
  const { shape, depth, pricePerTon = 0, units } = input;

  let volume: number;
  if (shape === 'circular') {
    const r = input.radius ?? 0;
    volume = units === 'imperial'
      ? (Math.PI * r * r * depth) / 27
      : Math.PI * r * r * depth;
  } else {
    const l = input.length ?? 0;
    const w = input.width ?? 0;
    volume = units === 'imperial'
      ? (l * w * depth) / 27
      : l * w * depth;
  }

  const alternativeVolume = units === 'imperial'
    ? volume * 0.764555
    : volume * 1.30795;

  const tonnage = units === 'imperial' ? volume * 1.4 : volume * 1.5;
  const bags50lb = units === 'imperial'
    ? Math.ceil(tonnage * 40)
    : Math.ceil(tonnage * 44);

  const estimatedCost = tonnage * pricePerTon;

  return { volume, alternativeVolume, tonnage, bags50lb, estimatedCost };
}
