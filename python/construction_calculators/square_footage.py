"""Square footage calculator for rooms and irregular areas."""

import math
from dataclasses import dataclass, field
from typing import List, Literal


@dataclass
class Room:
    """A single rectangular room or area."""

    name: str
    """Room label (e.g. 'Living Room')."""
    length: float
    width: float


@dataclass
class SquareFootageInput:
    """Input parameters for square footage calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    rooms: List[Room]
    """List of rooms/areas to sum."""
    units: Literal["imperial", "metric"] = "imperial"
    deductions: float = 0.0
    """Total area to deduct (e.g. closets excluded from flooring), in input units."""


@dataclass
class RoomArea:
    """Area result for a single room."""

    name: str
    area: float
    """Area in input units."""
    area_sq_ft: float
    area_sq_m: float


@dataclass
class SquareFootageResult:
    """Result of square footage calculation."""

    room_areas: List[RoomArea]
    """Per-room breakdown."""
    gross_area: float
    """Total area before deductions, in input units."""
    net_area: float
    """Total area after deductions, in input units."""
    gross_area_sq_ft: float
    gross_area_sq_m: float
    net_area_sq_ft: float
    net_area_sq_m: float


def calculate_square_footage(input: SquareFootageInput) -> SquareFootageResult:
    """Calculate total square footage across multiple rooms or areas.

    Args:
        input: Square footage calculation parameters.

    Returns:
        SquareFootageResult with per-room breakdown and totals.

    Examples:
        >>> from construction_calculators.square_footage import Room, SquareFootageInput, calculate_square_footage
        >>> rooms = [Room("Living Room", 20, 15), Room("Kitchen", 12, 10), Room("Bedroom", 14, 12)]
        >>> result = calculate_square_footage(SquareFootageInput(rooms=rooms, units="imperial"))
        >>> print(f"Total: {result.gross_area_sq_ft:.0f} sq ft")
        Total: 588 sq ft
    """
    room_areas: List[RoomArea] = []
    gross = 0.0

    for room in input.rooms:
        area = room.length * room.width
        if input.units == "metric":
            area_sq_ft = area * 10.7639
            area_sq_m = area
        else:
            area_sq_ft = area
            area_sq_m = area * 0.092903
        room_areas.append(RoomArea(
            name=room.name,
            area=area,
            area_sq_ft=area_sq_ft,
            area_sq_m=area_sq_m,
        ))
        gross += area

    net = max(0.0, gross - input.deductions)

    if input.units == "metric":
        gross_sq_ft = gross * 10.7639
        gross_sq_m = gross
        net_sq_ft = net * 10.7639
        net_sq_m = net
    else:
        gross_sq_ft = gross
        gross_sq_m = gross * 0.092903
        net_sq_ft = net
        net_sq_m = net * 0.092903

    return SquareFootageResult(
        room_areas=room_areas,
        gross_area=gross,
        net_area=net,
        gross_area_sq_ft=gross_sq_ft,
        gross_area_sq_m=gross_sq_m,
        net_area_sq_ft=net_sq_ft,
        net_area_sq_m=net_sq_m,
    )
