import { describe, expect, it } from "vitest";
import { computeEmi, emiFor } from "./emi";

describe("emiFor()", () => {
  it("matches the closed-form EMI for a standard loan", () => {
    // ₹1,00,000 @ 8% for 84 months → ~₹1,558.8
    expect(emiFor(100_000, 0.08 / 12, 84)).toBeCloseTo(1558.8, 0);
  });

  it("handles a zero-interest loan", () => {
    expect(emiFor(120_000, 0, 12)).toBe(10_000);
  });
});

describe("computeEmi() — interest-only moratorium", () => {
  const res = computeEmi({
    principal: 100_000,
    annualRatePct: 8,
    tenureMonths: 84,
    moratoriumMonths: 6,
    mode: "interest-only",
  });

  it("produces one schedule row per month", () => {
    expect(res.schedule).toHaveLength(84);
  });

  it("charges only interest and keeps principal flat during the moratorium", () => {
    for (const row of res.schedule.slice(0, 6)) {
      expect(row.principal).toBe(0);
      expect(row.closing).toBe(100_000);
    }
    expect(res.moratoriumPayment).toBeCloseTo((100_000 * 0.08) / 12, 4);
  });

  it("fully repays the principal", () => {
    const principalPaid = res.schedule.reduce((s, r) => s + r.principal, 0);
    expect(principalPaid).toBeCloseTo(100_000, 0);
    expect(Math.abs(res.schedule[res.schedule.length - 1].closing)).toBeLessThan(1);
  });

  it("keeps totalPayable = principal + totalInterest", () => {
    expect(res.totalPayable).toBeCloseTo(100_000 + res.totalInterest, 4);
  });
});

describe("computeEmi() — deferred moratorium", () => {
  const res = computeEmi({
    principal: 100_000,
    annualRatePct: 8,
    tenureMonths: 84,
    moratoriumMonths: 6,
    mode: "deferred",
  });

  it("capitalises interest into the effective principal", () => {
    const expected = 100_000 * Math.pow(1 + 0.08 / 12, 6);
    expect(res.effectivePrincipal).toBeCloseTo(expected, 0);
    expect(res.effectivePrincipal).toBeGreaterThan(100_000);
  });

  it("charges nothing during the moratorium", () => {
    expect(res.schedule.slice(0, 6).every((r) => r.payment === 0)).toBe(true);
  });

  it("costs more interest than the interest-only model", () => {
    const io = computeEmi({
      principal: 100_000,
      annualRatePct: 8,
      tenureMonths: 84,
      moratoriumMonths: 6,
      mode: "interest-only",
    });
    expect(res.totalInterest).toBeGreaterThan(io.totalInterest);
  });
});
