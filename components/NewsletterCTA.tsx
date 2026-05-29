export default function NewsletterCTA() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: 8,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 20,
            fontWeight: 500,
            fontStyle: "italic",
            color: "var(--text)",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Get the squeeze before the headlines.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--text-secondary)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          A weekly read on the AI buildout's tightest constraints. Free, sourced.
        </p>
      </div>
      <a
        href="https://copperroad.beehiiv.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          background: "#B87333",
          color: "#fff",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 500,
          padding: "9px 20px",
          borderRadius: 5,
          textDecoration: "none",
          letterSpacing: "0.01em",
        }}
      >
        Subscribe
      </a>
    </div>
  );
}
