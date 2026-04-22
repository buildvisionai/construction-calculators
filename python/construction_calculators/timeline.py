"""Construction project timeline estimator."""

import math
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import List, Optional


@dataclass
class TimelinePhase:
    """A single phase of a construction project."""

    name: str
    """Phase name (e.g. 'Foundation', 'Framing')."""
    duration_days: float
    """Estimated working days for this phase."""
    crew_size: int = 1
    """Number of workers on this phase."""
    dependencies: List[str] = field(default_factory=list)
    """Names of phases that must complete before this one starts."""


@dataclass
class TimelineInput:
    """Input parameters for project timeline calculation."""

    phases: List[TimelinePhase]
    """List of project phases."""
    work_days_per_week: int = 5
    """Working days per week (default 5)."""
    start_date: Optional[date] = None
    """Optional project start date for calendar output."""
    weather_buffer_percent: float = 10.0
    """Additional buffer for weather/delays as a percentage."""


@dataclass
class PhaseSchedule:
    """Scheduled start and end for a single phase."""

    name: str
    start_day: int
    """Project day when phase starts (1-based)."""
    end_day: int
    """Project day when phase ends (inclusive)."""
    duration_days: float
    start_date: Optional[date]
    end_date: Optional[date]


@dataclass
class TimelineResult:
    """Result of project timeline calculation."""

    total_working_days: float
    """Total project duration in working days (with buffer)."""
    total_calendar_days: int
    """Total calendar days including weekends."""
    total_weeks: float
    """Total working weeks."""
    schedule: List[PhaseSchedule]
    """Per-phase schedule."""
    estimated_end_date: Optional[date]
    """Estimated completion date if start_date was provided."""


def calculate_timeline(input: TimelineInput) -> TimelineResult:
    """Estimate a construction project timeline from phases and dependencies.

    Phases without dependencies start on day 1. Phases with dependencies
    start after all specified predecessors complete. A weather/delay buffer
    is applied to each phase duration.

    Args:
        input: Timeline calculation parameters.

    Returns:
        TimelineResult with phase schedule and total duration.

    Examples:
        >>> from construction_calculators.timeline import TimelinePhase, TimelineInput, calculate_timeline
        >>> phases = [
        ...     TimelinePhase("Foundation", 10),
        ...     TimelinePhase("Framing", 15, dependencies=["Foundation"]),
        ...     TimelinePhase("Roofing", 7, dependencies=["Framing"]),
        ... ]
        >>> result = calculate_timeline(TimelineInput(phases=phases, weather_buffer_percent=10))
        >>> print(f"Total: {result.total_working_days:.0f} days ({result.total_weeks:.1f} weeks)")
        Total: 35 days (7.0 weeks)
    """
    buffer = 1 + input.weather_buffer_percent / 100
    phase_end: dict[str, float] = {}
    schedule: List[PhaseSchedule] = []

    for phase in input.phases:
        buffered_duration = phase.duration_days * buffer
        if phase.dependencies:
            start_day = max((phase_end.get(dep, 0) for dep in phase.dependencies), default=0) + 1
        else:
            start_day = 1
        end_day = start_day + buffered_duration - 1
        phase_end[phase.name] = end_day

        if input.start_date:
            # Convert working days to calendar days
            def _add_working_days(d: date, wd: float) -> date:
                whole = int(wd)
                current = d
                added = 0
                while added < whole:
                    current += timedelta(days=1)
                    if current.weekday() < input.work_days_per_week:
                        added += 1
                return current

            phase_start_date = _add_working_days(input.start_date, start_day - 1)
            phase_end_date = _add_working_days(input.start_date, end_day - 1)
        else:
            phase_start_date = None
            phase_end_date = None

        schedule.append(PhaseSchedule(
            name=phase.name,
            start_day=math.ceil(start_day),
            end_day=math.ceil(end_day),
            duration_days=buffered_duration,
            start_date=phase_start_date,
            end_date=phase_end_date,
        ))

    total_working_days = max(phase_end.values()) if phase_end else 0.0
    total_weeks = total_working_days / input.work_days_per_week
    calendar_ratio = 7 / input.work_days_per_week
    total_calendar_days = math.ceil(total_working_days * calendar_ratio)

    if input.start_date:
        estimated_end_date = input.start_date + timedelta(days=total_calendar_days)
    else:
        estimated_end_date = None

    return TimelineResult(
        total_working_days=round(total_working_days, 1),
        total_calendar_days=total_calendar_days,
        total_weeks=round(total_weeks, 2),
        schedule=schedule,
        estimated_end_date=estimated_end_date,
    )
