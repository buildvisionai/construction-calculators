"""Billable hourly rate calculator covering expenses and target profit margin."""

from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass
class HourlyRateExpenses:
    """Annual business expenses."""

    annual_salary: float = 0.0
    rent: float = 0.0
    utilities: float = 0.0
    insurance: float = 0.0
    tools: float = 0.0
    vehicle: float = 0.0
    marketing: float = 0.0
    other: float = 0.0


@dataclass
class HourlyRateInput:
    """Input parameters for hourly rate calculation."""

    days_per_week: float
    weeks_per_year: float
    hours_per_day: float
    vacation_days: float
    sick_days: float
    holiday_days: float
    expenses: HourlyRateExpenses
    profit_margin: float
    """Target profit margin percentage (e.g. 20 = 20%)."""


@dataclass
class HourlyRateResult:
    """Result of hourly rate calculation."""

    working_days_per_year: float
    """Actual working days after time-off deductions."""
    annual_hours: float
    """Total billable hours per year."""
    total_expenses: float
    """Sum of all annual expenses."""
    base_hourly_rate: float
    """Minimum rate to cover all expenses."""
    with_profit_rate: float
    """Rate including target profit margin."""
    expense_breakdown_per_hour: Dict[str, float]
    """Each expense category's contribution per billable hour."""


def calculate_hourly_rate(input: HourlyRateInput) -> HourlyRateResult:
    """Calculate a billable hourly rate that covers all expenses and a target profit margin.

    Args:
        input: Hourly rate calculation parameters.

    Returns:
        HourlyRateResult with working hours, expenses, and recommended rates.

    Examples:
        >>> from construction_calculators.hourly_rate import (
        ...     HourlyRateExpenses, HourlyRateInput, calculate_hourly_rate
        ... )
        >>> expenses = HourlyRateExpenses(annual_salary=60000, insurance=3000, tools=2000, vehicle=5000)
        >>> inp = HourlyRateInput(
        ...     days_per_week=5, weeks_per_year=52, hours_per_day=8,
        ...     vacation_days=10, sick_days=5, holiday_days=10,
        ...     expenses=expenses, profit_margin=20
        ... )
        >>> result = calculate_hourly_rate(inp)
        >>> print(f"Charge ${result.with_profit_rate:.2f}/hr ({result.annual_hours:.0f} hrs/yr)")
        Charge $54.11/hr (1960 hrs/yr)
    """
    days_per_week = input.days_per_week
    weeks_per_year = input.weeks_per_year
    hours_per_day = input.hours_per_day
    total_days_off = input.vacation_days + input.sick_days + input.holiday_days

    working_days_per_year = days_per_week * weeks_per_year - total_days_off
    annual_hours = working_days_per_year * hours_per_day

    expenses = input.expenses
    expense_dict = {
        "annual_salary": expenses.annual_salary,
        "rent": expenses.rent,
        "utilities": expenses.utilities,
        "insurance": expenses.insurance,
        "tools": expenses.tools,
        "vehicle": expenses.vehicle,
        "marketing": expenses.marketing,
        "other": expenses.other,
    }
    total_expenses = sum(expense_dict.values())

    base_hourly_rate = total_expenses / annual_hours if annual_hours > 0 else 0.0
    with_profit_rate = base_hourly_rate * (1 + input.profit_margin / 100)

    expense_breakdown_per_hour: Dict[str, float] = {}
    if annual_hours > 0:
        for key, value in expense_dict.items():
            expense_breakdown_per_hour[key] = value / annual_hours

    return HourlyRateResult(
        working_days_per_year=working_days_per_year,
        annual_hours=annual_hours,
        total_expenses=total_expenses,
        base_hourly_rate=base_hourly_rate,
        with_profit_rate=with_profit_rate,
        expense_breakdown_per_hour=expense_breakdown_per_hour,
    )
