"""Flooring materials and installed cost calculator."""

import math
from dataclasses import dataclass
from typing import Literal


# Cost per sq ft (installed) and box coverage by flooring type
_FLOORING_DEFAULTS: dict[str, dict] = {
    "hardwood": {"cost_min": 6, "cost_max": 12, "box_coverage": 20, "box_coverage_metric": 1.86},
    "laminate": {"cost_min": 3, "cost_max": 8, "box_coverage": 20, "box_coverage_metric": 1.86},
    "vinyl_plank": {"cost_min": 2, "cost_max": 7, "box_coverage": 20, "box_coverage_metric": 1.86},
    "tile": {"cost_min": 5, "cost_max": 15, "box_coverage": 10, "box_coverage_metric": 0.93},
    "carpet": {"cost_min": 3, "cost_max": 8, "box_coverage": 1, "box_coverage_metric": 1.0},
}

FlooringType = Literal["hardwood", "laminate", "vinyl_plank", "tile", "carpet"]


@dataclass
class FlooringInput:
    """Input parameters for flooring calculation.

    Imperial: room dimensions in feet, plank dimensions in inches.
    Metric: room dimensions in meters, plank dimensions in mm.
    """

    room_length: float
    room_width: float
    plank_width: float
    plank_length: float
    waste_percent: float
    """Waste factor as a percentage (e.g. 10 = 10%)."""
    flooring_type: str
    """Flooring type: 'hardwood', 'laminate', 'vinyl_plank', 'tile', or 'carpet'."""
    units: Literal["imperial", "metric"]


@dataclass
class FlooringResult:
    """Result of flooring calculation."""

    total_area: float
    """Room area in input units."""
    total_area_with_waste: float
    """Area including waste factor."""
    pieces_needed: int
    boxes_needed: int
    underlayment_area: float
    """Same as total_area_with_waste."""
    perimeter_ft: float
    """Room perimeter in feet (for trim/molding)."""
    transition_strips: int
    cost_min: float
    cost_max: float


def calculate_flooring(input: FlooringInput) -> FlooringResult:
    """Calculate flooring materials and installed cost.

    Args:
        input: Flooring calculation parameters.

    Returns:
        FlooringResult with piece/box counts, perimeter, and cost range.

    Examples:
        >>> from construction_calculators.flooring import FlooringInput, calculate_flooring
        >>> inp = FlooringInput(
        ...     room_length=15, room_width=12, plank_width=5, plank_length=48,
        ...     waste_percent=10, flooring_type="hardwood", units="imperial"
        ... )
        >>> result = calculate_flooring(inp)
        >>> print(f"{result.total_area_with_waste:.0f} sq ft, {result.boxes_needed} boxes")
        198 sq ft, 10 boxes
    """
    room_length = input.room_length
    room_width = input.room_width
    units = input.units

    total_area = room_length * room_width
    total_area_with_waste = total_area * (1 + input.waste_percent / 100)

    if units == "metric":
        piece_area = (input.plank_width / 1000) * (input.plank_length / 1000)
    else:
        piece_area = (input.plank_width / 12) * (input.plank_length / 12)

    pieces_needed = math.ceil(total_area_with_waste / piece_area)

    defaults = _FLOORING_DEFAULTS.get(input.flooring_type, _FLOORING_DEFAULTS["hardwood"])
    box_coverage = defaults["box_coverage_metric"] if units == "metric" else defaults["box_coverage"]
    boxes_needed = math.ceil(total_area_with_waste / box_coverage)

    perimeter = 2 * (room_length + room_width)
    perimeter_ft = perimeter * 3.28084 if units == "metric" else perimeter
    transition_strips = max(1, round(perimeter / 3))

    area_sq_ft = total_area_with_waste * 10.7639 if units == "metric" else total_area_with_waste
    cost_min = area_sq_ft * defaults["cost_min"]
    cost_max = area_sq_ft * defaults["cost_max"]

    return FlooringResult(
        total_area=total_area,
        total_area_with_waste=total_area_with_waste,
        pieces_needed=pieces_needed,
        boxes_needed=boxes_needed,
        underlayment_area=total_area_with_waste,
        perimeter_ft=perimeter_ft,
        transition_strips=transition_strips,
        cost_min=cost_min,
        cost_max=cost_max,
    )
