interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-secondary)",
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </span>
      <div className="hairline" style={{ marginTop: 8 }} />
    </div>
  );
}
