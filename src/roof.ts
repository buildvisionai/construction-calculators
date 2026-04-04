/** Area multipliers by pitch (rise/12) */
const PITCH_FACTORS: Record<string, number> = {
  '2/12': 1.014, '3/12': 1.031, '4/12': 1.054, '5/12': 1.083,
  '6/12': 1.118, '7/12': 1.158, '8/12': 1.202, '9/12': 1.25,
  '10/12': 1.302, '11/12': 1.357, '12/12': 1.414,
};

const ACC = {
  starterPerBundle: 80,
  ridgeCapPerBundle: 65,
  underlaymentPerRoll: 30,
  iceWaterPerSqFt: 1.5,
  dripEdgePer10ft: 8,
  nailsPerLb: 3,
};

export interface RoofMaterialInput {
  /** Building footprint in sq ft (imperial) or m² (metric) */
  footprint: number;
  /** Pitch key like '6/12' */
  pitch: string;
  /** Waste percentage (e.g. 10 = 10%) */
  wastePercent: number;
  /** Shingle price per square (100 sq ft) */
  shinglePricePerSquare: number;
  /** Markup percentage on total material cost */
  markupPercent: number;
  units: 'imperial' | 'metric';
}

export interface RoofMaterialResult {
  footprintSqFt: number;
  actualAreaSqFt: number;
  totalAreaWithWaste: number;
  squares: number;
  fieldBundles: number;
  starterBundles: number;
  ridgeCapBundles: number;
  underlaymentRolls: number;
  iceWaterSqFt: number;
  dripEdgePieces: number;
  nailsLbs: number;
  totalSupplierCost: number;
  bidPrice: number;
  grossMarginPercent: number;
}

/** Calculate roofing material quantities and bid price. */
export function calculateRoofMaterials(input: RoofMaterialInput): RoofMaterialResult {
  const { footprint, pitch, wastePercent, shinglePricePerSquare, markupPercent, units } = input;

  const footprintSqFt = units === 'metric' ? footprint * 10.7639 : footprint;
  const pitchFactor = PITCH_FACTORS[pitch] ?? 1.0;
  const actualAreaSqFt = footprintSqFt * pitchFactor;
  const totalAreaWithWaste = actualAreaSqFt * (1 + wastePercent / 100);
  const squares = totalAreaWithWaste / 100;
  const fieldBundles = Math.ceil(squares * 3);

  const side = Math.sqrt(footprintSqFt);
  const perimeterEst = 4 * side;
  const ridgeLengthEst = side;

  const starterBundles = Math.max(2, Math.ceil((perimeterEst * 0.6) / 105) + 1);
  const ridgeCapBundles = Math.max(2, Math.ceil(ridgeLengthEst / 35) + 1);
  const underlaymentRolls = Math.ceil(actualAreaSqFt / 1000) + 1;
  const iceWaterSqFt = Math.ceil(perimeterEst * 2 * 1.15);
  const dripEdgePieces = Math.ceil(perimeterEst / 10) + 2;
  const nailsLbs = Math.ceil((actualAreaSqFt / 100) * 2);

  const shingleCost = squares * shinglePricePerSquare;
  const starterCost = starterBundles * ACC.starterPerBundle;
  const ridgeCost = ridgeCapBundles * ACC.ridgeCapPerBundle;
  const underlaymentCost = underlaymentRolls * ACC.underlaymentPerRoll;
  const iceWaterCost = iceWaterSqFt * ACC.iceWaterPerSqFt;
  const dripEdgeCost = dripEdgePieces * ACC.dripEdgePer10ft;
  const nailsCost = nailsLbs * ACC.nailsPerLb;
  const totalSupplierCost = shingleCost + starterCost + ridgeCost + underlaymentCost + iceWaterCost + dripEdgeCost + nailsCost;

  const bidPrice = totalSupplierCost * (1 + markupPercent / 100);
  const grossMarginPercent = ((bidPrice - totalSupplierCost) / bidPrice) * 100;

  return { footprintSqFt, actualAreaSqFt, totalAreaWithWaste, squares, fieldBundles, starterBundles, ridgeCapBundles, underlaymentRolls, iceWaterSqFt, dripEdgePieces, nailsLbs, totalSupplierCost, bidPrice, grossMarginPercent };
}
