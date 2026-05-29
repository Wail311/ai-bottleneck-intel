"use client";
import { useEffect, useState } from "react";

type GaugeInputs = {
  coverage: number;
  leadTime: number;
  concentration: number;
  momentum: number;
};

export type TightnessGaugeProps = {
  score: number; // 0–100
  band: "eased" | "tight" | "critical";
  rationale?: string;
  delta90d?: number;
  inputs?: GaugeInputs; // optional weighted sub-score breakdown
};

// Semicircle geometry: arc sweeps left (frac 0) over the top to right (frac 1).
const CX = 110;
const CY = 110;
const R = 90;
const MONO = "var(--font-mono, 'Geist Mono', ui-monospace, monospace)";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function polar(frac: number, radius = R) {
  const a = Math.PI * (1 - clamp01(frac));
  return { x: CX + radius * Math.cos(a), y: CY - radius * Math.sin(a) };
}

function arc(f0: number, f1: number) {
  const a = polar(f0);
  const b = polar(f1);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

const BAND = {
  eased: { label: "Eased", bg: "var(--eased-bg)", text: "var(--eased-text)" },
  tight: { label: "Tight", bg: "var(--tight-bg)", text: "var(--tight-text)" },
  critical: { label: "Critical", bg: "var(--crit-bg)", text: "var(--crit-text)" },
} as const;

const SUBS: { key: keyof GaugeInputs; label: string; weight: string }[] = [
  { key: "coverage", label: "Coverage", weight: "35%" },
  { key: "leadTime", label: "Lead time", weight: "25%" },
  { key: "concentration", label: "Concentration", weight: "20%" },
  { key: "momentum", label: "Momentum", weight: "20%" },
];

export default function TightnessGauge({
  score,
  band,
  rationale,
  delta90d,
  inputs,
}: TightnessGaugeProps) {
  // Needle is a vertical line rotated about the hub. frac 0.5 -> 0deg (up).
  const target = (clamp01(score / 100) - 0.5) * 180;
  const [angle, setAngle] = useState(-90); // start at score 0 (points left), then sweep
  useEffect(() => {
    const id = requestAnimationFrame(() => setAngle(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const b = BAND[band];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <svg
          viewBox="0 0 220 132"
          width="200"
          height="120"
          role="img"
          aria-label={`Tightness ${Math.round(score)} of 100, ${b.label}`}
        >
          <path d={arc(0, 0.4)} fill="none" stroke="#639922" strokeWidth={11} strokeLinecap="round" />
          <path d={arc(0.4, 0.7)} fill="none" stroke="#EF9F27" strokeWidth={11} />
          <path d={arc(0.7, 1)} fill="none" stroke="#E24B4A" strokeWidth={11} strokeLinecap="round" />
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transformBox: "view-box",
              transition: "transform 0.6s ease-out",
            }}
          >
            <line x1={CX} y1={CY} x2={CX} y2={CY - R * 0.82} stroke="#8C8B83" strokeWidth={4} strokeLinecap="round" />
          </g>
          <circle cx={CX} cy={CY} r={5.5} fill="#8C8B83" />
        </svg>

        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 4px" }}>Tightness</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 46, fontWeight: 600, lineHeight: 1, color: "var(--text)" }}>
              {Math.round(score)}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 16, color: "var(--text-tertiary)" }}>/ 100</span>
            <span style={{ marginLeft: 4, fontSize: 12, padding: "4px 11px", borderRadius: 8, background: b.bg, color: b.text }}>
              {b.label}
            </span>
          </div>
          {rationale && (
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "10px 0 0", lineHeight: 1.6 }}>
              {typeof delta90d === "number" && delta90d !== 0 && (
                <span style={{ fontFamily: MONO, color: "var(--text)" }}>
                  {delta90d > 0 ? "+" : ""}
                  {delta90d} this quarter —{" "}
                </span>
              )}
              {rationale}
            </p>
          )}
        </div>
      </div>

      {inputs && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {SUBS.map(({ key, label, weight }) => {
            const v = inputs[key];
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{weight}</span>
                </div>
                <div style={{ margin: "3px 0 6px" }}>
                  <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 500, color: "var(--text)" }}>
                    {Math.round(v)}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "var(--surface-muted)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${clamp01(v / 100) * 100}%`, background: "var(--accent)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
