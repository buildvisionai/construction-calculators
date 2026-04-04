# @buildvisionai/construction-calculators

[![npm version](https://badge.fury.io/js/%40buildvisionai%2Fconstruction-calculators.svg)](https://www.npmjs.com/package/@buildvisionai/construction-calculators)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Pure TypeScript functions for construction estimating calculations — no dependencies, no React, no DOM. Works in any JS/TS environment (Node, browser, Deno, edge runtimes).

> **Live calculators**: [buildvisionai.com/calculators](https://buildvisionai.com/calculators)

## Install

```bash
npm install @buildvisionai/construction-calculators
# or
yarn add @buildvisionai/construction-calculators
# or
pnpm add @buildvisionai/construction-calculators
```

## Usage

```typescript
import {
  calculateConcrete,
  calculateGravel,
  calculateMarkup,
  calculateRoofingCost,
} from '@buildvisionai/construction-calculators';

// Concrete volume for a 20×30 ft slab, 4 inches thick
const concrete = calculateConcrete({
  shape: 'rectangular',
  length: 20,
  width: 30,
  depth: 4 / 12, // convert inches to feet
  units: 'imperial',
});
console.log(concrete.volumeCuYd);  // cubic yards
console.log(concrete.bagsNeeded);  // 60 lb bags

// Gravel for a driveway
const gravel = calculateGravel({
  shape: 'rectangular',
  length: 50,
  width: 12,
  depth: 4 / 12,
  pricePerTon: 35,
  units: 'imperial',
});
console.log(gravel.tonnage);       // tons needed
console.log(gravel.estimatedCost); // total cost

// Markup from cost
const price = calculateMarkup({ costs: 8500, markupPercent: 25 });
console.log(price.totalWithMarkup); // $10,625
console.log(price.profitMarginPercent); // 20%

// Roofing cost estimate
const roofing = calculateRoofingCost({
  roofArea: 2400,
  materialType: 'asphalt',
  regionMultiplier: 1.0,
  pitchMultiplier: 1.1,
  storiesMultiplier: 1.0,
  includeTearOff: true,
  units: 'imperial',
});
console.log(`$${roofing.totalLow.toFixed(0)}–$${roofing.totalHigh.toFixed(0)}`);
```

## Available Calculators

| Function | Description |
|----------|-------------|
| `calculateBoardFoot` | Lumber board feet, metric volume, weight |
| `calculateConcrete` | Rectangular/circular concrete volume, bags, materials |
| `calculateConcreteSlab` | Slab volume, bags, ready-mix, rebar |
| `calculateConcreteBlock` | CMU block count, mortar bags, cost |
| `calculateGravel` | Gravel/aggregate volume, tonnage, cost |
| `calculateMarkup` | Selling price and profit from cost + markup % |
| `calculateMarkupFromMargin` | Required markup to hit a target margin |
| `calculateLaborCost` | Total labor cost with payroll burden |
| `pitchFromRiseRun` | Roof pitch angle and percent from rise/run |
| `pitchFromAngle` | Rise/run from pitch angle |
| `pitchFromPercent` | Rise/run from slope percent |
| `calculateRafterLength` | Rafter length from pitch and span |
| `calculateRoofingCost` | Installed roofing cost by material type |
| `calculateMetalRoofCost` | Metal roof cost + 50-year asphalt comparison |
| `calculateRoofMaterials` | Shingles, bundles, accessories, bid price |
| `calculateSquareFootage` | Multi-room square footage (rect/square/circle) |
| `calculateConstructionCost` | Line-item cost roll-up by category |
| `calculateDrywall` | Sheets, tape, compound, screws |
| `calculateFence` | Posts, rails, pickets, panels, cost |
| `calculateFlooring` | Planks, boxes, underlayment, cost |
| `calculatePaint` | Gallons, primer, cost, time estimate |
| `calculateInsulation` | Thickness, rolls/bags, cost |
| `calculatePavers` | Paver count, sand, gravel base |
| `calculateRetainingWall` | Block courses, backfill, geogrid |
| `calculateStairs` | Risers, run, stringer length, angle |
| `calculateDeckCost` | Boards, framing, material + installed cost |
| `calculateEquipmentDepreciation` | 4-method depreciation schedule |
| `calculateHourlyRate` | Billable rate from expenses + profit margin |
| `calculateNetProfit` | Projects needed to hit desired annual profit |
| `calculateTimeline` | Critical path method (CPM) scheduling |

## Units

All calculators accept a `units` parameter: `'imperial'` (feet, inches, lbs) or `'metric'` (meters, cm/mm, kg). Output objects include both unit variants where relevant.

## Contributing

This package is open source under the MIT license. Issues and PRs welcome on [GitHub](https://github.com/buildvisionai/construction-calculators).

Built by [BuildVision](https://buildvisionai.com) — construction estimating software.
