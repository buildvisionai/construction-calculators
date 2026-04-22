"""Metal roofing cost estimator."""

from dataclasses import dataclass
from typing import Literal


_PANEL_COSTS: dict[str, dict[str, float]] = {
    "standing_seam": {"low": 10.0, "high": 17.0},
    "corrugated": {"low": 5.0, "high": 9.0},
    "ribbed": {"low": 6.0, "high": 11.0},
    "metal_shingle": {"low": 7.0, "high": 13.0},
}

_METAL_TYPES: dict[str, float] = {
    "galvanized_steel": 1.0,
    "aluminum": 1.15,
    "copper": 3.0,
    "zinc": 2.0,
    "steel_with_coating": 1.1,
}

_LABOR_FRACTION = 0.4


@dataclass
class MetalRoofCostInput:
    """Input parameters for metal roof cost estimation."""

    roof_area: float
    """Roof area in sq ft (imperial) or m² (metric)."""
    panel_type: str = "standing_seam"
    """Panel style: 'standing_seam', 'corrugated', 'ribbed', 'metal_shingle'."""
    metal_type: str = "galvanized_steel"
    """Metal material: 'galvanized_steel', 'aluminum', 'copper', 'zinc', 'steel_with_coating'."""
    pitch_multiplier: float = 1.0
    """Roof pitch difficulty multiplier (1.0 = low pitch)."""
    include_underlayment: bool = True
    """Whether to include underlayment cost (~$0.50/sq ft)."""
    include_trim: bool = True
    """Whether to include ridge cap and trim (~$1.00/sq ft)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class MetalRoofCostResult:
    """Result of metal roof cost estimation."""

    area_sq_ft: float
    """Roof area in square feet."""
    panels_cost_low: float
    """Low estimate for panels."""
    panels_cost_high: float
    """High estimate for panels."""
    labor_cost_low: float
    labor_cost_high: float
    underlayment_cost: float
    trim_cost: float
    total_low: float
    total_high: float
    cost_per_sq_ft_low: float
    cost_per_sq_ft_high: float


def calculate_metal_roof_cost(input: MetalRoofCostInput) -> MetalRoofCostResult:
    """Estimate metal roofing installation cost.

    Args:
        input: Metal roof cost parameters.

    Returns:
        MetalRoofCostResult with itemized and total cost ranges.

    Examples:
        >>> from construction_calculators.metal_roof_cost import MetalRoofCostInput, calculate_metal_roof_cost
        >>> inp = MetalRoofCostInput(roof_area=1500, panel_type="standing_seam", units="imperial")
        >>> result = calculate_metal_roof_cost(inp)
        >>> print(f"Total: ${result.total_low:,.0f}–${result.total_high:,.0f}")
        Total: $21,000–$36,750
    """
    area_sq_ft = input.roof_area * 10.7639 if input.units == "metric" else input.roof_area

    panel_range = _PANEL_COSTS.get(input.panel_type, _PANEL_COSTS["standing_seam"])
    metal_mult = _METAL_TYPES.get(input.metal_type, 1.0)

    base_low = panel_range["low"] * metal_mult * input.pitch_multiplier
    base_high = panel_range["high"] * metal_mult * input.pitch_multiplier

    material_fraction = 1 - _LABOR_FRACTION
    panels_cost_low = base_low * material_fraction * area_sq_ft
    panels_cost_high = base_high * material_fraction * area_sq_ft
    labor_cost_low = base_low * _LABOR_FRACTION * area_sq_ft
    labor_cost_high = base_high * _LABOR_FRACTION * area_sq_ft

    underlayment_cost = area_sq_ft * 0.50 if input.include_underlayment else 0.0
    trim_cost = area_sq_ft * 1.00 if input.include_trim else 0.0

    total_low = panels_cost_low + labor_cost_low + underlayment_cost + trim_cost
    total_high = panels_cost_high + labor_cost_high + underlayment_cost + trim_cost

    return MetalRoofCostResult(
        area_sq_ft=area_sq_ft,
        panels_cost_low=panels_cost_low,
        panels_cost_high=panels_cost_high,
        labor_cost_low=labor_cost_low,
        labor_cost_high=labor_cost_high,
        underlayment_cost=underlayment_cost,
        trim_cost=trim_cost,
        total_low=total_low,
        total_high=total_high,
        cost_per_sq_ft_low=total_low / area_sq_ft if area_sq_ft else 0.0,
        cost_per_sq_ft_high=total_high / area_sq_ft if area_sq_ft else 0.0,
    )
