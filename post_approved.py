#!/usr/bin/env python3
"""
Copper Road - post approved drafts to X.

Reads the "Copper Road - Social Queue" Notion DB for rows with Status = Approved,
posts each row's "Draft Post" text to X (Twitter), appends the Source link,
then flips that row to Status = Posted so it never double-posts.

THIS IS THE ONLY PIECE THAT PUBLISHES. It posts ONLY rows you personally set to
Approved. Verify every figure BEFORE you mark a row Approved, because from this
script's point of view, Approved means publish.

Setup: see X_BOT_SETUP.md
Run:
    pip install requests tweepy
    export NOTION_TOKEN=...        # same internal integration as the generator
    export X_API_KEY=...           X_API_SECRET=...
    export X_ACCESS_TOKEN=...      X_ACCESS_SECRET=...
    python post_approved.py --dry-run     # show what WOULD post, post nothing
    python post_approved.py               # actually post approved rows
    python post_approved.py --limit 1     # post at most 1 (good for first live test)
"""

import os, sys, argparse, time
import requests
import tweepy

NOTION_DB_ID = os.environ.get("NOTION_DB_ID", "d951957c-d263-4913-9778-76a5dea46380")
NOTION_VERSION = "2022-06-28"
NOTION = "https://api.notion.com/v1"

def notion_headers():
    return {
        "Authorization": f"Bearer {os.environ['NOTION_TOKEN']}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }

def get_approved():
    """Return list of {id, text, source} for rows with Status = Approved."""
    r = requests.post(
        f"{NOTION}/databases/{NOTION_DB_ID}/query",
        headers=notion_headers(),
        json={"filter": {"property": "Status", "select": {"equals": "Approved"}}},
        timeout=30,
    )
    if r.status_code >= 300:
        raise RuntimeError(f"Notion query {r.status_code}: {r.text[:300]}")
    rows = []
    for page in r.json().get("results", []):
        props = page["properties"]
        draft = "".join(t["plain_text"] for t in props["Draft Post"]["rich_text"])
        source = props["Source"]["url"]
        rows.append({"id": page["id"], "text": draft.strip(), "source": source})
    return rows

def mark_posted(page_id):
    r = requests.patch(
        f"{NOTION}/pages/{page_id}",
        headers=notion_headers(),
        json={"properties": {"Status": {"select": {"name": "Posted"}}}},
        timeout=30,
    )
    if r.status_code >= 300:
        raise RuntimeError(f"Notion update {r.status_code}: {r.text[:300]}")

def x_client():
    return tweepy.Client(
        consumer_key=os.environ["X_API_KEY"],
        consumer_secret=os.environ["X_API_SECRET"],
        access_token=os.environ["X_ACCESS_TOKEN"],
        access_token_secret=os.environ["X_ACCESS_SECRET"],
    )

def compose(row):
    """Body + source link, trimmed to fit. X counts any link as 23 chars."""
    text = row["text"]
    link = row["source"]
    if link:
        # 280 limit, 23 for the link, 1 space, small safety margin
        max_body = 280 - 24 - 2
        if len(text) > max_body:
            text = text[: max_body - 1].rstrip() + "\u2026"
        return f"{text}\n{link}"
    return text[:280]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="show what would post, post nothing")
    ap.add_argument("--limit", type=int, default=0, help="max rows to post this run")
    args = ap.parse_args()

    if not os.environ.get("NOTION_TOKEN"):
        sys.exit("Set NOTION_TOKEN.")
    if not args.dry_run and not os.environ.get("X_API_KEY"):
        sys.exit("Set X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET (or use --dry-run).")

    rows = get_approved()
    if args.limit:
        rows = rows[: args.limit]
    if not rows:
        print("Nothing approved. Mark rows Approved in Notion first.")
        return
    print(f"{len(rows)} approved row(s).\n")

    client = None if args.dry_run else x_client()
    posted = failed = 0

    for i, row in enumerate(rows, 1):
        msg = compose(row)
        print(f"[{i}/{len(rows)}] ({len(msg)} chars)\n{msg}\n")
        if args.dry_run:
            continue
        try:
            client.create_tweet(text=msg)
            mark_posted(row["id"])
            print("   posted + marked Posted\n")
            posted += 1
        except Exception as e:
            print(f"   FAILED (left as Approved): {e}\n")
            failed += 1
        time.sleep(2)

    if not args.dry_run:
        print(f"Done. {posted} posted, {failed} failed.")

if __name__ == "__main__":
    main()
