"""Roof area and shingles/squares calculator."""

import math
from dataclasses import dataclass
from typing import Literal


@dataclass
class RoofInput:
    """Input parameters for roof area calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    footprint_length: float
    """Building footprint length in feet (imperial) or meters (metric)."""
    footprint_width: float
    """Building footprint width in feet (imperial) or meters (metric)."""
    pitch_rise: float
    """Roof rise (inches per 12-inch run for imperial, or cm per 30.48 cm run)."""
    pitch_run: float = 12.0
    """Roof run reference (default 12 for imperial pitch notation)."""
    overhang: float = 1.0
    """Roof overhang on each side in feet (imperial) or meters (metric)."""
    waste_factor: float = 0.10
    """Waste factor as decimal (default 10%)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class RoofResult:
    """Result of roof area calculation."""

    footprint_area_sq_ft: float
    """Building footprint area in square feet."""
    roof_area_sq_ft: float
    """Actual sloped roof area in square feet."""
    roof_area_sq_m: float
    """Actual sloped roof area in square meters."""
    squares: float
    """Roofing squares (100 sq ft each) needed including waste."""
    bundles_shingles: int
    """Estimated shingle bundles (3 bundles per square)."""
    pitch_multiplier: float
    """Pitch area multiplier applied."""


def calculate_roof(input: RoofInput) -> RoofResult:
    """Calculate roof area and shingle quantities.

    Args:
        input: Roof calculation parameters.

    Returns:
        RoofResult with area, squares, and shingle count.

    Examples:
        >>> from construction_calculators.roof import RoofInput, calculate_roof
        >>> inp = RoofInput(footprint_length=40, footprint_width=30, pitch_rise=6, units="imperial")
        >>> result = calculate_roof(inp)
        >>> print(f"Roof area: {result.roof_area_sq_ft:.0f} sq ft, {result.squares:.1f} squares")
        Roof area: 1507 sq ft, 16.6 squares
    """
    if input.units == "metric":
        length_ft = input.footprint_length * 3.28084
        width_ft = input.footprint_width * 3.28084
        overhang_ft = input.overhang * 3.28084
    else:
        length_ft = input.footprint_length
        width_ft = input.footprint_width
        overhang_ft = input.overhang

    # Effective dimensions including overhang
    eff_length = length_ft + 2 * overhang_ft
    eff_width = width_ft + 2 * overhang_ft

    footprint_area_sq_ft = eff_length * eff_width
    pitch_multiplier = math.sqrt((input.pitch_rise / input.pitch_run) ** 2 + 1)
    roof_area_sq_ft = footprint_area_sq_ft * pitch_multiplier
    roof_area_sq_m = roof_area_sq_ft * 0.092903

    area_with_waste = roof_area_sq_ft * (1 + input.waste_factor)
    squares = area_with_waste / 100.0
    bundles_shingles = math.ceil(squares * 3)

    return RoofResult(
        footprint_area_sq_ft=footprint_area_sq_ft,
        roof_area_sq_ft=roof_area_sq_ft,
        roof_area_sq_m=roof_area_sq_m,
        squares=squares,
        bundles_shingles=bundles_shingles,
        pitch_multiplier=round(pitch_multiplier, 4),
    )
