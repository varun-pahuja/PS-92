/**
 * Rule-based scheme matching engine.
 *
 * Deliberately a transparent weighted decision tree — not a black box. Every
 * recommendation carries a `reasons[]` trail so the applicant (and an auditor)
 * can see exactly why a scheme was ranked where it was. The interface is kept
 * narrow so this can later be swapped for a trained classifier
 * (e.g. gradient-boosted trees over the same feature vector) without touching
 * the UI.
 */

import {
  INCOME_CEILING,
  RATE_MAX,
  RATE_MIN,
  RECOGNISED_COURSES,
  SCHEMES,
  type IScheme,
  type LoanPurpose,
  type SchemeId,
} from "./schemes";

export type ApplicantType = "individual" | "partnership" | "cooperative";

export interface IProfile {
  isSC: boolean;
  applicantType: ApplicantType;
  annualFamilyIncome: number;
  purpose: LoanPurpose;
  /** Free-text / selectable activity or course. */
  activity: string;
  estimatedCost: number;
  /** For education: is the activity a recognised course? */
  courseRecognised?: boolean;
  stateCode?: string;
}

export interface IRecommendation {
  scheme: IScheme;
  eligible: boolean;
  /** 0–100 composite fit. */
  fitScore: number;
  /** Sanctionable loan after the 90% LTV cap and hard loan cap. */
  loanAmount: number;
  ownContribution: number;
  reasons: string[];
  blockers: string[];
}

export interface IEngineResult {
  profile: IProfile;
  recommendations: IRecommendation[];
  /** Best eligible scheme, if any. */
  primary: IRecommendation | null;
  /** Populated when no scheme is eligible. */
  globalBlockers: string[];
  /** How each factor contributed to the top score (for the explainability UI). */
  scoreBreakdown: { label: string; weight: number; value: number }[];
}

const WEIGHTS = {
  costFit: 0.32,
  rateFit: 0.3,
  moratoriumFit: 0.18,
  purposeFit: 0.2,
} as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function loanFor(scheme: IScheme, cost: number): number {
  return Math.min(cost * scheme.ltv, scheme.maxLoan);
}

function costFit(scheme: IScheme, cost: number): number {
  const inBand = cost >= scheme.minCost && cost <= scheme.maxCost;
  if (!inBand) return cost < scheme.minCost ? 0.55 : 0;
  const span = Math.max(1, scheme.maxCost - scheme.minCost);
  // Prefer the lower end of the band (less leverage / less repayment risk).
  return 1 - 0.4 * ((cost - scheme.minCost) / span);
}

function rateFit(scheme: IScheme): number {
  return clamp01(1 - (scheme.beneficiaryRate - RATE_MIN) / (RATE_MAX - RATE_MIN));
}

function moratoriumFit(scheme: IScheme): number {
  return clamp01((scheme.moratoriumMonths - 3) / (12 - 3));
}

function purposeFit(scheme: IScheme, purpose: LoanPurpose): number {
  return scheme.purposes.includes(purpose) ? 1 : 0;
}

/**
 * Core matching function. Pure and synchronous — trivially unit-testable.
 */
export function recommend(profile: IProfile): IEngineResult {
  const recommendations: IRecommendation[] = [];
  const globalBlockers: string[] = [];

  if (!profile.isSC) {
    globalBlockers.push(
      "NSFDC schemes are only for applicants belonging to the Scheduled Caste community.",
    );
  }
  if (profile.annualFamilyIncome > INCOME_CEILING) {
    globalBlockers.push(
      `Annual family income exceeds the ₹5.00 lakh ceiling (entered: ₹${profile.annualFamilyIncome.toLocaleString("en-IN")}).`,
    );
  }
  if (profile.estimatedCost <= 0) {
    globalBlockers.push("Estimated project / course cost must be greater than zero.");
  }

  if (globalBlockers.length > 0) {
    return {
      profile,
      recommendations: [],
      primary: null,
      globalBlockers,
      scoreBreakdown: [],
    };
  }

  for (const scheme of SCHEMES) {
    const reasons: string[] = [];
    const blockers: string[] = [];

    const pFit = purposeFit(scheme, profile.purpose);
    const cFit = costFit(scheme, profile.estimatedCost);
    const rFit = rateFit(scheme);
    const mFit = moratoriumFit(scheme);
    const score = 100 * (WEIGHTS.costFit * cFit + WEIGHTS.rateFit * rFit + WEIGHTS.moratoriumFit * mFit + WEIGHTS.purposeFit * pFit);

    const loan = loanFor(scheme, profile.estimatedCost);
    const capped = profile.estimatedCost * scheme.ltv > scheme.maxLoan;

    // ---- explainability trails -------------------------------------------
    if (pFit === 0) {
      blockers.push(
        scheme.purposes.includes("education")
          ? "This is an education-only scheme; your request is for a business/enterprise unit."
          : "This scheme funds business/enterprise units; your request is for education.",
      );
    } else {
      reasons.push(
        `${scheme.nameEn} funds the ${profile.purpose === "education" ? "education" : "business/enterprise"} use-case you selected.`,
      );
    }

    if (profile.purpose === "business") {
      if (profile.estimatedCost <= scheme.maxCost && profile.estimatedCost >= scheme.minCost) {
        reasons.push(
          `Your project cost of ₹${profile.estimatedCost.toLocaleString("en-IN")} falls within the scheme band ₹${scheme.minCost.toLocaleString("en-IN")}–₹${scheme.maxCost.toLocaleString("en-IN")}.`,
        );
      } else {
        blockers.push(
          profile.estimatedCost > scheme.maxCost
            ? `Project cost exceeds the maximum ₹${scheme.maxCost.toLocaleString("en-IN")} for this scheme.`
            : `Project cost is below the minimum ₹${scheme.minCost.toLocaleString("en-IN")} for this scheme.`,
        );
      }
    } else if (profile.courseRecognised === false) {
      blockers.push("The course is not on NSFDC's list of recognised professional/technical courses.");
    }

    if (capped) {
      reasons.push(
        `Loan is capped at ₹${scheme.maxLoan.toLocaleString("en-IN")} (90% LTV / scheme ceiling), so your own contribution rises to ₹${(profile.estimatedCost - loan).toLocaleString("en-IN")}.`,
      );
    }

    reasons.push(
      `Interest rate ${scheme.beneficiaryRate}% p.a. is at the ${scheme.beneficiaryRate <= 8 ? "concessional" : "higher"} end of the 6.5%–15% range.`,
    );
    reasons.push(`Moratorium of ${scheme.moratoriumMonths} month(s) with repayment over ${Math.round(scheme.maxTenureMonths / 12)}+ year(s).`);

    const eligible = blockers.length === 0;

    recommendations.push({
      scheme,
      eligible,
      fitScore: eligible ? Math.round(score) : 0,
      loanAmount: Math.round(loan),
      ownContribution: Math.round(Math.max(0, profile.estimatedCost - loan)),
      reasons,
      blockers,
    });
  }

  recommendations.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return b.fitScore - a.fitScore;
  });

  const primary = recommendations.find((r) => r.eligible) ?? null;

  const scoreBreakdown =
    primary === null
      ? []
      : [
          { label: "Project-cost fit", weight: WEIGHTS.costFit, value: costFit(primary.scheme, profile.estimatedCost) },
          { label: "Interest-rate fit", weight: WEIGHTS.rateFit, value: rateFit(primary.scheme) },
          { label: "Moratorium benefit", weight: WEIGHTS.moratoriumFit, value: moratoriumFit(primary.scheme) },
          { label: "Purpose match", weight: WEIGHTS.purposeFit, value: purposeFit(primary.scheme, profile.purpose) },
        ];

  return { profile, recommendations, primary, globalBlockers, scoreBreakdown };
}

/** Display helper: the best loan a given scheme can offer for a cost. */
export function sanitiseCost(raw: number): number {
  if (!Number.isFinite(raw) || raw < 0) return 0;
  return Math.round(raw);
}

/** Recognised-course helper for the UI. */
export function isRecognisedCourse(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return false;
  return RECOGNISED_COURSES.some((c) => c.toLowerCase().includes(n) || n.includes(c.toLowerCase().split(" (")[0]));
}

export const ENGINE_SCHEME_ORDER: SchemeId[] = ["MFS", "TERM", "AAJEEVIKA", "UNY", "ELS"];
