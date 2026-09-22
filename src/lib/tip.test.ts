import { describe, expect, it } from 'vitest';
import { calculateTip } from './tip';

describe('calculateTip', () => {
  it('computes tip, total, and per-person split', () => {
    const { tipAmount, total, perPerson } = calculateTip(100, 20, 4);
    expect(tipAmount).toBeCloseTo(20, 10);
    expect(total).toBeCloseTo(120, 10);
    expect(perPerson).toBeCloseTo(30, 10);
  });

  it('handles fractional bills', () => {
    const { tipAmount, total, perPerson } = calculateTip(42.5, 18, 2);
    expect(tipAmount).toBeCloseTo(7.65, 10);
    expect(total).toBeCloseTo(50.15, 10);
    expect(perPerson).toBeCloseTo(25.075, 10);
  });

  it('treats zero or negative bill as zero', () => {
    expect(calculateTip(0, 20, 2)).toEqual({ tipAmount: 0, total: 0, perPerson: 0 });
    expect(calculateTip(-5, 20, 2)).toEqual({ tipAmount: 0, total: 0, perPerson: 0 });
  });

  it('guards against zero or invalid people count', () => {
    const { perPerson, total } = calculateTip(100, 15, 0);
    expect(perPerson).toBeCloseTo(total, 10);
  });

  it('supports a zero tip', () => {
    const { tipAmount, total, perPerson } = calculateTip(80, 0, 1);
    expect(tipAmount).toBe(0);
    expect(total).toBe(80);
    expect(perPerson).toBe(80);
  });
});
