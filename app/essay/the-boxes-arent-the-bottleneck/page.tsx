import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "The boxes aren't the bottleneck — Copper Road",
  description:
    "Every forecast for the AI buildout is written in GPUs. It's the wrong unit. A GPU is the easy part now.",
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 20,
  fontWeight: 500,
  color: "var(--text)",
  margin: "2.25rem 0 0.75rem",
  lineHeight: 1.3,
};

const p: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 17,
  lineHeight: 1.75,
  color: "var(--text)",
  margin: "0 0 1.1rem",
};

export default function LaunchEssayPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px 72px", flex: 1, width: "100%" }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
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
              Essay
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
              May 29, 2026
            </span>
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
            The boxes aren't the bottleneck
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
            Every forecast for the AI buildout is written in GPUs. How many
            Blackwells ship, how many Rubins follow, how big the next cluster gets.
            It's the wrong unit.
          </p>
        </div>

        <div className="hairline" style={{ marginBottom: "2rem" }} />

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <article>

          <p style={p}>
            A GPU is the easy part now. The hard part is everything that has to
            exist around it before a single accelerator does useful work, and most
            of that is in short supply.
          </p>

          <p style={p}>
            Copper Road exists to track that other layer: the packaging, the
            memory, the power, the cooling, the raw materials, and the equipment
            that builds the equipment. We score each chokepoint on a single 0 to
            100 scale we call the Tightness Gauge, sourced entirely from public
            data, and we watch it move. Here is the picture on day one.
          </p>

          <h2 style={h2}>The squeeze is upstream of the chip</h2>

          <p style={p}>
            Start with the thing a finished accelerator literally cannot exist
            without: advanced packaging. TSMC's CoWoS is how logic and
            high-bandwidth memory get fused into one package, and demand has run
            ahead of capacity for two years straight. The interposer at the center
            of it is capped by the lithography reticle, so as packages grow past
            3.3 times reticle size, a single wafer yields only a handful of usable
            units. TSMC's own fix, a shift to panel-level packaging, is not
            scheduled for volume until 2028 or 2029. That is a long time to wait
            when the constraint binds today.
          </p>

          <p style={p}>
            Memory tells the same story from a different angle. SK Hynix said its
            capacity was essentially sold out for 2026 back in October. Makers are
            pouring wafers into HBM because the margins are several times higher
            than conventional DRAM, and the result is a server-memory shortage that
            Goldman Sachs has called the worst undersupply in more than fifteen
            years, with contract prices climbing more than 60 percent in a single
            quarter. New fabs do not produce meaningful bits until late 2027 at the
            earliest. You cannot buy your way out of this one quickly, and everyone
            building a cluster is bidding for the same supply.
          </p>

          <p style={p}>
            And underneath all of it sits one company most investors never think
            about. Every leading-edge chip and every advanced memory die is
            patterned on an extreme ultraviolet lithography machine, and exactly
            one firm on earth builds them. ASML closed 2025 with a record order
            book larger than a full year of sales, EUV systems carry lead times
            beyond twelve months, and Canon and Nikon left the technology more than
            a decade ago. ASML's annual build rate is, in a real sense, the speed
            limit on the entire frontier.
          </p>

          <h2 style={h2}>Then there is the power</h2>

          <p style={p}>
            Here is the part the chip-centric forecasts miss entirely. You can have
            every wafer, every HBM stack, and every package you want, and none of
            it computes without electricity delivered to the rack.
          </p>

          <p style={p}>
            The grid is the first wall. Interconnection queues in the United States
            stretch past four years, gigawatts of capacity sit waiting to connect,
            and the timelines do not bend to quarterly demand. The hardware that
            moves that power is its own crisis. Large power transformers now carry
            lead times of four to five years, with demand up sharply against a
            supply base of only a few serious manufacturers. Gas turbines, the
            bridge a lot of operators are reaching for, are sold out at the major
            makers well into the end of the decade. None of these are technology
            problems. They are heavy-industry problems, and heavy industry does not
            scale on a software timeline.
          </p>

          <p style={p}>
            This is why we treat power as a first-class part of the compute story
            rather than a footnote. On our gauge, transformers and gas turbines sit
            at the very top of the tightness ranking, above the chips.
          </p>

          <h2 style={h2}>Why a gauge, and why sourced</h2>

          <p style={p}>
            Two principles run through everything here.
          </p>

          <p style={p}>
            The first is that constraints are comparable. HBM memory and a 500-ton
            transformer have nothing in common physically, but both can be the
            thing that stops a data center from coming online, and both can be
            scored on the same axes: how badly supply trails demand, how long new
            supply takes to arrive, how concentrated the producers are, and which
            way the last 90 days have moved. That is what the Tightness Gauge
            measures, and it is what lets you rank a whole supply chain on one
            page.
          </p>

          <p style={p}>
            The second is that every number earns its place. Each figure on the
            site carries its value, the date it was true as of, and a link to where
            it came from. If a claim cannot be sourced, it does not appear. The
            gauge is only as trustworthy as the data feeding it, so we show the
            working on every page and let you check us.
          </p>

          <h2 style={h2}>What to watch</h2>

          <p style={p}>
            The through-line on day one is that the AI buildout has moved from a
            chip-supply story to a physical-infrastructure story. The scarce things
            are increasingly the unglamorous ones: a transformer, a turbine, a
            packaging slot, a memory wafer, a lithography machine with a two-year
            queue. These are the points where the whole effort can stall, and they
            move slowly enough to see coming if you are watching the right layer.
          </p>

          <p style={p}>
            That is the layer Copper Road covers. Fifteen chokepoints are live now,
            each with a gauge and a sourced trail, and we will add the rest of the
            map and track every one as it moves.
          </p>

          <p
            style={{
              ...p,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              marginTop: "2rem",
            }}
          >
            The buildout moves at the speed of its tightest link. We are here to
            tell you where that link is.
          </p>

        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
