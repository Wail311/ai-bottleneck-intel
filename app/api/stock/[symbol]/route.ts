// app/api/stock/[symbol]/route.ts
// Proxies EODHD so your API key never reaches the browser, normalizes the
// response, and caches for an hour to keep API-call usage low.
//
// Env: set EODHD_API_KEY in .env.local (and in Vercel project env vars).
// Note: international (non-US) symbols require a paid EODHD "All World" plan;
// non-US quotes are delayed.

import { NextResponse } from "next/server";

type SeriesPoint = { time: string; value: number };

const KEY = process.env.EODHD_API_KEY;
const BASE = "https://eodhd.com/api";
const REVALIDATE = 3600; // cache each symbol for 1 hour

function oneYearAgo(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

// Next.js 15: params is a Promise. On Next 14, change to `{ params }: { params: { symbol: string } }`
// and drop the `await`.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!KEY) {
    return NextResponse.json({ error: "EODHD_API_KEY not set" }, { status: 500 });
  }
  const sym = decodeURIComponent(symbol);

  try {
    // 1) End-of-day history (1y). Drives the chart + derived price/change/52w range.
    const eodUrl = `${BASE}/eod/${encodeURIComponent(sym)}?api_token=${KEY}&fmt=json&period=d&from=${oneYearAgo()}`;
    const eodRes = await fetch(eodUrl, { next: { revalidate: REVALIDATE } });
    if (!eodRes.ok) {
      return NextResponse.json(
        { error: `EODHD eod ${eodRes.status}` },
        { status: eodRes.status === 404 ? 404 : 502 }
      );
    }
    const eod: Array<{ date: string; close: number }> = await eodRes.json();
    if (!Array.isArray(eod) || eod.length === 0) {
      return NextResponse.json({ error: "no price data" }, { status: 404 });
    }

    const series: SeriesPoint[] = eod
      .filter((d) => typeof d.close === "number")
      .map((d) => ({ time: d.date, value: d.close }));

    const closes = series.map((s) => s.value);
    const price = closes[closes.length - 1];
    const prev = closes.length > 1 ? closes[closes.length - 2] : price;
    const changePct = prev ? ((price - prev) / prev) * 100 : 0;
    const week52High = Math.max(...closes);
    const week52Low = Math.min(...closes);

    // 2) Fundamentals for market cap + P/E + name + currency (best-effort).
    let marketCap: number | null = null;
    let peRatio: number | null = null;
    let name: string | null = null;
    let currency: string | null = null;
    try {
      const fUrl = `${BASE}/fundamentals/${encodeURIComponent(sym)}?api_token=${KEY}`;
      const fRes = await fetch(fUrl, { next: { revalidate: REVALIDATE } });
      if (fRes.ok) {
        const f = await fRes.json();
        marketCap = f?.Highlights?.MarketCapitalization ?? null;
        peRatio = f?.Highlights?.PERatio ? Number(f.Highlights.PERatio) : null;
        name = f?.General?.Name ?? null;
        currency = f?.General?.CurrencyCode ?? null;
      }
    } catch {
      // fundamentals are optional; ignore failures
    }

    return NextResponse.json({
      symbol: sym,
      name,
      currency,
      price,
      changePct,
      marketCap,
      peRatio,
      week52High,
      week52Low,
      asOf: series[series.length - 1].time,
      series,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "fetch failed" },
      { status: 502 }
    );
  }
}
