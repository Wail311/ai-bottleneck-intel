// UI-layer helpers for design-system color tokens.
// Keeps gauge.ts (logic) untouched.

export type Band = "eased" | "tight" | "critical";

export function bandVars(band: Band) {
  if (band === "critical")
    return { bg: "var(--crit-bg)", text: "var(--crit-text)" };
  if (band === "tight")
    return { bg: "var(--tight-bg)", text: "var(--tight-text)" };
  return { bg: "var(--eased-bg)", text: "var(--eased-text)" };
}

export function bandArcColor(band: Band) {
  // Saturated arc colors, readable on both --surface-muted and --bg
  if (band === "critical") return "#C23B3B";
  if (band === "tight") return "#C07800";
  return "#3E9A38";
}

export function subBand(score: number): Band {
  if (score >= 70) return "critical";
  if (score >= 40) return "tight";
  return "eased";
}
