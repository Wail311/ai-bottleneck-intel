import Link from "next/link";

interface SiteNavProps {
  back?: { href: string; label: string };
}

export default function SiteNav({ back }: SiteNavProps) {
  return (
    <nav
      style={{
        borderBottom: "0.5px solid var(--border)",
        background: "var(--surface)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 52,
      }}
    >
      {/* Left: wordmark or back link */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Copper Road
        </Link>
        {back && (
          <>
            <span style={{ color: "var(--border-strong)", fontSize: 14 }}>/</span>
            <Link
              href={back.href}
              className="nav-back"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              {back.label}
            </Link>
          </>
        )}
      </div>

      {/* Right: site links */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
          Bottlenecks
        </Link>
        <Link
          href="/methodology"
          className="nav-back"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Methodology
        </Link>
      </div>
    </nav>
  );
}
