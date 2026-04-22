# construction-calculators

[![npm version](https://img.shields.io/npm/v/@buildvisionai/construction-calculators.svg)](https://www.npmjs.com/package/@buildvisionai/construction-calculators)
[![PyPI](https://img.shields.io/pypi/v/buildvision-construction-calculators)](https://pypi.org/project/buildvision-construction-calculators/)
[![npm downloads](https://img.shields.io/npm/dm/@buildvisionai/construction-calculators.svg)](https://www.npmjs.com/package/@buildvisionai/construction-calculators)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/pypi/pyversions/buildvision-construction-calculators)](https://pypi.org/project/buildvision-construction-calculators/)

> Pure TypeScript and Python calculation libraries for construction estimating — zero dependencies. Works everywhere.

Built and maintained by [BuildVision](https://www.buildvisionai.com) — AI-powered construction estimating software. Try the **[live calculators →](https://www.buildvisionai.com/calculators)**

---

## Install

### JavaScript / TypeScript

```bash
npm install @buildvisionai/construction-calculators
# or
yarn add @buildvisionai/construction-calculators
# or
pnpm add @buildvisionai/construction-calculators
```

### Python

```bash
pip install buildvision-construction-calculators
```

Requires Python 3.9+. No dependencies beyond the standard library.

---

## Quick Start

### TypeScript

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

### Python

```python
from construction_calculators.concrete import ConcreteInput, calculate_concrete

result = calculate_concrete(ConcreteInput(
    shape="rectangular",
    length=20,
    width=20,
    depth=0.333,
    units="imperial",
))

print(f"Volume: {result.volume_cu_ft:.1f} cu ft ({result.volume_cu_m:.2f} m³)")
print(f"Bags needed: {result.bags_needed}")
```

```python
from construction_calculators.markup import MarkupFromCostInput, calculate_markup

result = calculate_markup(MarkupFromCostInput(costs=15_000, markup_percent=25))
print(f"Sell: ${result.total_with_markup:,.0f}, Margin: {result.profit_margin_percent:.1f}%")
```

---

## Calculators

### Concrete & Masonry

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Concrete | Rectangular/circular volume, bags, sand, gravel, water | [Concrete Calculator](https://www.buildvisionai.com/calculators/concrete-calculator) |
| Concrete Slab | Slab volume, 60/80lb bags, ready-mix trucks, rebar | [Concrete Slab Calculator](https://www.buildvisionai.com/calculators/concrete-slab-calculator) |
| Concrete Block | CMU block count, mortar bags, cost estimate | [Concrete Block Calculator](https://www.buildvisionai.com/calculators/concrete-block-calculator) |
| Retaining Wall | Block courses, backfill volume, drainage, geogrid layers | [Retaining Wall Calculator](https://www.buildvisionai.com/calculators/retaining-wall-calculator) |

### Materials & Aggregates

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Gravel | Volume, tonnage, 50lb bags, cost | [Gravel Calculator](https://www.buildvisionai.com/calculators/gravel-calculator) |
| Board Foot | Lumber board feet, cubic meters, weight | [Board Foot Calculator](https://www.buildvisionai.com/calculators/board-foot-calculator) |
| Insulation | R-value thickness, rolls/bags by insulation type, cost | [Insulation Calculator](https://www.buildvisionai.com/calculators/insulation-calculator) |
| Paver | Paver count + waste, sand bed, gravel base | [Paver Calculator](https://www.buildvisionai.com/calculators/paver-calculator) |

### Interior Finishes

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Drywall | Sheets, tape rolls, compound buckets, screws | [Drywall Calculator](https://www.buildvisionai.com/calculators/drywall-calculator) |
| Flooring | Planks/boxes, underlayment, transition strips, cost | [Flooring Calculator](https://www.buildvisionai.com/calculators/flooring-calculator) |
| Paint | Gallons, primer, cost range, time estimate | [Paint Calculator](https://www.buildvisionai.com/calculators/paint-calculator) |

### Roofing

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Roof Materials | Shingle bundles, accessories, bid price, gross margin | [Roof Calculator](https://www.buildvisionai.com/calculators/roof-calculator) |
| Roofing Cost | Installed cost by material, region, pitch, stories | [Roofing Cost Calculator](https://www.buildvisionai.com/calculators/roofing-cost-calculator) |
| Metal Roof Cost | Metal roof cost + 50-year vs asphalt comparison | [Metal Roof Cost Calculator](https://www.buildvisionai.com/calculators/metal-roof-cost-calculator) |
| Roof Pitch | Angle, percent, and rafter length from rise/run | [Roof Pitch Calculator](https://www.buildvisionai.com/calculators/roof-pitch-calculator) |

### Structures & Exterior

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Square Footage | Multi-room area for rectangle, square, circle shapes | [Square Footage Calculator](https://www.buildvisionai.com/calculators/square-footage-calculator) |
| Fence | Posts, rails, pickets, panels, concrete bags, cost | [Fence Calculator](https://www.buildvisionai.com/calculators/fence-calculator) |
| Stairs | Step count, rise/run, stringer length, angle | [Stair Calculator](https://www.buildvisionai.com/calculators/stair-calculator) |
| Deck Cost | Boards, joists, posts, footings, railing, installed cost | [Deck Cost Calculator](https://www.buildvisionai.com/calculators/deck-cost-calculator) |

### Business & Finance

| Calculator | Description | Live Demo |
|------------|-------------|-----------|
| Markup | Selling price and profit margin from cost + markup % | [Markup Calculator](https://www.buildvisionai.com/calculators/markup-calculator) |
| Labor Cost | Total labor cost with payroll burden multiplier | [Labor Cost Calculator](https://www.buildvisionai.com/calculators/labor-cost-calculator) |
| Hourly Rate | Billable rate from annual expenses + profit margin | [Hourly Rate Calculator](https://www.buildvisionai.com/calculators/hourly-rate-calculator) |
| Net Profit | Projects/month needed to hit annual profit goal | [Net Profit Calculator](https://www.buildvisionai.com/calculators/net-profit-calculator) |
| Construction Cost | Line-item cost roll-up by category | [Construction Cost Calculator](https://www.buildvisionai.com/calculators/construction-cost-calculator) |
| Equipment Depreciation | 4-method schedule: straight-line, DDB, SYD | [Equipment Depreciation Calculator](https://www.buildvisionai.com/calculators/equipment-depreciation-calculator) |
| Timeline | Critical path method (CPM) — earliest/latest start, float | [Timeline Calculator](https://www.buildvisionai.com/calculators/timeline-calculator) |

---

## Units

All functions accept a `units` parameter — `'imperial'` or `'metric'`. Outputs include both unit variants where relevant.

---

## Packages

| Package | Registry | Docs |
|---------|----------|------|
| [`@buildvisionai/construction-calculators`](https://www.npmjs.com/package/@buildvisionai/construction-calculators) | npm | [TypeScript API](https://www.buildvisionai.com/calculators) |
| [`buildvision-construction-calculators`](https://pypi.org/project/buildvision-construction-calculators/) | PyPI | [Python API](https://www.buildvisionai.com/calculators) |

## Design Principles

- **Pure functions** — input in, result out, no side effects
- **Zero dependencies** — nothing to audit, nothing to break
- **Fully typed** — TypeScript types and Python dataclasses
- **Universal** — works in Node, browser, Deno, edge runtimes (TS) and Python 3.9+ (Python)

---

## Contributing

PRs welcome. Good areas to expand: HVAC load, electrical, plumbing, sitework, earthworks.

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [BuildVision](https://www.buildvisionai.com) — AI-powered [construction estimating software](https://www.buildvisionai.com) for the modern contractor.
