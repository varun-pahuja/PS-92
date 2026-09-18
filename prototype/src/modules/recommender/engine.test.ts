import { describe, expect, it } from "vitest";
import { recommend, type IProfile } from "./engine";

const base: IProfile = {
  isSC: true,
  applicantType: "individual",
  annualFamilyIncome: 300_000,
  purpose: "business",
  activity: "Tailoring unit",
  estimatedCost: 80_000,
};

describe("recommend() — Micro Finance Scheme band", () => {
  it("recommends MFS as the lowest-rate primary for a sub-₹1.4L unit", () => {
    const res = recommend(base);
    expect(res.globalBlockers).toEqual([]);
    expect(res.primary?.scheme.id).toBe("MFS");
    expect(res.primary?.eligible).toBe(true);
    expect(res.primary?.scheme.beneficiaryRate).toBe(6.5);
    // 90% of 80,000 = 72,000, under the 1.25L cap
    expect(res.primary?.loanAmount).toBe(72_000);
    expect(res.primary?.ownContribution).toBe(8_000);
  });

  it("offers Aajeevika as an eligible alternative (via NBFC-MFI)", () => {
    const res = recommend(base);
    const aaj = res.recommendations.find((r) => r.scheme.id === "AAJEEVIKA");
    expect(aaj?.eligible).toBe(true);
  });
});

describe("recommend() — Term Loan band", () => {
  it("recommends Term Loan above ₹1.4L", () => {
    const res = recommend({ ...base, estimatedCost: 300_000 });
    expect(res.primary?.scheme.id).toBe("TERM");
    expect(res.primary?.loanAmount).toBe(270_000);
  });

  it("caps the loan at ₹45L for a ₹50L project", () => {
    const res = recommend({ ...base, estimatedCost: 5_000_000 });
    expect(res.primary?.scheme.id).toBe("TERM");
    expect(res.primary?.loanAmount).toBe(4_500_000);
    expect(res.primary?.ownContribution).toBe(500_000);
  });
});

describe("recommend() — Education", () => {
  it("routes a recognised course to the Education Loan Scheme", () => {
    const res = recommend({
      ...base,
      purpose: "education",
      activity: "B.Tech",
      estimatedCost: 800_000,
      courseRecognised: true,
    });
    expect(res.primary?.scheme.id).toBe("ELS");
    expect(res.primary?.scheme.beneficiaryRate).toBe(6.5);
  });

  it("blocks an unrecognised course from ELS", () => {
    const res = recommend({
      ...base,
      purpose: "education",
      activity: "Unlisted diploma",
      estimatedCost: 800_000,
      courseRecognised: false,
    });
    expect(res.primary).toBeNull();
  });
});

describe("recommend() — eligibility gates", () => {
  it("blocks everyone above the ₹5 lakh income ceiling", () => {
    const res = recommend({ ...base, annualFamilyIncome: 600_000 });
    expect(res.primary).toBeNull();
    expect(res.recommendations).toHaveLength(0);
    const income = res.globalBlockers.find((b) => b.key === "block.incomeCeiling");
    expect(income).toBeDefined();
    expect(income?.params?.income).toBe(600_000);
  });

  it("blocks non-SC applicants", () => {
    const res = recommend({ ...base, isSC: false });
    expect(res.primary).toBeNull();
    expect(res.globalBlockers.some((b) => b.key === "block.notSC")).toBe(true);
  });

  it("returns localisable message keys, never English prose", () => {
    const eligible = recommend(base); // produces reasons across all schemes
    const blocked = recommend({ ...base, annualFamilyIncome: 600_000 });
    const all = [
      ...blocked.globalBlockers,
      ...eligible.recommendations.flatMap((r) => [...r.reasons, ...r.blockers]),
    ];
    expect(all.length).toBeGreaterThan(0);
    for (const m of all) {
      // keys are dotted identifiers like "why.costInBand" — no spaces, no ₹.
      expect(m.key).toMatch(/^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/);
    }
  });

  it("returns no eligible scheme when the project exceeds all bands", () => {
    const res = recommend({ ...base, estimatedCost: 6_000_000 });
    expect(res.primary).toBeNull();
    expect(res.recommendations.every((r) => !r.eligible)).toBe(true);
  });
});
