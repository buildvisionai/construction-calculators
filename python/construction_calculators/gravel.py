"""Gravel and aggregate volume, weight, and cost calculator."""

import math
from dataclasses import dataclass, field
from typing import Literal


@dataclass
class GravelInput:
    """Input parameters for gravel calculation.

    Imperial: dimensions in feet, depth in feet.
    Metric: dimensions in meters.
    """

    shape: Literal["rectangular", "circular"]
    depth: float
    units: Literal["imperial", "metric"]
    length: float = 0.0
    width: float = 0.0
    radius: float = 0.0
    price_per_ton: float = 0.0


@dataclass
class GravelResult:
    """Result of gravel calculation."""

    volume: float
    """Volume in yd³ (imperial) or m³ (metric)."""
    alternative_volume: float
    """Volume converted to the other unit."""
    tonnage: float
    """Weight in short tons (imperial) or metric tons."""
    bags_50lb: int
    """Equivalent number of 50 lb bags."""
    estimated_cost: float
    """Estimated cost based on price_per_ton."""


def calculate_gravel(input: GravelInput) -> GravelResult:
    """Calculate gravel/aggregate volume, weight, and cost.

    Args:
        input: Gravel calculation parameters.

    Returns:
        GravelResult with volume, tonnage, bag count, and cost.

    Examples:
        >>> from construction_calculators.gravel import GravelInput, calculate_gravel
        >>> inp = GravelInput(shape="rectangular", length=10, width=10, depth=0.25, units="imperial", price_per_ton=35)
        >>> result = calculate_gravel(inp)
        >>> print(f"{result.volume:.2f} yd³, {result.tonnage:.2f} tons")
        0.93 yd³, 1.30 tons
    """
    shape = input.shape
    depth = input.depth
    units = input.units

    if shape == "circular":
        r = input.radius
        if units == "imperial":
            volume = (math.pi * r * r * depth) / 27
        else:
            volume = math.pi * r * r * depth
    else:
        l = input.length
        w = input.width
        if units == "imperial":
            volume = (l * w * depth) / 27
        else:
            volume = l * w * depth

    alternative_volume = volume * 0.764555 if units == "imperial" else volume * 1.30795

    tonnage = volume * 1.4 if units == "imperial" else volume * 1.5
    bags_50lb = (
        math.ceil(tonnage * 40) if units == "imperial" else math.ceil(tonnage * 44)
    )
    estimated_cost = tonnage * input.price_per_ton

    return GravelResult(
        volume=volume,
        alternative_volume=alternative_volume,
        tonnage=tonnage,
        bags_50lb=bags_50lb,
        estimated_cost=estimated_cost,
    )
