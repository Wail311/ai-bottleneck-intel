import Link from "next/link";
import NewsletterCTA from "./NewsletterCTA";

export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "0.5px solid var(--border)",
        padding: "32px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 740,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <NewsletterCTA />
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-secondary)",
            }}
          >
            Copper Road
          </span>
          <Link
            href="/methodology"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            Methodology
          </Link>
        </div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--text-tertiary)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 600,
          }}
        >
          Copper Road is a research and journalism publication about the AI supply
          chain. Nothing here is investment advice, a recommendation, or an offer
          to buy or sell any security. Always do your own research and speak to a
          licensed professional before making financial decisions.
        </p>
      </div>
    </footer>
  );
}
