/** Cost per sq ft (installed) and box coverage by flooring type */
const FLOORING_DEFAULTS: Record<string, { costMin: number; costMax: number; boxCoverage: number; boxCoverageMetric: number }> = {
  hardwood: { costMin: 6, costMax: 12, boxCoverage: 20, boxCoverageMetric: 1.86 },
  laminate: { costMin: 3, costMax: 8, boxCoverage: 20, boxCoverageMetric: 1.86 },
  vinyl_plank: { costMin: 2, costMax: 7, boxCoverage: 20, boxCoverageMetric: 1.86 },
  tile: { costMin: 5, costMax: 15, boxCoverage: 10, boxCoverageMetric: 0.93 },
  carpet: { costMin: 3, costMax: 8, boxCoverage: 1, boxCoverageMetric: 1 },
};

export interface FlooringInput {
  /** ft (imperial) or m (metric) */
  roomLength: number;
  roomWidth: number;
  /** inches (imperial) or mm (metric) */
  plankWidth: number;
  plankLength: number;
  wastePercent: number;
  flooringType: keyof typeof FLOORING_DEFAULTS;
  units: 'imperial' | 'metric';
}

export interface FlooringResult {
  totalArea: number;
  totalAreaWithWaste: number;
  piecesNeeded: number;
  boxesNeeded: number;
  underlaymentArea: number;
  perimeterFt: number;
  transitionStrips: number;
  costMin: number;
  costMax: number;
}

/** Calculate flooring materials and installed cost. */
export function calculateFlooring(input: FlooringInput): FlooringResult {
  const { roomLength, roomWidth, plankWidth, plankLength, wastePercent, flooringType, units } = input;

  const totalArea = roomLength * roomWidth;
  const totalAreaWithWaste = totalArea * (1 + wastePercent / 100);

  const pieceArea = units === 'metric'
    ? (plankWidth / 1000) * (plankLength / 1000)
    : (plankWidth / 12) * (plankLength / 12);
  const piecesNeeded = Math.ceil(totalAreaWithWaste / pieceArea);

  const defaults = FLOORING_DEFAULTS[flooringType] ?? FLOORING_DEFAULTS.hardwood;
  const boxCoverage = units === 'metric' ? defaults.boxCoverageMetric : defaults.boxCoverage;
  const boxesNeeded = Math.ceil(totalAreaWithWaste / boxCoverage);

  const perimeter = 2 * (roomLength + roomWidth);
  const perimeterFt = units === 'metric' ? perimeter * 3.28084 : perimeter;
  const transitionStrips = Math.max(1, Math.round(perimeter / 3));

  const areaSqFt = units === 'metric' ? totalAreaWithWaste * 10.7639 : totalAreaWithWaste;
  const costMin = areaSqFt * defaults.costMin;
  const costMax = areaSqFt * defaults.costMax;

  return { totalArea, totalAreaWithWaste, piecesNeeded, boxesNeeded, underlaymentArea: totalAreaWithWaste, perimeterFt, transitionStrips, costMin, costMax };
}
