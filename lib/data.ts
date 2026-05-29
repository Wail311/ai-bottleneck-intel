import fs from "fs";
import path from "path";
import { Bottleneck } from "@/types/bottleneck";

const dir = path.join(process.cwd(), "data/bottlenecks");

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
