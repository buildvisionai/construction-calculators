export interface StairInput {
  /** Total rise in inches (imperial) or mm (metric) */
  totalRise: number;
  /** Override number of steps (optional) */
  desiredSteps?: number;
  units: 'imperial' | 'metric';
}

export interface StairResult {
  numberOfSteps: number;
  risePerStep: number;
  runPerStep: number;
  totalRun: number;
  stringerLength: number;
  angleDegrees: number;
}

/** Calculate stair dimensions from total rise. */
export function calculateStairs(input: StairInput): StairResult {
  const { totalRise, desiredSteps, units } = input;

  const idealRise = units === 'imperial' ? 7.5 : 190;
  const idealRun = units === 'imperial' ? 10.5 : 267;

  const numberOfSteps = desiredSteps ?? Math.ceil(totalRise / idealRise);
  const risePerStep = totalRise / numberOfSteps;
  const runPerStep = idealRun;
  const totalRun = runPerStep * (numberOfSteps - 1);
  const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
  const angleDegrees = Math.atan2(totalRise, totalRun) * (180 / Math.PI);

  return { numberOfSteps, risePerStep, runPerStep, totalRun, stringerLength, angleDegrees };
}
