import Link from "next/link";
import { getAllBottlenecks } from "@/lib/data";
import { bandLabel } from "@/lib/gauge";
import { bandVars, subBand } from "@/lib/bandTokens";

export default function HomePage() {
  const bottlenecks = getAllBottlenecks();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Masthead ────────────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "0.5px solid var(--border)",
          background: "var(--surface)",
          padding: "20px 32px",
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-tertiary)",
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          >
            AI Infrastructure Intelligence
          </p>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--text)",
              margin: "0 0 10px",
            }}
          >
            Supply-chain bottleneck tracker
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            The AI buildout has discrete physical chokepoints. Each entry tracks
            tightness, who&apos;s exposed, and what would change the thesis.
          </p>
        </div>
      </header>

      {/* ── Index ───────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 740, margin: "0 auto", padding: "32px 24px 80px" }}>

        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-tertiary)",
            }}
          >
            {bottlenecks.length} bottlenecks — sorted by tightness
          </span>
          <div className="hairline" style={{ marginTop: 10 }} />
        </div>

        {bottlenecks.map((b) => {
          const { bg: bandBg, text: bandText } = bandVars(b.gauge.band);
          const label = bandLabel(b.gauge.band);
          const updatedDate = new Date(b.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Link
              key={b.slug}
              href={`/b/${b.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <article
                className="entry-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0 32px",
                  padding: "24px 0",
                  borderBottom: "0.5px solid var(--border)",
                  alignItems: "start",
                }}
              >
                {/* Left: meta + name + thesis + mini bars */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-tertiary)",
                        border: "1px solid var(--border)",
                        borderRadius: 4,
                        padding: "1px 8px",
                      }}
                    >
                      {b.layer}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {updatedDate}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "var(--text)",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {b.name}
                  </h2>

                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 15,
                      fontStyle: "italic",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      margin: "0 0 14px",
                    }}
                  >
                    {b.thesis}
                  </p>

                  {/* Mini sub-score bars */}
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    {(
                      [
                        ["Coverage", b.gauge.inputs.coverage],
                        ["Lead time", b.gauge.inputs.leadTime],
                        ["Conc.", b.gauge.inputs.concentration],
                        ["Momentum", b.gauge.inputs.momentum],
                      ] as [string, number][]
                    ).map(([k, v]) => {
                      const sb = subBand(v);
                      const arcColor =
                        sb === "critical" ? "var(--arc-critical)" :
                        sb === "tight"    ? "var(--arc-tight)" :
                                            "var(--arc-eased)";
                      return (
                        <div key={k} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div
                            style={{
                              height: 3,
                              background: "var(--arc-track)",
                              borderRadius: 2,
                              overflow: "hidden",
                              width: 48,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${v}%`,
                                background: arcColor,
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10,
                              color: "var(--text-tertiary)",
                            }}
                          >
                            {k}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: score + band */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                    paddingTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 36,
                      fontWeight: 600,
                      lineHeight: 1,
                      color: "var(--text)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {b.gauge.score}
                  </span>
                  <span
                    style={{
                      background: bandBg,
                      color: bandText,
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 4,
                    }}
                  >
                    {label}
                  </span>
                  {b.gauge.delta_90d !== undefined && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {b.gauge.delta_90d > 0 ? "+" : ""}{b.gauge.delta_90d} 90d
                    </span>
                  )}
                </div>
              </article>
            </Link>
          );
        })}

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-tertiary)",
            textAlign: "center",
            marginTop: 48,
            lineHeight: 1.6,
          }}
        >
          All data manually curated. Every metric shows its as-of date and source.
          Not investment advice.
        </p>
      </main>
    </div>
  );
}
