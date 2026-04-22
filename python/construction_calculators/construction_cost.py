"""Construction cost estimator (per-sq-ft basis with adjustments)."""

from dataclasses import dataclass
from typing import Literal


# Base cost ranges in $/sq ft by construction type
_CONSTRUCTION_COSTS: dict[str, dict[str, float]] = {
    "residential_standard": {"low": 100.0, "high": 200.0},
    "residential_custom": {"low": 200.0, "high": 400.0},
    "residential_luxury": {"low": 400.0, "high": 800.0},
    "commercial_basic": {"low": 150.0, "high": 300.0},
    "commercial_office": {"low": 200.0, "high": 500.0},
    "industrial": {"low": 75.0, "high": 200.0},
    "warehouse": {"low": 50.0, "high": 150.0},
    "retail": {"low": 100.0, "high": 250.0},
}


@dataclass
class ConstructionCostInput:
    """Input parameters for construction cost estimation.

    Imperial: area in sq ft.
    Metric: area in m².
    """

    area: float
    """Total floor area in sq ft (imperial) or m² (metric)."""
    construction_type: str = "residential_standard"
    """Construction type key (see _CONSTRUCTION_COSTS)."""
    stories: int = 1
    """Number of stories (each additional adds ~10% cost)."""
    region_multiplier: float = 1.0
    """Regional cost multiplier (1.0 = national average US)."""
    quality_multiplier: float = 1.0
    """Quality/finish multiplier (1.0 = standard)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class ConstructionCostResult:
    """Result of construction cost estimation."""

    area_sq_ft: float
    """Floor area in square feet."""
    area_sq_m: float
    """Floor area in square meters."""
    cost_per_sq_ft_low: float
    cost_per_sq_ft_high: float
    foundation_low: float
    foundation_high: float
    framing_low: float
    framing_high: float
    mechanical_low: float
    """Mechanical, Electrical, Plumbing (MEP) cost estimate."""
    mechanical_high: float
    finishes_low: float
    finishes_high: float
    total_low: float
    total_high: float


def calculate_construction_cost(input: ConstructionCostInput) -> ConstructionCostResult:
    """Estimate total construction cost broken down by trade category.

    Args:
        input: Construction cost parameters.

    Returns:
        ConstructionCostResult with per-sq-ft rates and total cost range.

    Examples:
        >>> from construction_calculators.construction_cost import ConstructionCostInput, calculate_construction_cost
        >>> inp = ConstructionCostInput(area=2000, construction_type="residential_standard", units="imperial")
        >>> result = calculate_construction_cost(inp)
        >>> print(f"Total: ${result.total_low:,.0f}–${result.total_high:,.0f}")
        Total: $200,000–$400,000
    """
    area_sq_ft = input.area * 10.7639 if input.units == "metric" else input.area
    area_sq_m = area_sq_ft * 0.092903

    base = _CONSTRUCTION_COSTS.get(input.construction_type, _CONSTRUCTION_COSTS["residential_standard"])

    story_adj = 1.0 + (input.stories - 1) * 0.10
    adj_low = base["low"] * story_adj * input.region_multiplier * input.quality_multiplier
    adj_high = base["high"] * story_adj * input.region_multiplier * input.quality_multiplier

    # Trade breakdown fractions
    foundation_low = area_sq_ft * adj_low * 0.10
    foundation_high = area_sq_ft * adj_high * 0.10
    framing_low = area_sq_ft * adj_low * 0.20
    framing_high = area_sq_ft * adj_high * 0.20
    mechanical_low = area_sq_ft * adj_low * 0.25
    mechanical_high = area_sq_ft * adj_high * 0.25
    finishes_low = area_sq_ft * adj_low * 0.45
    finishes_high = area_sq_ft * adj_high * 0.45

    total_low = area_sq_ft * adj_low
    total_high = area_sq_ft * adj_high

    return ConstructionCostResult(
        area_sq_ft=area_sq_ft,
        area_sq_m=area_sq_m,
        cost_per_sq_ft_low=adj_low,
        cost_per_sq_ft_high=adj_high,
        foundation_low=foundation_low,
        foundation_high=foundation_high,
        framing_low=framing_low,
        framing_high=framing_high,
        mechanical_low=mechanical_low,
        mechanical_high=mechanical_high,
        finishes_low=finishes_low,
        finishes_high=finishes_high,
        total_low=total_low,
        total_high=total_high,
    )
