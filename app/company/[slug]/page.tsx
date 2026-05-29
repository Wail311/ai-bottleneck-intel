import { notFound } from "next/navigation";
import { getCompany, getAllCompanySlugs, getBottleneck } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import NewsletterCTA from "@/components/NewsletterCTA";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompany(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `${c.name} — Copper Road`,
    description: c.exposure_summary,
  };
}

const exposureBadge: Record<string, { bg: string; text: string }> = {
  Direct:   { bg: "var(--crit-bg)",   text: "var(--crit-text)" },
  High:     { bg: "var(--tight-bg)",  text: "var(--tight-text)" },
  Moderate: { bg: "var(--eased-bg)",  text: "var(--eased-text)" },
  Watch:    { bg: "var(--neutral-bg)", text: "var(--neutral-text)" },
};

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const c = getCompany(slug);
  if (!c) notFound();

  const prose: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 17,
    lineHeight: 1.75,
    color: "var(--text)",
    margin: "0 0 1.1rem",
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav back={{ href: "/", label: "All bottlenecks" }} />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px 72px", flex: 1, width: "100%" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-tertiary)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 10px",
              }}
            >
              Company
            </span>
            {c.ticker && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
                {c.ticker}
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 32,
              fontWeight: 500,
              color: "var(--text)",
              margin: "0 0 18px",
              lineHeight: 1.2,
            }}
          >
            {c.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {c.exposure_summary}
          </p>
        </div>

        <div className="hairline" style={{ marginBottom: "2rem" }} />

        {/* ── Profile body ── */}
        <article>
          {c.profile.split("\n\n").map((para, i) => (
            <p key={i} style={prose}>{para}</p>
          ))}
        </article>

        {/* ── Linked bottlenecks ── */}
        {c.bottlenecks.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <div className="hairline" style={{ marginBottom: "1.5rem" }} />
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 12,
              }}
            >
              Bottlenecks
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.bottlenecks.map((bslug) => {
                const b = getBottleneck(bslug);
                const roles = (c as any).roles as Array<{ bottleneck: string; exposure: string }> | undefined;
                const exposure = roles?.find((r) => r.bottleneck === bslug)?.exposure ?? "";
                const colors = exposureBadge[exposure] ?? exposureBadge["Watch"];
                if (!b) return null;
                return (
                  <Link
                    key={bslug}
                    href={`/b/${bslug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 500,
                        background: colors.bg,
                        color: colors.text,
                        borderRadius: 4,
                        padding: "4px 10px",
                      }}
                    >
                      {b.name}
                      {exposure && (
                        <span style={{ opacity: 0.7, fontWeight: 400, fontSize: 11 }}>
                          {exposure}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Newsletter ── */}
        <div style={{ marginTop: "2.5rem" }}>
          <NewsletterCTA />
        </div>

        {/* ── Sources ── */}
        {c.sources.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <div className="hairline" style={{ marginBottom: "1.5rem" }} />
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 12,
              }}
            >
              Sources
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {c.sources.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-tertiary)", minWidth: 60 }}>
                    {s.as_of}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {s.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}
