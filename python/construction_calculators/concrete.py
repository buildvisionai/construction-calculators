"""Concrete volume and materials calculator."""

import math
from dataclasses import dataclass
from typing import Literal


@dataclass
class ConcreteInput:
    """Input parameters for concrete calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    shape: Literal["rectangular", "circular"]
    depth: float
    units: Literal["imperial", "metric"]
    length: float = 0.0
    width: float = 0.0
    radius: float = 0.0


@dataclass
class ConcreteResult:
    """Result of concrete calculation."""

    volume_cu_ft: float
    """Volume in cubic feet."""
    volume_cu_m: float
    """Volume in cubic meters."""
    bags_needed: int
    """Number of bags needed (60 lb / 40 kg)."""
    sand: float
    """Sand volume in same units as input."""
    gravel: float
    """Gravel volume in same units as input."""
    water: float
    """Water in gallons (imperial) or liters (metric)."""


def calculate_concrete(input: ConcreteInput) -> ConcreteResult:
    """Calculate concrete volume and materials.

    Args:
        input: Concrete calculation parameters.

    Returns:
        ConcreteResult with volume, bag count, and material quantities.

    Examples:
        >>> from construction_calculators.concrete import ConcreteInput, calculate_concrete
        >>> inp = ConcreteInput(shape="rectangular", length=10, width=10, depth=0.333, units="imperial")
        >>> result = calculate_concrete(inp)
        >>> print(f"{result.volume_cu_ft:.1f} cu ft, {result.bags_needed} bags")
        33.3 cu ft, 75 bags
    """
    shape = input.shape
    depth = input.depth
    units = input.units

    if shape == "circular":
        r = input.radius
        volume = math.pi * r * r * depth
    else:
        volume = input.length * input.width * depth

    volume_cu_ft = volume * 35.3147 if units == "metric" else volume
    volume_cu_m = volume if units == "metric" else volume * 0.0283168

    # 60 lb bags: ~0.45 cu ft; 40 kg bags: ~0.0127 m³
    if units == "metric":
        bags_needed = math.ceil(volume / 0.0127)
    else:
        bags_needed = math.ceil(volume / 0.45)

    sand = volume * 0.4
    gravel = volume * 0.6
    water = bags_needed * 2.5 if units == "metric" else bags_needed * 0.66

    return ConcreteResult(
        volume_cu_ft=volume_cu_ft,
        volume_cu_m=volume_cu_m,
        bags_needed=bags_needed,
        sand=sand,
        gravel=gravel,
        water=water,
    )
