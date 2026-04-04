export interface PaverInput {
  /** Area dimensions in ft (imperial) or m (metric) */
  areaLength: number;
  areaWidth: number;
  /** Paver dimensions in inches (imperial) or cm (metric) */
  paverLength: number;
  paverWidth: number;
  /** Joint width in inches (imperial) or mm (metric) */
  jointWidth: number;
  /** Waste percentage (e.g. 10 = 10%) */
  wastePercent: number;
  units: 'imperial' | 'metric';
}

export interface PaverResult {
  totalArea: number;
  paversNeeded: number;
  wastePavers: number;
  totalWithWaste: number;
  sandTons: number;
  gravelVolume: number;
}

/** Calculate paver quantities, bedding sand, and gravel base. */
export function calculatePavers(input: PaverInput): PaverResult {
  const { areaLength, areaWidth, paverLength, paverWidth, jointWidth, wastePercent, units } = input;

  const totalArea = areaLength * areaWidth;

  let effectivePaverArea: number;
  if (units === 'imperial') {
    const paverSqIn = (paverLength + jointWidth) * (paverWidth + jointWidth);
    effectivePaverArea = paverSqIn / 144;
  } else {
    const paverSqCm = (paverLength + jointWidth / 10) * (paverWidth + jointWidth / 10);
    effectivePaverArea = paverSqCm / 10000;
  }

  const paversNeeded = Math.ceil(totalArea / effectivePaverArea);
  const wastePavers = Math.ceil(paversNeeded * (wastePercent / 100));
  const totalWithWaste = paversNeeded + wastePavers;

  // Sand: ~1 ton per 100 sq ft for 1-inch bedding layer
  const sandTons = units === 'imperial'
    ? totalArea / 100
    : (totalArea * 10.764) / 100;

  // Gravel base: 4 inches deep
  const gravelVolume = units === 'imperial'
    ? (totalArea * 0.33) / 27 // cu yd
    : totalArea * 0.1;        // m³

  return { totalArea, paversNeeded, wastePavers, totalWithWaste, sandTons, gravelVolume };
}
