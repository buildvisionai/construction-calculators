export type CostCategory = 'materials' | 'labor' | 'equipment' | 'other';

export interface LineItem {
  category: CostCategory;
  quantity: number;
  unitCost: number;
}

export interface ConstructionCostResult {
  lineItemTotals: number[];
  materials: number;
  labor: number;
  equipment: number;
  other: number;
  grandTotal: number;
}

/** Sum construction cost line items by category. */
export function calculateConstructionCost(lineItems: LineItem[]): ConstructionCostResult {
  const lineItemTotals = lineItems.map(item => item.quantity * item.unitCost);
  const totals = { materials: 0, labor: 0, equipment: 0, other: 0 };

  lineItems.forEach((item, i) => {
    totals[item.category] += lineItemTotals[i];
  });

  const grandTotal = lineItemTotals.reduce((s, t) => s + t, 0);
  return { lineItemTotals, ...totals, grandTotal };
}
