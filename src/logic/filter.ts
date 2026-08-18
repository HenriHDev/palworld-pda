import type { Pal, PalFilterState, SortState } from '../types';
import { ALL_PALS } from '../data/pals';

/**
 * PALDECK SEARCH / FILTER / SORT ENGINE — pure functions, no side effects.
 * Search matches: id, dex number (#001), name (fuzzy), title.
 * Filters combine with AND semantics; sort supports asc/desc on any key.
 */
export function filterPals(
  pals: Pal[],
  filter: PalFilterState,
  captured: Record<string, boolean>
): Pal[] {
  const q = filter.query.trim().toLowerCase();

  return pals.filter((pal) => {
    if (q) {
      const hay = `${pal.id} ${pal.name} ${pal.title} #${String(pal.dexNo).padStart(3, '0')} ${pal.dexNo} ${pal.v10DexNo ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filter.elements.length > 0) {
      if (!filter.elements.some((e) => pal.elements.includes(e))) return false;
    }
    if (filter.workType) {
      const work = pal.works.find((w) => w.type === filter.workType);
      if (!work || work.level < filter.workMinLevel) return false;
    }
    if (filter.eggType && pal.egg !== filter.eggType) return false;
    if (filter.region) {
      if (!pal.spawns.some((s) => s.region === filter.region)) return false;
    }
    if (filter.onlyCaptured && !captured[pal.id]) return false;
    if (filter.quality && pal.quality !== filter.quality) return false;
    return true;
  });
}

export function sortPals(pals: Pal[], sort: SortState): Pal[] {
  const dir = sort.dir === 'asc' ? 1 : -1;
  const val = (p: Pal): number => {
    switch (sort.key) {
      case 'dex':
        return p.dexNo;
      case 'name':
        return 0;
      case 'hp':
        return p.stats?.hp ?? -1;
      case 'meleeAtk':
        return p.stats?.meleeAtk ?? -1;
      case 'rangedAtk':
        return p.stats?.rangedAtk ?? -1;
      case 'def':
        return p.stats?.def ?? -1;
      case 'workSpeed':
        return p.stats?.workSpeed ?? -1;
      case 'breedingPower':
        return p.breedingPower ?? -1;
      default:
        return p.dexNo;
    }
  };

  return [...pals].sort((a, b) => {
    if (sort.key === 'name') return a.name.localeCompare(b.name) * dir;
    const av = val(a);
    const bv = val(b);
    if (av === bv) return a.dexNo - b.dexNo;
    return (av - bv) * dir;
  });
}

export const DECK_MAX: Record<string, number> = ALL_PALS.reduce(
  (acc, p) => {
    if (!p.stats) return acc;
    acc.hp = Math.max(acc.hp, p.stats.hp);
    acc.meleeAtk = Math.max(acc.meleeAtk, p.stats.meleeAtk);
    acc.rangedAtk = Math.max(acc.rangedAtk, p.stats.rangedAtk);
    acc.def = Math.max(acc.def, p.stats.def);
    acc.workSpeed = Math.max(acc.workSpeed, p.stats.workSpeed);
    return acc;
  },
  { hp: 0, meleeAtk: 0, rangedAtk: 0, def: 0, workSpeed: 0 }
);

export const captureProgress = (captured: Record<string, boolean>): { caught: number; total: number; pct: number } => {
  const total = ALL_PALS.length;
  const caught = ALL_PALS.filter((p) => captured[p.id]).length;
  return { caught, total, pct: total > 0 ? Math.round((caught / total) * 100) : 0 };
};
