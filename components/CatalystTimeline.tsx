import { Catalyst } from "@/types/bottleneck";

interface CatalystTimelineProps {
  catalysts: Catalyst[];
}

export default function CatalystTimeline({ catalysts }: CatalystTimelineProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {catalysts.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            padding: "12px 0",
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 400,
              background: "var(--tight-bg)",
              color: "var(--tight-text)",
              padding: "3px 10px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {c.timeframe}
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--text)",
              lineHeight: 1.6,
            }}
          >
            {c.text}
          </span>
        </div>
      ))}
    </div>
  );
}
