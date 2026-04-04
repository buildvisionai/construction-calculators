export interface ConcreteSlabInput {
  /** ft (imperial) or m (metric) */
  length: number;
  width: number;
  /** inches (imperial) or cm (metric) */
  thickness: number;
  numSlabs: number;
  wasteFactor: number;
  /** USD per cubic yard (optional cost estimate) */
  pricePerCuYd?: number;
  units: 'imperial' | 'metric';
}

export interface ConcreteSlabResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuM: number;
  bags80lb: number;
  bags60lb: number;
  readyMixTrucks: number;
  estimatedCost: number;
  rebarLinearFt: number;
}

/** Calculate concrete slab volume, bag counts, and optional cost. */
export function calculateConcreteSlab(input: ConcreteSlabInput): ConcreteSlabResult {
  const { length, width, thickness, numSlabs, wasteFactor, pricePerCuYd = 0, units } = input;

  let lengthFt: number, widthFt: number, thicknessFt: number;
  let totalAreaSqFt: number, totalAreaSqM: number;

  if (units === 'imperial') {
    lengthFt = length;
    widthFt = width;
    thicknessFt = thickness / 12;
    totalAreaSqFt = length * width * numSlabs;
    totalAreaSqM = totalAreaSqFt * 0.092903;
  } else {
    lengthFt = length * 3.28084;
    widthFt = width * 3.28084;
    thicknessFt = (thickness / 100) * 3.28084;
    totalAreaSqM = length * width * numSlabs;
    totalAreaSqFt = totalAreaSqM / 0.092903;
  }

  const rawVolumeCuFt = lengthFt * widthFt * thicknessFt * numSlabs;
  const volumeCuFt = rawVolumeCuFt * (1 + wasteFactor);
  const volumeCuYd = volumeCuFt / 27;
  const volumeCuM = volumeCuFt * 0.0283168;

  const bags80lb = Math.ceil(volumeCuFt / 0.6);
  const bags60lb = Math.ceil(volumeCuFt / 0.45);
  const readyMixTrucks = volumeCuYd / 10;
  const estimatedCost = volumeCuYd * pricePerCuYd;

  const totalLengthFt = lengthFt * numSlabs;
  const totalWidthFt = widthFt;
  const lengthwiseBars = Math.floor(totalWidthFt) + 1;
  const widthwiseBars = Math.floor(totalLengthFt) + 1;
  const rebarLinearFt = lengthwiseBars * totalLengthFt + widthwiseBars * totalWidthFt;

  return { totalAreaSqFt, totalAreaSqM, volumeCuFt, volumeCuYd, volumeCuM, bags80lb, bags60lb, readyMixTrucks, estimatedCost, rebarLinearFt };
}
