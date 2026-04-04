export interface BoardFootInput {
  thickness: number;
  width: number;
  length: number;
  quantity: number;
  /** 'imperial' = inches for thickness/width, feet for length; 'metric' = mm */
  units: 'imperial' | 'metric';
}

export interface BoardFootResult {
  totalBoardFeet: number;
  totalCubicMeters: number;
  weightLbs: number;
  weightKg: number;
}

/**
 * Calculate board feet (lumber volume) and metric equivalents.
 * Imperial: thickness & width in inches, length in feet.
 * Metric: all dimensions in mm.
 */
export function calculateBoardFoot(input: BoardFootInput): BoardFootResult {
  const { thickness, width, length, quantity, units } = input;

  let totalBoardFeet: number;
  let totalCubicMeters: number;

  if (units === 'imperial') {
    totalBoardFeet = (thickness * width * length * quantity) / 144;
    totalCubicMeters = totalBoardFeet * 0.002359737;
  } else {
    const volumeCm3 = (thickness * width * length * quantity) / 1000;
    totalCubicMeters = volumeCm3 / 1000000;
    totalBoardFeet = volumeCm3 / 2359.737;
  }

  const weightLbs = totalBoardFeet * 35;
  const weightKg = weightLbs * 0.453592;

  return { totalBoardFeet, totalCubicMeters, weightLbs, weightKg };
}
