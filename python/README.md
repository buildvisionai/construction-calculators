# construction-calculators

[![PyPI](https://img.shields.io/pypi/v/buildvision-construction-calculators)](https://pypi.org/project/buildvision-construction-calculators/)
[![Python](https://img.shields.io/pypi/pyversions/buildvision-construction-calculators)](https://pypi.org/project/buildvision-construction-calculators/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Pure-Python construction calculation library.** Estimate materials, labor costs, and project financials with zero external dependencies. Supports both imperial and metric units.

Built by [BuildVision](https://www.buildvisionai.com) — the construction project management platform. Try the interactive web versions at **[buildvisionai.com/calculators](https://www.buildvisionai.com/calculators)**.

---

## Installation

```bash
pip install buildvision-construction-calculators
```

Requires Python 3.10+. No dependencies beyond the standard library.

---

## Calculators

### Concrete & Masonry

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `concrete` | `calculate_concrete` | Volume, bag count, sand/gravel/water quantities | [concrete-calculator](https://www.buildvisionai.com/calculators/concrete-calculator) |
| `concrete_slab` | `calculate_concrete_slab` | Slab volume in cubic yards and bags | [concrete-slab-calculator](https://www.buildvisionai.com/calculators/concrete-slab-calculator) |
| `concrete_block` | `calculate_concrete_block` | CMU block count, mortar bags, cost | [concrete-block-calculator](https://www.buildvisionai.com/calculators/concrete-block-calculator) |
| `retaining_wall` | `calculate_retaining_wall` | Wall materials and installed cost range | [retaining-wall-calculator](https://www.buildvisionai.com/calculators/retaining-wall-calculator) |
| `gravel` | `calculate_gravel` | Volume, tonnage, bag count, cost estimate | [gravel-calculator](https://www.buildvisionai.com/calculators/gravel-calculator) |

### Roofing

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `roofing_cost` | `calculate_roofing_cost` | Full roofing cost range by material type | [roofing-cost-calculator](https://www.buildvisionai.com/calculators/roofing-cost-calculator) |
| `roof` | `calculate_roof` | Roof area, squares, and shingle bundles | [roof-calculator](https://www.buildvisionai.com/calculators/roof-calculator) |
| `roof_pitch` | `pitch_from_rise_run`, `pitch_from_angle`, `pitch_from_percent`, `calculate_rafter_length` | Pitch angle, percent, and rafter length | [roof-pitch-calculator](https://www.buildvisionai.com/calculators/roof-pitch-calculator) |
| `metal_roof_cost` | `calculate_metal_roof_cost` | Metal panel cost by type and metal | [metal-roof-cost-calculator](https://www.buildvisionai.com/calculators/metal-roof-cost-calculator) |

### Interior & Finishing

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `drywall` | `calculate_drywall` | Sheets, tape, joint compound, and screws | [drywall-calculator](https://www.buildvisionai.com/calculators/drywall-calculator) |
| `flooring` | `calculate_flooring` | Pieces, boxes, underlayment, cost range | [flooring-calculator](https://www.buildvisionai.com/calculators/flooring-calculator) |
| `paint` | `calculate_paint` | Paint gallons, primer, cost range, time estimate | [paint-calculator](https://www.buildvisionai.com/calculators/paint-calculator) |
| `insulation` | `calculate_insulation` | Depth, bags, and cost for target R-value | [insulation-calculator](https://www.buildvisionai.com/calculators/insulation-calculator) |

### Exterior & Structural

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `fence` | `calculate_fence` | Posts, rails, pickets, concrete bags, cost range | [fence-calculator](https://www.buildvisionai.com/calculators/fence-calculator) |
| `paver` | `calculate_paver` | Paver count, sand bags, gravel base, cost | [paver-calculator](https://www.buildvisionai.com/calculators/paver-calculator) |
| `stair` | `calculate_stairs` | Step count, rise/run, stringer length, angle | [stair-calculator](https://www.buildvisionai.com/calculators/stair-calculator) |
| `deck_cost` | `calculate_deck_cost` | Deck cost by material with framing and railing | [deck-cost-calculator](https://www.buildvisionai.com/calculators/deck-cost-calculator) |
| `board_foot` | `calculate_board_foot` | Lumber volume in board feet and cubic meters | [board-foot-calculator](https://www.buildvisionai.com/calculators/board-foot-calculator) |

### General Construction

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `square_footage` | `calculate_square_footage` | Multi-room area totals in sq ft and m² | [square-footage-calculator](https://www.buildvisionai.com/calculators/square-footage-calculator) |
| `construction_cost` | `calculate_construction_cost` | Per-sq-ft cost estimate by construction type | [construction-cost-calculator](https://www.buildvisionai.com/calculators/construction-cost-calculator) |

### Business & Financial

| Module | Function | Description | Calculator |
|--------|----------|-------------|-----------|
| `markup` | `calculate_markup`, `calculate_markup_from_margin` | Selling price, profit, and margin calculations | [markup-calculator](https://www.buildvisionai.com/calculators/markup-calculator) |
| `net_profit` | `calculate_net_profit` | Projects needed to hit profit target | [net-profit-calculator](https://www.buildvisionai.com/calculators/net-profit-calculator) |
| `hourly_rate` | `calculate_hourly_rate` | Billable rate covering expenses and profit margin | [hourly-rate-calculator](https://www.buildvisionai.com/calculators/hourly-rate-calculator) |
| `labor_cost` | `calculate_labor_cost` | Total labor cost with payroll burden | [labor-cost-calculator](https://www.buildvisionai.com/calculators/labor-cost-calculator) |
| `equipment_depreciation` | `calculate_equipment_depreciation` | 4-method depreciation schedule | [equipment-depreciation-calculator](https://www.buildvisionai.com/calculators/equipment-depreciation-calculator) |
| `timeline` | `calculate_timeline` | Phase-based project schedule with dependency ordering | [timeline-calculator](https://www.buildvisionai.com/calculators/timeline-calculator) |

---

## Usage Examples

All functions accept a typed dataclass as input and return a typed dataclass. Every calculator that accepts physical dimensions supports `units="imperial"` (default) or `units="metric"`.

### Concrete

```python
from construction_calculators.concrete import ConcreteInput, calculate_concrete

result = calculate_concrete(ConcreteInput(
    shape="rectangular",
    length=20,   # feet
    width=20,    # feet
    depth=0.333, # feet (~4 inches)
    units="imperial",
))

print(f"Volume: {result.volume_cu_ft:.1f} cu ft ({result.volume_cu_m:.2f} m³)")
print(f"Bags needed: {result.bags_needed}")
print(f"Sand: {result.sand:.1f} cu ft, Gravel: {result.gravel:.1f} cu ft")
print(f"Water: {result.water:.1f} gallons")
# Volume: 133.2 cu ft (3.77 m³)
# Bags needed: 297
# Sand: 53.3 cu ft, Gravel: 79.9 cu ft
# Water: 196.0 gallons
```

### Gravel

```python
from construction_calculators.gravel import GravelInput, calculate_gravel

result = calculate_gravel(GravelInput(
    shape="rectangular",
    length=30, width=20, depth=0.25,  # feet
    price_per_ton=45,
    units="imperial",
))

print(f"Volume: {result.volume:.2f} yd³")
print(f"Tonnage: {result.tonnage:.2f} tons")
print(f"Cost: ${result.estimated_cost:,.2f}")
# Volume: 5.56 yd³
# Tonnage: 7.78 tons
# Cost: $350.00
```

### Markup and Margin

```python
from construction_calculators.markup import (
    MarkupFromCostInput, MarkupFromMarginInput,
    calculate_markup, calculate_markup_from_margin,
)

# From markup percentage
result = calculate_markup(MarkupFromCostInput(costs=15_000, markup_percent=25))
print(f"Sell: ${result.total_with_markup:,.0f}, Margin: {result.profit_margin_percent:.1f}%")
# Sell: $18,750, Margin: 20.0%

# From desired margin
result = calculate_markup_from_margin(MarkupFromMarginInput(costs=15_000, desired_margin=25))
print(f"Required markup: {result.markup_percent:.1f}%, Sell: ${result.total_with_markup:,.0f}")
# Required markup: 33.3%, Sell: $20,000
```

### Roofing Cost

```python
from construction_calculators.roofing_cost import RoofingCostInput, calculate_roofing_cost

result = calculate_roofing_cost(RoofingCostInput(
    roof_area=2500,         # sq ft
    material_type="metal",
    region_multiplier=1.1,  # 10% above average
    pitch_multiplier=1.15,  # moderately steep
    stories_multiplier=1.0,
    include_tear_off=True,
    units="imperial",
))

print(f"Total: ${result.total_low:,.0f} – ${result.total_high:,.0f}")
print(f"Expected lifespan: {result.lifespan_years.low}–{result.lifespan_years.high} years")
print(f"Cost/year: ${result.cost_per_year_low:,.0f} – ${result.cost_per_year_high:,.0f}")
```

### Paint

```python
from construction_calculators.paint import PaintInput, calculate_paint

result = calculate_paint(PaintInput(
    length=20, width=15, height=9,  # feet
    doors=2, windows=4,
    include_ceiling=True,
    coats=2,
    paint_type="standard",
    include_primer=True,
    units="imperial",
))

print(f"Net wall area: {result.net_wall_area:.0f} sq ft")
print(f"Paint needed: {result.gallons_needed} gallons")
print(f"Primer: {result.primer_gallons} gallons")
print(f"Time: {result.time_estimate_hours:.1f} hours")
print(f"Cost: ${result.cost_low:,.0f} – ${result.cost_high:,.0f}")
```

### Flooring

```python
from construction_calculators.flooring import FlooringInput, calculate_flooring

result = calculate_flooring(FlooringInput(
    room_length=18, room_width=14,  # feet
    plank_width=5, plank_length=48, # inches
    waste_percent=10,
    flooring_type="hardwood",
    units="imperial",
))

print(f"Area with waste: {result.total_area_with_waste:.0f} sq ft")
print(f"Boxes needed: {result.boxes_needed}")
print(f"Cost: ${result.cost_min:,.0f} – ${result.cost_max:,.0f}")
```

### Board Foot (Lumber)

```python
from construction_calculators.board_foot import BoardFootInput, calculate_board_foot

result = calculate_board_foot(BoardFootInput(
    thickness=2,  # inches
    width=8,      # inches
    length=16,    # feet
    quantity=50,
    units="imperial",
))

print(f"Total: {result.total_board_feet:.0f} board feet")
print(f"Weight: {result.weight_lbs:,.0f} lbs ({result.weight_kg:,.0f} kg)")
```

### Drywall

```python
from construction_calculators.drywall import DrywallInput, calculate_drywall

result = calculate_drywall(DrywallInput(
    room_length=24, room_width=18, ceiling_height=9,  # feet
    doors=3, windows=5,
    include_ceiling=True,
    units="imperial",
))

print(f"Total area: {result.total_area_sq_ft:.0f} sq ft")
print(f"Sheets needed: {result.sheets_needed}")
print(f"Tape rolls: {result.drywall_tape_rolls}")
print(f"Joint compound buckets: {result.joint_compound_buckets}")
print(f"Screws: {result.screws_lbs} lbs")
```

### Labor Cost

```python
from construction_calculators.labor_cost import (
    LaborBurden, Worker, LaborCostInput, calculate_labor_cost
)

result = calculate_labor_cost(LaborCostInput(
    project_length=15,   # working days
    hours_per_day=8,
    workers=[
        Worker(hourly_wage=35, taxable=True, project_percentage=100),
        Worker(hourly_wage=28, taxable=True, project_percentage=100),
        Worker(hourly_wage=65, taxable=False, project_percentage=50),  # subcontractor
    ],
    burden=LaborBurden(
        social_security=6.2,
        medicare=1.45,
        federal_unemployment=0.6,
        state_unemployment=3.0,
        workers_comp=4.0,
        downtime_percentage=10,
        liability_insurance=7.5,
    ),
))

print(f"Total labor: ${result.total_labor_cost:,.2f}")
print(f"Avg effective rate: ${result.avg_hourly_rate:.2f}/hr")
```

### Net Profit Planning

```python
from construction_calculators.net_profit import NetProfitInput, calculate_net_profit

result = calculate_net_profit(NetProfitInput(
    desired_profit=150_000,
    profit_margin_percent=18,
    avg_revenue_per_project=30_000,
))

print(f"Revenue needed: ${result.total_revenue_needed:,.0f}")
print(f"Projects/year: {result.projects_per_year}")
print(f"Projects/month: {result.projects_per_month}")
```

### Hourly Rate

```python
from construction_calculators.hourly_rate import (
    HourlyRateExpenses, HourlyRateInput, calculate_hourly_rate
)

result = calculate_hourly_rate(HourlyRateInput(
    days_per_week=5,
    weeks_per_year=52,
    hours_per_day=8,
    vacation_days=10,
    sick_days=5,
    holiday_days=11,
    expenses=HourlyRateExpenses(
        annual_salary=70_000,
        rent=12_000,
        insurance=4_800,
        vehicle=6_000,
        tools=3_000,
        marketing=2_400,
    ),
    profit_margin=20,
))

print(f"Billable hours/year: {result.annual_hours:.0f}")
print(f"Base rate: ${result.base_hourly_rate:.2f}/hr")
print(f"With profit: ${result.with_profit_rate:.2f}/hr")
```

### Equipment Depreciation

```python
from construction_calculators.equipment_depreciation import (
    EquipmentDepreciationInput, calculate_equipment_depreciation
)

result = calculate_equipment_depreciation(EquipmentDepreciationInput(
    cost=120_000,
    salvage_value=15_000,
    useful_life_years=7,
))

print(f"Depreciable amount: ${result.depreciable_amount:,.0f}")
for yr in result.schedule:
    print(
        f"Year {yr.year}: SL ${yr.straight_line:,.0f}  "
        f"DDB ${yr.double_declining_balance:,.0f}  "
        f"SYD ${yr.sum_of_years_digits:,.0f}"
    )
```

### Stairs

```python
from construction_calculators.stair import StairInput, calculate_stairs

result = calculate_stairs(StairInput(
    total_rise=120,  # inches (10 feet)
    units="imperial",
))

print(f"Steps: {result.number_of_steps}")
print(f"Rise per step: {result.rise_per_step:.2f} in")
print(f"Total run: {result.total_run:.1f} in ({result.total_run/12:.1f} ft)")
print(f"Stringer length: {result.stringer_length/12:.2f} ft")
print(f"Angle: {result.angle_degrees:.1f}°")
```

### Fence

```python
from construction_calculators.fence import FenceInput, calculate_fence

result = calculate_fence(FenceInput(
    linear_length=300,   # feet
    post_spacing=8,
    height=6,
    gates=2,
    fence_type="wood",
    units="imperial",
))

print(f"Posts: {result.posts}")
print(f"Rails: {result.rails}")
print(f"Pickets: {result.pickets}")
print(f"Concrete bags: {result.concrete_bags}")
print(f"Cost: ${result.cost_min:,.0f} – ${result.cost_max:,.0f}")
```

### Roof Pitch

```python
from construction_calculators.roof_pitch import (
    RoofPitchFromRiseRunInput, RafterInput,
    pitch_from_rise_run, calculate_rafter_length,
)

# From rise/run
pitch = pitch_from_rise_run(RoofPitchFromRiseRunInput(rise=6, run=12))
print(f"Angle: {pitch.angle_degrees:.1f}°, Slope: {pitch.pitch_percent:.0f}%")

# Rafter length
rafter = calculate_rafter_length(RafterInput(rise=6, run=12, half_span=20))
print(f"Rafter length: {rafter.rafter_length:.2f} ft")
print(f"Rise for span: {rafter.rise_for_span:.2f} ft")
```

---

## API Reference

All input and output types are [dataclasses](https://docs.python.org/3/library/dataclasses.html) — inspect fields with `dataclasses.fields()` or your IDE's autocomplete.

Full API documentation: [buildvisionai.com/calculators](https://www.buildvisionai.com/calculators)

---

## Related

- **npm package**: [`@buildvisionai/construction-calculators`](https://www.npmjs.com/package/@buildvisionai/construction-calculators) — identical calculators for JavaScript/TypeScript
- **GitHub**: [github.com/buildvisionai/construction-calculators](https://github.com/buildvisionai/construction-calculators)
- **Interactive calculators**: [buildvisionai.com/calculators](https://www.buildvisionai.com/calculators)

---

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/buildvisionai/construction-calculators).

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [BuildVision](https://www.buildvisionai.com) — AI-powered construction estimating software at buildvisionai.com
