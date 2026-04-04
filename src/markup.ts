export interface MarkupFromCostInput {
  costs: number;
  /** Markup percentage (e.g. 20 = 20%) */
  markupPercent: number;
}

export interface MarkupResult {
  totalWithMarkup: number;
  profit: number;
  profitMarginPercent: number;
}

/** Calculate selling price and profit from cost and markup %. */
export function calculateMarkup(input: MarkupFromCostInput): MarkupResult {
  const { costs, markupPercent } = input;
  const totalWithMarkup = costs * (1 + markupPercent / 100);
  const profit = totalWithMarkup - costs;
  const profitMarginPercent = (profit / totalWithMarkup) * 100;
  return { totalWithMarkup, profit, profitMarginPercent };
}

export interface MarkupFromMarginInput {
  costs: number;
  /** Desired profit margin percentage (e.g. 25 = 25%) */
  desiredMargin: number;
}

/** Derive the required markup % to achieve a target profit margin. */
export function calculateMarkupFromMargin(input: MarkupFromMarginInput): MarkupResult & { markupPercent: number } {
  const { costs, desiredMargin } = input;
  const markupPercent = (desiredMargin / (100 - desiredMargin)) * 100;
  const totalWithMarkup = costs * (1 + markupPercent / 100);
  const profit = totalWithMarkup - costs;
  const profitMarginPercent = (profit / totalWithMarkup) * 100;
  return { totalWithMarkup, profit, profitMarginPercent, markupPercent };
}
