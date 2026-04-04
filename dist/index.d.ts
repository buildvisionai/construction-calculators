interface BoardFootInput {
    thickness: number;
    width: number;
    length: number;
    quantity: number;
    /** 'imperial' = inches for thickness/width, feet for length; 'metric' = mm */
    units: 'imperial' | 'metric';
}
interface BoardFootResult {
    totalBoardFeet: number;
    totalCubicMeters: number;
    weightLbs: number;
    weightKg: number;
}
/**
 * Calculate board feet (lumber volume) and metric equivalents.
 * Imperial: thickness & width in inches, length in feet.
 * Metric: all dimensions in mm.
 */
declare function calculateBoardFoot(input: BoardFootInput): BoardFootResult;

interface ConcreteInput {
    shape: 'rectangular' | 'circular';
    /** For rectangular: length × width × depth. For circular: radius × depth. All in same unit. */
    length?: number;
    width?: number;
    radius?: number;
    depth: number;
    units: 'imperial' | 'metric';
}
interface ConcreteResult {
    volumeCuFt: number;
    volumeCuM: number;
    bagsNeeded: number;
    sand: number;
    gravel: number;
    /** Water in gallons (imperial) or liters (metric) */
    water: number;
}
/**
 * Calculate concrete volume and materials.
 * Imperial: dimensions in feet, depth in feet.
 * Metric: dimensions in meters.
 */
declare function calculateConcrete(input: ConcreteInput): ConcreteResult;

interface ConcreteSlabInput {
    /** ft (imperial) or m (metric) */
    length: number;
    width: number;
    /** inches (imperial) or cm (metric) */
    thickness: number;
    numSlabs: number;
    wasteFactor: number;
    /** USD per cubic yard (optional cost estimate) */
    pricePerCuYd?: number;
    units: 'imperial' | 'metric';
}
interface ConcreteSlabResult {
    totalAreaSqFt: number;
    totalAreaSqM: number;
    volumeCuFt: number;
    volumeCuYd: number;
    volumeCuM: number;
    bags80lb: number;
    bags60lb: number;
    readyMixTrucks: number;
    estimatedCost: number;
    rebarLinearFt: number;
}
/** Calculate concrete slab volume, bag counts, and optional cost. */
declare function calculateConcreteSlab(input: ConcreteSlabInput): ConcreteSlabResult;

interface ConcreteBlockInput {
    /** ft (imperial) or m (metric) */
    wallLength: number;
    wallHeight: number;
    numberOfWalls: number;
    /** Block dimensions in inches (imperial) or cm (metric), plus mortar joint */
    blockLength: number;
    blockHeight: number;
    /** Mortar joint: inches (imperial) or mm (metric) */
    mortarJoint: number;
    wastePercent: number;
    /** Blocks per mortar bag (typical: 35–45) */
    blocksPerBag: number;
    /** Optional cost per block */
    costPerBlock?: number;
    units: 'imperial' | 'metric';
}
interface ConcreteBlockResult {
    blocksPerWall: number;
    totalBlocks: number;
    blocksWithWaste: number;
    mortarBags: number;
    costEstimate: number;
}
/** Calculate concrete blocks, mortar, and cost for a masonry wall. */
declare function calculateConcreteBlock(input: ConcreteBlockInput): ConcreteBlockResult;

interface GravelInput {
    shape: 'rectangular' | 'circular';
    /** ft (imperial) or m (metric) */
    length?: number;
    width?: number;
    radius?: number;
    /** ft (imperial) or m (metric) */
    depth: number;
    pricePerTon?: number;
    units: 'imperial' | 'metric';
}
interface GravelResult {
    /** yd³ (imperial) or m³ (metric) */
    volume: number;
    /** Converted to the other unit */
    alternativeVolume: number;
    tonnage: number;
    bags50lb: number;
    estimatedCost: number;
}
/** Calculate gravel/aggregate volume, weight, and cost. */
declare function calculateGravel(input: GravelInput): GravelResult;

interface MarkupFromCostInput {
    costs: number;
    /** Markup percentage (e.g. 20 = 20%) */
    markupPercent: number;
}
interface MarkupResult {
    totalWithMarkup: number;
    profit: number;
    profitMarginPercent: number;
}
/** Calculate selling price and profit from cost and markup %. */
declare function calculateMarkup(input: MarkupFromCostInput): MarkupResult;
interface MarkupFromMarginInput {
    costs: number;
    /** Desired profit margin percentage (e.g. 25 = 25%) */
    desiredMargin: number;
}
/** Derive the required markup % to achieve a target profit margin. */
declare function calculateMarkupFromMargin(input: MarkupFromMarginInput): MarkupResult & {
    markupPercent: number;
};

interface LaborBurden {
    /** Percentages */
    socialSecurity: number;
    medicare: number;
    federalUnemployment: number;
    stateUnemployment: number;
    workersComp: number;
    downtimePercentage: number;
    /** Per $1000 of payroll */
    liabilityInsurance: number;
}
interface Worker {
    hourlyWage: number;
    /** If false, burden is not applied (e.g. subcontractor) */
    taxable: boolean;
    /** 0–100, percentage of project time */
    projectPercentage: number;
}
interface LaborCostInput {
    /** Working days */
    projectLength: number;
    hoursPerDay: number;
    workers: Worker[];
    burden: LaborBurden;
}
interface LaborCostResult {
    totalProjectHours: number;
    burdenMultiplier: number;
    totalLaborCost: number;
    avgHourlyRate: number;
    perWorkerCosts: number[];
}
/** Calculate total labor cost including payroll burden. */
declare function calculateLaborCost(input: LaborCostInput): LaborCostResult;

interface RoofPitchFromRiseRunInput {
    rise: number;
    run: number;
}
interface RoofPitchFromAngleInput {
    angleDegrees: number;
}
interface RoofPitchFromPercentInput {
    percent: number;
}
interface RoofPitchResult {
    rise: number;
    run: number;
    angleDegrees: number;
    pitchPercent: number;
}
interface RafterInput extends RoofPitchFromRiseRunInput {
    /** Half-span (ft or m) */
    halfSpan: number;
}
interface RafterResult {
    rafterLength: number;
    riseForSpan: number;
}
/** Calculate roof pitch from rise and run. */
declare function pitchFromRiseRun(input: RoofPitchFromRiseRunInput): RoofPitchResult;
/** Calculate roof pitch (rise over 12-unit run) from angle. */
declare function pitchFromAngle(input: RoofPitchFromAngleInput): RoofPitchResult;
/** Calculate roof pitch from slope percent. */
declare function pitchFromPercent(input: RoofPitchFromPercentInput): RoofPitchResult;
/** Calculate rafter length given half-span and pitch. */
declare function calculateRafterLength(input: RafterInput): RafterResult;

/** Cost ranges in $/sq ft installed */
declare const PRICE_RANGES: Record<string, {
    low: number;
    high: number;
}>;
interface RoofingCostInput {
    /** Square feet (imperial) or m² (metric) */
    roofArea: number;
    materialType: keyof typeof PRICE_RANGES;
    /** Multiplier for regional labor/material costs (e.g. 1.0 = average) */
    regionMultiplier: number;
    /** Multiplier for roof pitch difficulty (e.g. 1.0 = low pitch) */
    pitchMultiplier: number;
    /** Multiplier for number of stories (e.g. 1.0 = single story) */
    storiesMultiplier: number;
    includeTearOff: boolean;
    units: 'imperial' | 'metric';
}
interface RoofingCostResult {
    areaSqFt: number;
    materialCostLow: number;
    materialCostHigh: number;
    laborCostLow: number;
    laborCostHigh: number;
    tearOffLow: number;
    tearOffHigh: number;
    totalLow: number;
    totalHigh: number;
    costPerSquareLow: number;
    costPerSquareHigh: number;
    lifespanYears: {
        low: number;
        high: number;
    };
    costPerYearLow: number;
    costPerYearHigh: number;
}
/** Estimate roofing installation cost including materials, labor, and tear-off. */
declare function calculateRoofingCost(input: RoofingCostInput): RoofingCostResult;

/** Price ranges in $/sq ft for metal roofing types */
declare const METAL_PRICES: Record<string, {
    low: number;
    high: number;
}>;
interface MetalRoofCostInput {
    /** Square feet (imperial) or m² (metric) */
    roofArea: number;
    metalType: keyof typeof METAL_PRICES;
    /** Roof pitch in degrees */
    pitchDegrees: number;
    regionMultiplier: number;
    units: 'imperial' | 'metric';
}
interface MetalRoofCostResult {
    areaSqFt: number;
    wasteFactor: number;
    materialCostLow: number;
    materialCostHigh: number;
    laborCostLow: number;
    laborCostHigh: number;
    totalLow: number;
    totalHigh: number;
    metalLifespanYears: number;
    /** Cost over 50-year horizon compared to asphalt */
    comparison50yr: {
        metalLow: number;
        metalHigh: number;
        asphaltLow: number;
        asphaltHigh: number;
    };
}
/** Estimate metal roof installation cost and compare to asphalt over 50 years. */
declare function calculateMetalRoofCost(input: MetalRoofCostInput): MetalRoofCostResult;

interface RoofMaterialInput {
    /** Building footprint in sq ft (imperial) or m² (metric) */
    footprint: number;
    /** Pitch key like '6/12' */
    pitch: string;
    /** Waste percentage (e.g. 10 = 10%) */
    wastePercent: number;
    /** Shingle price per square (100 sq ft) */
    shinglePricePerSquare: number;
    /** Markup percentage on total material cost */
    markupPercent: number;
    units: 'imperial' | 'metric';
}
interface RoofMaterialResult {
    footprintSqFt: number;
    actualAreaSqFt: number;
    totalAreaWithWaste: number;
    squares: number;
    fieldBundles: number;
    starterBundles: number;
    ridgeCapBundles: number;
    underlaymentRolls: number;
    iceWaterSqFt: number;
    dripEdgePieces: number;
    nailsLbs: number;
    totalSupplierCost: number;
    bidPrice: number;
    grossMarginPercent: number;
}
/** Calculate roofing material quantities and bid price. */
declare function calculateRoofMaterials(input: RoofMaterialInput): RoofMaterialResult;

type RoomShape = 'rectangle' | 'square' | 'circle';
interface SquareFootageRoom {
    shape: RoomShape;
    /** ft (imperial) or m (metric) */
    length?: number;
    width?: number;
    radius?: number;
}
interface SquareFootageInput {
    rooms: SquareFootageRoom[];
    units: 'imperial' | 'metric';
}
interface SquareFootageResult {
    totalAreaSqFt: number;
    totalAreaSqM: number;
    perRoom: number[];
}
/** Calculate total square footage for one or more rooms of various shapes. */
declare function calculateSquareFootage(input: SquareFootageInput): SquareFootageResult;

type CostCategory = 'materials' | 'labor' | 'equipment' | 'other';
interface LineItem {
    category: CostCategory;
    quantity: number;
    unitCost: number;
}
interface ConstructionCostResult {
    lineItemTotals: number[];
    materials: number;
    labor: number;
    equipment: number;
    other: number;
    grandTotal: number;
}
/** Sum construction cost line items by category. */
declare function calculateConstructionCost(lineItems: LineItem[]): ConstructionCostResult;

interface DrywallInput {
    /** ft (imperial) or m (metric) */
    length: number;
    width: number;
    height: number;
    doors: number;
    windows: number;
    includeCeiling: boolean;
    /** '4x8', '4x10', or '4x12' */
    sheetSize: '4x8' | '4x10' | '4x12';
    units: 'imperial' | 'metric';
}
interface DrywallResult {
    wallArea: number;
    ceilingArea: number;
    totalArea: number;
    sheets: number;
    tapeRolls: number;
    compoundBuckets: number;
    screws: number;
}
/** Calculate drywall sheets, tape, compound, and screws. */
declare function calculateDrywall(input: DrywallInput): DrywallResult;

/** Cost per linear foot ranges by fence type */
declare const FENCE_COSTS: Record<string, {
    costMin: number;
    costMax: number;
    picketWidth: number;
}>;
interface FenceInput {
    /** Linear feet (imperial) or meters (metric) */
    linearLength: number;
    /** Post spacing in same unit as linearLength */
    postSpacing: number;
    /** Height in feet (imperial) or meters (metric) */
    height: number;
    gates: number;
    fenceType: keyof typeof FENCE_COSTS;
    units: 'imperial' | 'metric';
}
interface FenceResult {
    posts: number;
    rails: number;
    pickets: number;
    panels: number;
    concreteBags: number;
    costMin: number;
    costMax: number;
}
/** Calculate fence materials and installation cost range. */
declare function calculateFence(input: FenceInput): FenceResult;

/** Cost per sq ft (installed) and box coverage by flooring type */
declare const FLOORING_DEFAULTS: Record<string, {
    costMin: number;
    costMax: number;
    boxCoverage: number;
    boxCoverageMetric: number;
}>;
interface FlooringInput {
    /** ft (imperial) or m (metric) */
    roomLength: number;
    roomWidth: number;
    /** inches (imperial) or mm (metric) */
    plankWidth: number;
    plankLength: number;
    wastePercent: number;
    flooringType: keyof typeof FLOORING_DEFAULTS;
    units: 'imperial' | 'metric';
}
interface FlooringResult {
    totalArea: number;
    totalAreaWithWaste: number;
    piecesNeeded: number;
    boxesNeeded: number;
    underlaymentArea: number;
    perimeterFt: number;
    transitionStrips: number;
    costMin: number;
    costMax: number;
}
/** Calculate flooring materials and installed cost. */
declare function calculateFlooring(input: FlooringInput): FlooringResult;

/** Coverage in sq ft per gallon (imperial) or m² per liter (metric) */
declare const PAINT_COVERAGE: {
    standard: {
        imperial: number;
        metric: number;
    };
    primer: {
        imperial: number;
        metric: number;
    };
    gloss: {
        imperial: number;
        metric: number;
    };
    matte: {
        imperial: number;
        metric: number;
    };
};
interface PaintInput {
    /** ft (imperial) or m (metric) */
    length: number;
    width: number;
    height: number;
    doors: number;
    windows: number;
    includeCeiling: boolean;
    coats: number;
    paintType: keyof typeof PAINT_COVERAGE;
    includePrimer: boolean;
    units: 'imperial' | 'metric';
}
interface PaintResult {
    netWallArea: number;
    ceilingArea: number;
    totalPaintableArea: number;
    gallonsNeeded: number;
    quartsNeeded: number;
    primerGallons: number;
    costLow: number;
    costHigh: number;
    timeEstimateHours: number;
}
/** Calculate paint quantities, primer, cost, and time estimate. */
declare function calculatePaint(input: PaintInput): PaintResult;

type InsulationType = 'fiberglass-batt' | 'blown-in-fiberglass' | 'cellulose' | 'spray-foam' | 'rigid-board';
interface InsulationInput {
    /** ft (imperial) or m (metric) */
    length: number;
    width: number;
    /** Target R-value (numeric, e.g. 30) */
    targetRValue: number;
    insulationType: InsulationType;
    units: 'imperial' | 'metric';
}
interface InsulationResult {
    areaSqFt: number;
    thicknessInches: number;
    thicknessCm: number;
    rollsOrBags: number;
    costLow: number;
    costHigh: number;
}
/** Calculate insulation thickness, material quantity, and cost. */
declare function calculateInsulation(input: InsulationInput): InsulationResult;

interface PaverInput {
    /** Area dimensions in ft (imperial) or m (metric) */
    areaLength: number;
    areaWidth: number;
    /** Paver dimensions in inches (imperial) or cm (metric) */
    paverLength: number;
    paverWidth: number;
    /** Joint width in inches (imperial) or mm (metric) */
    jointWidth: number;
    /** Waste percentage (e.g. 10 = 10%) */
    wastePercent: number;
    units: 'imperial' | 'metric';
}
interface PaverResult {
    totalArea: number;
    paversNeeded: number;
    wastePavers: number;
    totalWithWaste: number;
    sandTons: number;
    gravelVolume: number;
}
/** Calculate paver quantities, bedding sand, and gravel base. */
declare function calculatePavers(input: PaverInput): PaverResult;

interface RetainingWallInput {
    /** ft (imperial) or m (metric) */
    wallLength: number;
    wallHeight: number;
    /** inches (imperial) or cm (metric) */
    wallThickness: number;
    /** Backfill depth in ft (imperial) or m (metric) */
    backfillDepth: number;
    /** Block face dimensions in inches */
    blockLength: number;
    blockHeight: number;
    wastePercent: number;
    units: 'imperial' | 'metric';
}
interface RetainingWallResult {
    courses: number;
    blocksPerCourse: number;
    totalBlocks: number;
    blocksWithWaste: number;
    capBlocks: number;
    totalFaceArea: number;
    gravelBackfill: number;
    drainageAggregate: number;
    geogridLayers: number;
}
/** Calculate retaining wall block counts, backfill, and geogrid requirements. */
declare function calculateRetainingWall(input: RetainingWallInput): RetainingWallResult;

interface StairInput {
    /** Total rise in inches (imperial) or mm (metric) */
    totalRise: number;
    /** Override number of steps (optional) */
    desiredSteps?: number;
    units: 'imperial' | 'metric';
}
interface StairResult {
    numberOfSteps: number;
    risePerStep: number;
    runPerStep: number;
    totalRun: number;
    stringerLength: number;
    angleDegrees: number;
}
/** Calculate stair dimensions from total rise. */
declare function calculateStairs(input: StairInput): StairResult;

/** Material and installed prices per sq ft by deck material */
declare const DECK_PRICES: Record<string, {
    materialLow: number;
    materialHigh: number;
    installedLow: number;
    installedHigh: number;
}>;
interface DeckCostInput {
    /** ft (imperial) or m (metric) */
    length: number;
    width: number;
    height: number;
    deckMaterial: keyof typeof DECK_PRICES;
    includeRailing: boolean;
    includeStairs: boolean;
    steps: number;
    units: 'imperial' | 'metric';
}
interface DeckCostResult {
    areaSqFt: number;
    areaM2: number;
    boardsNeeded: number;
    joistsNeeded: number;
    postsNeeded: number;
    footingsNeeded: number;
    fastenersNeeded: number;
    railingLinearFt: number;
    totalMaterialLow: number;
    totalMaterialHigh: number;
    totalInstalledLow: number;
    totalInstalledHigh: number;
}
/** Calculate deck materials, framing, and cost range. */
declare function calculateDeckCost(input: DeckCostInput): DeckCostResult;

interface EquipmentDepreciationInput {
    cost: number;
    salvageValue: number;
    usefulLifeYears: number;
}
interface DepreciationYear {
    year: number;
    straightLine: number;
    decliningBalance: number;
    sumOfYearsDigits: number;
    doubleDecliningBalance: number;
}
interface EquipmentDepreciationResult {
    depreciableAmount: number;
    schedule: DepreciationYear[];
}
/**
 * Calculate equipment depreciation schedule using four methods:
 * straight-line, 27.5% declining balance, sum-of-years-digits, and double-declining balance.
 */
declare function calculateEquipmentDepreciation(input: EquipmentDepreciationInput): EquipmentDepreciationResult;

interface HourlyRateExpenses {
    annualSalary?: number;
    rent?: number;
    utilities?: number;
    insurance?: number;
    tools?: number;
    vehicle?: number;
    marketing?: number;
    other?: number;
}
interface HourlyRateInput {
    daysPerWeek: number;
    weeksPerYear: number;
    hoursPerDay: number;
    vacationDays: number;
    sickDays: number;
    holidayDays: number;
    expenses: HourlyRateExpenses;
    /** Target profit margin percentage */
    profitMargin: number;
}
interface HourlyRateResult {
    workingDaysPerYear: number;
    annualHours: number;
    totalExpenses: number;
    baseHourlyRate: number;
    withProfitRate: number;
    expenseBreakdownPerHour: Record<string, number>;
}
/** Calculate a billable hourly rate that covers all expenses and target profit margin. */
declare function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult;

interface NetProfitInput {
    desiredProfit: number;
    /** Profit margin as a percentage (e.g. 20 = 20%) */
    profitMarginPercent: number;
    /** Average revenue per project */
    avgRevenuePerProject: number;
}
interface NetProfitResult {
    totalRevenueNeeded: number;
    projectsPerYear: number;
    projectsPerMonth: number;
    projectsPerWeek: number;
}
/** Calculate how many projects are needed to hit a desired net profit. */
declare function calculateNetProfit(input: NetProfitInput): NetProfitResult;

interface Task {
    id: string;
    duration: number;
    dependencies: string[];
}
interface TimelineResult {
    projectDuration: number;
    criticalPath: string[];
    earliestStart: Record<string, number>;
    earliestFinish: Record<string, number>;
    latestStart: Record<string, number>;
    latestFinish: Record<string, number>;
    totalFloat: Record<string, number>;
}
/**
 * Critical path method (CPM) scheduler.
 * Returns earliest/latest start & finish for each task and the critical path.
 */
declare function calculateTimeline(tasks: Task[]): TimelineResult;

export { type BoardFootInput, type BoardFootResult, type ConcreteBlockInput, type ConcreteBlockResult, type ConcreteInput, type ConcreteResult, type ConcreteSlabInput, type ConcreteSlabResult, type ConstructionCostResult, type CostCategory, type DeckCostInput, type DeckCostResult, type DepreciationYear, type DrywallInput, type DrywallResult, type EquipmentDepreciationInput, type EquipmentDepreciationResult, type FenceInput, type FenceResult, type FlooringInput, type FlooringResult, type GravelInput, type GravelResult, type HourlyRateExpenses, type HourlyRateInput, type HourlyRateResult, type InsulationInput, type InsulationResult, type LaborBurden, type LaborCostInput, type LaborCostResult, type LineItem, type MarkupFromCostInput, type MarkupFromMarginInput, type MarkupResult, type MetalRoofCostInput, type MetalRoofCostResult, type NetProfitInput, type NetProfitResult, type PaintInput, type PaintResult, type PaverInput, type PaverResult, type RafterInput, type RafterResult, type RetainingWallInput, type RetainingWallResult, type RoofMaterialInput, type RoofMaterialResult, type RoofPitchFromAngleInput, type RoofPitchFromPercentInput, type RoofPitchFromRiseRunInput, type RoofPitchResult, type RoofingCostInput, type RoofingCostResult, type RoomShape, type SquareFootageInput, type SquareFootageResult, type SquareFootageRoom, type StairInput, type StairResult, type Task, type TimelineResult, type Worker, calculateBoardFoot, calculateConcrete, calculateConcreteBlock, calculateConcreteSlab, calculateConstructionCost, calculateDeckCost, calculateDrywall, calculateEquipmentDepreciation, calculateFence, calculateFlooring, calculateGravel, calculateHourlyRate, calculateInsulation, calculateLaborCost, calculateMarkup, calculateMarkupFromMargin, calculateMetalRoofCost, calculateNetProfit, calculatePaint, calculatePavers, calculateRafterLength, calculateRetainingWall, calculateRoofMaterials, calculateRoofingCost, calculateSquareFootage, calculateStairs, calculateTimeline, pitchFromAngle, pitchFromPercent, pitchFromRiseRun };
