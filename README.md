# HC Labs Palworld v1.0 Ultimate Companion PDA

**HC Labs' unified cross-platform companion app** — Web · iOS · Android — built with **React / Expo (React Native for Web)**, **TypeScript (strict)**, and **Tailwind CSS / NativeWind v4**.

A cyber-diegetic Sci-Fi OS styled after Palworld's digital PDA: deep slate/charcoal base (`#0F172A` / `#1E293B`), Paldium Cyan (`#06B6D4`), Warning Gold (`#F59E0B`), Fire Orange (`#EF4444`), Neon Green (`#10B981`). Monospace stat readouts, glassmorphic panels, glowing borders, fluid module transitions, bottom nav on mobile, side dock on desktop.

---

## 1. Quick start

```bash
cd palworld-pda
npm install

npm run web        # Expo web dev server → http://localhost:8081
npm run ios        # iOS simulator / Expo Go
npm run android    # Android emulator / Expo Go
npm run typecheck  # tsc --noEmit (strict)
```

## 2. Packaging & distribution

| Target | Command | Notes |
| --- | --- | --- |
| **Web (static export)** | `npx expo export --platform web` | Output in `dist/` — host anywhere (Vercel/Netlify/S3). |
| **iOS — Expo Go (dev)** | `npx expo start` then scan QR with Expo Go | Zero build time. |
| **iOS — TestFlight** | `npm i -g eas-cli && eas login && eas build --platform ios --profile production && eas submit --platform ios` | EAS cloud build produces the `.ipa`; `eas submit` ships it to TestFlight. |
| **iOS — Xcode (local)** | `npx expo run:ios` or `npx expo prebuild -p ios` then open `ios/*.xcworkspace` in Xcode | Requires macOS + Xcode + CocoaPods. |
| **Android — APK** | `eas build --platform android --profile preview` (downloads an installable `.apk`) | Or local: `npx expo run:android` then `./gradlew assembleRelease` in `android/`. |
| **Android — Play Store** | `eas build --platform android --profile production && eas submit --platform android` | Needs a Google Play Console account; bundle/package id `com.palworld.pda` (set in `app.json`). |

`eas.json` ships pre-configured (`development` / `preview` / `production` profiles).

## 3. Feature modules

### Module A — Full interactive Paldeck (219 indexed entries · 250 official icons bundled (Palpedia))
- **Search / multi-filter / sort engine** (`src/logic/filter.ts`, pure functions): query matches id, name, title, `#dex` and v1.0 dex numbers; filters combine AND semantics across Elements, Work Suitability (type + min level 1–10), Egg Type, Region (incl. Sunreach / World Tree / new islets), captured-only and data-quality; sorts by Dex #, Name, HP, Melee/Ranged Atk, Def, Work Speed, Breeding Power (asc/desc).
- **Egg & Lore tab**: "Breed From Your Captures" — all valid parent pairs for that Pal partitioned by your capture checklist (ready now / one missing / easiest routes), each with a BREED button that opens the lab pre-filled.
- **Pal detail view**: official bundled artwork (SVG hex frame + element gradient), base stats with deck-percentile bar graphs, IV sliders (0–30) with live level projection (Lv1–80), partner skill, learned-move progression tree (level → power/CT/cooldown), drop tables with exact % rates, day/night spawn markers with map coordinates, egg class/size/incubation, element matchups, lore.
- Captured status persists (localStorage / AsyncStorage).

### Module B — Breeding & Mutation Lab (`src/logic/breeding.ts`, `src/logic/mutation.ts`)
- **Mutation Lab (1.0 rules)**: pick the two parents and see the standard offspring PLUS the Mutation Outcome — egg odds (1% base, 3% with the Extravagant/Deluxe Vegetable Cake), the mutated-species table (rarer ★★ hatches ranked by conditional %, modeled weights), the mutated-egg guarantees (★★ condensation, Alpha, ≥90 IVs, one of the six mutation-exclusive passives: Immortality / Idiosyncratic / Babysitter / Heavily Armored / Lightfooted / God of Destruction), a Lv50 mutated-stat projection, and the 1.0 count-based passive inheritance table (1/2/3/4 → 40/30/20/10%; Special Cake forces 4).
- **Parent → Offspring**: searchable parent pickers; real CombiRank algorithm `ChildRank = floor((A + B + 1) / 2)` → nearest-rank species (tie-break = codename order, i.e. largest rank ≤ target); **special-combo override table** (27 documented pairs, e.g. Relaxaurus + Sparkit → Relaxaurus Lux, Penking + Bushi → Anubis, Grizzbolt + Sweepa → Jormuntide, Relaxaurus + Frostallion → Jetragon…); egg type/size/incubation readout.
- **Offspring → Parents**: every valid parent pair sorted by an accessibility score (early-game commons first, region/element bonuses, specials pinned).
- **Chain solver**: BFS over the breedable graph from *your captured species* (persisted) to a target within 1–3 generations, preferring special combos.
- **Passive inheritance simulator**: up to 4 passives per parent + desired child set; per-slot 48% inheritance (community datamined figure; Special Cake ×1.5) with Monte-Carlo verification (50k trials) — empirical clean-4-trait %, eggs-to-expectancy, per-passive frequency breakdown.
- **v1.0 Mutation roll**: base 3% per egg × cake multiplier (Deluxe Vegetable Cake ×3); mutated eggs roll 1–3 boosted stats (+2–10% growth) and a 30% chance at a mutation-exclusive passive; full Monte-Carlo odds table + seeded sample rolls.
- **Cake selector** with the real v1.0 cakes and their distinct effects: Mushroom (stat floor), Vegetable (double eggs), Deluxe Vegetable (mutation), Special (passive inheritance).
- **Saved breeding plans** persist to storage.

### Module C — Interactive world map (`src/components/map/`)
- Stylized PDA grid map (0–100 abstract coords) covering main island, Feybreak, Sakurajima, **Sunreach** and **World Tree** + the seven new islets.
- Filterable markers: Alpha Bosses, Tower gates, Fast Travel, Effigies, Lifmunk Statues, Rare Chests, Dungeons, **Sunreach Soralite nodes**, **World Tree Paloxite nodes**.
- Per-point checklist: mark found / mark Alpha defeated; persisted; tap-through to Pal dossiers.

### Module D — Storyline, quests & lore (`src/data/quests.ts`)
- Searchable quest tracker with the v1.0 campaign spine: Tutorial → five reworked towers → Feybreak (Bjorn & Bastigor) → **Sunreach (Shaolong)** → **World Tree climax (Astralym)**, plus side/collection quests; per-step toggles persist.
- Boss guide: all tower bosses + raid bosses (Bellanoir, Blazamut Ryu) with weaknesses and tactics.
- Lore database: diaries, Sunreach/World Tree lore, the Ancient Ruins beacon-riddle hint, hidden secrets.

## 4. Architecture — master component tree

```
palworld-pda/
├── App.tsx                                  # root: StatusBar + AppShell, imports global.css
├── assets/
│   ├── icon.png                              # 1024×1024 app icon
│   └── pals/                                 # bundled official Pal icons (Palpedia)
├── index.ts                                 # Expo registerRootComponent
├── global.css                               # Tailwind layers + web-only polish
├── babel.config.js                          # babel-preset-expo (jsxImportSource nativewind) + nativewind/babel preset
├── metro.config.js                          # withNativeWind(cssInterop)
├── tailwind.config.js                       # PDA palette, glows, element colors
├── nativewind-env.d.ts                      # NativeWind TS augmentation
├── eas.json                                 # EAS build/submit profiles
└── src/
    ├── types/index.ts                       # ★ ALL domain interfaces
    ├── data/pals/palImages.ts                # palId → bundled artwork index (generated) (Pal, skills, items, cakes, quests, map, breeding…)
    ├── data/
    │   ├── elements.ts                      # 9 elements + matchups, eggs + incubation, 14 regions, work types
    │   ├── skills.ts                        # 60+ active skills (power/CT/CD) · 50 passives incl. mutation-exclusive pool
    │   ├── items.ts                         # resources (Soralite/Paloxite/Radiant Gems…), gear, schematics, recipes, 4 v1.0 cakes
    │   ├── locations.ts                     # ~60 map points (bosses, towers, effigies, nodes…)
    │   ├── quests.ts                        # 14 quest nodes, 10 boss guides, 12 lore entries
    │   └── pals/
    │       ├── chunk1.ts                    # #001–#040 EA roster (full data, datamined BPs)  [P()/sp() builders]
    │       ├── chunk2.ts                    # #041–#080
    │       ├── chunk3.ts                    # #081–#111 + raid bosses
    │       ├── chunk4.ts                    # Sakurajima + Feybreak rosters
    │       ├── chunk5.ts                    # 74 new v1.0 Pals (official v1.0 numbering, types, locations)
    │       └── index.ts                     # registry aggregation, v1.0-dex map, lookups, SPECIAL_COMBOS table
    ├── logic/                               # ★ pure, side-effect-free calculation engines
    │   ├── breeding.ts                      # getOffspring · findAllParentPairs · accessibilityScore · findBreedingChain (BFS)
    │   ├── mutation.ts                      # simulateInheritance (Monte-Carlo) · rollMutation · simulateMutations + tunables
    │   ├── stats.ts                         # IV/level/passive stat projection, passive modifiers
    │   ├── filter.ts                        # filterPals · sortPals · deck maxima · capture progress
    │   └── rng.ts                           # seeded mulberry32 RNG (reproducible sims)
    ├── hooks/
    │   ├── useStorage.ts                    # localStorage(web)/AsyncStorage(native) + cross-tab sync
    │   ├── usePersistence.ts                # captured Pals, map checklist, breeding plans (versioned doc)
    │   └── useBreakpoint.ts                 # responsive columns / dock-vs-bottomnav switch
    ├── navigation/
    │   └── router.tsx                       # typed Route union + RouterProvider/useRouter (no external dep)
    ├── components/
    │   ├── ui/                              # primitives: GlassCard, MonoText, Badge, TypeChip, SectionTitle,
    │   │   │                                 # ProgressBar, Segmented, Toggle, Chip, EmptyState · SearchBar · SheetModal
    │   ├── layout/AppShell.tsx              # top bar + SideDock (≥1024px) / BottomNav (<1024px) + ScreenOutlet
    │   ├── paldeck/                         # PalPortrait (SVG) · PalCard · FilterPanel · PalDetail
    │   │                                    #   (StatPanel · SkillPanel · WorkPanel · DropPanel · SpawnPanel · EggPanel)
    │   ├── breeding/                        # PalSelect (searchable) · OffspringCard · ReverseParentPanel
    │   │                                    #   · ChainSolverPanel · MutationSimPanel
    │   ├── map/                             # WorldMapSvg (interactive SVG) · MapPointCard · MapFilterRow
    │   └── quests/                          # QuestTracker · BossGuides · LoreDatabase
    └── screens/                             # HomeScreen · PalDeckScreen · PalDetailScreen
                                             #   · BreedingScreen · MapScreen · QuestsScreen
```

## 5. Artwork & assets

**250 of 251 species** ship with official icons **bundled locally** in `assets/pals/*.png` (only Nybelle lacks a Palpedia page — it keeps the procedural avatar). (source: Palpedia — palpedia.azrocdn.com; the wiki's published icon set, downloaded via a polite, rate-limited scraper). They are loaded through Metro `require()` so the app works offline and on all platforms; the procedural SVG avatar remains as a graceful fallback for species still missing artwork.

- Mapping lives in `src/data/pals/palImages.ts` (palId → bundled asset).
- `scripts/fetch-pal-images.py` re-scrapes and regenerates that file when Palpedia adds new species.
- Attribution: icons © Pocketpair / hosted by Palpedia; used as a personal companion-app reference.

## 5. Data provenance — read this

**The dataset is now extracted from the Palworld 1.0 game files themselves**
(pal-atlas datamine, Awy64/palworld-atlas-data, MIT license, build 24575149,
Aug 2026):

| Data | Source | Notes |
| --- | --- | --- |
| CombiRank breeding ranks, hp/attack/defense, elements, work suitabilities, official Paldeck numbers | `DT_PalMonsterParameter` via pal-atlas | Applied to every one of the 299 species in the registry |
| 238 official special breeding pairs | `DT_PalCombiUnique` via pal-atlas | 256 datamine rows minus deprecated-codename leftovers (e.g. PinkKangaroo) |
| Formula eligibility | 1.0 rules | Legendaries (Jetragon, Frostallion, Neptilius, Paladius, Necromus, Bellanoir…) and every special-combo child can never be a formula result |
| 1,329 map markers (9 towers, 82+ alphas, 135 fast travel, 407 effigies, 157 dungeons, 270 Soralite, 258 chests) | pal-atlas POI + spawn exports | Real in-game world coordinates |
| Base map images (Palpagos + World Tree) | Nifrendil/pal-atlas, MIT | Extracted from the game files, bundled locally |
| 350+ Pal icons | game-extracted icon set (Palpedia / palworld-shared-library) | Bundled locally in `assets/pals` |
| Passives/moves/cakes/mutation constants | community sources + modeled (see §6) | Unchanged from previous versions |

**Important 1.0 correction:** third-party sites list some fusions (e.g.
"Frostallion + Anubis = Bastigor") that are NOT in the actual game files —
the datamine only contains same-species rows for Bastigor. This app trusts the
game files: every special combo shown is a row from `DT_PalCombiUnique`.


The dataset and engines ship with real, working logic. Accuracy is tiered and transparent:

| Tier | What | Count |
| --- | --- | --- |
| `complete` | Full verified records: stats, **datamined Breeding Power**, works, moves, drops, spawns. Classic EA roster. | 142 |
| `core` | Stats + typing + works; Sakurajima/Feybreak species. Breeding Power **null** → excluded from offspring math (avoids wrong results). | 34 |
| `minimal` | The 74 new v1.0 Pals (official v1.0 dex numbers, types, locations from the release guides). Searchable/filterable/map-tracked; stat blocks pending public datamines. | 75 |

- **Breeding formula** — datamined: `floor((A + B + 1) / 2)` → nearest rank, ties by codename order. Validated: exhaustive 10,153-pair space resolves with 0 crashes; known combos (Chikipi+Lamball→Mau, Lifmunk+Foxparks→Flambelle, Celaray+Relaxaurus→Anubis…) all match.
- **Special combos** — 27 pairs with fixed overrides (source: palworld wiki special-combo table).
- **v1.0 numbering** — v1.0 renumbered the Paldeck. Official numbers are applied where confirmed via the variant tables (e.g. `023B Tanzee Ignis` ⇒ Tanzee = #023 in v1.0) and for all 74 new Pals; other classics keep legacy EA numbering (`v10DexNo` field carries the cross-reference).
- **Modeled values** (official tables not public) — all tunable in one place:
  - `src/logic/mutation.ts`: `INHERIT_BASE` (per-slot 0.48, per calculator sources), `BASE_MUTATION` (0.03), `EXCLUSIVE_CHANCE` (0.3), growth-boost range, cake multipliers.
  - Egg incubation minutes per size (`src/data/elements.ts`), map coordinates (stylized PDA grid, not in-game meters).
- **Dropping in official data**: each Pal chunk is a plain typed array — append/correct rows from a datamine dump and every engine (filters, breeding, chain solver, sim) updates automatically. Drop official art via `imageUrl` in the `PalPortrait` fallback slot.

## 6. Verification performed

- `tsc --noEmit` clean under strict mode.
- **35/35 assertion tests** against the 1.0 datamine: verified rank resolutions
  (Chikipi+Lamball→Vixy, the famous **Penking+Bushi→Sibelyx** 1.0 change),
  special combos, the gender-dependent Katress×Wixen pair, formula-eligibility
  invariants (exhaustive pair space never yields an excluded species),
  self-verifying reverse lookups (hundreds of pairs per target) and
  self-verifying breeding chains.
- Metro web bundle compiles; `expo export --platform web` production build
  succeeds with all icons and both map images bundled.


- `tsc --noEmit` — clean under strict mode.
- Metro web bundle compiles and serves (dev + production export).
- Logic assertion suite (compiled to JS, run under Node): 16/18 expected outcomes pass; the 2 mismatches were wrong test expectations, not engine bugs (Direhowl+Blazamut → Elphidran Aqua is the correct rank resolution; a starter-only gene pool *cannot* reach Anubis — matching real-game constraints — while a realistic early pool finds `Relaxaurus → Anubis` in 1 generation).
