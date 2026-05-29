import { GaugeInputs } from "@/types/bottleneck";

const WEIGHTS = {
  coverage: 0.35,
  leadTime: 0.25,
  concentration: 0.2,
  momentum: 0.2,
};

export function computeGauge(i: GaugeInputs) {
  const score = Math.round(
    i.coverage * WEIGHTS.coverage +
      i.leadTime * WEIGHTS.leadTime +
      i.concentration * WEIGHTS.concentration +
      i.momentum * WEIGHTS.momentum
  );
  const band: "eased" | "tight" | "critical" =
    score >= 70 ? "critical" : score >= 40 ? "tight" : "eased";
  return { score, band };
}

export function coverageScore(supplyOverDemand: number) {
  if (supplyOverDemand >= 1.0) return 10;
  if (supplyOverDemand >= 0.9) return 30;
  if (supplyOverDemand >= 0.8) return 50;
  if (supplyOverDemand >= 0.7) return 70;
  return 90;
}

export function leadTimeScore(weeks: number) {
  if (weeks < 8) return 10;
  if (weeks < 16) return 30;
  if (weeks < 26) return 50;
  if (weeks < 40) return 70;
  return 90;
}

export function concentrationScore(topSupplierSharePct: number) {
  if (topSupplierSharePct < 40) return 15;
  if (topSupplierSharePct < 60) return 40;
  if (topSupplierSharePct < 80) return 65;
  return 88;
}

export function bandColor(band: "eased" | "tight" | "critical"): string {
  if (band === "critical") return "#ef4444";
  if (band === "tight") return "#f59e0b";
  return "#22c55e";
}

export function bandLabel(band: "eased" | "tight" | "critical"): string {
  if (band === "critical") return "Critical";
  if (band === "tight") return "Tight";
  return "Eased";
}
