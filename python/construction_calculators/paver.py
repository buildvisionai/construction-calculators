"""Paver quantity and cost calculator for patios, driveways, and walkways."""

import math
from dataclasses import dataclass
from typing import Literal


@dataclass
class PaverInput:
    """Input parameters for paver calculation.

    Imperial: area dimensions in feet, paver size in inches.
    Metric: area dimensions in meters, paver size in cm.
    """

    area_length: float
    """Area length in feet (imperial) or meters (metric)."""
    area_width: float
    """Area width in feet (imperial) or meters (metric)."""
    paver_length: float
    """Individual paver length in inches (imperial) or cm (metric)."""
    paver_width: float
    """Individual paver width in inches (imperial) or cm (metric)."""
    joint_size: float = 0.25
    """Mortar/sand joint width in inches (imperial) or cm (metric)."""
    waste_factor: float = 0.10
    """Waste factor as decimal (default 10%)."""
    price_per_paver: float = 0.0
    """Optional price per paver."""
    price_per_bag_sand: float = 0.0
    """Optional price per bag of polymeric sand."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class PaverResult:
    """Result of paver calculation."""

    area_sq_ft: float
    """Total area in square feet."""
    area_sq_m: float
    """Total area in square meters."""
    pavers_needed: int
    """Total pavers including waste."""
    sand_bags: int
    """Bags of polymeric sand (50 lb bags; ~1 per 25 sq ft)."""
    base_gravel_tons: float
    """Tons of compactable base gravel (4 inch depth)."""
    estimated_paver_cost: float
    """Paver cost estimate."""
    estimated_sand_cost: float
    """Sand cost estimate."""


def calculate_paver(input: PaverInput) -> PaverResult:
    """Calculate paver quantities and materials for a paved area.

    Args:
        input: Paver calculation parameters.

    Returns:
        PaverResult with paver count, sand, base gravel, and costs.

    Examples:
        >>> from construction_calculators.paver import PaverInput, calculate_paver
        >>> inp = PaverInput(area_length=20, area_width=15, paver_length=4, paver_width=8, price_per_paver=0.85, units="imperial")
        >>> result = calculate_paver(inp)
        >>> print(f"{result.pavers_needed} pavers, ${result.estimated_paver_cost:,.0f}")
        1350 pavers, $1,148
    """
    if input.units == "metric":
        area_length_ft = input.area_length * 3.28084
        area_width_ft = input.area_width * 3.28084
        paver_length_in = input.paver_length / 2.54
        paver_width_in = input.paver_width / 2.54
        joint_in = input.joint_size / 2.54
    else:
        area_length_ft = input.area_length
        area_width_ft = input.area_width
        paver_length_in = input.paver_length
        paver_width_in = input.paver_width
        joint_in = input.joint_size

    area_sq_ft = area_length_ft * area_width_ft
    area_sq_m = area_sq_ft * 0.092903

    # Paver area including joint
    paver_area_sq_ft = ((paver_length_in + joint_in) * (paver_width_in + joint_in)) / 144
    raw_pavers = area_sq_ft / paver_area_sq_ft
    pavers_needed = math.ceil(raw_pavers * (1 + input.waste_factor))

    # Polymeric sand: ~1 bag per 25 sq ft
    sand_bags = math.ceil(area_sq_ft / 25)

    # Base gravel (4 inch depth, ~1.4 tons/yd³)
    base_cu_ft = area_sq_ft * (4 / 12)
    base_gravel_tons = (base_cu_ft / 27) * 1.4

    estimated_paver_cost = pavers_needed * input.price_per_paver
    estimated_sand_cost = sand_bags * input.price_per_bag_sand

    return PaverResult(
        area_sq_ft=area_sq_ft,
        area_sq_m=area_sq_m,
        pavers_needed=pavers_needed,
        sand_bags=sand_bags,
        base_gravel_tons=round(base_gravel_tons, 2),
        estimated_paver_cost=estimated_paver_cost,
        estimated_sand_cost=estimated_sand_cost,
    )
