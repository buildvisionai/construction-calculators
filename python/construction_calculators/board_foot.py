"""Board foot (lumber volume) calculator."""

from dataclasses import dataclass, field
from typing import Literal


@dataclass
class BoardFootInput:
    """Input parameters for board foot calculation.

    Imperial: thickness and width in inches, length in feet.
    Metric: all dimensions in mm.
    """

    thickness: float
    width: float
    length: float
    quantity: int
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class BoardFootResult:
    """Result of board foot calculation."""

    total_board_feet: float
    """Total lumber volume in board feet."""
    total_cubic_meters: float
    """Total volume in cubic meters."""
    weight_lbs: float
    """Estimated weight in pounds (~35 lbs per board foot average density)."""
    weight_kg: float
    """Estimated weight in kilograms."""


def calculate_board_foot(input: BoardFootInput) -> BoardFootResult:
    """Calculate board feet (lumber volume) and metric equivalents.

    One board foot = 1 inch thick × 12 inches wide × 1 foot long.

    Args:
        input: Board foot calculation parameters.

    Returns:
        BoardFootResult with volume in board feet, cubic meters, and weight.

    Examples:
        >>> from construction_calculators.board_foot import BoardFootInput, calculate_board_foot
        >>> inp = BoardFootInput(thickness=2, width=6, length=8, quantity=10, units="imperial")
        >>> result = calculate_board_foot(inp)
        >>> print(f"{result.total_board_feet:.1f} board feet, {result.weight_lbs:.0f} lbs")
        80.0 board feet, 2800 lbs
    """
    thickness = input.thickness
    width = input.width
    length = input.length
    quantity = input.quantity
    units = input.units

    if units == "imperial":
        # thickness & width in inches, length in feet
        total_board_feet = (thickness * width * length * quantity) / 144
        total_cubic_meters = total_board_feet * 0.002359737
    else:
        # all dimensions in mm
        volume_cm3 = (thickness * width * length * quantity) / 1000
        total_cubic_meters = volume_cm3 / 1_000_000
        total_board_feet = volume_cm3 / 2359.737

    weight_lbs = total_board_feet * 35
    weight_kg = weight_lbs * 0.453592

    return BoardFootResult(
        total_board_feet=total_board_feet,
        total_cubic_meters=total_cubic_meters,
        weight_lbs=weight_lbs,
        weight_kg=weight_kg,
    )
