/** Cost per linear foot ranges by fence type */
const FENCE_COSTS: Record<string, { costMin: number; costMax: number; picketWidth: number }> = {
  wood: { costMin: 17, costMax: 45, picketWidth: 5.5 },
  vinyl: { costMin: 25, costMax: 40, picketWidth: 0 },
  chain_link: { costMin: 10, costMax: 20, picketWidth: 0 },
  aluminum: { costMin: 25, costMax: 40, picketWidth: 0 },
  split_rail: { costMin: 10, costMax: 25, picketWidth: 0 },
};

export interface FenceInput {
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

export interface FenceResult {
  posts: number;
  rails: number;
  pickets: number;
  panels: number;
  concreteBags: number;
  costMin: number;
  costMax: number;
}

/** Calculate fence materials and installation cost range. */
export function calculateFence(input: FenceInput): FenceResult {
  const { linearLength, postSpacing, height, gates, fenceType, units } = input;

  const posts = Math.ceil(linearLength / postSpacing) + 1 + gates;
  const railsPerSection = height > (units === 'imperial' ? 5 : 1.5) ? 3 : 2;
  const rails = (posts - 1) * railsPerSection;

  const type = FENCE_COSTS[fenceType] ?? FENCE_COSTS.wood;
  const pickets = fenceType === 'wood'
    ? Math.ceil((linearLength * (units === 'imperial' ? 12 : 39.3701)) / type.picketWidth)
    : 0;
  const panels = fenceType !== 'wood' ? Math.ceil(linearLength / postSpacing) : 0;
  const concreteBags = posts * 2;

  const linearInFeet = units === 'imperial' ? linearLength : linearLength * 3.28084;
  const costMin = linearInFeet * type.costMin;
  const costMax = linearInFeet * type.costMax;

  return { posts, rails, pickets, panels, concreteBags, costMin, costMax };
}
