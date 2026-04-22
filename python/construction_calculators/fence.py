"""Fence materials and installation cost calculator."""

import math
from dataclasses import dataclass
from typing import Literal


# Cost per linear foot ranges by fence type
_FENCE_COSTS: dict[str, dict] = {
    "wood": {"cost_min": 17, "cost_max": 45, "picket_width": 5.5},
    "vinyl": {"cost_min": 25, "cost_max": 40, "picket_width": 0},
    "chain_link": {"cost_min": 10, "cost_max": 20, "picket_width": 0},
    "aluminum": {"cost_min": 25, "cost_max": 40, "picket_width": 0},
    "split_rail": {"cost_min": 10, "cost_max": 25, "picket_width": 0},
}

FenceType = Literal["wood", "vinyl", "chain_link", "aluminum", "split_rail"]


@dataclass
class FenceInput:
    """Input parameters for fence calculation."""

    linear_length: float
    """Total fence length in linear feet (imperial) or meters (metric)."""
    post_spacing: float
    """Distance between posts in same units as linear_length."""
    height: float
    """Fence height in feet (imperial) or meters (metric)."""
    gates: int
    """Number of gate openings."""
    fence_type: str
    """Fence type: 'wood', 'vinyl', 'chain_link', 'aluminum', or 'split_rail'."""
    units: Literal["imperial", "metric"]


@dataclass
class FenceResult:
    """Result of fence calculation."""

    posts: int
    rails: int
    pickets: int
    """Number of wood pickets (0 for non-wood fence types)."""
    panels: int
    """Number of panels (0 for wood fence)."""
    concrete_bags: int
    """80 lb bags of concrete for post footings (2 per post)."""
    cost_min: float
    cost_max: float


def calculate_fence(input: FenceInput) -> FenceResult:
    """Calculate fence materials and installation cost range.

    Args:
        input: Fence calculation parameters.

    Returns:
        FenceResult with post/rail/picket counts and cost range.

    Examples:
        >>> from construction_calculators.fence import FenceInput, calculate_fence
        >>> inp = FenceInput(
        ...     linear_length=200, post_spacing=8, height=6,
        ...     gates=1, fence_type="wood", units="imperial"
        ... )
        >>> result = calculate_fence(inp)
        >>> print(f"{result.posts} posts, {result.pickets} pickets")
        27 posts, 436 pickets
    """
    linear_length = input.linear_length
    post_spacing = input.post_spacing
    height = input.height
    gates = input.gates
    fence_type = input.fence_type
    units = input.units

    posts = math.ceil(linear_length / post_spacing) + 1 + gates
    rails_per_section = 3 if height > (5 if units == "imperial" else 1.5) else 2
    rails = (posts - 1) * rails_per_section

    type_data = _FENCE_COSTS.get(fence_type, _FENCE_COSTS["wood"])
    if fence_type == "wood":
        length_in_small_units = linear_length * (12 if units == "imperial" else 39.3701)
        pickets = math.ceil(length_in_small_units / type_data["picket_width"])
    else:
        pickets = 0

    panels = math.ceil(linear_length / post_spacing) if fence_type != "wood" else 0
    concrete_bags = posts * 2

    linear_in_feet = linear_length if units == "imperial" else linear_length * 3.28084
    cost_min = linear_in_feet * type_data["cost_min"]
    cost_max = linear_in_feet * type_data["cost_max"]

    return FenceResult(
        posts=posts,
        rails=rails,
        pickets=pickets,
        panels=panels,
        concrete_bags=concrete_bags,
        cost_min=cost_min,
        cost_max=cost_max,
    )
