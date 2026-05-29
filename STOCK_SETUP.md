# Copper Road — stock data setup

Adds a copper-themed price chart + key stats to each public company page, with a
clean "private company" fallback. Data comes from EODHD, charts render with
TradingView Lightweight Charts (v5).

## Files in this drop
- `symbol-map.json` → save to **`data/symbol-map.json`**
- `route.ts` → save to **`app/api/stock/[symbol]/route.ts`**
- `CompanyStock.tsx` → save to **`components/CompanyStock.tsx`**

## Steps

### 1. Place the files (paths above). The folder `app/api/stock/[symbol]/` is new — create it.

### 2. Install the chart library
```
npm i lightweight-charts
```

### 3. Get an EODHD key + plan
- Sign up at eodhd.com, copy your API token.
- IMPORTANT: the free tier is **US-only**. Your watchlist is mostly international
  (Korea, Taiwan, Japan, Germany, Austria, France, China), so you need a paid
  **All-World** plan for those. Non-US quotes are delayed. Verify current pricing
  and that your target exchanges are covered before paying.

### 4. Add the key (never commit it)
In `.env.local`:
```
EODHD_API_KEY=your_token_here
```
Add the same variable in Vercel → Project → Settings → Environment Variables.

### 5. Render it on each company page
Pass the company's slug (the same slug used for its profile file):
```tsx
import CompanyStock from "@/components/CompanyStock";
// ...
<CompanyStock slug={company.slug} />
```
The component does the rest: looks the slug up in `symbol-map.json`, fetches
`/api/stock/[eodhdSymbol]`, and renders the chart + stats, or a "private company"
card if it isn't listed.

## Instruction to paste into Claude Code
> I've added `data/symbol-map.json`, `app/api/stock/[symbol]/route.ts`, and
> `components/CompanyStock.tsx`, and run `npm i lightweight-charts`. On each
> company profile page, render `<CompanyStock slug={company.slug} />` in the
> sidebar or just under the header, where `company.slug` matches the key in
> symbol-map.json. Make sure the component only renders client-side (it already
> has "use client"). Don't change the API key handling.

## Symbols to verify before launch
A handful of international codes vary by provider. The map flags them in each
entry's `note`, but spot-check these against EODHD's exchange symbol list
(`https://eodhd.com/api/exchange-symbol-list/{CODE}`):
- **GlobalWafers** (Taipei Exchange / OTC): `6488.TWO`
- **Eoptolink / InnoLight** (Shenzhen ChiNext): `.SHE`, plus confirm foreign data access
- **Tokyo names** (Ibiden, Shin-Etsu, SUMCO, Tokyo Electron, Mitsubishi Heavy): `.TSE`
- **Hitachi Energy**: not separately listed — map points to parent **Hitachi Ltd (6501.TSE)**
- **Shinko Electric**: take-private in progress; the listing may end

## Notes
- The API route caches each symbol for 1 hour (`revalidate: 3600`) to keep
  EODHD call usage low. Tune in `route.ts`.
- Next.js 15 assumed (`params` is awaited). On Next 14, remove the `await` and
  change the param type per the comment in `route.ts`.
- Keep it informational. No buy/sell language anywhere near the chart — same
  media-not-advice line as the rest of the site.
