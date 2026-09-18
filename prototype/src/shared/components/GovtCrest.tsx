/**
 * A generic, original government-style crest.
 * This is NOT the State Emblem of India and makes no claim to be one — it is a
 * neutral spoke-wheel mark used purely for visual framing in this prototype.
 */
export function GovtCrest({ size = 40 }: { size?: number }) {
  const spokes = Array.from({ length: 12 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Prototype government crest"
      className="crest"
    >
      <defs>
        <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb066" />
          <stop offset="100%" stopColor="#f47920" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="none" stroke="url(#crestGrad)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      {spokes.map((_, i) => {
        const a = (i / spokes.length) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 6}
            y1={32 + Math.sin(a) * 6}
            x2={32 + Math.cos(a) * 21}
            y2={32 + Math.sin(a) * 21}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      })}
      <circle cx="32" cy="32" r="5.4" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
