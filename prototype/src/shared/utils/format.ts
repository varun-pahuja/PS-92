/** Indian-format number & currency helpers. */

export function inr(n: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(n)) return "₹0";
  if (opts.compact) {
    if (Math.abs(n) >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (Math.abs(n) >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    if (Math.abs(n) >= 1_000) return `₹${(n / 1_000).toFixed(1)} K`;
  }
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function intFmt(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function monthsLabel(m: number, monthsWord: string): string {
  return `${m} ${monthsWord}`;
}
