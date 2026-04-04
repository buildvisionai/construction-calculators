export interface RoofPitchFromRiseRunInput {
  rise: number;
  run: number;
}

export interface RoofPitchFromAngleInput {
  angleDegrees: number;
}

export interface RoofPitchFromPercentInput {
  percent: number;
}

export interface RoofPitchResult {
  rise: number;
  run: number;
  angleDegrees: number;
  pitchPercent: number;
}

export interface RafterInput extends RoofPitchFromRiseRunInput {
  /** Half-span (ft or m) */
  halfSpan: number;
}

export interface RafterResult {
  rafterLength: number;
  riseForSpan: number;
}

/** Calculate roof pitch from rise and run. */
export function pitchFromRiseRun(input: RoofPitchFromRiseRunInput): RoofPitchResult {
  const { rise, run } = input;
  const angleDegrees = Math.atan(rise / run) * (180 / Math.PI);
  const pitchPercent = (rise / run) * 100;
  return { rise, run, angleDegrees, pitchPercent };
}

/** Calculate roof pitch (rise over 12-unit run) from angle. */
export function pitchFromAngle(input: RoofPitchFromAngleInput): RoofPitchResult {
  const { angleDegrees } = input;
  const rise = Math.tan(angleDegrees * (Math.PI / 180)) * 12;
  const run = 12;
  const pitchPercent = (rise / run) * 100;
  return { rise, run, angleDegrees, pitchPercent };
}

/** Calculate roof pitch from slope percent. */
export function pitchFromPercent(input: RoofPitchFromPercentInput): RoofPitchResult {
  const { percent } = input;
  const rise = (percent / 100) * 12;
  const run = 12;
  const angleDegrees = Math.atan(percent / 100) * (180 / Math.PI);
  const pitchPercent = percent;
  return { rise, run, angleDegrees, pitchPercent };
}

/** Calculate rafter length given half-span and pitch. */
export function calculateRafterLength(input: RafterInput): RafterResult {
  const { rise, run, halfSpan } = input;
  const riseForSpan = halfSpan * (rise / run);
  const rafterLength = Math.sqrt(halfSpan * halfSpan + riseForSpan * riseForSpan);
  return { rafterLength, riseForSpan };
}
