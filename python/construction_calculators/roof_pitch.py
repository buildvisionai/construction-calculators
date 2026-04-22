"""Roof pitch, angle, and rafter length calculators."""

import math
from dataclasses import dataclass


@dataclass
class RoofPitchFromRiseRunInput:
    """Input for roof pitch calculation from rise and run."""

    rise: float
    """Vertical rise (e.g. inches per 12-inch run)."""
    run: float
    """Horizontal run."""


@dataclass
class RoofPitchFromAngleInput:
    """Input for roof pitch calculation from angle."""

    angle_degrees: float
    """Roof angle in degrees from horizontal."""


@dataclass
class RoofPitchFromPercentInput:
    """Input for roof pitch calculation from slope percent."""

    percent: float
    """Slope as a percentage (rise/run × 100)."""


@dataclass
class RoofPitchResult:
    """Result of roof pitch calculation."""

    rise: float
    run: float
    angle_degrees: float
    pitch_percent: float


@dataclass
class RafterInput:
    """Input for rafter length calculation."""

    rise: float
    run: float
    half_span: float
    """Half the roof span (ft or m)."""


@dataclass
class RafterResult:
    """Result of rafter length calculation."""

    rafter_length: float
    """Diagonal rafter length."""
    rise_for_span: float
    """Total rise for the given half-span."""


def pitch_from_rise_run(input: RoofPitchFromRiseRunInput) -> RoofPitchResult:
    """Calculate roof pitch from rise and run.

    Args:
        input: Rise and run values.

    Returns:
        RoofPitchResult with angle and pitch percent.

    Examples:
        >>> from construction_calculators.roof_pitch import RoofPitchFromRiseRunInput, pitch_from_rise_run
        >>> result = pitch_from_rise_run(RoofPitchFromRiseRunInput(rise=6, run=12))
        >>> print(f"Angle: {result.angle_degrees:.1f}°, {result.pitch_percent:.1f}%")
        Angle: 26.6°, 50.0%
    """
    rise = input.rise
    run = input.run
    angle_degrees = math.degrees(math.atan(rise / run))
    pitch_percent = (rise / run) * 100
    return RoofPitchResult(rise=rise, run=run, angle_degrees=angle_degrees, pitch_percent=pitch_percent)


def pitch_from_angle(input: RoofPitchFromAngleInput) -> RoofPitchResult:
    """Calculate roof pitch (rise over 12-unit run) from angle.

    Args:
        input: Roof angle in degrees.

    Returns:
        RoofPitchResult with rise/12 pitch and percent.

    Examples:
        >>> from construction_calculators.roof_pitch import RoofPitchFromAngleInput, pitch_from_angle
        >>> result = pitch_from_angle(RoofPitchFromAngleInput(angle_degrees=26.57))
        >>> print(f"Rise: {result.rise:.1f}/12, {result.pitch_percent:.1f}%")
        Rise: 6.0/12, 50.0%
    """
    angle_degrees = input.angle_degrees
    rise = math.tan(math.radians(angle_degrees)) * 12
    run = 12.0
    pitch_percent = (rise / run) * 100
    return RoofPitchResult(rise=rise, run=run, angle_degrees=angle_degrees, pitch_percent=pitch_percent)


def pitch_from_percent(input: RoofPitchFromPercentInput) -> RoofPitchResult:
    """Calculate roof pitch from slope percent.

    Args:
        input: Slope as a percentage.

    Returns:
        RoofPitchResult with rise/12 pitch and angle.

    Examples:
        >>> from construction_calculators.roof_pitch import RoofPitchFromPercentInput, pitch_from_percent
        >>> result = pitch_from_percent(RoofPitchFromPercentInput(percent=50))
        >>> print(f"Rise: {result.rise:.1f}/12, Angle: {result.angle_degrees:.1f}°")
        Rise: 6.0/12, Angle: 26.6°
    """
    percent = input.percent
    rise = (percent / 100) * 12
    run = 12.0
    angle_degrees = math.degrees(math.atan(percent / 100))
    return RoofPitchResult(rise=rise, run=run, angle_degrees=angle_degrees, pitch_percent=percent)


def calculate_rafter_length(input: RafterInput) -> RafterResult:
    """Calculate rafter length given half-span and pitch.

    Args:
        input: Rise, run, and half-span of the roof.

    Returns:
        RafterResult with rafter length and total rise.

    Examples:
        >>> from construction_calculators.roof_pitch import RafterInput, calculate_rafter_length
        >>> result = calculate_rafter_length(RafterInput(rise=6, run=12, half_span=15))
        >>> print(f"Rafter: {result.rafter_length:.2f} ft")
        Rafter: 16.77 ft
    """
    rise = input.rise
    run = input.run
    half_span = input.half_span
    rise_for_span = half_span * (rise / run)
    rafter_length = math.sqrt(half_span ** 2 + rise_for_span ** 2)
    return RafterResult(rafter_length=rafter_length, rise_for_span=rise_for_span)
