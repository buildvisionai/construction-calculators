"""Retaining wall materials and cost calculator."""

import math
from dataclasses import dataclass
from typing import Literal


@dataclass
class RetainingWallInput:
    """Input parameters for retaining wall calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    length: float
    """Wall length in feet (imperial) or meters (metric)."""
    height: float
    """Wall height in feet (imperial) or meters (metric)."""
    wall_type: str = "concrete_block"
    """Wall type: 'concrete_block', 'poured_concrete', 'stone', 'timber'."""
    price_per_sq_ft: float = 0.0
    """Optional installed cost per sq ft of face area."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class RetainingWallResult:
    """Result of retaining wall calculation."""

    face_area_sq_ft: float
    """Face area in square feet."""
    face_area_sq_m: float
    """Face area in square meters."""
    blocks_needed: int
    """Estimated blocks (for concrete_block type)."""
    concrete_cubic_yards: float
    """Estimated concrete (for poured_concrete type)."""
    gravel_tons: float
    """Estimated gravel for drainage backfill."""
    estimated_cost_low: float
    """Low estimate based on typical $/sq ft ranges."""
    estimated_cost_high: float
    """High estimate based on typical $/sq ft ranges."""
    custom_cost: float
    """Cost using provided price_per_sq_ft (0 if not provided)."""


_PRICE_RANGES: dict[str, dict[str, float]] = {
    "concrete_block": {"low": 20.0, "high": 35.0},
    "poured_concrete": {"low": 25.0, "high": 45.0},
    "stone": {"low": 30.0, "high": 60.0},
    "timber": {"low": 15.0, "high": 25.0},
}


def calculate_retaining_wall(input: RetainingWallInput) -> RetainingWallResult:
    """Estimate retaining wall materials and cost.

    Args:
        input: Retaining wall calculation parameters.

    Returns:
        RetainingWallResult with material quantities and cost range.

    Examples:
        >>> from construction_calculators.retaining_wall import RetainingWallInput, calculate_retaining_wall
        >>> inp = RetainingWallInput(length=30, height=4, wall_type="concrete_block", units="imperial")
        >>> result = calculate_retaining_wall(inp)
        >>> print(f"Area: {result.face_area_sq_ft:.0f} sq ft, cost ${result.estimated_cost_low:,.0f}–${result.estimated_cost_high:,.0f}")
        Area: 120 sq ft, cost $2,400–$4,200
    """
    if input.units == "metric":
        length_ft = input.length * 3.28084
        height_ft = input.height * 3.28084
    else:
        length_ft = input.length
        height_ft = input.height

    face_area_sq_ft = length_ft * height_ft
    face_area_sq_m = face_area_sq_ft * 0.092903

    # ~1.125 blocks per sq ft (standard 8"x16" CMU)
    blocks_needed = math.ceil(face_area_sq_ft * 1.125 * 1.05)

    # For poured concrete walls (assume 8" thick)
    thickness_ft = 8 / 12
    concrete_cubic_yards = (face_area_sq_ft * thickness_ft) / 27

    # Gravel drainage: ~0.5 tons per sq ft of face
    gravel_tons = face_area_sq_ft * 0.5

    price_range = _PRICE_RANGES.get(input.wall_type, _PRICE_RANGES["concrete_block"])
    estimated_cost_low = face_area_sq_ft * price_range["low"]
    estimated_cost_high = face_area_sq_ft * price_range["high"]
    custom_cost = face_area_sq_ft * input.price_per_sq_ft

    return RetainingWallResult(
        face_area_sq_ft=face_area_sq_ft,
        face_area_sq_m=face_area_sq_m,
        blocks_needed=blocks_needed,
        concrete_cubic_yards=concrete_cubic_yards,
        gravel_tons=gravel_tons,
        estimated_cost_low=estimated_cost_low,
        estimated_cost_high=estimated_cost_high,
        custom_cost=custom_cost,
    )
