#!/usr/bin/env python3
"""
Copper Road - company profile generator.

Reads every bottleneck seed in ./data/bottlenecks/*.json, dedupes the watchlists
into a unique company list, and uses the Anthropic API (with the web search tool)
to write a ~300-word, fully-sourced factual profile for each one to
./data/companies/{slug}.json.

Run from your repo root:
    pip install anthropic
    export ANTHROPIC_API_KEY=sk-ant-...
    python generate_profiles.py            # generate all
    python generate_profiles.py --limit 3  # smoke-test on 3 first
    python generate_profiles.py --force     # regenerate even if file exists

Notes
- Web search runs server-side inside each request, so one API call per company.
- Existing profiles are skipped (resume-safe) unless --force.
- Model + tool versions are config below; verify current options at
  https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool
"""

import os, re, json, glob, time, argparse, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import anthropic

# ----------------------------- config -----------------------------
MODEL          = "claude-sonnet-4-6"      # good cost/quality. "claude-haiku-4-5" = cheaper, "claude-opus-4-7" = strongest.
WEB_TOOL       = "web_search_20250305"    # basic web search; works with the models above.
MAX_SEARCHES   = 4                         # per company
MAX_WORKERS    = 5
WORD_TARGET    = 300
SEEDS_DIR      = "data/bottlenecks"
OUT_DIR        = "data/companies"
SLEEP_SECONDS  = 1.5                        # be gentle on rate limits
MAX_RETRIES    = 3

# Dedupe aliases for names that appear differently across seeds.
ALIAS = {
    "micron": "Micron Technology",
    "micron technology": "Micron Technology",
    "samsung electronics": "Samsung Electronics",
    "samsung foundry": "Samsung Electronics",
}

# --------------------------- helpers ------------------------------
def canon(name): return ALIAS.get(name.strip().lower(), name.strip())

def slugify(name):
    s = re.sub(r"\(.*?\)", "", name).strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def load_companies():
    comp = {}
    for f in sorted(glob.glob(os.path.join(SEEDS_DIR, "*.json"))):
        d = json.load(open(f))
        bslug = d["slug"]
        for w in d.get("watchlist", []):
            name = canon(w["name"]); key = name.lower()
            c = comp.setdefault(key, {"name": name, "ticker": "", "type": w.get("type",""), "roles": []})
            if not c["ticker"] and w.get("ticker"): c["ticker"] = w["ticker"].strip()
            c["roles"].append({"bottleneck": bslug, "role": w.get("role",""), "exposure": w.get("exposure","")})
    return sorted(comp.values(), key=lambda c: (-len(c["roles"]), c["name"].lower()))

def build_prompt(c):
    roles = "\n".join(f'- {r["bottleneck"]}: {r["role"]} (exposure: {r["exposure"]})' for r in c["roles"])
    return f"""You are writing a factual company profile for Copper Road, a research publication that tracks supply-chain chokepoints in the AI buildout.

COMPANY: {c['name']}{(' (' + c['ticker'] + ')') if c['ticker'] else ''}
Its role in the chokepoints we track:
{roles}

Write a {WORD_TARGET}-word factual profile. Cover: what the company does, its position in the relevant part of the AI supply chain, its exposure to the chokepoint(s) above, and recent (2025-2026) developments or figures that show its standing. Lead with why this company matters to the AI buildout.

HARD RULES
- Use the web search tool to verify current facts. Every specific figure (capacity, market share, revenue, backlog, lead time, dates) MUST come from a source you found. If you cannot source a number, describe it qualitatively instead. Never invent or estimate figures.
- This is journalism and education, not investment advice. No buy/sell/hold language, no price targets, no recommendations.
- Do NOT use em dashes. Do NOT use the construction "it's not X, it's Y" or similar AI-cliche phrasing. Write in plain, direct editorial prose.
- Roughly {WORD_TARGET} words.

OUTPUT
Return ONLY valid JSON, no preamble, no code fences, in exactly this shape:
{{"slug":"{slugify(c['name'])}","name":"{c['name']}","ticker":"{c['ticker']}","type":"{c['type']}","exposure_summary":"one sentence on why this company matters to the AI supply chain","profile":"the ~{WORD_TARGET} word profile as a single string","sources":[{{"label":"short source name","url":"https://...","as_of":"YYYY-MM"}}]}}"""

def extract_json(text):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()
    start, end = text.find("{"), text.rfind("}")
    snippet = text[start:end+1]
    try:
        return json.loads(snippet)
    except json.JSONDecodeError:
        # second pass: escape raw newlines inside the snippet and retry
        return json.loads(snippet.replace("\n", "\\n"))

def gen_one(client, c):
    prompt = build_prompt(c)
    for attempt in range(1, MAX_RETRIES+1):
        try:
            resp = client.messages.create(
                model=MODEL, max_tokens=2000,
                system="You output only a single valid JSON object. Escape all double quotes and newlines inside string values. No text before or after the JSON.",
                tools=[{"type": WEB_TOOL, "name": "web_search", "max_uses": MAX_SEARCHES}],
                messages=[{"role": "user", "content": prompt}],
            )
            text = "".join(b.text for b in resp.content if b.type == "text")
            data = extract_json(text)
            # strip <cite> wrappers that the web search tool injects
            if "profile" in data:
                data["profile"] = re.sub(r'</?cite[^>]*>', '', data["profile"])
                data["profile"] = re.sub(r'\s+([.,;])', r'\1', data["profile"])  # tidy spaces before punctuation
            return data
        except Exception as e:
            print(f"   attempt {attempt} failed: {e}")
            time.sleep(3 * attempt)
    return None

# ----------------------------- main -------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="only process first N companies")
    ap.add_argument("--force", action="store_true", help="regenerate even if profile exists")
    args = ap.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY first.")
    if not glob.glob(os.path.join(SEEDS_DIR, "*.json")):
        sys.exit(f"No seeds found in {SEEDS_DIR}/. Run from your repo root.")

    os.makedirs(OUT_DIR, exist_ok=True)
    client = anthropic.Anthropic()
    companies = load_companies()
    if args.limit: companies = companies[:args.limit]
    print(f"{len(companies)} companies to process. Model={MODEL}\n")

    # figure out which companies still need profiles
    todo = []
    for c in companies:
        out_path = os.path.join(OUT_DIR, slugify(c["name"]) + ".json")
        if os.path.exists(out_path) and not args.force:
            print(f"skip (exists): {c['name']}")
        else:
            todo.append(c)

    print(f"\n{len(todo)} to generate, {MAX_WORKERS} at a time.\n")
    ok = fail = 0

    def worker(c):
        data = gen_one(client, c)
        if not data:
            return c["name"], False
        data["bottlenecks"] = [r["bottleneck"] for r in c["roles"]]
        out_path = os.path.join(OUT_DIR, slugify(c["name"]) + ".json")
        json.dump(data, open(out_path, "w"), indent=2, ensure_ascii=False)
        wc = len(data.get("profile", "").split())
        return c["name"], (wc, len(data.get("sources", [])))

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(worker, c): c for c in todo}
        for fut in as_completed(futures):
            name, result = fut.result()
            if result:
                wc, ns = result
                print(f"  done: {name} ({wc} words, {ns} sources)")
                ok += 1
            else:
                print(f"  FAILED: {name}")
                fail += 1

    print(f"\nDone. {ok} written, {fail} failed.")

if __name__ == "__main__":
    main()
