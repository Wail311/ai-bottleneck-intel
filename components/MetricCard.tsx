import { Metric } from "@/types/bottleneck";

interface MetricCardProps {
  label: string;
  metric: Metric;
}

export default function MetricCard({ label, metric }: MetricCardProps) {
  return (
    <div
      style={{
        background: "var(--surface-muted)",
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 24,
            fontWeight: 600,
            color: "var(--text)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {metric.value}
        </span>
        {metric.unit && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>
            {metric.unit}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 6px", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
          as of {metric.as_of}
        </span>
        <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>·</span>
        {metric.url ? (
          <a
            href={metric.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--accent)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            {metric.source}
          </a>
        ) : (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
            {metric.source}
          </span>
        )}
      </div>
    </div>
  );
}
