"""Markup and profit margin calculators."""

from dataclasses import dataclass


@dataclass
class MarkupFromCostInput:
    """Input for markup calculation from cost and markup percentage."""

    costs: float
    """Total costs (material, labor, overhead)."""
    markup_percent: float
    """Markup percentage (e.g. 20 = 20%)."""


@dataclass
class MarkupResult:
    """Result of markup calculation."""

    total_with_markup: float
    """Selling price including markup."""
    profit: float
    """Absolute profit amount."""
    profit_margin_percent: float
    """Profit as a percentage of selling price."""


@dataclass
class MarkupFromMarginInput:
    """Input for markup calculation from desired profit margin."""

    costs: float
    """Total costs."""
    desired_margin: float
    """Desired profit margin percentage (e.g. 25 = 25%)."""


@dataclass
class MarkupFromMarginResult(MarkupResult):
    """Result of markup-from-margin calculation, includes derived markup %."""

    markup_percent: float = 0.0
    """The markup percentage required to achieve the desired margin."""


def calculate_markup(input: MarkupFromCostInput) -> MarkupResult:
    """Calculate selling price and profit from cost and markup percentage.

    Args:
        input: Cost and markup percentage.

    Returns:
        MarkupResult with selling price, profit, and margin.

    Examples:
        >>> from construction_calculators.markup import MarkupFromCostInput, calculate_markup
        >>> result = calculate_markup(MarkupFromCostInput(costs=10000, markup_percent=20))
        >>> print(f"Sell at ${result.total_with_markup:,.0f}, margin {result.profit_margin_percent:.1f}%")
        Sell at $12,000, margin 16.7%
    """
    costs = input.costs
    markup_percent = input.markup_percent

    total_with_markup = costs * (1 + markup_percent / 100)
    profit = total_with_markup - costs
    profit_margin_percent = (profit / total_with_markup) * 100 if total_with_markup else 0.0

    return MarkupResult(
        total_with_markup=total_with_markup,
        profit=profit,
        profit_margin_percent=profit_margin_percent,
    )


def calculate_markup_from_margin(input: MarkupFromMarginInput) -> MarkupFromMarginResult:
    """Derive the required markup percentage to achieve a target profit margin.

    Args:
        input: Cost and desired profit margin percentage.

    Returns:
        MarkupFromMarginResult with selling price, profit, margin, and markup %.

    Examples:
        >>> from construction_calculators.markup import MarkupFromMarginInput, calculate_markup_from_margin
        >>> result = calculate_markup_from_margin(MarkupFromMarginInput(costs=10000, desired_margin=25))
        >>> print(f"Markup: {result.markup_percent:.1f}%, Sell at ${result.total_with_markup:,.0f}")
        Markup: 33.3%, Sell at $13,333
    """
    costs = input.costs
    desired_margin = input.desired_margin

    markup_percent = (desired_margin / (100 - desired_margin)) * 100
    total_with_markup = costs * (1 + markup_percent / 100)
    profit = total_with_markup - costs
    profit_margin_percent = (profit / total_with_markup) * 100 if total_with_markup else 0.0

    return MarkupFromMarginResult(
        total_with_markup=total_with_markup,
        profit=profit,
        profit_margin_percent=profit_margin_percent,
        markup_percent=markup_percent,
    )
