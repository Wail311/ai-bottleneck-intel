import Link from "next/link";
import Image from "next/image";

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
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
        >
          <Image
            src="/copper-road-mark.png"
            alt="Copper Road mark"
            height={32}
            width={32}
            style={{ height: 32, width: "auto" }}
          />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1,
            }}
          >
            Copper Road
          </span>
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
          href="/essay/the-boxes-arent-the-bottleneck"
          className="nav-back"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Essays
        </Link>
        <Link
          href="/companies"
          className="nav-back"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Companies
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
