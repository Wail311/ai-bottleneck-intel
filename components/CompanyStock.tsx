"use client";

// components/CompanyStock.tsx
// Drop into a company page as <CompanyStock slug={company.slug} />.
// Looks the company up in data/symbol-map.json, renders a copper-themed
// Lightweight Charts area chart + stat cards, or a clean "not listed" card
// for private companies.
//
// Requires: npm i lightweight-charts
// Requires: data/symbol-map.json and the /api/stock/[symbol] route.

import { useEffect, useRef, useState } from "react";
import symbolMap from "@/data/symbol-map.json";

type Entry = {
  name: string;
  isPublic: boolean;
  exchange: string | null;
  currency: string | null;
  tvSymbol: string | null;
  eodhdSymbol: string | null;
  note: string;
};

type StockData = {
  symbol: string;
  name: string | null;
  currency: string | null;
  price: number;
  changePct: number;
  marketCap: number | null;
  peRatio: number | null;
  week52High: number;
  week52Low: number;
  asOf: string;
  series: { time: string; value: number }[];
};

const COPPER = "#B87333";

function fmtPrice(v: number, cur?: string | null) {
  const code = cur || "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `${v.toFixed(2)} ${code}`;
  }
}

function fmtCap(v: number | null) {
  if (!v) return "\u2014";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary, #6b7280)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

export default function CompanyStock({ slug }: { slug: string }) {
  const entry = (symbolMap as Record<string, Entry>)[slug];
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eodhdSymbol = entry?.eodhdSymbol ?? null;

  useEffect(() => {
    if (!eodhdSymbol) return;
    let cancelled = false;
    setData(null);
    setError(null);
    fetch(`/api/stock/${encodeURIComponent(eodhdSymbol)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!cancelled) (d.error ? setError(d.error) : setData(d));
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [eodhdSymbol]);

  useEffect(() => {
    if (!data || !chartRef.current) return;
    const el = chartRef.current;
    const dark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    let chart: { remove: () => void; applyOptions: (o: object) => void } | null = null;
    let ro: ResizeObserver | null = null;

    (async () => {
      const { createChart, AreaSeries, ColorType } = await import("lightweight-charts");
      const c = createChart(el, {
        width: el.clientWidth,
        height: 220,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: dark ? "#9A938A" : "#6b7280",
          attributionLogo: false,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
        crosshair: { horzLine: { visible: true }, vertLine: { labelVisible: true } },
        handleScale: false,
        handleScroll: false,
      });
      const s = c.addSeries(AreaSeries, {
        lineColor: COPPER,
        lineWidth: 2,
        topColor: "rgba(184,115,51,0.28)",
        bottomColor: "rgba(184,115,51,0.0)",
        priceLineVisible: false,
      });
      s.setData(data.series);
      c.timeScale().fitContent();
      chart = c;
      ro = new ResizeObserver(() => c.applyOptions({ width: el.clientWidth }));
      ro.observe(el);
    })();

    return () => {
      ro?.disconnect();
      chart?.remove();
    };
  }, [data]);

  // Unknown slug
  if (!entry) return null;

  // Private / not separately listed
  if (!entry.isPublic) {
    return (
      <div
        style={{
          border: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.12))",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500 }}>Private company</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary, #6b7280)", marginTop: 4 }}>
          {entry.note || "Not publicly listed."}
        </div>
      </div>
    );
  }

  const up = data ? data.changePct >= 0 : true;
  const changeColor = up ? "#1D9E75" : "#E24B4A";

  return (
    <div
      style={{
        border: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.12))",
        borderRadius: 12,
        padding: "16px 18px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary, #6b7280)" }}>
          {entry.tvSymbol}
        </div>
        {data && (
          <div style={{ fontSize: 12, color: "var(--color-text-secondary, #6b7280)" }}>
            as of {data.asOf}
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--color-text-secondary, #6b7280)", marginTop: 8 }}>
          Price data unavailable.
        </div>
      )}

      {data && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            <div style={{ fontSize: 26, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {fmtPrice(data.price, data.currency || entry.currency)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: changeColor }}>
              {up ? "+" : ""}
              {data.changePct.toFixed(2)}%
            </div>
          </div>

          <div ref={chartRef} style={{ width: "100%", height: 220, margin: "12px 0" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 12,
              borderTop: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.12))",
              paddingTop: 12,
            }}
          >
            <Stat label="Market cap" value={fmtCap(data.marketCap)} />
            <Stat label="P/E" value={data.peRatio ? data.peRatio.toFixed(1) : "\u2014"} />
            <Stat label="52w high" value={fmtPrice(data.week52High, data.currency || entry.currency)} />
            <Stat label="52w low" value={fmtPrice(data.week52Low, data.currency || entry.currency)} />
          </div>
        </>
      )}

      {!data && !error && (
        <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary, #6b7280)", fontSize: 13 }}>
          Loading price data\u2026
        </div>
      )}

      <div style={{ fontSize: 11, color: "var(--color-text-secondary, #6b7280)", marginTop: 12 }}>
        Data for information only. Not investment advice.{entry.note ? ` ${entry.note}` : ""}
      </div>
    </div>
  );
}
