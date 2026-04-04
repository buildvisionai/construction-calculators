export interface HourlyRateExpenses {
  annualSalary?: number;
  rent?: number;
  utilities?: number;
  insurance?: number;
  tools?: number;
  vehicle?: number;
  marketing?: number;
  other?: number;
}

export interface HourlyRateInput {
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

export interface HourlyRateResult {
  workingDaysPerYear: number;
  annualHours: number;
  totalExpenses: number;
  baseHourlyRate: number;
  withProfitRate: number;
  expenseBreakdownPerHour: Record<string, number>;
}

/** Calculate a billable hourly rate that covers all expenses and target profit margin. */
export function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult {
  const { daysPerWeek, weeksPerYear, hoursPerDay, vacationDays, sickDays, holidayDays, expenses, profitMargin } = input;

  const totalDaysOff = vacationDays + sickDays + holidayDays;
  const workingDaysPerYear = daysPerWeek * weeksPerYear - totalDaysOff;
  const annualHours = workingDaysPerYear * hoursPerDay;

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (value ?? 0), 0);

  const baseHourlyRate = annualHours > 0 ? totalExpenses / annualHours : 0;
  const withProfitRate = baseHourlyRate * (1 + profitMargin / 100);

  const expenseBreakdownPerHour: Record<string, number> = {};
  if (annualHours > 0) {
    for (const [key, value] of Object.entries(expenses)) {
      expenseBreakdownPerHour[key] = (value ?? 0) / annualHours;
    }
  }

  return { workingDaysPerYear, annualHours, totalExpenses, baseHourlyRate, withProfitRate, expenseBreakdownPerHour };
}
