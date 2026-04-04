export interface LaborBurden {
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

export interface Worker {
  hourlyWage: number;
  /** If false, burden is not applied (e.g. subcontractor) */
  taxable: boolean;
  /** 0–100, percentage of project time */
  projectPercentage: number;
}

export interface LaborCostInput {
  /** Working days */
  projectLength: number;
  hoursPerDay: number;
  workers: Worker[];
  burden: LaborBurden;
}

export interface LaborCostResult {
  totalProjectHours: number;
  burdenMultiplier: number;
  totalLaborCost: number;
  avgHourlyRate: number;
  perWorkerCosts: number[];
}

/** Calculate total labor cost including payroll burden. */
export function calculateLaborCost(input: LaborCostInput): LaborCostResult {
  const { projectLength, hoursPerDay, workers, burden } = input;

  const totalProjectHours = projectLength * hoursPerDay;

  const burdenMultiplier =
    (burden.socialSecurity + burden.medicare + burden.federalUnemployment + burden.stateUnemployment) / 100 +
    burden.liabilityInsurance / 1000 +
    burden.workersComp / 100 +
    burden.downtimePercentage / 100;

  const perWorkerCosts = workers.map(worker => {
    const workerHours = (totalProjectHours * worker.projectPercentage) / 100;
    const effectiveRate = worker.taxable ? worker.hourlyWage * (1 + burdenMultiplier) : worker.hourlyWage;
    return effectiveRate * workerHours;
  });

  const totalLaborCost = perWorkerCosts.reduce((sum, c) => sum + c, 0);
  const avgHourlyRate = totalProjectHours > 0 ? totalLaborCost / totalProjectHours : 0;

  return { totalProjectHours, burdenMultiplier, totalLaborCost, avgHourlyRate, perWorkerCosts };
}
