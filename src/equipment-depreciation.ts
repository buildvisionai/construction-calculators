export interface EquipmentDepreciationInput {
  cost: number;
  salvageValue: number;
  usefulLifeYears: number;
}

export interface DepreciationYear {
  year: number;
  straightLine: number;
  decliningBalance: number;
  sumOfYearsDigits: number;
  doubleDecliningBalance: number;
}

export interface EquipmentDepreciationResult {
  depreciableAmount: number;
  schedule: DepreciationYear[];
}

/**
 * Calculate equipment depreciation schedule using four methods:
 * straight-line, 27.5% declining balance, sum-of-years-digits, and double-declining balance.
 */
export function calculateEquipmentDepreciation(input: EquipmentDepreciationInput): EquipmentDepreciationResult {
  const { cost, salvageValue, usefulLifeYears } = input;

  const depreciableAmount = cost - salvageValue;
  const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
  const straightLineAnnual = depreciableAmount / usefulLifeYears;

  let remainingDeclining = cost;
  let remainingDouble = cost;
  const schedule: DepreciationYear[] = [];

  for (let year = 1; year <= usefulLifeYears; year++) {
    const decliningDepreciation = Math.min(remainingDeclining * 0.275, remainingDeclining - salvageValue);
    remainingDeclining -= decliningDepreciation;

    const sumOfYearsDigits = (depreciableAmount * (usefulLifeYears - year + 1)) / sumOfYears;

    const doubleRate = 2 / usefulLifeYears;
    const doubleDeclineDepreciation = Math.min(remainingDouble * doubleRate, remainingDouble - salvageValue);
    remainingDouble -= doubleDeclineDepreciation;

    schedule.push({
      year,
      straightLine: straightLineAnnual,
      decliningBalance: decliningDepreciation,
      sumOfYearsDigits,
      doubleDecliningBalance: doubleDeclineDepreciation,
    });
  }

  return { depreciableAmount, schedule };
}
