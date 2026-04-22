"""Net profit and project volume calculator."""

import math
from dataclasses import dataclass


@dataclass
class NetProfitInput:
    """Input parameters for net profit planning."""

    desired_profit: float
    """Target annual net profit."""
    profit_margin_percent: float
    """Profit margin as a percentage (e.g. 20 = 20%)."""
    avg_revenue_per_project: float
    """Average revenue per completed project."""


@dataclass
class NetProfitResult:
    """Result of net profit calculation."""

    total_revenue_needed: float
    """Total annual revenue required to achieve desired profit."""
    projects_per_year: int
    """Number of projects needed per year."""
    projects_per_month: int
    """Number of projects needed per month (rounded up)."""
    projects_per_week: int
    """Number of projects needed per week (rounded up)."""


def calculate_net_profit(input: NetProfitInput) -> NetProfitResult:
    """Calculate how many projects are needed to hit a desired net profit.

    Args:
        input: Net profit planning parameters.

    Returns:
        NetProfitResult with revenue target and required project volumes.

    Examples:
        >>> from construction_calculators.net_profit import NetProfitInput, calculate_net_profit
        >>> result = calculate_net_profit(NetProfitInput(
        ...     desired_profit=100_000,
        ...     profit_margin_percent=20,
        ...     avg_revenue_per_project=25_000
        ... ))
        >>> print(f"Projects/year: {result.projects_per_year}, Revenue: ${result.total_revenue_needed:,.0f}")
        Projects/year: 20, Revenue: $500,000
    """
    desired_profit = input.desired_profit
    profit_margin_percent = input.profit_margin_percent
    avg_revenue_per_project = input.avg_revenue_per_project

    total_revenue_needed = (desired_profit * 100) / profit_margin_percent
    projects_per_year = math.ceil(total_revenue_needed / avg_revenue_per_project)
    projects_per_month = math.ceil(projects_per_year / 12)
    projects_per_week = math.ceil(projects_per_year / 52)

    return NetProfitResult(
        total_revenue_needed=total_revenue_needed,
        projects_per_year=projects_per_year,
        projects_per_month=projects_per_month,
        projects_per_week=projects_per_week,
    )
