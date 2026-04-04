export interface NetProfitInput {
  desiredProfit: number;
  /** Profit margin as a percentage (e.g. 20 = 20%) */
  profitMarginPercent: number;
  /** Average revenue per project */
  avgRevenuePerProject: number;
}

export interface NetProfitResult {
  totalRevenueNeeded: number;
  projectsPerYear: number;
  projectsPerMonth: number;
  projectsPerWeek: number;
}

/** Calculate how many projects are needed to hit a desired net profit. */
export function calculateNetProfit(input: NetProfitInput): NetProfitResult {
  const { desiredProfit, profitMarginPercent, avgRevenuePerProject } = input;

  const totalRevenueNeeded = (desiredProfit * 100) / profitMarginPercent;
  const projectsPerYear = Math.ceil(totalRevenueNeeded / avgRevenuePerProject);
  const projectsPerMonth = Math.ceil(projectsPerYear / 12);
  const projectsPerWeek = Math.ceil(projectsPerYear / 52);

  return { totalRevenueNeeded, projectsPerYear, projectsPerMonth, projectsPerWeek };
}
