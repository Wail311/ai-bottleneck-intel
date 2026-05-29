import { Bottleneck } from "@/types/bottleneck";
import { bandLabel } from "@/lib/gauge";
import { bandVars } from "@/lib/bandTokens";
import TightnessGauge from "./TightnessGauge";
import MetricCard from "./MetricCard";
import Watchlist from "./Watchlist";
import CatalystTimeline from "./CatalystTimeline";
import DevelopmentsFeed from "./DevelopmentsFeed";
import LinkedBottlenecks from "./LinkedBottlenecks";
import SectionHeader from "./SectionHeader";
import Link from "next/link";

interface BottleneckPageProps {
  bottleneck: Bottleneck;
}

const section: React.CSSProperties = { marginBottom: "2.25rem" };

const prose: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  lineHeight: 1.7,
  color: "var(--text)",
  margin: 0,
};

export default function BottleneckPage({ bottleneck: b }: BottleneckPageProps) {
  const { bg: bandBg, text: bandText } = bandVars(b.gauge.band);
  const label = bandLabel(b.gauge.band);

  const updatedDate = new Date(b.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          borderBottom: "0.5px solid var(--border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface)",
        }}
      >
        <Link
          href="/"
          className="nav-back"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          ← All bottlenecks
        </Link>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-tertiary)",
          }}
        >
          AI Infrastructure Intelligence
        </span>
      </nav>

      {/* ── Reading column ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "2.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 10px",
              }}
            >
              {b.layer}
            </span>
            <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
              Updated {updatedDate}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.25,
              color: "var(--text)",
              margin: "0 0 14px",
            }}
          >
            {b.name}
          </h1>

          {/* Thesis in serif italic */}
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {b.thesis}
          </p>
        </div>

        {/* ── Gauge hero ─────────────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface)",
            border: "0.5px solid var(--border)",
            borderRadius: 8,
            padding: "32px 24px",
            marginBottom: "2.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, alignSelf: "flex-start" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
              Tightness gauge
            </span>
            <span
              style={{
                background: bandBg,
                color: bandText,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                padding: "2px 10px",
                borderRadius: 4,
              }}
            >
              {label}
            </span>
          </div>
          <TightnessGauge
            score={b.gauge.score}
            band={b.gauge.band}
            rationale={b.gauge.rationale}
            delta90d={b.gauge.delta_90d}
            inputs={b.gauge.inputs}
          />
        </div>

        {/* ── 4 Metric cards ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginBottom: "2.25rem",
          }}
        >
          {b.metrics.map((m, i) => (
            <MetricCard key={i} label={m.label} metric={m.metric} />
          ))}
        </div>

        {/* ── Why it gates ───────────────────────────────────────────────── */}
        <section style={section}>
          <SectionHeader title="Why it gates the buildout" />
          <p style={prose}>{b.why_it_gates}</p>
        </section>

        {/* ── Who's exposed ──────────────────────────────────────────────── */}
        <section style={section}>
          <SectionHeader title="Who's exposed" />
          <Watchlist entries={b.watchlist} />
        </section>

        {/* ── Catalysts ──────────────────────────────────────────────────── */}
        <section style={section}>
          <SectionHeader title="Catalysts & timeline" />
          <CatalystTimeline catalysts={b.catalysts} />
        </section>

        {/* ── What would loosen it ───────────────────────────────────────── */}
        <section style={section}>
          <SectionHeader title="What would loosen it" />
          <p style={prose}>{b.what_loosens_it}</p>
        </section>

        {/* ── Developments ───────────────────────────────────────────────── */}
        <section style={section}>
          <SectionHeader title="Latest developments" />
          <DevelopmentsFeed developments={b.developments} />
        </section>

        {/* ── Linked ─────────────────────────────────────────────────────── */}
        {b.linked.length > 0 && (
          <section style={section}>
            <SectionHeader title="Linked bottlenecks" />
            <LinkedBottlenecks slugs={b.linked} />
          </section>
        )}
      </div>
    </div>
  );
}
