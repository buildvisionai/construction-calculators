"""Equipment depreciation schedule calculator."""

from dataclasses import dataclass
from typing import List


@dataclass
class EquipmentDepreciationInput:
    """Input parameters for equipment depreciation."""

    cost: float
    """Original purchase cost of the equipment."""
    salvage_value: float
    """Expected value at end of useful life."""
    useful_life_years: int
    """Useful life in years."""


@dataclass
class DepreciationYear:
    """Depreciation amounts for a single year using four methods."""

    year: int
    straight_line: float
    """Straight-line depreciation (equal amount each year)."""
    declining_balance: float
    """27.5% declining balance depreciation."""
    sum_of_years_digits: float
    """Sum-of-years-digits accelerated depreciation."""
    double_declining_balance: float
    """Double-declining balance depreciation."""


@dataclass
class EquipmentDepreciationResult:
    """Result of equipment depreciation calculation."""

    depreciable_amount: float
    """Cost minus salvage value."""
    schedule: List[DepreciationYear]
    """Year-by-year depreciation schedule."""


def calculate_equipment_depreciation(
    input: EquipmentDepreciationInput,
) -> EquipmentDepreciationResult:
    """Calculate equipment depreciation schedule using four methods.

    Methods included:
    - Straight-line: equal depreciation each year.
    - Declining balance (27.5%): fixed rate on remaining book value.
    - Sum-of-years-digits: accelerated front-loaded depreciation.
    - Double-declining balance: 2× straight-line rate on remaining value.

    Args:
        input: Equipment depreciation parameters.

    Returns:
        EquipmentDepreciationResult with depreciable amount and full schedule.

    Examples:
        >>> from construction_calculators.equipment_depreciation import (
        ...     EquipmentDepreciationInput, calculate_equipment_depreciation
        ... )
        >>> result = calculate_equipment_depreciation(
        ...     EquipmentDepreciationInput(cost=50000, salvage_value=5000, useful_life_years=5)
        ... )
        >>> print(f"Depreciable: ${result.depreciable_amount:,.0f}, Years: {len(result.schedule)}")
        Depreciable: $45,000, Years: 5
        >>> yr1 = result.schedule[0]
        >>> print(f"Year 1 SL: ${yr1.straight_line:,.0f}, DDB: ${yr1.double_declining_balance:,.0f}")
        Year 1 SL: $9,000, DDB: $20,000
    """
    cost = input.cost
    salvage_value = input.salvage_value
    useful_life_years = input.useful_life_years

    depreciable_amount = cost - salvage_value
    sum_of_years = (useful_life_years * (useful_life_years + 1)) / 2
    straight_line_annual = depreciable_amount / useful_life_years

    remaining_declining = cost
    remaining_double = cost
    schedule: List[DepreciationYear] = []

    for year in range(1, useful_life_years + 1):
        # 27.5% declining balance
        declining_depreciation = min(
            remaining_declining * 0.275, remaining_declining - salvage_value
        )
        remaining_declining -= declining_depreciation

        # Sum-of-years-digits
        syd = (depreciable_amount * (useful_life_years - year + 1)) / sum_of_years

        # Double-declining balance
        double_rate = 2 / useful_life_years
        double_decline = min(remaining_double * double_rate, remaining_double - salvage_value)
        remaining_double -= double_decline

        schedule.append(
            DepreciationYear(
                year=year,
                straight_line=straight_line_annual,
                declining_balance=declining_depreciation,
                sum_of_years_digits=syd,
                double_declining_balance=double_decline,
            )
        )

    return EquipmentDepreciationResult(
        depreciable_amount=depreciable_amount,
        schedule=schedule,
    )
