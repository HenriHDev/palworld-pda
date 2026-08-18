import type { Pal } from '../../types';
import { CHUNK1 } from './chunk1';
import { CHUNK2 } from './chunk2';
import { CHUNK3 } from './chunk3';
import { CHUNK4 } from './chunk4';
import { CHUNK5 } from './chunk5';
import { NEW_SPECIES } from './newSpecies';
import { YAKUSHIMA_PALS } from './yakushima';
import { DROP_PATCH } from './dropPatch';
import { OFFICIAL_PALS, type OfficialPalRecord } from './official';
import { OFFICIAL_SPECIAL_COMBOS } from './specialCombos';

// ============================================================================
// PAL REGISTRY — aggregates all chunks + datamine additions, then applies the
// OFFICIAL 1.0 game-file data (pal-atlas datamine): official Paldeck numbers,
// CombiRank breeding ranks, hp/attack/defense, elements and works.
// ============================================================================

/** Name aliases — community names → official game-file names. */
const NAME_ALIASES: Record<string, string> = {
  'ice kingpaca': 'kingpaca cryst',
  'ice reptyro': 'reptyro cryst',
  'snock lux': 'snock terra'
};

/** Species that only exist as one of the two aliases (skip the datamine twin). */
const SKIP_NEW_NAMES = new Set(['kingpaca cryst', 'reptyro cryst', 'snock terra']);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9_]/g, '');

const OFFICIAL_BY_NAME: Record<string, OfficialPalRecord> = Object.fromEntries(
  OFFICIAL_PALS.map((o) => [norm(o.name), o])
);

const rawPals: Pal[] = [...CHUNK1, ...CHUNK2, ...CHUNK3, ...CHUNK4, ...CHUNK5];

// Apply official data to every registry pal.
const basePals: Pal[] = rawPals.map((pal) => {
  const official = OFFICIAL_BY_NAME[norm(pal.name)] ?? OFFICIAL_BY_NAME[norm(NAME_ALIASES[norm(pal.name)] ?? pal.name)];
  if (!official) return pal;
  return {
    ...pal,
    v10DexNo: null, // dexNo below IS the official number now
    dexNo: official.dexNo,
    elements: official.elements.length > 0 ? official.elements : pal.elements,
    breedingPower: official.breedingRank,
    stats: pal.stats
      ? { ...pal.stats, hp: official.hp, meleeAtk: official.attack, def: official.defense }
      : { hp: official.hp, meleeAtk: official.attack, rangedAtk: official.attack, def: official.defense, workSpeed: 100 },
    works: official.works.length > 0 ? official.works : pal.works,
    quality: pal.quality === 'minimal' && pal.stats ? 'core' : pal.quality
  };
});

// Apply community drop-table patch (merged, higher chance wins on duplicates).
const patchedPals: Pal[] = basePals.map((pal) => {
  const patch = DROP_PATCH[pal.id];
  if (!patch || patch.length === 0) return pal;
  const merged = [...pal.drops];
  for (const d of patch) {
    const existing = merged.findIndex((x) => x.itemId === d.itemId);
    if (existing >= 0) {
      merged[existing] = { ...merged[existing], chance: Math.max(merged[existing].chance, d.chance) };
    } else {
      merged.push(d);
    }
  }
  return { ...pal, drops: merged };
});

// Append datamine species not yet present (skipping alias twins) + collab pals.
const added: Pal[] = [...NEW_SPECIES.filter((p) => !SKIP_NEW_NAMES.has(p.name.toLowerCase())), ...YAKUSHIMA_PALS];

export const ALL_PALS: Pal[] = [...patchedPals, ...added];

/** codename (case-insensitive) → id for the unique-pairs table. */
const codenameToId: Record<string, string> = {};
const idByName: Record<string, string> = {};
for (const p of ALL_PALS) idByName[norm(p.name)] = p.id;
idByName[norm('kingpaca cryst')] = 'ice_kingpaca';
idByName[norm('reptyro cryst')] = 'ice_reptyro';
idByName[norm('snock terra')] = 'snock_lux';
// Yakushima collab codenames → ids
const YAKUSHIMA_CODES: Record<string, string> = {
  yakushimamonster001: 'blue_slime',
  yakushimamonster001_blue: 'blue_slime',
  yakushimamonster001_red: 'red_slime',
  yakushimamonster001_purple: 'purple_slime',
  yakushimamonster001_pink: 'pink_slime',
  yakushimamonster001_rainbow: 'rainbow_slime',
  yakushimamonster002: 'enchanted_sword',
  yakushimamonster003: 'cave_bat',
  yakushimamonster003_purple: 'illuminant_bat',
  yakushimaboss001: 'eye_of_cthulhu',
  yakushimaboss001_small: 'demon_eye'
};
for (const o of OFFICIAL_PALS) {
  const id = idByName[norm(o.name)];
  if (id) codenameToId[norm(o.codename)] = id;
}
for (const [code, id] of Object.entries(YAKUSHIMA_CODES)) codenameToId[code] = id;

export const PAL_BY_ID: Record<string, Pal> = Object.fromEntries(ALL_PALS.map((p) => [p.id, p]));

export const PAL_BY_NAME: Record<string, Pal> = Object.fromEntries(
  ALL_PALS.map((p) => [p.name.toLowerCase(), p])
);

export const getPal = (id: string): Pal | undefined => PAL_BY_ID[id];

export const findPalByQuery = (query: string): Pal | undefined => {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const byId = PAL_BY_ID[q] ?? PAL_BY_ID[q.replace(/^0+/, '')];
  if (byId) return byId;
  const byNum = ALL_PALS.find((p) => {
    const plain = String(p.dexNo);
    const padded = plain.padStart(3, '0');
    return plain === q || padded === q || `#${padded}` === q || `#${plain}` === q;
  });
  if (byNum) return byNum;
  const byName = ALL_PALS.find((p) => p.name.toLowerCase() === q);
  if (byName) return byName;
  return ALL_PALS.find((p) => p.name.toLowerCase().includes(q));
};

/** Pals eligible as breeding parents (any pal with a known CombiRank). */
export const BREEDABLE_PALS: Pal[] = ALL_PALS.filter((p) => p.breedingPower !== null);

export const getPalsWithBp = (): Pal[] => BREEDABLE_PALS;

// ============================================================================
// OFFICIAL SPECIAL BREEDING COMBINATIONS (1.0) — 257 unique pairs from
// DT_PalCombiUnique. Override the CombiRank average entirely.
// ============================================================================
export interface SpecialCombo {
  a: string;
  b: string;
  child: string;
  altChild?: string;
  genderNote?: string;
}

export const SPECIAL_COMBOS: SpecialCombo[] = [];
const seenPairs = new Map<string, number>();
for (const c of OFFICIAL_SPECIAL_COMBOS) {
  const a = codenameToId[norm(c.parentA)];
  const b = codenameToId[norm(c.parentB)];
  const child = codenameToId[norm(c.child)];
  if (!a || !b || !child) continue;
  const key = [a, b].sort().join('|');
  const existingIdx = seenPairs.get(key);
  if (existingIdx !== undefined) {
    // gender-dependent pair — second outcome becomes the alternate child
    SPECIAL_COMBOS[existingIdx] = {
      ...SPECIAL_COMBOS[existingIdx],
      altChild: child,
      genderNote: c.genderNote ?? 'GENDER-DEPENDENT: outcome flips with parent gender.'
    };
    continue;
  }
  seenPairs.set(key, SPECIAL_COMBOS.length);
  SPECIAL_COMBOS.push({ a, b, child, genderNote: c.genderNote });
}

const comboKey = (a: string, b: string) => [a, b].sort().join('|');

const SPECIAL_MAP: Record<string, SpecialCombo> = Object.fromEntries(
  SPECIAL_COMBOS.map((c) => [comboKey(c.a, c.b), c])
);

/** Returns the fixed combo for a pair, or null. */
export const getSpecialCombo = (aId: string, bId: string): SpecialCombo | null =>
  SPECIAL_MAP[comboKey(aId, bId)] ?? null;

// ============================================================================
// FORMULA ELIGIBILITY — 1.0 rule: legendaries and special-combo children
// never appear as results of the averaging formula.
// ============================================================================
const LEGENDARIES = new Set([
  'jetragon',
  'frostallion',
  'frostallion_noct',
  'neptilius',
  'paladius',
  'necromus',
  'bellanoir',
  'bellanoir_libero'
]);

const RAID_BOSSES = new Set(['xenolord', 'blazamut_ryu', 'bellanoir', 'bellanoir_libero', 'astralym', 'panthalus']);

export const FORMULA_EXCLUDED: Set<string> = new Set<string>([
  ...LEGENDARIES,
  ...RAID_BOSSES,
  ...SPECIAL_COMBOS.flatMap((c) => [c.child, ...(c.altChild ? [c.altChild] : [])])
]);
