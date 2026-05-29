import { Development } from "@/types/bottleneck";

interface DevelopmentsFeedProps {
  developments: Development[];
}

export default function DevelopmentsFeed({ developments }: DevelopmentsFeedProps) {
  const sorted = [...developments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {sorted.map((dev, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 24,
            padding: "14px 0",
            borderBottom: "0.5px solid var(--border)",
            alignItems: "flex-start",
          }}
        >
          {/* Date */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-tertiary)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontVariantNumeric: "tabular-nums",
              paddingTop: 2,
              minWidth: 80,
            }}
          >
            {dev.date}
          </span>

          {/* Text + source */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                color: "var(--text)",
                lineHeight: 1.6,
              }}
            >
              {dev.text}
            </span>
            {dev.source && (
              <div>
                {dev.url ? (
                  <a
                    href={dev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--accent)",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    {dev.source}
                  </a>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {dev.source}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
