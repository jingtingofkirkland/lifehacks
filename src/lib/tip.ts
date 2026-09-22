/** Pure bill-splitting math for the tip calculator tool. */
export interface TipBreakdown {
  tipAmount: number;
  total: number;
  perPerson: number;
}

export function calculateTip(
  billAmount: number,
  tipPercent: number,
  people: number,
): TipBreakdown {
  const safeBill = Number.isFinite(billAmount) && billAmount > 0 ? billAmount : 0;
  const safePercent = Number.isFinite(tipPercent) && tipPercent > 0 ? tipPercent : 0;
  const safePeople = Number.isInteger(people) && people > 0 ? people : 1;
  const tipAmount = safeBill * (safePercent / 100);
  const total = safeBill + tipAmount;
  const perPerson = total / safePeople;
  return { tipAmount, total, perPerson };
}
