#!/usr/bin/env python3
"""
Copper Road - social draft generator.

Each run:
  1. Searches Exa for recent news across the AI-bottleneck topics.
  2. Skips anything already seen (processed_urls.json).
  3. Asks Claude to score relevance and, if it clears the bar, draft a post
     in the Copper Road voice, tag the bottleneck, and flag any figure to verify.
  4. Writes each draft as a row in the "Copper Road - Social Queue" Notion DB
     with Status = Draft, for you to review, verify, approve, and post by hand.

It NEVER posts to X. Human-in-the-loop by design: one made-up number going live
would undo the whole "every figure sourced" promise.

Setup: see SOCIAL_BOT_SETUP.md
Run:
    pip install anthropic requests
    export EXA_API_KEY=...           ANTHROPIC_API_KEY=...
    export NOTION_TOKEN=...          # internal integration token
    python generate_social_drafts.py --days 3            # normal daily run
    python generate_social_drafts.py --dry-run           # print, don't write
    python generate_social_drafts.py --limit 5           # cap candidates
"""

import os, re, json, time, argparse, sys, datetime
import requests
import anthropic

# ----------------------------- config -----------------------------
MODEL          = "claude-sonnet-4-6"
THRESHOLD      = 65          # min relevance (0-100) to queue a draft
DAYS_BACK      = 3
PER_QUERY      = 5           # Exa results per topic
MAX_POST_CHARS = 250         # leaves room for a link when you post
SLEEP          = 1.0
SEEN_FILE      = "processed_urls.json"

NOTION_DB_ID = os.environ.get("NOTION_DB_ID", "d951957c-d263-4913-9778-76a5dea46380")
NOTION_VERSION = "2022-06-28"

ALLOWED = ["cowos-packaging","leading-edge-foundry","custom-silicon","euv-lithography",
           "wafer-fab-equipment","silicon-wafers","abf-substrates","silicon-interposers",
           "hbm-memory","dram-supply","grid-power","transformers","gas-turbines",
           "optical-transceivers","liquid-cooling","general"]

# (search query, default bottleneck tag)
TOPICS = [
    ("HBM high bandwidth memory shortage SK Hynix Samsung Micron", "hbm-memory"),
    ("server DRAM price increase shortage data center", "dram-supply"),
    ("CoWoS advanced packaging TSMC capacity", "cowos-packaging"),
    ("TSMC 2nm leading-edge foundry capacity", "leading-edge-foundry"),
    ("EUV lithography ASML High-NA", "euv-lithography"),
    ("custom AI ASIC Broadcom Marvell hyperscaler accelerator", "custom-silicon"),
    ("ABF substrate supply Ibiden Unimicron", "abf-substrates"),
    ("silicon wafer 300mm Shin-Etsu SUMCO", "silicon-wafers"),
    ("data center power grid interconnection queue", "grid-power"),
    ("large power transformer shortage lead time", "transformers"),
    ("gas turbine data center GE Vernova Siemens", "gas-turbines"),
    ("data center liquid cooling Vertiv", "liquid-cooling"),
    ("800G 1.6T optical transceiver AI networking", "optical-transceivers"),
    ("AI data center buildout capex constraint", "general"),
]

# ----------------------------- helpers ----------------------------
def load_seen():
    try:
        return set(json.load(open(SEEN_FILE)))
    except Exception:
        return set()

def save_seen(seen):
    json.dump(sorted(seen), open(SEEN_FILE, "w"))

def exa_search(query, key, days, n):
    start = (datetime.datetime.utcnow() - datetime.timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = {
        "query": query,
        "category": "news",
        "type": "auto",
        "numResults": n,
        "startPublishedDate": start,
        "contents": {"text": {"maxCharacters": 2000}},
    }
    r = requests.post(
        "https://api.exa.ai/search",
        headers={"x-api-key": key, "Content-Type": "application/json"},
        json=body, timeout=40,
    )
    r.raise_for_status()
    return r.json().get("results", [])

def extract_json(text):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()
    s, e = text.find("{"), text.rfind("}")
    snippet = text[s:e+1]
    try:
        return json.loads(snippet)
    except json.JSONDecodeError:
        return json.loads(snippet.replace("\n", "\\n"))

def draft_with_claude(client, art, default_bottleneck):
    title = art.get("title") or ""
    url = art.get("url") or ""
    published = art.get("publishedDate") or ""
    body = (art.get("text") or "")[:2000]
    prompt = f"""You curate social posts for Copper Road, a research publication tracking supply-chain chokepoints in the AI buildout (advanced packaging, HBM/DRAM, foundry, lithography, power, grid, transformers, turbines, cooling, optics, materials).

Assess this article and, if it is genuinely relevant to an AI-infrastructure bottleneck, draft one post.

ARTICLE
Title: {title}
Published: {published}
URL: {url}
Excerpt: {body}

RULES
- Relevance: only score >= {THRESHOLD} if this is real news about supply, capacity, lead times, pricing, concentration, or a named company's position in one of the chokepoints above. Generic AI hype, product launches, or model news = low score.
- The post: one post, {MAX_POST_CHARS} characters max, plain and factual, lead with the development. Do NOT include the link (it gets added when posting).
- Voice: no em dashes. Never use the construction "it's not X, it's Y". No hashtags spam (one at most, optional). Informational and educational only: no buy/sell/hold language, no price targets, no recommendations.
- Figures: if the post states any specific number (capacity, share, lead time, price, date), copy those exact figures into figures_to_verify so a human can confirm them against the source before posting. If none, use "none".
- bottleneck: choose the single best-fit slug from this list, else "general": {", ".join(ALLOWED)}

Return ONLY valid JSON, no preamble, escaping any quotes/newlines inside strings:
{{"relevant": true/false, "relevance": 0-100, "bottleneck": "slug", "headline": "short label (max 80 chars)", "draft": "the post text", "figures_to_verify": "list of figures, or none"}}"""
    resp = client.messages.create(
        model=MODEL, max_tokens=900,
        system="You output only a single valid JSON object. No text before or after it.",
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text")
    data = extract_json(text)
    if data.get("bottleneck") not in ALLOWED:
        data["bottleneck"] = default_bottleneck if default_bottleneck in ALLOWED else "general"
    # strip stray cite tags / tidy
    if "draft" in data:
        data["draft"] = re.sub(r"</?cite[^>]*>", "", data["draft"]).strip()
    return data

def notion_create(token, db_id, art, d):
    payload = {
        "parent": {"database_id": db_id},
        "properties": {
            "Headline": {"title": [{"text": {"content": (d.get("headline") or art.get("title") or "Untitled")[:200]}}]},
            "Draft Post": {"rich_text": [{"text": {"content": d.get("draft", "")[:1900]}}]},
            "Source": {"url": art.get("url") or None},
            "Bottleneck": {"select": {"name": d.get("bottleneck", "general")}},
            "Status": {"select": {"name": "Draft"}},
            "Relevance": {"number": float(d.get("relevance", 0))},
            "Figures to verify": {"rich_text": [{"text": {"content": (d.get("figures_to_verify") or "none")[:1900]}}]},
        },
    }
    r = requests.post(
        "https://api.notion.com/v1/pages",
        headers={"Authorization": f"Bearer {token}", "Notion-Version": NOTION_VERSION,
                 "Content-Type": "application/json"},
        json=payload, timeout=30,
    )
    if r.status_code >= 300:
        raise RuntimeError(f"Notion {r.status_code}: {r.text[:300]}")
    return r.json()

# ----------------------------- main -------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=DAYS_BACK)
    ap.add_argument("--limit", type=int, default=0, help="max candidates to evaluate")
    ap.add_argument("--threshold", type=int, default=THRESHOLD)
    ap.add_argument("--dry-run", action="store_true", help="print, don't write to Notion")
    args = ap.parse_args()

    exa_key = os.environ.get("EXA_API_KEY")
    notion_token = os.environ.get("NOTION_TOKEN")
    if not exa_key or not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set EXA_API_KEY and ANTHROPIC_API_KEY.")
    if not args.dry_run and not notion_token:
        sys.exit("Set NOTION_TOKEN (or use --dry-run).")

    client = anthropic.Anthropic()
    seen = load_seen()

    # gather candidates
    candidates = []
    for query, tag in TOPICS:
        try:
            for art in exa_search(query, exa_key, args.days, PER_QUERY):
                u = art.get("url")
                if u and u not in seen and not any(c[0].get("url") == u for c in candidates):
                    candidates.append((art, tag))
        except Exception as e:
            print(f"  exa error on '{query}': {e}")
        time.sleep(0.5)

    if args.limit:
        candidates = candidates[:args.limit]
    print(f"{len(candidates)} new candidates.\n")

    queued = skipped = failed = 0
    for i, (art, tag) in enumerate(candidates, 1):
        title = (art.get("title") or "")[:70]
        print(f"[{i}/{len(candidates)}] {title} ...")
        try:
            d = draft_with_claude(client, art, tag)
        except Exception as e:
            print(f"   draft error: {e}"); failed += 1; continue

        seen.add(art.get("url"))
        rel = d.get("relevance", 0)
        if not d.get("relevant") or rel < args.threshold:
            print(f"   skip (relevance {rel})"); skipped += 1
            continue

        if args.dry_run:
            print(f"   [{rel}] {d.get('bottleneck')}: {d.get('draft')}")
            if d.get("figures_to_verify", "none") != "none":
                print(f"        verify: {d['figures_to_verify']}")
            queued += 1
        else:
            try:
                notion_create(notion_token, NOTION_DB_ID, art, d)
                print(f"   queued [{rel}] {d.get('bottleneck')}")
                queued += 1
            except Exception as e:
                print(f"   notion error: {e}"); failed += 1
        time.sleep(SLEEP)

    save_seen(seen)
    print(f"\nDone. {queued} queued, {skipped} below bar, {failed} failed.")

if __name__ == "__main__":
    main()
