#!/usr/bin/env python3
"""
Palworld PDA — Palpedia artwork fetcher.

Downloads the official Pal icon set from Palpedia (palpedia.azrocdn.com) into
assets/pals/ and regenerates src/data/pals/palImages.ts.

Usage:
    python3 scripts/fetch-pal-images.py

Be a good netizen: this scraper is sequential, low-concurrency and jittered.
Palpedia rate-limits aggressively — the built-in backoff handles it, so a
full run takes several minutes. Re-run only when Palpedia adds new species.
"""
import os
import random
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(APP, "assets", "pals")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 PalworldPDA/1.0"


def curl(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def get_pal_ids() -> list[tuple[str, str]]:
    """(id, display name) pairs from the app registry."""
    ids_js = (
        "const { ALL_PALS } = require("
        f'"{os.path.join(APP, "src", "data", "pals", "index.ts")}");'
        'for (const p of ALL_PALS) console.log(p.id + "\\t" + p.name);'
    )
    out = subprocess.run(["node", "-e", ids_js], capture_output=True, text=True)
    return [tuple(l.split("\t")) for l in out.stdout.strip().split("\n") if "\t" in l]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1. discover pal page slugs from the sitemap
    sitemap = curl("https://www.palpedia.net/sitemap.xml").decode("utf-8", "ignore")
    slugs = sorted(
        {
            urllib.parse.unquote(l.split("/pals/")[1]).strip()
            for l in re.findall(r"<loc>([^<]*)</loc>", sitemap)
            if "/pals/" in l
        }
    )
    # strip Alpha/Raid/Boss prefixes + Ultra/Twin suffixes → base species
    def base(s: str) -> str:
        for p in ("Alpha ", "Raid ", "Boss ", "Tower "):
            if s.startswith(p):
                s = s[len(p):]
        for suf in (" Ultra", " Twin"):
            if s.endswith(suf):
                s = s[: -len(suf)]
        return s.strip()

    bases: dict[str, str] = {}
    for s in slugs:
        b = base(s)
        key = norm(b)
        if key not in bases:
            bases[key] = b

    # 2. fetch each base page, extract T_*_icon_normal.png
    icons: dict[str, str] = {}
    todo = sorted(bases.items(), key=lambda kv: kv[1])
    for i, (key, name) in enumerate(todo):
        url = "https://www.palpedia.net/pals/" + urllib.parse.quote(name)
        for attempt in range(6):
            try:
                html = curl(url).decode("utf-8", "ignore")
            except Exception:
                html = ""
            m = re.search(r"https://palpedia\.azrocdn\.com/pals/T_[A-Za-z0-9_]+_icon_normal\.png", html)
            if m:
                icons[key] = m.group(0)
                break
            time.sleep(5 + random.random() * 5)
        time.sleep(1.5 + random.random() * 2)
        if (i + 1) % 20 == 0:
            print(f"  scanned {i + 1}/{len(todo)} — {len(icons)} icons", flush=True)

    # 3. match to app registry, download
    matched, unmatched = [], []
    for pid, name in get_pal_ids():
        key = norm(name)
        if key in icons:
            matched.append((pid, icons[key]))
        else:
            unmatched.append((pid, name))

    ok: list[str] = []
    for pid, url in matched:
        dest = os.path.join(OUT_DIR, f"{pid}.png")
        for attempt in range(3):
            try:
                with open(dest, "wb") as f:
                    f.write(curl(url))
                if os.path.getsize(dest) > 800:
                    ok.append(pid)
                    break
            except Exception:
                time.sleep(3)
        time.sleep(0.4 + random.random() * 0.4)

    # 4. emit palImages.ts
    with open(os.path.join(APP, "src", "data", "pals", "palImages.ts"), "w") as f:
        f.write(
            "/**\n * PAL ARTWORK INDEX — official Palworld icons (source: Palpedia,\n"
            " * palpedia.azrocdn.com), bundled locally in /assets/pals.\n"
            " * Pals without an entry render the procedural SVG portrait instead.\n */\n"
            "import type { ImageSourcePropType } from 'react-native';\n\n"
            "export const PAL_IMAGES: Record<string, ImageSourcePropType> = {\n"
        )
        for pid in sorted(ok):
            f.write(f"  {pid}: require('../../../assets/pals/{pid}.png'),\n")
        f.write("};\n")

    print(f"done: {len(ok)} icons bundled, {len(unmatched)} unmatched")
    for pid, name in unmatched:
        print(f"  missing: {pid} ({name})")
    if unmatched:
        print("(missing species keep the procedural SVG portrait)", file=sys.stderr)


if __name__ == "__main__":
    main()
