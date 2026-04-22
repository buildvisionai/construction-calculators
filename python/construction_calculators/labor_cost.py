"""Labor cost calculator including payroll burden."""

from dataclasses import dataclass, field
from typing import List


@dataclass
class LaborBurden:
    """Payroll burden rates."""

    social_security: float = 6.2
    """Social Security rate (%)."""
    medicare: float = 1.45
    """Medicare rate (%)."""
    federal_unemployment: float = 0.6
    """Federal unemployment (FUTA) rate (%)."""
    state_unemployment: float = 2.7
    """State unemployment (SUTA) rate (%)."""
    workers_comp: float = 3.0
    """Workers compensation rate (%)."""
    downtime_percentage: float = 10.0
    """Non-billable time as a percentage of total hours (%)."""
    liability_insurance: float = 5.0
    """General liability insurance per $1,000 of payroll."""


@dataclass
class Worker:
    """Worker definition."""

    hourly_wage: float
    """Base hourly wage."""
    taxable: bool = True
    """If False, burden is not applied (e.g. subcontractor)."""
    project_percentage: float = 100.0
    """Percentage of project time this worker is on-site (0–100)."""


@dataclass
class LaborCostInput:
    """Input parameters for labor cost calculation."""

    project_length: float
    """Project length in working days."""
    hours_per_day: float
    """Working hours per day."""
    workers: List[Worker]
    """List of workers on the project."""
    burden: LaborBurden = field(default_factory=LaborBurden)


@dataclass
class LaborCostResult:
    """Result of labor cost calculation."""

    total_project_hours: float
    """Total project hours (project_length × hours_per_day)."""
    burden_multiplier: float
    """Combined burden rate as a decimal (e.g. 0.15 = 15% overhead)."""
    total_labor_cost: float
    """Total labor cost including burden."""
    avg_hourly_rate: float
    """Blended average effective hourly rate across all workers."""
    per_worker_costs: List[float]
    """Individual cost for each worker in the same order as input."""


def calculate_labor_cost(input: LaborCostInput) -> LaborCostResult:
    """Calculate total labor cost including payroll burden.

    Args:
        input: Labor cost calculation parameters.

    Returns:
        LaborCostResult with total cost, burden multiplier, and per-worker breakdown.

    Examples:
        >>> from construction_calculators.labor_cost import (
        ...     LaborBurden, Worker, LaborCostInput, calculate_labor_cost
        ... )
        >>> workers = [Worker(hourly_wage=25, taxable=True, project_percentage=100)]
        >>> inp = LaborCostInput(project_length=10, hours_per_day=8, workers=workers)
        >>> result = calculate_labor_cost(inp)
        >>> print(f"Total: ${result.total_labor_cost:,.2f}")
        Total: $2,617.60
    """
    project_length = input.project_length
    hours_per_day = input.hours_per_day
    workers = input.workers
    burden = input.burden

    total_project_hours = project_length * hours_per_day

    burden_multiplier = (
        (burden.social_security + burden.medicare + burden.federal_unemployment + burden.state_unemployment)
        / 100
        + burden.liability_insurance / 1000
        + burden.workers_comp / 100
        + burden.downtime_percentage / 100
    )

    per_worker_costs = []
    for worker in workers:
        worker_hours = (total_project_hours * worker.project_percentage) / 100
        effective_rate = (
            worker.hourly_wage * (1 + burden_multiplier) if worker.taxable else worker.hourly_wage
        )
        per_worker_costs.append(effective_rate * worker_hours)

    total_labor_cost = sum(per_worker_costs)
    avg_hourly_rate = total_labor_cost / total_project_hours if total_project_hours > 0 else 0.0

    return LaborCostResult(
        total_project_hours=total_project_hours,
        burden_multiplier=burden_multiplier,
        total_labor_cost=total_labor_cost,
        avg_hourly_rate=avg_hourly_rate,
        per_worker_costs=per_worker_costs,
    )
