"""
construction-calculators
========================

A collection of pure-Python construction calculation functions for
estimating materials, costs, and dimensions. No external dependencies.

Ported from the BuildVision TypeScript calculator library.
See https://buildvisionai.com/calculators for interactive web versions.
"""

from construction_calculators.board_foot import (
    BoardFootInput,
    BoardFootResult,
    calculate_board_foot,
)
from construction_calculators.concrete import (
    ConcreteInput,
    ConcreteResult,
    calculate_concrete,
)
from construction_calculators.drywall import (
    DrywallInput,
    DrywallResult,
    calculate_drywall,
)
from construction_calculators.equipment_depreciation import (
    DepreciationYear,
    EquipmentDepreciationInput,
    EquipmentDepreciationResult,
    calculate_equipment_depreciation,
)
from construction_calculators.fence import (
    FenceInput,
    FenceResult,
    calculate_fence,
)
from construction_calculators.flooring import (
    FlooringInput,
    FlooringResult,
    calculate_flooring,
)
from construction_calculators.gravel import (
    GravelInput,
    GravelResult,
    calculate_gravel,
)
from construction_calculators.hourly_rate import (
    HourlyRateExpenses,
    HourlyRateInput,
    HourlyRateResult,
    calculate_hourly_rate,
)
from construction_calculators.labor_cost import (
    LaborBurden,
    LaborCostInput,
    LaborCostResult,
    Worker,
    calculate_labor_cost,
)
from construction_calculators.markup import (
    MarkupFromCostInput,
    MarkupFromMarginInput,
    MarkupFromMarginResult,
    MarkupResult,
    calculate_markup,
    calculate_markup_from_margin,
)
from construction_calculators.net_profit import (
    NetProfitInput,
    NetProfitResult,
    calculate_net_profit,
)
from construction_calculators.paint import (
    PaintInput,
    PaintResult,
    calculate_paint,
)
from construction_calculators.roof_pitch import (
    RafterInput,
    RafterResult,
    RoofPitchFromAngleInput,
    RoofPitchFromPercentInput,
    RoofPitchFromRiseRunInput,
    RoofPitchResult,
    calculate_rafter_length,
    pitch_from_angle,
    pitch_from_percent,
    pitch_from_rise_run,
)
from construction_calculators.roofing_cost import (
    LifespanYears,
    RoofingCostInput,
    RoofingCostResult,
    calculate_roofing_cost,
)
from construction_calculators.stair import (
    StairInput,
    StairResult,
    calculate_stairs,
)
from construction_calculators.concrete_slab import (
    ConcreteSlabInput,
    ConcreteSlabResult,
    calculate_concrete_slab,
)
from construction_calculators.concrete_block import (
    ConcreteBlockInput,
    ConcreteBlockResult,
    calculate_concrete_block,
)
from construction_calculators.retaining_wall import (
    RetainingWallInput,
    RetainingWallResult,
    calculate_retaining_wall,
)
from construction_calculators.roof import (
    RoofInput,
    RoofResult,
    calculate_roof,
)
from construction_calculators.metal_roof_cost import (
    MetalRoofCostInput,
    MetalRoofCostResult,
    calculate_metal_roof_cost,
)
from construction_calculators.insulation import (
    InsulationInput,
    InsulationResult,
    calculate_insulation,
)
from construction_calculators.paver import (
    PaverInput,
    PaverResult,
    calculate_paver,
)
from construction_calculators.deck_cost import (
    DeckCostInput,
    DeckCostResult,
    calculate_deck_cost,
)
from construction_calculators.square_footage import (
    Room,
    RoomArea,
    SquareFootageInput,
    SquareFootageResult,
    calculate_square_footage,
)
from construction_calculators.construction_cost import (
    ConstructionCostInput,
    ConstructionCostResult,
    calculate_construction_cost,
)
from construction_calculators.timeline import (
    PhaseSchedule,
    TimelineInput,
    TimelinePhase,
    TimelineResult,
    calculate_timeline,
)

__version__ = "1.0.0"
__author__ = "BuildVision"
__email__ = "hello@buildvisionai.com"

__all__ = [
    # Board foot
    "BoardFootInput",
    "BoardFootResult",
    "calculate_board_foot",
    # Concrete
    "ConcreteInput",
    "ConcreteResult",
    "calculate_concrete",
    # Drywall
    "DrywallInput",
    "DrywallResult",
    "calculate_drywall",
    # Equipment depreciation
    "DepreciationYear",
    "EquipmentDepreciationInput",
    "EquipmentDepreciationResult",
    "calculate_equipment_depreciation",
    # Fence
    "FenceInput",
    "FenceResult",
    "calculate_fence",
    # Flooring
    "FlooringInput",
    "FlooringResult",
    "calculate_flooring",
    # Gravel
    "GravelInput",
    "GravelResult",
    "calculate_gravel",
    # Hourly rate
    "HourlyRateExpenses",
    "HourlyRateInput",
    "HourlyRateResult",
    "calculate_hourly_rate",
    # Labor cost
    "LaborBurden",
    "LaborCostInput",
    "LaborCostResult",
    "Worker",
    "calculate_labor_cost",
    # Markup
    "MarkupFromCostInput",
    "MarkupFromMarginInput",
    "MarkupFromMarginResult",
    "MarkupResult",
    "calculate_markup",
    "calculate_markup_from_margin",
    # Net profit
    "NetProfitInput",
    "NetProfitResult",
    "calculate_net_profit",
    # Paint
    "PaintInput",
    "PaintResult",
    "calculate_paint",
    # Roof pitch
    "RafterInput",
    "RafterResult",
    "RoofPitchFromAngleInput",
    "RoofPitchFromPercentInput",
    "RoofPitchFromRiseRunInput",
    "RoofPitchResult",
    "calculate_rafter_length",
    "pitch_from_angle",
    "pitch_from_percent",
    "pitch_from_rise_run",
    # Roofing cost
    "LifespanYears",
    "RoofingCostInput",
    "RoofingCostResult",
    "calculate_roofing_cost",
    # Stairs
    "StairInput",
    "StairResult",
    "calculate_stairs",
    # Concrete slab
    "ConcreteSlabInput",
    "ConcreteSlabResult",
    "calculate_concrete_slab",
    # Concrete block
    "ConcreteBlockInput",
    "ConcreteBlockResult",
    "calculate_concrete_block",
    # Retaining wall
    "RetainingWallInput",
    "RetainingWallResult",
    "calculate_retaining_wall",
    # Roof
    "RoofInput",
    "RoofResult",
    "calculate_roof",
    # Metal roof cost
    "MetalRoofCostInput",
    "MetalRoofCostResult",
    "calculate_metal_roof_cost",
    # Insulation
    "InsulationInput",
    "InsulationResult",
    "calculate_insulation",
    # Paver
    "PaverInput",
    "PaverResult",
    "calculate_paver",
    # Deck cost
    "DeckCostInput",
    "DeckCostResult",
    "calculate_deck_cost",
    # Square footage
    "Room",
    "RoomArea",
    "SquareFootageInput",
    "SquareFootageResult",
    "calculate_square_footage",
    # Construction cost
    "ConstructionCostInput",
    "ConstructionCostResult",
    "calculate_construction_cost",
    # Timeline
    "PhaseSchedule",
    "TimelineInput",
    "TimelinePhase",
    "TimelineResult",
    "calculate_timeline",
]
