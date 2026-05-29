import { WatchlistEntry } from "@/types/bottleneck";

function exposureStyle(e: WatchlistEntry["exposure"]): React.CSSProperties {
  if (e === "Direct")
    return { background: "var(--crit-bg)", color: "var(--crit-text)" };
  if (e === "High")
    return { background: "var(--tight-bg)", color: "var(--tight-text)" };
  if (e === "Moderate")
    return { background: "var(--neutral-bg)", color: "var(--neutral-text)" };
  // Watch
  return { background: "var(--surface-muted)", color: "var(--text-tertiary)" };
}

interface WatchlistProps {
  entries: WatchlistEntry[];
}

export default function Watchlist({ entries }: WatchlistProps) {
  return (
    <div style={{ width: "100%" }}>
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr auto",
          gap: "0 24px",
          paddingBottom: 8,
          borderBottom: "0.5px solid var(--border)",
          marginBottom: 0,
        }}
      >
        {["Company", "Role", "Exposure"].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-tertiary)",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {entries.map((entry, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr auto",
            gap: "0 24px",
            padding: "12px 0",
            borderBottom: "0.5px solid var(--border)",
            alignItems: "center",
          }}
        >
          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              {entry.name}
            </span>
            {entry.ticker && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                }}
              >
                {entry.ticker}
              </span>
            )}
            {entry.type === "private" && (
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                }}
              >
                Private
              </span>
            )}
          </div>

          {/* Role */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            {entry.role}
          </span>

          {/* Exposure badge */}
          <span
            style={{
              ...exposureStyle(entry.exposure),
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {entry.exposure}
          </span>
        </div>
      ))}
    </div>
  );
}
