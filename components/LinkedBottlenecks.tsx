import Link from "next/link";
import { getAllBottlenecks } from "@/lib/data";

interface LinkedBottlenecksProps {
  slugs: string[];
}

export default function LinkedBottlenecks({ slugs }: LinkedBottlenecksProps) {
  const all = getAllBottlenecks();
  const known = all.filter((b) => slugs.includes(b.slug));
  const unknown = slugs.filter((s) => !all.find((b) => b.slug === s));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {known.map((b) => (
        <Link
          key={b.slug}
          href={`/b/${b.slug}`}
          className="linked-pill"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text)",
            border: "1px solid var(--border-strong)",
            borderRadius: 4,
            padding: "5px 14px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {b.name}
        </Link>
      ))}
      {unknown.map((slug) => (
        <span
          key={slug}
          title="Not yet published"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "5px 14px",
            cursor: "default",
          }}
        >
          {slug}
        </span>
      ))}
    </div>
  );
}
