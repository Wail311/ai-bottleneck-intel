import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Methodology — Copper Road",
  description:
    "How the Tightness Gauge works: a 0–100 score built from coverage, lead time, concentration, and momentum, sourced entirely from public data.",
};

const section: React.CSSProperties = { marginBottom: "2.5rem" };

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 20,
  fontWeight: 500,
  color: "var(--text)",
  margin: "0 0 12px",
  lineHeight: 1.3,
};

const prose: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  lineHeight: 1.75,
  color: "var(--text)",
  margin: 0,
};

const secondaryProse: React.CSSProperties = {
  ...prose,
  color: "var(--text-secondary)",
};

export default function MethodologyPage() {
  const inputs = [
    {
      name: "Coverage",
      weight: "35%",
      desc: "How well current and announced supply covers demand. This carries the most weight, because a real shortfall between what exists and what is needed is the clearest sign of a binding constraint.",
    },
    {
      name: "Lead time",
      weight: "25%",
      desc: "How long it takes to add new supply or take delivery, from order to operation. Long lead times mean a shortage cannot be fixed quickly even when everyone wants it fixed.",
    },
    {
      name: "Concentration",
      weight: "20%",
      desc: "How few suppliers, regions, or facilities control output. The more concentrated the source, the more fragile the supply.",
    },
    {
      name: "Momentum",
      weight: "20%",
      desc: "The direction of travel over the last 90 days, read from dated developments. A constraint that is tightening scores higher than one holding steady.",
    },
  ];

  const bands = [
    {
      label: "Critical",
      range: "70 and above",
      desc: "Supply is a hard limit on the pace of the buildout.",
      bg: "var(--crit-bg)",
      text: "var(--crit-text)",
    },
    {
      label: "Tight",
      range: "40 to 69",
      desc: "Supply is strained and worth watching, though not yet the binding constraint.",
      bg: "var(--tight-bg)",
      text: "var(--tight-text)",
    },
    {
      label: "Eased",
      range: "Below 40",
      desc: "Supply is keeping up, or relief is arriving.",
      bg: "var(--eased-bg)",
      text: "var(--eased-text)",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />

      <main style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px 64px", flex: 1, width: "100%" }}>

        {/* ── Title ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
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
            How the Tightness Gauge works
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
            Every bottleneck on Copper Road carries one number: the Tightness
            Gauge, a 0 to 100 score for how constrained that part of the AI supply
            chain is right now. A higher score means supply is struggling to keep up
            with demand. A lower score means the pressure is easing.
          </p>
        </div>

        <div className="hairline" style={{ marginBottom: "2.5rem" }} />

        {/* ── Purpose ───────────────────────────────────────────────────── */}
        <section style={section}>
          <p style={prose}>
            The gauge exists so you can compare very different chokepoints — from
            HBM memory to gas turbines — on a single consistent scale, and so you
            can watch each one move over time.
          </p>
        </section>

        {/* ── Inputs ────────────────────────────────────────────────────── */}
        <section style={section}>
          <h2 style={h2Style}>What goes into the score</h2>
          <p style={{ ...secondaryProse, marginBottom: 20 }}>
            The score combines four inputs, each rated from 0 to 100, then
            weighted. The weighted total produces the headline score.
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {inputs.map((inp, i) => (
              <div
                key={inp.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "0 24px",
                  padding: "16px 0",
                  borderTop: i === 0 ? "0.5px solid var(--border)" : undefined,
                  borderBottom: "0.5px solid var(--border)",
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--text)",
                      marginBottom: 2,
                    }}
                  >
                    {inp.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {inp.weight}
                  </div>
                </div>
                <p style={{ ...secondaryProse, fontSize: 15, lineHeight: 1.65 }}>
                  {inp.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bands ─────────────────────────────────────────────────────── */}
        <section style={section}>
          <h2 style={h2Style}>The three bands</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bands.map((band) => (
              <div
                key={band.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "14px 16px",
                  background: band.bg,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 80 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: band.text,
                    }}
                  >
                    {band.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: band.text,
                      opacity: 0.75,
                    }}
                  >
                    {band.range}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: band.text,
                    margin: 0,
                    opacity: 0.9,
                  }}
                >
                  {band.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sourcing ──────────────────────────────────────────────────── */}
        <section style={section}>
          <h2 style={h2Style}>The sourcing standard</h2>
          <p style={{ ...secondaryProse, marginBottom: 12 }}>
            Every figure on Copper Road carries three things: the value, the date
            it was true as of, and a link to the source. If a number cannot be
            sourced, it does not go on the page.
          </p>
          <p style={secondaryProse}>
            The gauge is only as good as the data behind it, so we hold the data
            to that one rule and show the working on every claim.
          </p>
        </section>

        <div className="hairline" style={{ marginBottom: "2.5rem" }} />

        {/* ── Disclaimer ────────────────────────────────────────────────── */}
        <section style={section} id="disclaimer">
          <h2 style={h2Style}>What Copper Road is</h2>
          <p style={secondaryProse}>
            Copper Road is a research and journalism publication about the AI
            supply chain. It reports on companies, technologies, and market
            conditions for information and education. Nothing here is investment
            advice, a recommendation, or an offer to buy or sell any security.
            Always do your own research and speak to a licensed professional before
            making financial decisions.
          </p>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
