"""Roofing installation cost estimator."""

from dataclasses import dataclass
from typing import Literal


# Cost ranges in $/sq ft installed
_PRICE_RANGES: dict[str, dict[str, float]] = {
    "asphalt": {"low": 3.5, "high": 5.5},
    "metal": {"low": 7.0, "high": 14.0},
    "tile": {"low": 10.0, "high": 20.0},
    "slate": {"low": 15.0, "high": 30.0},
    "wood": {"low": 6.0, "high": 12.0},
    "flat": {"low": 5.0, "high": 10.0},
}

_LABOR_FRACTION = {"low": 0.4, "high": 0.6}
_TEAR_OFF_COST = {"low": 1.0, "high": 2.0}

_LIFESPAN_DATA: dict[str, dict[str, float]] = {
    "asphalt": {"low": 15, "high": 30},
    "metal": {"low": 40, "high": 70},
    "tile": {"low": 50, "high": 100},
    "slate": {"low": 75, "high": 150},
    "wood": {"low": 20, "high": 40},
    "flat": {"low": 15, "high": 25},
}

MaterialType = Literal["asphalt", "metal", "tile", "slate", "wood", "flat"]


@dataclass
class RoofingCostInput:
    """Input parameters for roofing cost estimation."""

    roof_area: float
    """Roof area in sq ft (imperial) or m² (metric)."""
    material_type: str
    """Roofing material: 'asphalt', 'metal', 'tile', 'slate', 'wood', or 'flat'."""
    region_multiplier: float
    """Regional labor/material cost multiplier (1.0 = national average)."""
    pitch_multiplier: float
    """Roof pitch difficulty multiplier (1.0 = low pitch)."""
    stories_multiplier: float
    """Number of stories multiplier (1.0 = single story)."""
    include_tear_off: bool
    """Whether to include tear-off of existing roof."""
    units: Literal["imperial", "metric"]


@dataclass
class LifespanYears:
    """Expected lifespan range in years."""

    low: float
    high: float


@dataclass
class RoofingCostResult:
    """Result of roofing cost estimation."""

    area_sq_ft: float
    material_cost_low: float
    material_cost_high: float
    labor_cost_low: float
    labor_cost_high: float
    tear_off_low: float
    tear_off_high: float
    total_low: float
    total_high: float
    cost_per_square_low: float
    """Cost per 100 sq ft (roofing square)."""
    cost_per_square_high: float
    lifespan_years: LifespanYears
    cost_per_year_low: float
    cost_per_year_high: float


def calculate_roofing_cost(input: RoofingCostInput) -> RoofingCostResult:
    """Estimate roofing installation cost including materials, labor, and tear-off.

    Args:
        input: Roofing cost calculation parameters.

    Returns:
        RoofingCostResult with cost ranges broken down by component.

    Examples:
        >>> from construction_calculators.roofing_cost import RoofingCostInput, calculate_roofing_cost
        >>> inp = RoofingCostInput(
        ...     roof_area=2000, material_type="asphalt",
        ...     region_multiplier=1.0, pitch_multiplier=1.0, stories_multiplier=1.0,
        ...     include_tear_off=True, units="imperial"
        ... )
        >>> result = calculate_roofing_cost(inp)
        >>> print(f"Total: ${result.total_low:,.0f} – ${result.total_high:,.0f}")
        Total: $9,000 – $17,000
    """
    roof_area = input.roof_area
    material_type = input.material_type
    region_mult = input.region_multiplier
    pitch_mult = input.pitch_multiplier
    stories_mult = input.stories_multiplier
    include_tear_off = input.include_tear_off
    units = input.units

    area_sq_ft = roof_area * 10.7639 if units == "metric" else roof_area
    price_range = _PRICE_RANGES.get(material_type, _PRICE_RANGES["asphalt"])

    adjusted_low = price_range["low"] * region_mult * pitch_mult * stories_mult
    adjusted_high = price_range["high"] * region_mult * pitch_mult * stories_mult

    material_cost_low = adjusted_low * (1 - _LABOR_FRACTION["high"]) * area_sq_ft
    material_cost_high = adjusted_high * (1 - _LABOR_FRACTION["low"]) * area_sq_ft
    labor_cost_low = adjusted_low * _LABOR_FRACTION["low"] * area_sq_ft
    labor_cost_high = adjusted_high * _LABOR_FRACTION["high"] * area_sq_ft

    tear_off_low = _TEAR_OFF_COST["low"] * area_sq_ft * region_mult if include_tear_off else 0.0
    tear_off_high = _TEAR_OFF_COST["high"] * area_sq_ft * region_mult if include_tear_off else 0.0

    total_low = material_cost_low + labor_cost_low + tear_off_low
    total_high = material_cost_high + labor_cost_high + tear_off_high
    cost_per_square_low = (total_low / area_sq_ft) * 100
    cost_per_square_high = (total_high / area_sq_ft) * 100

    lifespan = _LIFESPAN_DATA.get(material_type, _LIFESPAN_DATA["asphalt"])
    avg_lifespan = (lifespan["low"] + lifespan["high"]) / 2
    cost_per_year_low = total_low / avg_lifespan
    cost_per_year_high = total_high / avg_lifespan

    return RoofingCostResult(
        area_sq_ft=area_sq_ft,
        material_cost_low=material_cost_low,
        material_cost_high=material_cost_high,
        labor_cost_low=labor_cost_low,
        labor_cost_high=labor_cost_high,
        tear_off_low=tear_off_low,
        tear_off_high=tear_off_high,
        total_low=total_low,
        total_high=total_high,
        cost_per_square_low=cost_per_square_low,
        cost_per_square_high=cost_per_square_high,
        lifespan_years=LifespanYears(low=lifespan["low"], high=lifespan["high"]),
        cost_per_year_low=cost_per_year_low,
        cost_per_year_high=cost_per_year_high,
    )
