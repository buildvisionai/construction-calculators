"""Stair dimension calculator."""

import math
from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class StairInput:
    """Input parameters for stair calculation."""

    total_rise: float
    """Total rise in inches (imperial) or mm (metric)."""
    units: Literal["imperial", "metric"]
    desired_steps: Optional[int] = None
    """Override number of steps. If None, calculated from ideal rise per step."""


@dataclass
class StairResult:
    """Result of stair calculation."""

    number_of_steps: int
    rise_per_step: float
    """Vertical height of each step in same units as total_rise."""
    run_per_step: float
    """Horizontal depth of each tread (10.5 in / 267 mm)."""
    total_run: float
    """Total horizontal distance of the staircase."""
    stringer_length: float
    """Diagonal stringer length."""
    angle_degrees: float
    """Staircase angle in degrees."""


def calculate_stairs(input: StairInput) -> StairResult:
    """Calculate stair dimensions from total rise.

    Uses ideal rise of 7.5 in (190 mm) and ideal run of 10.5 in (267 mm)
    per standard building codes.

    Args:
        input: Stair calculation parameters.

    Returns:
        StairResult with step count, dimensions, and stringer length.

    Examples:
        >>> from construction_calculators.stair import StairInput, calculate_stairs
        >>> result = calculate_stairs(StairInput(total_rise=108, units="imperial"))
        >>> print(f"{result.number_of_steps} steps, angle {result.angle_degrees:.1f}°")
        15 steps, angle 35.5°
    """
    total_rise = input.total_rise
    units = input.units

    ideal_rise = 7.5 if units == "imperial" else 190
    ideal_run = 10.5 if units == "imperial" else 267

    number_of_steps = (
        input.desired_steps if input.desired_steps is not None
        else math.ceil(total_rise / ideal_rise)
    )
    rise_per_step = total_rise / number_of_steps
    run_per_step = ideal_run
    total_run = run_per_step * (number_of_steps - 1)
    stringer_length = math.sqrt(total_rise ** 2 + total_run ** 2)
    angle_degrees = math.degrees(math.atan2(total_rise, total_run))

    return StairResult(
        number_of_steps=number_of_steps,
        rise_per_step=rise_per_step,
        run_per_step=run_per_step,
        total_run=total_run,
        stringer_length=stringer_length,
        angle_degrees=angle_degrees,
    )
