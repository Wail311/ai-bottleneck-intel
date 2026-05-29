export type Metric = {
  value: number | string;
  unit?: string;
  as_of: string;
  source: string;
  url?: string;
};

export type GaugeInputs = {
  coverage: number;
  leadTime: number;
  concentration: number;
  momentum: number;
};

export type Gauge = {
  inputs: GaugeInputs;
  score: number;
  band: "eased" | "tight" | "critical";
  delta_90d?: number;
  rationale: string;
};

export type WatchlistEntry = {
  name: string;
  type: "public" | "private";
  ticker?: string;
  role: string;
  exposure: "Direct" | "High" | "Moderate" | "Watch";
};

export type Catalyst = { timeframe: string; text: string };

export type Development = {
  date: string;
  text: string;
  source?: string;
  url?: string;
};

export type Bottleneck = {
  slug: string;
  name: string;
  layer: string;
  thesis: string;
  updated_at: string;
  gauge: Gauge;
  metrics: { label: string; metric: Metric }[];
  why_it_gates: string;
  watchlist: WatchlistEntry[];
  catalysts: Catalyst[];
  what_loosens_it: string;
  developments: Development[];
  linked: string[];
};
