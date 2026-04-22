"""Paint quantity, primer, cost, and time estimator."""

import math
from dataclasses import dataclass
from typing import Literal


# Coverage in sq ft per gallon (imperial) or m² per liter (metric)
_PAINT_COVERAGE: dict[str, dict[str, float]] = {
    "standard": {"imperial": 400, "metric": 10},
    "primer": {"imperial": 350, "metric": 8.5},
    "gloss": {"imperial": 350, "metric": 8.5},
    "matte": {"imperial": 450, "metric": 11},
}

_DOOR_AREA = {"imperial": 21.0, "metric": 1.95}
_WINDOW_AREA = {"imperial": 15.0, "metric": 1.4}
_PAINT_RATE = {"imperial": 150.0, "metric": 14.0}

PaintType = Literal["standard", "primer", "gloss", "matte"]


@dataclass
class PaintInput:
    """Input parameters for paint calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    length: float
    width: float
    height: float
    doors: int
    windows: int
    include_ceiling: bool
    coats: int
    paint_type: str
    """Paint type: 'standard', 'gloss', or 'matte'."""
    include_primer: bool
    units: Literal["imperial", "metric"]


@dataclass
class PaintResult:
    """Result of paint calculation."""

    net_wall_area: float
    """Paintable wall area after deducting doors and windows."""
    ceiling_area: float
    """Ceiling area (0 if not included)."""
    total_paintable_area: float
    """Total area including coats."""
    gallons_needed: int
    """Gallons of paint needed (imperial measure)."""
    quarts_needed: int
    """Equivalent quarts."""
    primer_gallons: int
    """Gallons of primer needed (0 if not included)."""
    cost_low: float
    """Estimated low cost (USD)."""
    cost_high: float
    """Estimated high cost (USD)."""
    time_estimate_hours: float
    """Estimated application time in hours."""


def calculate_paint(input: PaintInput) -> PaintResult:
    """Calculate paint quantities, primer, cost, and time estimate.

    Args:
        input: Paint calculation parameters.

    Returns:
        PaintResult with quantities, cost range, and time estimate.

    Examples:
        >>> from construction_calculators.paint import PaintInput, calculate_paint
        >>> inp = PaintInput(
        ...     length=15, width=12, height=9, doors=2, windows=3,
        ...     include_ceiling=True, coats=2, paint_type="standard",
        ...     include_primer=True, units="imperial"
        ... )
        >>> result = calculate_paint(inp)
        >>> print(f"{result.gallons_needed} gallons, {result.time_estimate_hours:.1f} hrs")
        3 gallons, 9.6 hrs
    """
    length = input.length
    width = input.width
    height = input.height
    units = input.units

    perimeter = 2 * (length + width)
    total_wall_area = perimeter * height
    door_deduction = input.doors * _DOOR_AREA[units]
    window_deduction = input.windows * _WINDOW_AREA[units]
    net_wall_area = max(0.0, total_wall_area - door_deduction - window_deduction)
    ceiling_area = length * width if input.include_ceiling else 0.0
    total_paintable_area = (net_wall_area + ceiling_area) * input.coats

    paint_type = input.paint_type if input.paint_type in _PAINT_COVERAGE else "standard"
    coverage = _PAINT_COVERAGE[paint_type][units]
    gallons_needed = math.ceil(total_paintable_area / coverage)
    quarts_needed = gallons_needed * 4

    primer_coverage = _PAINT_COVERAGE["primer"][units]
    primer_gallons = (
        math.ceil((net_wall_area + ceiling_area) / primer_coverage)
        if input.include_primer
        else 0
    )

    cost_low = gallons_needed * 25
    cost_high = gallons_needed * 50

    rate = _PAINT_RATE[units]
    time_estimate_hours = total_paintable_area / rate

    return PaintResult(
        net_wall_area=net_wall_area,
        ceiling_area=ceiling_area,
        total_paintable_area=total_paintable_area,
        gallons_needed=gallons_needed,
        quarts_needed=quarts_needed,
        primer_gallons=primer_gallons,
        cost_low=cost_low,
        cost_high=cost_high,
        time_estimate_hours=time_estimate_hours,
    )
