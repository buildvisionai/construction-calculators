"""Concrete slab volume and cost calculator."""

import math
from dataclasses import dataclass
from typing import Literal


@dataclass
class ConcreteSlabInput:
    """Input parameters for concrete slab calculation.

    Imperial: dimensions in feet, thickness in inches.
    Metric: dimensions in meters, thickness in cm.
    """

    length: float
    """Slab length in feet (imperial) or meters (metric)."""
    width: float
    """Slab width in feet (imperial) or meters (metric)."""
    thickness: float
    """Slab thickness in inches (imperial) or cm (metric)."""
    price_per_cubic_yard: float = 0.0
    """Concrete price per cubic yard (or m³ for metric)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class ConcreteSlabResult:
    """Result of concrete slab calculation."""

    volume_cubic_yards: float
    """Volume in cubic yards."""
    volume_cubic_meters: float
    """Volume in cubic meters."""
    bags_60lb: int
    """Equivalent number of 60 lb bags."""
    estimated_cost: float
    """Estimated concrete cost."""
    area_sq_ft: float
    """Slab area in square feet."""
    area_sq_m: float
    """Slab area in square meters."""


def calculate_concrete_slab(input: ConcreteSlabInput) -> ConcreteSlabResult:
    """Calculate concrete slab volume and estimated cost.

    Args:
        input: Concrete slab calculation parameters.

    Returns:
        ConcreteSlabResult with volume in multiple units and cost.

    Examples:
        >>> from construction_calculators.concrete_slab import ConcreteSlabInput, calculate_concrete_slab
        >>> inp = ConcreteSlabInput(length=20, width=20, thickness=4, price_per_cubic_yard=120, units="imperial")
        >>> result = calculate_concrete_slab(inp)
        >>> print(f"{result.volume_cubic_yards:.2f} yd³, cost ${result.estimated_cost:,.0f}")
        4.94 yd³, cost $593
    """
    if input.units == "metric":
        length_ft = input.length * 3.28084
        width_ft = input.width * 3.28084
        thickness_ft = input.thickness / 100.0 * 3.28084
    else:
        length_ft = input.length
        width_ft = input.width
        thickness_ft = input.thickness / 12.0

    area_sq_ft = length_ft * width_ft
    area_sq_m = area_sq_ft * 0.092903
    volume_cu_ft = area_sq_ft * thickness_ft
    volume_cubic_yards = volume_cu_ft / 27.0
    volume_cubic_meters = volume_cu_ft * 0.0283168

    # 60 lb bag covers ~0.45 cu ft
    bags_60lb = math.ceil(volume_cu_ft / 0.45)

    price = input.price_per_cubic_yard
    estimated_cost = volume_cubic_yards * price if input.units == "imperial" else volume_cubic_meters * price

    return ConcreteSlabResult(
        volume_cubic_yards=volume_cubic_yards,
        volume_cubic_meters=volume_cubic_meters,
        bags_60lb=bags_60lb,
        estimated_cost=estimated_cost,
        area_sq_ft=area_sq_ft,
        area_sq_m=area_sq_m,
    )
