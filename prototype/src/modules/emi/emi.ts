/**
 * Loan amortisation engine for NSFDC-style concessional loans.
 *
 * Two moratorium models are supported and labelled explicitly in the UI:
 *
 *  - "interest-only": the borrower pays simple monthly interest during the
 *    moratorium and the principal stays flat. This mirrors how most channel
 *    partners service these loans.
 *  - "deferred": no payment during the moratorium; accrued interest is
 *    capitalised into the principal at the end of the moratorium.
 *
 * `tenureMonths` is the TOTAL repayment period and INCLUDES the moratorium,
 * matching the official phrasing ("repayable in 7 years including a 6-month
 * moratorium").
 */

export type MoratoriumMode = "interest-only" | "deferred";

export interface IEmiInput {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
  moratoriumMonths: number;
  mode: MoratoriumMode;
}

export interface IScheduleRow {
  month: number;
  opening: number;
  payment: number;
  interest: number;
  principal: number;
  closing: number;
}

export interface IYearRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

export interface IEmiResult {
  /** EMI once repayment begins (0 if no repayment period). */
  emi: number;
  /** Monthly outflow during the moratorium. */
  moratoriumPayment: number;
  /** Principal actually amortised after any capitalisation. */
  effectivePrincipal: number;
  totalInterest: number;
  totalPayable: number;
  schedule: IScheduleRow[];
  yearly: IYearRow[];
}

/** Standard reducing-balance EMI. */
export function emiFor(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const f = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * f) / (f - 1);
}

export function computeEmi(input: IEmiInput): IEmiResult {
  const P = Math.max(0, input.principal);
  const r = Math.max(0, input.annualRatePct) / 12 / 100;
  const T = Math.max(0, Math.floor(input.tenureMonths));
  const m = Math.min(Math.max(0, Math.floor(input.moratoriumMonths)), T);
  const n = T - m; // number of amortising months

  const schedule: IScheduleRow[] = [];
  let totalInterest = 0;

  let moratoriumPayment = 0;
  let effectivePrincipal = P;
  let emi = 0;

  if (input.mode === "interest-only") {
    moratoriumPayment = P * r;
    let balance = P;
    for (let k = 1; k <= m; k++) {
      const interest = balance * r;
      totalInterest += interest;
      schedule.push({
        month: k,
        opening: balance,
        payment: interest,
        interest,
        principal: 0,
        closing: balance,
      });
    }
    emi = emiFor(P, r, n);
    let opening = P;
    for (let k = m + 1; k <= T; k++) {
      const interest = opening * r;
      const principal = Math.min(emi - interest, opening);
      const closing = Math.max(0, opening - principal);
      totalInterest += interest;
      schedule.push({ month: k, opening, payment: emi, interest, principal, closing });
      opening = closing;
    }
  } else {
    // deferred: capitalise at end of moratorium
    let balance = P;
    for (let k = 1; k <= m; k++) {
      const interest = balance * r;
      balance += interest;
      totalInterest += interest;
      schedule.push({ month: k, opening: balance - interest, payment: 0, interest, principal: 0, closing: balance });
    }
    effectivePrincipal = balance;
    emi = emiFor(effectivePrincipal, r, n);
    let opening = effectivePrincipal;
    for (let k = m + 1; k <= T; k++) {
      const interest = opening * r;
      const principal = Math.min(emi - interest, opening);
      const closing = Math.max(0, opening - principal);
      totalInterest += interest;
      schedule.push({ month: k, opening, payment: emi, interest, principal, closing });
      opening = closing;
    }
  }

  // Aggregate to yearly rows for the chart.
  const yearly: IYearRow[] = [];
  for (const row of schedule) {
    const year = Math.ceil(row.month / 12);
    let y = yearly.find((x) => x.year === year);
    if (!y) {
      y = { year, principalPaid: 0, interestPaid: 0, totalPaid: 0, closingBalance: row.closing };
      yearly.push(y);
    }
    y.principalPaid += row.principal;
    y.interestPaid += row.interest;
    y.totalPaid += row.payment;
    y.closingBalance = row.closing;
  }

  return {
    emi,
    moratoriumPayment,
    effectivePrincipal,
    totalInterest,
    totalPayable: P + totalInterest,
    schedule,
    yearly,
  };
}
