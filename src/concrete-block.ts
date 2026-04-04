export interface ConcreteBlockInput {
  /** ft (imperial) or m (metric) */
  wallLength: number;
  wallHeight: number;
  numberOfWalls: number;
  /** Block dimensions in inches (imperial) or cm (metric), plus mortar joint */
  blockLength: number;
  blockHeight: number;
  /** Mortar joint: inches (imperial) or mm (metric) */
  mortarJoint: number;
  wastePercent: number;
  /** Blocks per mortar bag (typical: 35–45) */
  blocksPerBag: number;
  /** Optional cost per block */
  costPerBlock?: number;
  units: 'imperial' | 'metric';
}

export interface ConcreteBlockResult {
  blocksPerWall: number;
  totalBlocks: number;
  blocksWithWaste: number;
  mortarBags: number;
  costEstimate: number;
}

/** Calculate concrete blocks, mortar, and cost for a masonry wall. */
export function calculateConcreteBlock(input: ConcreteBlockInput): ConcreteBlockResult {
  const { wallLength, wallHeight, numberOfWalls, blockLength, blockHeight, mortarJoint, wastePercent, blocksPerBag, costPerBlock = 0, units } = input;

  let wallLengthIn: number, wallHeightIn: number, mortarIn: number;

  if (units === 'imperial') {
    wallLengthIn = wallLength * 12;
    wallHeightIn = wallHeight * 12;
    mortarIn = mortarJoint;
  } else {
    wallLengthIn = wallLength * 39.3701;
    wallHeightIn = wallHeight * 39.3701;
    mortarIn = mortarJoint * 0.03937;
  }

  const effectiveLength = blockLength + mortarIn;
  const effectiveHeight = blockHeight + mortarIn;

  const blocksPerRow = Math.ceil(wallLengthIn / effectiveLength);
  const rowsPerWall = Math.ceil(wallHeightIn / effectiveHeight);
  const blocksPerWall = blocksPerRow * rowsPerWall;
  const totalBlocks = blocksPerWall * numberOfWalls;
  const blocksWithWaste = Math.ceil(totalBlocks * (1 + wastePercent / 100));
  const mortarBags = Math.ceil(blocksWithWaste / blocksPerBag);
  const costEstimate = blocksWithWaste * costPerBlock;

  return { blocksPerWall, totalBlocks, blocksWithWaste, mortarBags, costEstimate };
}
