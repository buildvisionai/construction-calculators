"""Drywall sheets, tape, compound, and screws calculator."""

import math
from dataclasses import dataclass
from typing import Literal


_SHEET_AREAS_IMPERIAL: dict[str, float] = {"4x8": 32, "4x10": 40, "4x12": 48}
_SHEET_AREAS_METRIC: dict[str, float] = {"4x8": 2.97, "4x10": 3.72, "4x12": 4.46}

SheetSize = Literal["4x8", "4x10", "4x12"]


@dataclass
class DrywallInput:
    """Input parameters for drywall calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    length: float
    width: float
    height: float
    doors: int
    windows: int
    include_ceiling: bool
    sheet_size: str
    """Sheet size: '4x8', '4x10', or '4x12'."""
    units: Literal["imperial", "metric"]


@dataclass
class DrywallResult:
    """Result of drywall calculation."""

    wall_area: float
    """Net wall area after deducting doors and windows."""
    ceiling_area: float
    """Ceiling area (0 if not included)."""
    total_area: float
    """Total drywall area."""
    sheets: int
    """Number of sheets needed (includes 10% waste)."""
    tape_rolls: int
    """Number of tape rolls (500 ft / 46 m per roll)."""
    compound_buckets: int
    """Number of joint compound buckets."""
    screws: int
    """Number of drywall screws (32 per sheet)."""


def calculate_drywall(input: DrywallInput) -> DrywallResult:
    """Calculate drywall sheets, tape, compound, and screws.

    Args:
        input: Drywall calculation parameters.

    Returns:
        DrywallResult with material quantities.

    Examples:
        >>> from construction_calculators.drywall import DrywallInput, calculate_drywall
        >>> inp = DrywallInput(
        ...     length=20, width=15, height=9, doors=2, windows=4,
        ...     include_ceiling=True, sheet_size="4x8", units="imperial"
        ... )
        >>> result = calculate_drywall(inp)
        >>> print(f"{result.sheets} sheets, {result.tape_rolls} tape rolls")
        31 sheets, 1 tape rolls
    """
    units = input.units
    door_area = 21.0 if units == "imperial" else 1.95
    window_area = 15.0 if units == "imperial" else 1.4

    perimeter = 2 * (input.length + input.width)
    wall_area = perimeter * input.height - input.doors * door_area - input.windows * window_area
    ceiling_area = input.length * input.width if input.include_ceiling else 0.0
    total_area = wall_area + ceiling_area

    sheet_areas = _SHEET_AREAS_IMPERIAL if units == "imperial" else _SHEET_AREAS_METRIC
    sheet_area = sheet_areas.get(input.sheet_size, sheet_areas["4x8"])
    sheets = math.ceil((total_area * 1.10) / sheet_area)

    tape_rolls = math.ceil(total_area / (500 if units == "imperial" else 46))
    compound_buckets = math.ceil(total_area / (480 if units == "imperial" else 45))
    screws = sheets * 32

    return DrywallResult(
        wall_area=wall_area,
        ceiling_area=ceiling_area,
        total_area=total_area,
        sheets=sheets,
        tape_rolls=tape_rolls,
        compound_buckets=compound_buckets,
        screws=screws,
    )
