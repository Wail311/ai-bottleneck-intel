import fs from "fs";
import path from "path";
import { Bottleneck } from "@/types/bottleneck";

const dir = path.join(process.cwd(), "data/bottlenecks");

// ── Company profiles ─────────────────────────────────────────────────────────

export interface CompanySource {
  label: string;
  url: string;
  as_of: string;
}

export interface CompanyProfile {
  slug: string;
  name: string;
  ticker: string;
  type: string;
  exposure_summary: string;
  profile: string;
  sources: CompanySource[];
  bottlenecks: string[];
}

const companyDir = path.join(process.cwd(), "data/companies");

function loadAllCompanies(): CompanyProfile[] {
  if (!fs.existsSync(companyDir)) return [];
  return fs
    .readdirSync(companyDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(companyDir, f), "utf-8")) as CompanyProfile);
}

export function getCompany(slug: string): CompanyProfile | undefined {
  return loadAllCompanies().find((c) => c.slug === slug);
}

export function getAllCompanySlugs(): string[] {
  return loadAllCompanies().map((c) => c.slug);
}

function loadAll(): Bottleneck[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Bottleneck);
}

export function getAllBottlenecks(): Bottleneck[] {
  return loadAll().sort((a, b) => b.gauge.score - a.gauge.score);
}

export function getBottleneck(slug: string): Bottleneck | undefined {
  return loadAll().find((b) => b.slug === slug);
}

export function getAllSlugs(): string[] {
  return loadAll().map((b) => b.slug);
}
