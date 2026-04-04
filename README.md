# @buildvisionai/construction-calculators

[![npm version](https://img.shields.io/npm/v/@buildvisionai/construction-calculators.svg)](https://www.npmjs.com/package/@buildvisionai/construction-calculators)
[![npm downloads](https://img.shields.io/npm/dm/@buildvisionai/construction-calculators.svg)](https://www.npmjs.com/package/@buildvisionai/construction-calculators)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

> Pure TypeScript functions for construction estimating — zero dependencies, no React, no DOM. Works in Node, browser, Deno, and edge runtimes.

Built and maintained by [BuildVision](https://buildvisionai.com) — AI-powered construction estimating software. Try the **[live calculators →](https://buildvisionai.com/calculators)**

---

## Install

```bash
npm install @buildvisionai/construction-calculators
# or
yarn add @buildvisionai/construction-calculators
# or
pnpm add @buildvisionai/construction-calculators
```

---

## Quick Start

```typescript
import {
  calculateConcrete,
  calculateMarkup,
  calculateRoofingCost,
} from '@buildvisionai/construction-calculators';

// Concrete volume for a 20×30 ft slab, 4 inches thick
const slab = calculateConcrete({
  shape: 'rectangular',
  length: 20,
  width: 30,
  depth: 4 / 12,
  units: 'imperial',
});
console.log(slab.volumeCuYd);  // 2.22 cubic yards
console.log(slab.bagsNeeded);  // 134 × 60lb bags

// Price it up with markup
const quote = calculateMarkup({ costs: 850, markupPercent: 25 });
console.log(quote.totalWithMarkup);      // $1,062.50
console.log(quote.profitMarginPercent);  // 20%

// Roofing cost range
const roof = calculateRoofingCost({
  roofArea: 2400,
  materialType: 'asphalt',
  regionMultiplier: 1.0,
  pitchMultiplier: 1.1,
  storiesMultiplier: 1.0,
  includeTearOff: true,
  units: 'imperial',
});
console.log(`$${roof.totalLow.toFixed(0)}–$${roof.totalHigh.toFixed(0)}`);
```

---

## Calculators

### Concrete & Masonry

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateConcrete` | Rectangular/circular volume, bags, sand, gravel, water | [Concrete Calculator](https://buildvisionai.com/calculators/concrete-calculator) |
| `calculateConcreteSlab` | Slab volume, 60/80lb bags, ready-mix trucks, rebar | [Concrete Slab Calculator](https://buildvisionai.com/calculators/concrete-slab-calculator) |
| `calculateConcreteBlock` | CMU block count, mortar bags, cost estimate | [Concrete Block Calculator](https://buildvisionai.com/calculators/concrete-block-calculator) |
| `calculateRetainingWall` | Block courses, backfill volume, drainage, geogrid layers | [Retaining Wall Calculator](https://buildvisionai.com/calculators/retaining-wall-calculator) |

### Materials & Aggregates

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateGravel` | Volume, tonnage, 50lb bags, cost | [Gravel Calculator](https://buildvisionai.com/calculators/gravel-calculator) |
| `calculateBoardFoot` | Lumber board feet, cubic meters, weight | [Board Foot Calculator](https://buildvisionai.com/calculators/board-foot-calculator) |
| `calculateInsulation` | R-value thickness, rolls/bags by insulation type, cost | [Insulation Calculator](https://buildvisionai.com/calculators/insulation-calculator) |
| `calculatePavers` | Paver count + waste, sand bed, gravel base | [Paver Calculator](https://buildvisionai.com/calculators/paver-calculator) |

### Interior Finishes

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateDrywall` | Sheets, tape rolls, compound buckets, screws | [Drywall Calculator](https://buildvisionai.com/calculators/drywall-calculator) |
| `calculateFlooring` | Planks/boxes, underlayment, transition strips, cost | [Flooring Calculator](https://buildvisionai.com/calculators/flooring-calculator) |
| `calculatePaint` | Gallons, primer, cost range, time estimate | [Paint Calculator](https://buildvisionai.com/calculators/paint-calculator) |

### Roofing

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateRoofMaterials` | Shingle bundles, accessories, bid price, gross margin | [Roof Calculator](https://buildvisionai.com/calculators/roof-calculator) |
| `calculateRoofingCost` | Installed cost by material, region, pitch, stories | [Roofing Cost Calculator](https://buildvisionai.com/calculators/roofing-cost-calculator) |
| `calculateMetalRoofCost` | Metal roof cost + 50-year vs asphalt comparison | [Metal Roof Cost Calculator](https://buildvisionai.com/calculators/metal-roof-cost-calculator) |
| `pitchFromRiseRun` | Angle and percent from rise/run | [Roof Pitch Calculator](https://buildvisionai.com/calculators/roof-pitch-calculator) |
| `pitchFromAngle` | Rise/run from pitch angle | [Roof Pitch Calculator](https://buildvisionai.com/calculators/roof-pitch-calculator) |
| `pitchFromPercent` | Rise/run from slope percent | [Roof Pitch Calculator](https://buildvisionai.com/calculators/roof-pitch-calculator) |
| `calculateRafterLength` | Rafter length from pitch and half-span | [Roof Pitch Calculator](https://buildvisionai.com/calculators/roof-pitch-calculator) |

### Structures & Exterior

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateSquareFootage` | Multi-room area for rectangle, square, circle shapes | [Square Footage Calculator](https://buildvisionai.com/calculators/square-footage-calculator) |
| `calculateFence` | Posts, rails, pickets, panels, concrete bags, cost | [Fence Calculator](https://buildvisionai.com/calculators/fence-calculator) |
| `calculateStairs` | Step count, rise/run, stringer length, angle | [Stair Calculator](https://buildvisionai.com/calculators/stair-calculator) |
| `calculateDeckCost` | Boards, joists, posts, footings, railing, installed cost | [Deck Cost Calculator](https://buildvisionai.com/calculators/deck-cost-calculator) |

### Business & Finance

| Function | Description | Live Demo |
|----------|-------------|-----------|
| `calculateMarkup` | Selling price and profit margin from cost + markup % | [Markup Calculator](https://buildvisionai.com/calculators/markup-calculator) |
| `calculateMarkupFromMargin` | Required markup % to hit a target profit margin | [Markup Calculator](https://buildvisionai.com/calculators/markup-calculator) |
| `calculateLaborCost` | Total labor cost with payroll burden multiplier | [Labor Cost Calculator](https://buildvisionai.com/calculators/labor-cost-calculator) |
| `calculateHourlyRate` | Billable rate from annual expenses + profit margin | [Hourly Rate Calculator](https://buildvisionai.com/calculators/hourly-rate-calculator) |
| `calculateNetProfit` | Projects/month needed to hit annual profit goal | [Net Profit Calculator](https://buildvisionai.com/calculators/net-profit-calculator) |
| `calculateConstructionCost` | Line-item cost roll-up by category (materials/labor/equipment) | [Construction Cost Calculator](https://buildvisionai.com/calculators/construction-cost-calculator) |
| `calculateEquipmentDepreciation` | 4-method schedule: straight-line, declining balance, SYD, DDB | [Equipment Depreciation Calculator](https://buildvisionai.com/calculators/equipment-depreciation-calculator) |
| `calculateTimeline` | Critical path method (CPM) — earliest/latest start, float | [Timeline Calculator](https://buildvisionai.com/calculators/timeline-calculator) |

---

## Units

All functions accept a `units` parameter — `'imperial'` or `'metric'`. Outputs include both unit variants where relevant.

```typescript
// Imperial: feet, inches, lbs, gallons
calculateConcrete({ ..., units: 'imperial' })

// Metric: meters, cm/mm, kg, liters
calculateConcrete({ ..., units: 'metric' })
```

---

## Design Principles

- **Pure functions** — input object in, result object out, no side effects
- **Zero dependencies** — nothing to audit, nothing to break
- **TypeScript first** — full types on all inputs and outputs
- **Dual ESM + CJS** — works in any JS environment

---

## Contributing

PRs welcome. Good areas to expand: HVAC load, electrical, plumbing, sitework, earthworks.

---

Built by [BuildVision](https://buildvisionai.com) — construction estimating software for the modern contractor.
