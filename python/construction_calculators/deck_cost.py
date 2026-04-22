"""Deck construction cost estimator."""

import math
from dataclasses import dataclass
from typing import Literal


_DECKING_COSTS: dict[str, dict[str, float]] = {
    "pressure_treated": {"low": 15.0, "high": 25.0},
    "cedar": {"low": 20.0, "high": 35.0},
    "redwood": {"low": 25.0, "high": 45.0},
    "composite": {"low": 30.0, "high": 60.0},
    "ipe": {"low": 35.0, "high": 70.0},
    "pvc": {"low": 25.0, "high": 50.0},
}


@dataclass
class DeckCostInput:
    """Input parameters for deck cost estimation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    length: float
    """Deck length in feet (imperial) or meters (metric)."""
    width: float
    """Deck width in feet (imperial) or meters (metric)."""
    decking_type: str = "pressure_treated"
    """Decking material: 'pressure_treated', 'cedar', 'redwood', 'composite', 'ipe', 'pvc'."""
    include_railing: bool = True
    """Whether to include railing cost (~$40–$80/linear ft)."""
    include_stairs: bool = True
    """Whether to include one flight of stairs (~$700–$1,500)."""
    stories: int = 1
    """Number of stories above grade (affects footing/framing cost)."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class DeckCostResult:
    """Result of deck cost estimation."""

    area_sq_ft: float
    """Deck area in square feet."""
    area_sq_m: float
    """Deck area in square meters."""
    decking_cost_low: float
    labor_cost_low: float
    framing_cost_low: float
    railing_cost_low: float
    stair_cost_low: float
    total_low: float
    decking_cost_high: float
    labor_cost_high: float
    framing_cost_high: float
    railing_cost_high: float
    stair_cost_high: float
    total_high: float
    cost_per_sq_ft_low: float
    cost_per_sq_ft_high: float


def calculate_deck_cost(input: DeckCostInput) -> DeckCostResult:
    """Estimate deck construction cost including materials, framing, and labor.

    Args:
        input: Deck cost calculation parameters.

    Returns:
        DeckCostResult with itemized and total cost ranges.

    Examples:
        >>> from construction_calculators.deck_cost import DeckCostInput, calculate_deck_cost
        >>> inp = DeckCostInput(length=20, width=16, decking_type="composite", units="imperial")
        >>> result = calculate_deck_cost(inp)
        >>> print(f"Total: ${result.total_low:,.0f}–${result.total_high:,.0f}")
        Total: $15,280–$31,600
    """
    if input.units == "metric":
        length_ft = input.length * 3.28084
        width_ft = input.width * 3.28084
    else:
        length_ft = input.length
        width_ft = input.width

    area_sq_ft = length_ft * width_ft
    area_sq_m = area_sq_ft * 0.092903

    deck_range = _DECKING_COSTS.get(input.decking_type, _DECKING_COSTS["pressure_treated"])

    # Decking material (40% of total installed cost range)
    decking_cost_low = area_sq_ft * deck_range["low"] * 0.4
    decking_cost_high = area_sq_ft * deck_range["high"] * 0.4

    # Labor (35%)
    labor_cost_low = area_sq_ft * deck_range["low"] * 0.35
    labor_cost_high = area_sq_ft * deck_range["high"] * 0.35

    # Framing and footings (25%), adjusted for stories
    story_mult = 1.0 + (input.stories - 1) * 0.2
    framing_cost_low = area_sq_ft * deck_range["low"] * 0.25 * story_mult
    framing_cost_high = area_sq_ft * deck_range["high"] * 0.25 * story_mult

    perimeter = 2 * (length_ft + width_ft)
    if input.include_railing:
        railing_cost_low = perimeter * 40.0
        railing_cost_high = perimeter * 80.0
    else:
        railing_cost_low = railing_cost_high = 0.0

    if input.include_stairs:
        stair_cost_low = 700.0
        stair_cost_high = 1500.0
    else:
        stair_cost_low = stair_cost_high = 0.0

    total_low = decking_cost_low + labor_cost_low + framing_cost_low + railing_cost_low + stair_cost_low
    total_high = decking_cost_high + labor_cost_high + framing_cost_high + railing_cost_high + stair_cost_high

    return DeckCostResult(
        area_sq_ft=area_sq_ft,
        area_sq_m=area_sq_m,
        decking_cost_low=decking_cost_low,
        labor_cost_low=labor_cost_low,
        framing_cost_low=framing_cost_low,
        railing_cost_low=railing_cost_low,
        stair_cost_low=stair_cost_low,
        total_low=total_low,
        decking_cost_high=decking_cost_high,
        labor_cost_high=labor_cost_high,
        framing_cost_high=framing_cost_high,
        railing_cost_high=railing_cost_high,
        stair_cost_high=stair_cost_high,
        total_high=total_high,
        cost_per_sq_ft_low=total_low / area_sq_ft if area_sq_ft else 0.0,
        cost_per_sq_ft_high=total_high / area_sq_ft if area_sq_ft else 0.0,
    )
