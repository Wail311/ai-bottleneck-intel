import type { Metadata } from "next";
import Link from "next/link";
import { getAllCompanies } from "@/lib/data";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Companies — Copper Road",
  description: "Profiles of the companies at the centre of the AI supply-chain buildout.",
};

const exposureBadge: Record<string, { bg: string; text: string }> = {
  Direct:   { bg: "var(--crit-bg)",    text: "var(--crit-text)" },
  High:     { bg: "var(--tight-bg)",   text: "var(--tight-text)" },
  Moderate: { bg: "var(--eased-bg)",   text: "var(--eased-text)" },
  Watch:    { bg: "var(--neutral-bg)", text: "var(--neutral-text)" },
};

export default function CompaniesPage() {
  const companies = getAllCompanies();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />

      <header
        style={{
          borderBottom: "0.5px solid var(--border)",
          background: "var(--surface)",
          padding: "40px 24px 44px",
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 28,
              fontWeight: 500,
              color: "var(--text)",
              margin: "0 0 14px",
              lineHeight: 1.25,
            }}
          >
            Companies
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            The producers, toolmakers, and infrastructure suppliers at the centre of the AI buildout — each profiled against the chokepoints they touch.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 740, margin: "0 auto", padding: "32px 24px 64px", flex: 1, width: "100%" }}>

        <div style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-tertiary)" }}>
            {companies.length} companies — sorted A–Z
          </span>
          <div className="hairline" style={{ marginTop: 10 }} />
        </div>

        {companies.map((c) => (
          <Link key={c.slug} href={`/company/${c.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <article
              className="entry-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "0 32px",
                padding: "20px 0",
                borderBottom: "0.5px solid var(--border)",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  {c.ticker && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
                      {c.ticker}
                    </span>
                  )}
                  {c.type === "private" && (
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
                      Private
                    </span>
                  )}
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 17,
                    fontWeight: 500,
                    color: "var(--text)",
                    margin: "0 0 6px",
                    lineHeight: 1.3,
                  }}
                >
                  {c.name}
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "var(--text-secondary)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {c.exposure_summary}
                </p>
              </div>

              {/* Bottleneck count badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "var(--text)",
                  }}
                >
                  {c.bottlenecks.length}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.bottlenecks.length === 1 ? "bottleneck" : "bottlenecks"}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
