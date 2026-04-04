"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  calculateBoardFoot: () => calculateBoardFoot,
  calculateConcrete: () => calculateConcrete,
  calculateConcreteBlock: () => calculateConcreteBlock,
  calculateConcreteSlab: () => calculateConcreteSlab,
  calculateConstructionCost: () => calculateConstructionCost,
  calculateDeckCost: () => calculateDeckCost,
  calculateDrywall: () => calculateDrywall,
  calculateEquipmentDepreciation: () => calculateEquipmentDepreciation,
  calculateFence: () => calculateFence,
  calculateFlooring: () => calculateFlooring,
  calculateGravel: () => calculateGravel,
  calculateHourlyRate: () => calculateHourlyRate,
  calculateInsulation: () => calculateInsulation,
  calculateLaborCost: () => calculateLaborCost,
  calculateMarkup: () => calculateMarkup,
  calculateMarkupFromMargin: () => calculateMarkupFromMargin,
  calculateMetalRoofCost: () => calculateMetalRoofCost,
  calculateNetProfit: () => calculateNetProfit,
  calculatePaint: () => calculatePaint,
  calculatePavers: () => calculatePavers,
  calculateRafterLength: () => calculateRafterLength,
  calculateRetainingWall: () => calculateRetainingWall,
  calculateRoofMaterials: () => calculateRoofMaterials,
  calculateRoofingCost: () => calculateRoofingCost,
  calculateSquareFootage: () => calculateSquareFootage,
  calculateStairs: () => calculateStairs,
  calculateTimeline: () => calculateTimeline,
  pitchFromAngle: () => pitchFromAngle,
  pitchFromPercent: () => pitchFromPercent,
  pitchFromRiseRun: () => pitchFromRiseRun
});
module.exports = __toCommonJS(index_exports);

// src/board-foot.ts
function calculateBoardFoot(input) {
  const { thickness, width, length, quantity, units } = input;
  let totalBoardFeet;
  let totalCubicMeters;
  if (units === "imperial") {
    totalBoardFeet = thickness * width * length * quantity / 144;
    totalCubicMeters = totalBoardFeet * 2359737e-9;
  } else {
    const volumeCm3 = thickness * width * length * quantity / 1e3;
    totalCubicMeters = volumeCm3 / 1e6;
    totalBoardFeet = volumeCm3 / 2359.737;
  }
  const weightLbs = totalBoardFeet * 35;
  const weightKg = weightLbs * 0.453592;
  return { totalBoardFeet, totalCubicMeters, weightLbs, weightKg };
}

// src/concrete.ts
function calculateConcrete(input) {
  const { shape, depth, units } = input;
  let volume;
  if (shape === "circular") {
    const r = input.radius ?? 0;
    volume = Math.PI * r * r * depth;
  } else {
    volume = (input.length ?? 0) * (input.width ?? 0) * depth;
  }
  const volumeCuFt = units === "metric" ? volume * 35.3147 : volume;
  const volumeCuM = units === "metric" ? volume : volume * 0.0283168;
  const bagsNeeded = units === "metric" ? Math.ceil(volume / 0.0127) : Math.ceil(volume / 0.45);
  const sand = volume * 0.4;
  const gravel = volume * 0.6;
  const water = units === "metric" ? bagsNeeded * 2.5 : bagsNeeded * 0.66;
  return { volumeCuFt, volumeCuM, bagsNeeded, sand, gravel, water };
}

// src/concrete-slab.ts
function calculateConcreteSlab(input) {
  const { length, width, thickness, numSlabs, wasteFactor, pricePerCuYd = 0, units } = input;
  let lengthFt, widthFt, thicknessFt;
  let totalAreaSqFt, totalAreaSqM;
  if (units === "imperial") {
    lengthFt = length;
    widthFt = width;
    thicknessFt = thickness / 12;
    totalAreaSqFt = length * width * numSlabs;
    totalAreaSqM = totalAreaSqFt * 0.092903;
  } else {
    lengthFt = length * 3.28084;
    widthFt = width * 3.28084;
    thicknessFt = thickness / 100 * 3.28084;
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

// src/concrete-block.ts
function calculateConcreteBlock(input) {
  const { wallLength, wallHeight, numberOfWalls, blockLength, blockHeight, mortarJoint, wastePercent, blocksPerBag, costPerBlock = 0, units } = input;
  let wallLengthIn, wallHeightIn, mortarIn;
  if (units === "imperial") {
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

// src/gravel.ts
function calculateGravel(input) {
  const { shape, depth, pricePerTon = 0, units } = input;
  let volume;
  if (shape === "circular") {
    const r = input.radius ?? 0;
    volume = units === "imperial" ? Math.PI * r * r * depth / 27 : Math.PI * r * r * depth;
  } else {
    const l = input.length ?? 0;
    const w = input.width ?? 0;
    volume = units === "imperial" ? l * w * depth / 27 : l * w * depth;
  }
  const alternativeVolume = units === "imperial" ? volume * 0.764555 : volume * 1.30795;
  const tonnage = units === "imperial" ? volume * 1.4 : volume * 1.5;
  const bags50lb = units === "imperial" ? Math.ceil(tonnage * 40) : Math.ceil(tonnage * 44);
  const estimatedCost = tonnage * pricePerTon;
  return { volume, alternativeVolume, tonnage, bags50lb, estimatedCost };
}

// src/markup.ts
function calculateMarkup(input) {
  const { costs, markupPercent } = input;
  const totalWithMarkup = costs * (1 + markupPercent / 100);
  const profit = totalWithMarkup - costs;
  const profitMarginPercent = profit / totalWithMarkup * 100;
  return { totalWithMarkup, profit, profitMarginPercent };
}
function calculateMarkupFromMargin(input) {
  const { costs, desiredMargin } = input;
  const markupPercent = desiredMargin / (100 - desiredMargin) * 100;
  const totalWithMarkup = costs * (1 + markupPercent / 100);
  const profit = totalWithMarkup - costs;
  const profitMarginPercent = profit / totalWithMarkup * 100;
  return { totalWithMarkup, profit, profitMarginPercent, markupPercent };
}

// src/labor-cost.ts
function calculateLaborCost(input) {
  const { projectLength, hoursPerDay, workers, burden } = input;
  const totalProjectHours = projectLength * hoursPerDay;
  const burdenMultiplier = (burden.socialSecurity + burden.medicare + burden.federalUnemployment + burden.stateUnemployment) / 100 + burden.liabilityInsurance / 1e3 + burden.workersComp / 100 + burden.downtimePercentage / 100;
  const perWorkerCosts = workers.map((worker) => {
    const workerHours = totalProjectHours * worker.projectPercentage / 100;
    const effectiveRate = worker.taxable ? worker.hourlyWage * (1 + burdenMultiplier) : worker.hourlyWage;
    return effectiveRate * workerHours;
  });
  const totalLaborCost = perWorkerCosts.reduce((sum, c) => sum + c, 0);
  const avgHourlyRate = totalProjectHours > 0 ? totalLaborCost / totalProjectHours : 0;
  return { totalProjectHours, burdenMultiplier, totalLaborCost, avgHourlyRate, perWorkerCosts };
}

// src/roof-pitch.ts
function pitchFromRiseRun(input) {
  const { rise, run } = input;
  const angleDegrees = Math.atan(rise / run) * (180 / Math.PI);
  const pitchPercent = rise / run * 100;
  return { rise, run, angleDegrees, pitchPercent };
}
function pitchFromAngle(input) {
  const { angleDegrees } = input;
  const rise = Math.tan(angleDegrees * (Math.PI / 180)) * 12;
  const run = 12;
  const pitchPercent = rise / run * 100;
  return { rise, run, angleDegrees, pitchPercent };
}
function pitchFromPercent(input) {
  const { percent } = input;
  const rise = percent / 100 * 12;
  const run = 12;
  const angleDegrees = Math.atan(percent / 100) * (180 / Math.PI);
  const pitchPercent = percent;
  return { rise, run, angleDegrees, pitchPercent };
}
function calculateRafterLength(input) {
  const { rise, run, halfSpan } = input;
  const riseForSpan = halfSpan * (rise / run);
  const rafterLength = Math.sqrt(halfSpan * halfSpan + riseForSpan * riseForSpan);
  return { rafterLength, riseForSpan };
}

// src/roofing-cost.ts
var PRICE_RANGES = {
  asphalt: { low: 3.5, high: 5.5 },
  metal: { low: 7, high: 14 },
  tile: { low: 10, high: 20 },
  slate: { low: 15, high: 30 },
  wood: { low: 6, high: 12 },
  flat: { low: 5, high: 10 }
};
var LABOR_FRACTION = { low: 0.4, high: 0.6 };
var TEAR_OFF_COST = { low: 1, high: 2 };
var LIFESPAN_DATA = {
  asphalt: { low: 15, high: 30 },
  metal: { low: 40, high: 70 },
  tile: { low: 50, high: 100 },
  slate: { low: 75, high: 150 },
  wood: { low: 20, high: 40 },
  flat: { low: 15, high: 25 }
};
function calculateRoofingCost(input) {
  const { roofArea, materialType, regionMultiplier, pitchMultiplier, storiesMultiplier, includeTearOff, units } = input;
  const areaSqFt = units === "metric" ? roofArea * 10.7639 : roofArea;
  const priceRange = PRICE_RANGES[materialType] ?? PRICE_RANGES.asphalt;
  const adjustedLow = priceRange.low * regionMultiplier * pitchMultiplier * storiesMultiplier;
  const adjustedHigh = priceRange.high * regionMultiplier * pitchMultiplier * storiesMultiplier;
  const materialCostLow = adjustedLow * (1 - LABOR_FRACTION.high) * areaSqFt;
  const materialCostHigh = adjustedHigh * (1 - LABOR_FRACTION.low) * areaSqFt;
  const laborCostLow = adjustedLow * LABOR_FRACTION.low * areaSqFt;
  const laborCostHigh = adjustedHigh * LABOR_FRACTION.high * areaSqFt;
  const tearOffLow = includeTearOff ? TEAR_OFF_COST.low * areaSqFt * regionMultiplier : 0;
  const tearOffHigh = includeTearOff ? TEAR_OFF_COST.high * areaSqFt * regionMultiplier : 0;
  const totalLow = materialCostLow + laborCostLow + tearOffLow;
  const totalHigh = materialCostHigh + laborCostHigh + tearOffHigh;
  const costPerSquareLow = totalLow / areaSqFt * 100;
  const costPerSquareHigh = totalHigh / areaSqFt * 100;
  const lifespan = LIFESPAN_DATA[materialType] ?? LIFESPAN_DATA.asphalt;
  const avgLifespan = (lifespan.low + lifespan.high) / 2;
  const costPerYearLow = totalLow / avgLifespan;
  const costPerYearHigh = totalHigh / avgLifespan;
  return { areaSqFt, materialCostLow, materialCostHigh, laborCostLow, laborCostHigh, tearOffLow, tearOffHigh, totalLow, totalHigh, costPerSquareLow, costPerSquareHigh, lifespanYears: lifespan, costPerYearLow, costPerYearHigh };
}

// src/metal-roof-cost.ts
var METAL_PRICES = {
  standing_seam: { low: 10, high: 17 },
  corrugated: { low: 5, high: 12 },
  metal_shingle: { low: 7, high: 14 },
  ribbed: { low: 4, high: 10 }
};
var LABOR_FRACTION2 = { low: 0.35, high: 0.5 };
var ASPHALT_PRICE = { low: 3.5, high: 5.5 };
var ASPHALT_LIFESPAN = 25;
var METAL_LIFESPAN = {
  standing_seam: 60,
  corrugated: 40,
  metal_shingle: 45,
  ribbed: 35
};
function getWasteFactor(pitchDeg) {
  if (pitchDeg <= 0) return 1;
  if (pitchDeg <= 15) return 1.05;
  if (pitchDeg <= 25) return 1.1;
  if (pitchDeg <= 35) return 1.15;
  if (pitchDeg <= 45) return 1.2;
  return 1.25;
}
function calculateMetalRoofCost(input) {
  const { roofArea, metalType, pitchDegrees, regionMultiplier, units } = input;
  const areaSqFt = units === "metric" ? roofArea * 10.7639 : roofArea;
  const priceRange = METAL_PRICES[metalType] ?? METAL_PRICES.standing_seam;
  const wasteFactor = getWasteFactor(pitchDegrees);
  const adjustedLow = priceRange.low * wasteFactor * regionMultiplier;
  const adjustedHigh = priceRange.high * wasteFactor * regionMultiplier;
  const materialCostLow = adjustedLow * (1 - LABOR_FRACTION2.high) * areaSqFt;
  const materialCostHigh = adjustedHigh * (1 - LABOR_FRACTION2.low) * areaSqFt;
  const laborCostLow = adjustedLow * LABOR_FRACTION2.low * areaSqFt;
  const laborCostHigh = adjustedHigh * LABOR_FRACTION2.high * areaSqFt;
  const totalLow = materialCostLow + laborCostLow;
  const totalHigh = materialCostHigh + laborCostHigh;
  const metalLife = METAL_LIFESPAN[metalType] ?? 50;
  const metalReplacements50 = Math.ceil(50 / metalLife);
  const asphaltReplacements50 = Math.ceil(50 / ASPHALT_LIFESPAN);
  const asphaltInstalledLow = ASPHALT_PRICE.low * areaSqFt;
  const asphaltInstalledHigh = ASPHALT_PRICE.high * areaSqFt;
  return {
    areaSqFt,
    wasteFactor,
    materialCostLow,
    materialCostHigh,
    laborCostLow,
    laborCostHigh,
    totalLow,
    totalHigh,
    metalLifespanYears: metalLife,
    comparison50yr: {
      metalLow: totalLow * metalReplacements50,
      metalHigh: totalHigh * metalReplacements50,
      asphaltLow: asphaltInstalledLow * asphaltReplacements50,
      asphaltHigh: asphaltInstalledHigh * asphaltReplacements50
    }
  };
}

// src/roof.ts
var PITCH_FACTORS = {
  "2/12": 1.014,
  "3/12": 1.031,
  "4/12": 1.054,
  "5/12": 1.083,
  "6/12": 1.118,
  "7/12": 1.158,
  "8/12": 1.202,
  "9/12": 1.25,
  "10/12": 1.302,
  "11/12": 1.357,
  "12/12": 1.414
};
var ACC = {
  starterPerBundle: 80,
  ridgeCapPerBundle: 65,
  underlaymentPerRoll: 30,
  iceWaterPerSqFt: 1.5,
  dripEdgePer10ft: 8,
  nailsPerLb: 3
};
function calculateRoofMaterials(input) {
  const { footprint, pitch, wastePercent, shinglePricePerSquare, markupPercent, units } = input;
  const footprintSqFt = units === "metric" ? footprint * 10.7639 : footprint;
  const pitchFactor = PITCH_FACTORS[pitch] ?? 1;
  const actualAreaSqFt = footprintSqFt * pitchFactor;
  const totalAreaWithWaste = actualAreaSqFt * (1 + wastePercent / 100);
  const squares = totalAreaWithWaste / 100;
  const fieldBundles = Math.ceil(squares * 3);
  const side = Math.sqrt(footprintSqFt);
  const perimeterEst = 4 * side;
  const ridgeLengthEst = side;
  const starterBundles = Math.max(2, Math.ceil(perimeterEst * 0.6 / 105) + 1);
  const ridgeCapBundles = Math.max(2, Math.ceil(ridgeLengthEst / 35) + 1);
  const underlaymentRolls = Math.ceil(actualAreaSqFt / 1e3) + 1;
  const iceWaterSqFt = Math.ceil(perimeterEst * 2 * 1.15);
  const dripEdgePieces = Math.ceil(perimeterEst / 10) + 2;
  const nailsLbs = Math.ceil(actualAreaSqFt / 100 * 2);
  const shingleCost = squares * shinglePricePerSquare;
  const starterCost = starterBundles * ACC.starterPerBundle;
  const ridgeCost = ridgeCapBundles * ACC.ridgeCapPerBundle;
  const underlaymentCost = underlaymentRolls * ACC.underlaymentPerRoll;
  const iceWaterCost = iceWaterSqFt * ACC.iceWaterPerSqFt;
  const dripEdgeCost = dripEdgePieces * ACC.dripEdgePer10ft;
  const nailsCost = nailsLbs * ACC.nailsPerLb;
  const totalSupplierCost = shingleCost + starterCost + ridgeCost + underlaymentCost + iceWaterCost + dripEdgeCost + nailsCost;
  const bidPrice = totalSupplierCost * (1 + markupPercent / 100);
  const grossMarginPercent = (bidPrice - totalSupplierCost) / bidPrice * 100;
  return { footprintSqFt, actualAreaSqFt, totalAreaWithWaste, squares, fieldBundles, starterBundles, ridgeCapBundles, underlaymentRolls, iceWaterSqFt, dripEdgePieces, nailsLbs, totalSupplierCost, bidPrice, grossMarginPercent };
}

// src/square-footage.ts
function calculateSquareFootage(input) {
  const { rooms, units } = input;
  const perRoom = rooms.map((room) => {
    switch (room.shape) {
      case "circle":
        return Math.PI * (room.radius ?? 0) ** 2;
      case "square":
        return (room.width ?? 0) ** 2;
      case "rectangle":
      default:
        return (room.length ?? 0) * (room.width ?? 0);
    }
  });
  const totalArea = perRoom.reduce((sum, a) => sum + a, 0);
  const totalAreaSqFt = units === "metric" ? totalArea * 10.764 : totalArea;
  const totalAreaSqM = units === "metric" ? totalArea : totalArea * 0.0929;
  return { totalAreaSqFt, totalAreaSqM, perRoom };
}

// src/construction-cost.ts
function calculateConstructionCost(lineItems) {
  const lineItemTotals = lineItems.map((item) => item.quantity * item.unitCost);
  const totals = { materials: 0, labor: 0, equipment: 0, other: 0 };
  lineItems.forEach((item, i) => {
    totals[item.category] += lineItemTotals[i];
  });
  const grandTotal = lineItemTotals.reduce((s, t) => s + t, 0);
  return { lineItemTotals, ...totals, grandTotal };
}

// src/drywall.ts
var SHEET_AREAS_IMPERIAL = { "4x8": 32, "4x10": 40, "4x12": 48 };
var SHEET_AREAS_METRIC = { "4x8": 2.97, "4x10": 3.72, "4x12": 4.46 };
function calculateDrywall(input) {
  const { length, width, height, doors, windows, includeCeiling, sheetSize, units } = input;
  const doorArea = units === "imperial" ? 21 : 1.95;
  const windowArea = units === "imperial" ? 15 : 1.4;
  const perimeter = 2 * (length + width);
  const wallArea = perimeter * height - doors * doorArea - windows * windowArea;
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalArea = wallArea + ceilingArea;
  const sheetAreas = units === "imperial" ? SHEET_AREAS_IMPERIAL : SHEET_AREAS_METRIC;
  const sheetArea = sheetAreas[sheetSize] ?? sheetAreas["4x8"];
  const sheets = Math.ceil(totalArea * 1.1 / sheetArea);
  const tapeRolls = Math.ceil(totalArea / (units === "imperial" ? 500 : 46));
  const compoundBuckets = Math.ceil(totalArea / (units === "imperial" ? 480 : 45));
  const screws = sheets * 32;
  return { wallArea, ceilingArea, totalArea, sheets, tapeRolls, compoundBuckets, screws };
}

// src/fence.ts
var FENCE_COSTS = {
  wood: { costMin: 17, costMax: 45, picketWidth: 5.5 },
  vinyl: { costMin: 25, costMax: 40, picketWidth: 0 },
  chain_link: { costMin: 10, costMax: 20, picketWidth: 0 },
  aluminum: { costMin: 25, costMax: 40, picketWidth: 0 },
  split_rail: { costMin: 10, costMax: 25, picketWidth: 0 }
};
function calculateFence(input) {
  const { linearLength, postSpacing, height, gates, fenceType, units } = input;
  const posts = Math.ceil(linearLength / postSpacing) + 1 + gates;
  const railsPerSection = height > (units === "imperial" ? 5 : 1.5) ? 3 : 2;
  const rails = (posts - 1) * railsPerSection;
  const type = FENCE_COSTS[fenceType] ?? FENCE_COSTS.wood;
  const pickets = fenceType === "wood" ? Math.ceil(linearLength * (units === "imperial" ? 12 : 39.3701) / type.picketWidth) : 0;
  const panels = fenceType !== "wood" ? Math.ceil(linearLength / postSpacing) : 0;
  const concreteBags = posts * 2;
  const linearInFeet = units === "imperial" ? linearLength : linearLength * 3.28084;
  const costMin = linearInFeet * type.costMin;
  const costMax = linearInFeet * type.costMax;
  return { posts, rails, pickets, panels, concreteBags, costMin, costMax };
}

// src/flooring.ts
var FLOORING_DEFAULTS = {
  hardwood: { costMin: 6, costMax: 12, boxCoverage: 20, boxCoverageMetric: 1.86 },
  laminate: { costMin: 3, costMax: 8, boxCoverage: 20, boxCoverageMetric: 1.86 },
  vinyl_plank: { costMin: 2, costMax: 7, boxCoverage: 20, boxCoverageMetric: 1.86 },
  tile: { costMin: 5, costMax: 15, boxCoverage: 10, boxCoverageMetric: 0.93 },
  carpet: { costMin: 3, costMax: 8, boxCoverage: 1, boxCoverageMetric: 1 }
};
function calculateFlooring(input) {
  const { roomLength, roomWidth, plankWidth, plankLength, wastePercent, flooringType, units } = input;
  const totalArea = roomLength * roomWidth;
  const totalAreaWithWaste = totalArea * (1 + wastePercent / 100);
  const pieceArea = units === "metric" ? plankWidth / 1e3 * (plankLength / 1e3) : plankWidth / 12 * (plankLength / 12);
  const piecesNeeded = Math.ceil(totalAreaWithWaste / pieceArea);
  const defaults = FLOORING_DEFAULTS[flooringType] ?? FLOORING_DEFAULTS.hardwood;
  const boxCoverage = units === "metric" ? defaults.boxCoverageMetric : defaults.boxCoverage;
  const boxesNeeded = Math.ceil(totalAreaWithWaste / boxCoverage);
  const perimeter = 2 * (roomLength + roomWidth);
  const perimeterFt = units === "metric" ? perimeter * 3.28084 : perimeter;
  const transitionStrips = Math.max(1, Math.round(perimeter / 3));
  const areaSqFt = units === "metric" ? totalAreaWithWaste * 10.7639 : totalAreaWithWaste;
  const costMin = areaSqFt * defaults.costMin;
  const costMax = areaSqFt * defaults.costMax;
  return { totalArea, totalAreaWithWaste, piecesNeeded, boxesNeeded, underlaymentArea: totalAreaWithWaste, perimeterFt, transitionStrips, costMin, costMax };
}

// src/paint.ts
var DOOR_AREA = { imperial: 21, metric: 1.95 };
var WINDOW_AREA = { imperial: 15, metric: 1.4 };
var PAINT_COVERAGE = {
  standard: { imperial: 400, metric: 10 },
  primer: { imperial: 350, metric: 8.5 },
  gloss: { imperial: 350, metric: 8.5 },
  matte: { imperial: 450, metric: 11 }
};
var PAINT_RATE = { imperial: 150, metric: 14 };
function calculatePaint(input) {
  const { length, width, height, doors, windows, includeCeiling, coats, paintType, includePrimer, units } = input;
  const perimeter = 2 * (length + width);
  const totalWallArea = perimeter * height;
  const doorDeduction = doors * (units === "imperial" ? DOOR_AREA.imperial : DOOR_AREA.metric);
  const windowDeduction = windows * (units === "imperial" ? WINDOW_AREA.imperial : WINDOW_AREA.metric);
  const netWallArea = Math.max(0, totalWallArea - doorDeduction - windowDeduction);
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalPaintableArea = (netWallArea + ceilingArea) * coats;
  const coverage = units === "imperial" ? PAINT_COVERAGE[paintType].imperial : PAINT_COVERAGE[paintType].metric;
  const gallonsNeeded = Math.ceil(totalPaintableArea / coverage);
  const quartsNeeded = gallonsNeeded * 4;
  const primerCoverage = units === "imperial" ? PAINT_COVERAGE.primer.imperial : PAINT_COVERAGE.primer.metric;
  const primerGallons = includePrimer ? Math.ceil((netWallArea + ceilingArea) / primerCoverage) : 0;
  const costLow = gallonsNeeded * 25;
  const costHigh = gallonsNeeded * 50;
  const rate = units === "imperial" ? PAINT_RATE.imperial : PAINT_RATE.metric;
  const timeEstimateHours = totalPaintableArea / rate;
  return { netWallArea, ceilingArea, totalPaintableArea, gallonsNeeded, quartsNeeded, primerGallons, costLow, costHigh, timeEstimateHours };
}

// src/insulation.ts
var R_PER_INCH = {
  "fiberglass-batt": 3.14,
  "blown-in-fiberglass": 2.5,
  cellulose: 3.7,
  "spray-foam": 6.5,
  "rigid-board": 5
};
var COST_RANGES = {
  "fiberglass-batt": [0.64, 1.19],
  "blown-in-fiberglass": [1, 2.1],
  cellulose: [0.85, 1.8],
  "spray-foam": [1.5, 3],
  "rigid-board": [1, 2.5]
};
var BATT_ROLL_COVERAGE_SQFT = 40;
var LOOSE_FILL_BAG_COVERAGE_SQFT = 40;
function calculateInsulation(input) {
  const { length, width, targetRValue, insulationType, units } = input;
  const areaInInputUnits = length * width;
  const areaSqFt = units === "metric" ? areaInInputUnits * 10.7639 : areaInInputUnits;
  const rPerInch = R_PER_INCH[insulationType];
  const thicknessInches = targetRValue / rPerInch;
  const thicknessCm = thicknessInches * 2.54;
  let rollsOrBags;
  if (insulationType === "fiberglass-batt") {
    rollsOrBags = Math.ceil(areaSqFt / BATT_ROLL_COVERAGE_SQFT);
  } else if (insulationType === "blown-in-fiberglass" || insulationType === "cellulose") {
    const rRatio = targetRValue / 30;
    const adjustedCoverage = LOOSE_FILL_BAG_COVERAGE_SQFT / rRatio;
    rollsOrBags = Math.ceil(areaSqFt / adjustedCoverage);
  } else if (insulationType === "spray-foam") {
    const boardFeet = areaSqFt * thicknessInches;
    rollsOrBags = Math.ceil(boardFeet / 600);
  } else {
    rollsOrBags = Math.ceil(areaSqFt / 32);
  }
  const [lowRate, highRate] = COST_RANGES[insulationType];
  const costLow = areaSqFt * lowRate;
  const costHigh = areaSqFt * highRate;
  return { areaSqFt, thicknessInches, thicknessCm, rollsOrBags, costLow, costHigh };
}

// src/paver.ts
function calculatePavers(input) {
  const { areaLength, areaWidth, paverLength, paverWidth, jointWidth, wastePercent, units } = input;
  const totalArea = areaLength * areaWidth;
  let effectivePaverArea;
  if (units === "imperial") {
    const paverSqIn = (paverLength + jointWidth) * (paverWidth + jointWidth);
    effectivePaverArea = paverSqIn / 144;
  } else {
    const paverSqCm = (paverLength + jointWidth / 10) * (paverWidth + jointWidth / 10);
    effectivePaverArea = paverSqCm / 1e4;
  }
  const paversNeeded = Math.ceil(totalArea / effectivePaverArea);
  const wastePavers = Math.ceil(paversNeeded * (wastePercent / 100));
  const totalWithWaste = paversNeeded + wastePavers;
  const sandTons = units === "imperial" ? totalArea / 100 : totalArea * 10.764 / 100;
  const gravelVolume = units === "imperial" ? totalArea * 0.33 / 27 : totalArea * 0.1;
  return { totalArea, paversNeeded, wastePavers, totalWithWaste, sandTons, gravelVolume };
}

// src/retaining-wall.ts
function calculateRetainingWall(input) {
  const { wallLength, wallHeight, wallThickness, backfillDepth, blockLength, blockHeight, wastePercent, units } = input;
  let wallLengthIn, wallHeightIn, wallThicknessIn, backfillDepthIn;
  if (units === "imperial") {
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
  const totalFaceArea = units === "imperial" ? totalFaceAreaSqIn / 144 : totalFaceAreaSqIn / 1550.0031;
  const backfillVolumeCuIn = wallLengthIn * wallHeightIn * backfillDepthIn;
  const gravelBackfill = units === "imperial" ? backfillVolumeCuIn / 46656 : backfillVolumeCuIn / 61023.7;
  const drainageAggregate = gravelBackfill * 0.33;
  const wallHeightFt = wallHeightIn / 12;
  let geogridLayers = 0;
  if (wallHeightFt > 3) {
    geogridLayers = Math.max(1, Math.floor(courses / 2));
  }
  return { courses, blocksPerCourse, totalBlocks, blocksWithWaste, capBlocks, totalFaceArea, gravelBackfill, drainageAggregate, geogridLayers };
}

// src/stair.ts
function calculateStairs(input) {
  const { totalRise, desiredSteps, units } = input;
  const idealRise = units === "imperial" ? 7.5 : 190;
  const idealRun = units === "imperial" ? 10.5 : 267;
  const numberOfSteps = desiredSteps ?? Math.ceil(totalRise / idealRise);
  const risePerStep = totalRise / numberOfSteps;
  const runPerStep = idealRun;
  const totalRun = runPerStep * (numberOfSteps - 1);
  const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
  const angleDegrees = Math.atan2(totalRise, totalRun) * (180 / Math.PI);
  return { numberOfSteps, risePerStep, runPerStep, totalRun, stringerLength, angleDegrees };
}

// src/deck-cost.ts
var BOARD_COVERAGE_SQFT = 0.833;
var WASTE_FACTOR = 1.15;
var JOIST_SPACING_IN = 16;
var POST_AREA_SQFT = 64;
var FOOTING_PER_POST = 1;
var SCREWS_PER_100_SQFT = 350;
var DECK_PRICES = {
  pressure_treated: { materialLow: 15, materialHigh: 25, installedLow: 30, installedHigh: 60 },
  composite: { materialLow: 30, materialHigh: 60, installedLow: 50, installedHigh: 100 },
  cedar: { materialLow: 25, materialHigh: 40, installedLow: 40, installedHigh: 80 },
  redwood: { materialLow: 30, materialHigh: 50, installedLow: 50, installedHigh: 100 },
  hardwood: { materialLow: 35, materialHigh: 65, installedLow: 60, installedHigh: 120 }
};
var RAILING_PRICES = { low: 150, high: 400 };
var STAIR_PRICES = { low: 600, high: 2e3 };
function calculateDeckCost(input) {
  const { length, width, height, deckMaterial, includeRailing, includeStairs, steps, units } = input;
  const lengthFt = units === "metric" ? length * 3.28084 : length;
  const widthFt = units === "metric" ? width * 3.28084 : width;
  const heightFt = units === "metric" ? height * 3.28084 : height;
  const areaSqFt = lengthFt * widthFt;
  const areaM2 = areaSqFt / 10.7639;
  const boardsNeeded = Math.ceil(areaSqFt / BOARD_COVERAGE_SQFT * WASTE_FACTOR);
  const joistsNeeded = Math.ceil(lengthFt * 12 / JOIST_SPACING_IN) + 1;
  const heightMultiplier = heightFt > 4 ? 1.5 : 1;
  const postsNeeded = Math.max(4, Math.ceil(areaSqFt / POST_AREA_SQFT * heightMultiplier));
  const footingsNeeded = postsNeeded * FOOTING_PER_POST;
  const fastenersNeeded = Math.ceil(areaSqFt / 100 * SCREWS_PER_100_SQFT);
  const perimeter = 2 * lengthFt + 2 * widthFt;
  const railingLinearFt = includeRailing ? Math.ceil(perimeter - widthFt) : 0;
  const prices = DECK_PRICES[deckMaterial] ?? DECK_PRICES.pressure_treated;
  const materialCostLow = areaSqFt * prices.materialLow;
  const materialCostHigh = areaSqFt * prices.materialHigh;
  const installedCostLow = areaSqFt * prices.installedLow;
  const installedCostHigh = areaSqFt * prices.installedHigh;
  const railingCostLow = railingLinearFt * RAILING_PRICES.low;
  const railingCostHigh = railingLinearFt * RAILING_PRICES.high;
  const stairCostLow = includeStairs ? steps * STAIR_PRICES.low : 0;
  const stairCostHigh = includeStairs ? steps * STAIR_PRICES.high : 0;
  const totalMaterialLow = materialCostLow + (includeRailing ? railingCostLow * 0.5 : 0) + (includeStairs ? stairCostLow * 0.4 : 0);
  const totalMaterialHigh = materialCostHigh + (includeRailing ? railingCostHigh * 0.5 : 0) + (includeStairs ? stairCostHigh * 0.4 : 0);
  const totalInstalledLow = installedCostLow + railingCostLow + stairCostLow;
  const totalInstalledHigh = installedCostHigh + railingCostHigh + stairCostHigh;
  return { areaSqFt, areaM2, boardsNeeded, joistsNeeded, postsNeeded, footingsNeeded, fastenersNeeded, railingLinearFt, totalMaterialLow, totalMaterialHigh, totalInstalledLow, totalInstalledHigh };
}

// src/equipment-depreciation.ts
function calculateEquipmentDepreciation(input) {
  const { cost, salvageValue, usefulLifeYears } = input;
  const depreciableAmount = cost - salvageValue;
  const sumOfYears = usefulLifeYears * (usefulLifeYears + 1) / 2;
  const straightLineAnnual = depreciableAmount / usefulLifeYears;
  let remainingDeclining = cost;
  let remainingDouble = cost;
  const schedule = [];
  for (let year = 1; year <= usefulLifeYears; year++) {
    const decliningDepreciation = Math.min(remainingDeclining * 0.275, remainingDeclining - salvageValue);
    remainingDeclining -= decliningDepreciation;
    const sumOfYearsDigits = depreciableAmount * (usefulLifeYears - year + 1) / sumOfYears;
    const doubleRate = 2 / usefulLifeYears;
    const doubleDeclineDepreciation = Math.min(remainingDouble * doubleRate, remainingDouble - salvageValue);
    remainingDouble -= doubleDeclineDepreciation;
    schedule.push({
      year,
      straightLine: straightLineAnnual,
      decliningBalance: decliningDepreciation,
      sumOfYearsDigits,
      doubleDecliningBalance: doubleDeclineDepreciation
    });
  }
  return { depreciableAmount, schedule };
}

// src/hourly-rate.ts
function calculateHourlyRate(input) {
  const { daysPerWeek, weeksPerYear, hoursPerDay, vacationDays, sickDays, holidayDays, expenses, profitMargin } = input;
  const totalDaysOff = vacationDays + sickDays + holidayDays;
  const workingDaysPerYear = daysPerWeek * weeksPerYear - totalDaysOff;
  const annualHours = workingDaysPerYear * hoursPerDay;
  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (value ?? 0), 0);
  const baseHourlyRate = annualHours > 0 ? totalExpenses / annualHours : 0;
  const withProfitRate = baseHourlyRate * (1 + profitMargin / 100);
  const expenseBreakdownPerHour = {};
  if (annualHours > 0) {
    for (const [key, value] of Object.entries(expenses)) {
      expenseBreakdownPerHour[key] = (value ?? 0) / annualHours;
    }
  }
  return { workingDaysPerYear, annualHours, totalExpenses, baseHourlyRate, withProfitRate, expenseBreakdownPerHour };
}

// src/net-profit.ts
function calculateNetProfit(input) {
  const { desiredProfit, profitMarginPercent, avgRevenuePerProject } = input;
  const totalRevenueNeeded = desiredProfit * 100 / profitMarginPercent;
  const projectsPerYear = Math.ceil(totalRevenueNeeded / avgRevenuePerProject);
  const projectsPerMonth = Math.ceil(projectsPerYear / 12);
  const projectsPerWeek = Math.ceil(projectsPerYear / 52);
  return { totalRevenueNeeded, projectsPerYear, projectsPerMonth, projectsPerWeek };
}

// src/timeline.ts
function calculateTimeline(tasks) {
  const graph = {};
  tasks.forEach((t) => {
    graph[t.id] = t;
  });
  const earliestStart = {};
  const earliestFinish = {};
  const visited = /* @__PURE__ */ new Set();
  function forwardPass(taskId) {
    if (visited.has(taskId)) return earliestFinish[taskId];
    visited.add(taskId);
    const task = graph[taskId];
    let maxDepFinish = 0;
    task.dependencies.forEach((depId) => {
      maxDepFinish = Math.max(maxDepFinish, forwardPass(depId));
    });
    earliestStart[taskId] = maxDepFinish;
    earliestFinish[taskId] = maxDepFinish + task.duration;
    return earliestFinish[taskId];
  }
  let projectDuration = 0;
  tasks.forEach((t) => {
    projectDuration = Math.max(projectDuration, forwardPass(t.id));
  });
  const latestFinish = {};
  const latestStart = {};
  tasks.forEach((t) => {
    latestFinish[t.id] = projectDuration;
  });
  const successors = {};
  tasks.forEach((t) => {
    successors[t.id] = [];
  });
  tasks.forEach((t) => {
    t.dependencies.forEach((depId) => {
      if (successors[depId]) successors[depId].push(t.id);
    });
  });
  const taskIds = tasks.map((t) => t.id).reverse();
  for (let i = 0; i < taskIds.length * 2; i++) {
    taskIds.forEach((id) => {
      const succs = successors[id];
      if (succs.length > 0) {
        latestFinish[id] = Math.min(...succs.map((s) => latestStart[s] ?? projectDuration));
      }
      latestStart[id] = latestFinish[id] - graph[id].duration;
    });
  }
  const totalFloat = {};
  const criticalPath = [];
  tasks.forEach((t) => {
    totalFloat[t.id] = (latestStart[t.id] ?? 0) - earliestStart[t.id];
    if (totalFloat[t.id] === 0) criticalPath.push(t.id);
  });
  return { projectDuration, criticalPath, earliestStart, earliestFinish, latestStart, latestFinish, totalFloat };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  calculateBoardFoot,
  calculateConcrete,
  calculateConcreteBlock,
  calculateConcreteSlab,
  calculateConstructionCost,
  calculateDeckCost,
  calculateDrywall,
  calculateEquipmentDepreciation,
  calculateFence,
  calculateFlooring,
  calculateGravel,
  calculateHourlyRate,
  calculateInsulation,
  calculateLaborCost,
  calculateMarkup,
  calculateMarkupFromMargin,
  calculateMetalRoofCost,
  calculateNetProfit,
  calculatePaint,
  calculatePavers,
  calculateRafterLength,
  calculateRetainingWall,
  calculateRoofMaterials,
  calculateRoofingCost,
  calculateSquareFootage,
  calculateStairs,
  calculateTimeline,
  pitchFromAngle,
  pitchFromPercent,
  pitchFromRiseRun
});
//# sourceMappingURL=index.cjs.map