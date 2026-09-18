import type { IYearRow } from "./emi";
import { inr } from "../../shared/utils/format";

/**
 * Stacked year-wise principal-vs-interest bar chart, hand-rolled in SVG.
 * No charting dependency — keeps the bundle small and renders identically
 * offline (a real consideration for the rural/low-bandwidth target user).
 */
export function AmortChart({
  yearly,
  principalLabel,
  interestLabel,
}: {
  yearly: IYearRow[];
  principalLabel: string;
  interestLabel: string;
}) {
  const rows = yearly.filter((y) => y.totalPaid > 0);
  if (rows.length === 0) return null;

  const W = 720;
  const H = 260;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 34;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const max = Math.max(...rows.map((y) => y.totalPaid), 1);
  const slot = innerW / rows.length;
  const barW = Math.min(64, slot * 0.62);

  return (
    <figure className="chart">
      <div className="chart__legend">
        <span>
          <i className="swatch swatch--p" /> {principalLabel}
        </span>
        <span>
          <i className="swatch swatch--i" /> {interestLabel}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Principal versus interest by year">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padL}
            x2={W - padR}
            y1={padT + innerH * g}
            y2={padT + innerH * g}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
        {rows.map((y, i) => {
          const cx = padL + slot * i + slot / 2;
          const pH = (y.principalPaid / max) * innerH;
          const iH = (y.interestPaid / max) * innerH;
          const x = cx - barW / 2;
          return (
            <g key={y.year}>
              <rect x={x} y={padT + innerH - pH} width={barW} height={pH} rx="4" fill="var(--navy)" />
              <rect
                x={x}
                y={padT + innerH - pH - iH}
                width={barW}
                height={iH}
                rx="4"
                fill="var(--saffron)"
              />
              <text x={cx} y={H - 16} textAnchor="middle" className="chart__tick">
                Y{y.year}
              </text>
              <text x={cx} y={padT + innerH - pH - iH - 6} textAnchor="middle" className="chart__val">
                {inr(y.totalPaid, { compact: true })}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
