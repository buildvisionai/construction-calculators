export interface RetainingWallInput {
  /** ft (imperial) or m (metric) */
  wallLength: number;
  wallHeight: number;
  /** inches (imperial) or cm (metric) */
  wallThickness: number;
  /** Backfill depth in ft (imperial) or m (metric) */
  backfillDepth: number;
  /** Block face dimensions in inches */
  blockLength: number;
  blockHeight: number;
  wastePercent: number;
  units: 'imperial' | 'metric';
}

export interface RetainingWallResult {
  courses: number;
  blocksPerCourse: number;
  totalBlocks: number;
  blocksWithWaste: number;
  capBlocks: number;
  totalFaceArea: number;
  gravelBackfill: number;
  drainageAggregate: number;
  geogridLayers: number;
}

/** Calculate retaining wall block counts, backfill, and geogrid requirements. */
export function calculateRetainingWall(input: RetainingWallInput): RetainingWallResult {
  const { wallLength, wallHeight, wallThickness, backfillDepth, blockLength, blockHeight, wastePercent, units } = input;

  let wallLengthIn: number, wallHeightIn: number, wallThicknessIn: number, backfillDepthIn: number;

  if (units === 'imperial') {
    wallLengthIn = wallLength * 12;
    wallHeightIn = wallHeight * 12;
    wallThicknessIn = wallThickness;
    backfillDepthIn = backfillDepth * 12;
  } else {
    wallLengthIn = wallLength * 39.3701;
    wallHeightIn = wallHeight * 39.3701;
    wallThicknessIn = wallThickness * 0.393701;
    backfillDepthIn = backfillDepth * 39.3701;
  }

  const courses = Math.ceil(wallHeightIn / blockHeight);
  const blocksPerCourse = Math.ceil(wallLengthIn / blockLength);
  const totalBlocks = courses * blocksPerCourse;
  const blocksWithWaste = Math.ceil(totalBlocks * (1 + wastePercent / 100));
  const capBlocks = Math.ceil(wallLengthIn / blockLength);

  const totalFaceAreaSqIn = wallLengthIn * wallHeightIn;
  const totalFaceArea = units === 'imperial'
    ? totalFaceAreaSqIn / 144
    : totalFaceAreaSqIn / 1550.0031;

  const backfillVolumeCuIn = wallLengthIn * wallHeightIn * backfillDepthIn;
  const gravelBackfill = units === 'imperial'
    ? backfillVolumeCuIn / 46656   // cu yd
    : backfillVolumeCuIn / 61023.7; // m³

  const drainageAggregate = gravelBackfill * 0.33;

  const wallHeightFt = wallHeightIn / 12;
  let geogridLayers = 0;
  if (wallHeightFt > 3) {
    geogridLayers = Math.max(1, Math.floor(courses / 2));
  }

  return { courses, blocksPerCourse, totalBlocks, blocksWithWaste, capBlocks, totalFaceArea, gravelBackfill, drainageAggregate, geogridLayers };
}
