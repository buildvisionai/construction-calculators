"""Concrete block (CMU) wall calculator."""

import math
from dataclasses import dataclass
from typing import Literal


# Standard block dimensions (including mortar joint)
_BLOCK_HEIGHT_FT = 8 / 12  # 8 inches
_BLOCK_LENGTH_FT = 16 / 12  # 16 inches
_BLOCK_AREA_SQ_FT = _BLOCK_HEIGHT_FT * _BLOCK_LENGTH_FT  # ~0.889 sq ft per block


@dataclass
class ConcreteBlockInput:
    """Input parameters for concrete block wall calculation.

    Imperial: dimensions in feet.
    Metric: dimensions in meters.
    """

    wall_length: float
    """Wall length in feet (imperial) or meters (metric)."""
    wall_height: float
    """Wall height in feet (imperial) or meters (metric)."""
    waste_factor: float = 0.05
    """Waste/breakage factor as a decimal (default 5%)."""
    price_per_block: float = 0.0
    """Optional price per block for cost estimate."""
    units: Literal["imperial", "metric"] = "imperial"


@dataclass
class ConcreteBlockResult:
    """Result of concrete block wall calculation."""

    wall_area_sq_ft: float
    """Wall face area in square feet."""
    wall_area_sq_m: float
    """Wall face area in square meters."""
    blocks_needed: int
    """Total blocks including waste."""
    mortar_bags: int
    """Estimated 70 lb mortar bags needed."""
    estimated_cost: float
    """Estimated block cost."""


def calculate_concrete_block(input: ConcreteBlockInput) -> ConcreteBlockResult:
    """Calculate number of concrete blocks needed for a wall.

    Args:
        input: Concrete block calculation parameters.

    Returns:
        ConcreteBlockResult with block count, mortar, and cost.

    Examples:
        >>> from construction_calculators.concrete_block import ConcreteBlockInput, calculate_concrete_block
        >>> inp = ConcreteBlockInput(wall_length=20, wall_height=8, price_per_block=2.5, units="imperial")
        >>> result = calculate_concrete_block(inp)
        >>> print(f"{result.blocks_needed} blocks, ${result.estimated_cost:,.0f}")
        180 blocks, $450
    """
    if input.units == "metric":
        length_ft = input.wall_length * 3.28084
        height_ft = input.wall_height * 3.28084
    else:
        length_ft = input.wall_length
        height_ft = input.wall_height

    wall_area_sq_ft = length_ft * height_ft
    wall_area_sq_m = wall_area_sq_ft * 0.092903

    raw_blocks = wall_area_sq_ft / _BLOCK_AREA_SQ_FT
    blocks_needed = math.ceil(raw_blocks * (1 + input.waste_factor))

    # ~1 bag of mortar per 40 blocks
    mortar_bags = math.ceil(blocks_needed / 40)
    estimated_cost = blocks_needed * input.price_per_block

    return ConcreteBlockResult(
        wall_area_sq_ft=wall_area_sq_ft,
        wall_area_sq_m=wall_area_sq_m,
        blocks_needed=blocks_needed,
        mortar_bags=mortar_bags,
        estimated_cost=estimated_cost,
    )
