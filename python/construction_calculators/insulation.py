"""Insulation calculator (batts, blown-in, spray foam)."""

import math
from dataclasses import dataclass
from typing import Literal


_COVERAGE_PER_BAG: dict[str, float] = {
    "fiberglass_blown": 40.0,   # sq ft per bag at R-38
    "cellulose_blown": 25.0,    # sq ft per bag at R-38
    "mineral_wool": 40.0,
}

_R_VALUE_PER_INCH: dict[str, float] = {
    "fiberglass_batt": 3.14,
    "mineral_wool_batt": 3.7,
    "cellulose_blown": 3.7,
    "fiberglass_blown": 2.2,
    "spray_foam_open": 3.7,
    "spray_foam_closed": 6.5,
}

_COST_PER_SQ_FT: dict[str, dict[str, float]] = {
    "fiberglass_batt": {"low": 0.40, "high": 1.00},
    "mineral_wool_batt": {"low": 0.80, "high": 1.50},
    "cellulose_blown": {"low": 0.60, "high": 1.20},
    "fiberglass_blown": {"low": 0.50, "high": 1.00},
    "spray_foam_open": {"low": 0.44, "high": 0.65},
    "spray_foam_closed": {"low": 1.00, "high": 2.00},
}


@dataclass
class InsulationInput:
    """Input parameters for insulation calculation.

    Imperial: area in sq ft, existing R-value and target R-value.
    Metric: area in m².
    """

    area: float
    """Area to insulate in sq ft (imperial) or m² (metric)."""
    insulation_type: str = "fiberglass_batt"
    """Type: 'fiberglass_batt', 'mineral_wool_batt', 'cellulose_blown',
    'fiberglass_blown', 'spray_foam_open', 'spray_foam_closed'."""
    target_r_value: float = 38.0
    """Desired total R-value."""
    existing_r_value: float = 0.0
    """Existing R-value in place (top-up insulation)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class InsulationResult:
    """Result of insulation calculation."""

    area_sq_ft: float
    """Area in square feet."""
    r_value_needed: float
    """Additional R-value to add."""
    depth_inches: float
    """Required insulation depth in inches."""
    bags_needed: int
    """Bags of blown-in insulation (0 for batt types)."""
    cost_low: float
    """Low cost estimate."""
    cost_high: float
    """High cost estimate."""


def calculate_insulation(input: InsulationInput) -> InsulationResult:
    """Calculate insulation depth, bags, and cost to reach a target R-value.

    Args:
        input: Insulation calculation parameters.

    Returns:
        InsulationResult with depth, bags, and cost range.

    Examples:
        >>> from construction_calculators.insulation import InsulationInput, calculate_insulation
        >>> inp = InsulationInput(area=1000, insulation_type="fiberglass_batt", target_r_value=38, units="imperial")
        >>> result = calculate_insulation(inp)
        >>> print(f"Depth: {result.depth_inches:.1f} in, cost ${result.cost_low:,.0f}–${result.cost_high:,.0f}")
        Depth: 12.1 in, cost $400–$1,000
    """
    area_sq_ft = input.area * 10.7639 if input.units == "metric" else input.area

    r_value_needed = max(0.0, input.target_r_value - input.existing_r_value)
    r_per_inch = _R_VALUE_PER_INCH.get(input.insulation_type, 3.14)
    depth_inches = r_value_needed / r_per_inch if r_per_inch > 0 else 0.0

    # Bags only relevant for blown-in types
    blown_types = {"cellulose_blown", "fiberglass_blown"}
    if input.insulation_type in blown_types:
        coverage = _COVERAGE_PER_BAG.get(input.insulation_type, 40.0)
        bags_needed = math.ceil(area_sq_ft / coverage)
    else:
        bags_needed = 0

    cost_range = _COST_PER_SQ_FT.get(input.insulation_type, _COST_PER_SQ_FT["fiberglass_batt"])
    cost_low = area_sq_ft * cost_range["low"]
    cost_high = area_sq_ft * cost_range["high"]

    return InsulationResult(
        area_sq_ft=area_sq_ft,
        r_value_needed=r_value_needed,
        depth_inches=round(depth_inches, 2),
        bags_needed=bags_needed,
        cost_low=cost_low,
        cost_high=cost_high,
    )
