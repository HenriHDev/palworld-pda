import type { EggDef, EggType, OffspringResult, Pal, ParentPair } from '../types';
import { EGG_MAP } from '../data/elements';
import { FORMULA_EXCLUDED, getPal, getPalsWithBp, getSpecialCombo } from '../data/pals';

/**
 * BREEDING ENGINE — Palworld 1.0 rules (pal-atlas datamine, build 24575149):
 *
 *   ChildRank = floor( (RankA + RankB + 1) / 2 )
 *   Child     = the ELIGIBLE pal whose rank is closest to ChildRank.
 *               Ties resolve to the rarer (lower-rank) species — modeled;
 *               the game uses a hidden priority table not in this datamine.
 *
 * Eligibility (1.0): legendaries (Jetragon, Frostallion, Neptilius,
 * Paladius, Necromus, Bellanoir…) and every special-combo child can never
 * be produced by the average formula. Same-species pairs always produce
 * that species. The 257 official unique pairs override everything.
 */

const RANK_ORDER: Pal[] = [...getPalsWithBp()]
  .filter((p) => !FORMULA_EXCLUDED.has(p.id))
  .sort((a, b) => (b.breedingPower! - a.breedingPower!) || a.id.localeCompare(b.id));

/** Closest eligible pal to `target`; ties → rarer (lower rank). */
const resolveRank = (target: number): Pal | null => {
  let best: Pal | null = null;
  let bestDist = Infinity;
  for (const pal of RANK_ORDER) {
    const dist = Math.abs(pal.breedingPower! - target);
    if (dist < bestDist || (dist === bestDist && best && pal.breedingPower! < best.breedingPower!)) {
      best = pal;
      bestDist = dist;
    }
    if (pal.breedingPower! < target && dist > bestDist) break; // sorted desc — done
  }
  return best;
};

export const eggInfo = (type: EggType, size: Pal['eggSize']): { type: EggType; egg: EggDef; size: Pal['eggSize']; incubationMinutes: number } => {
  const egg = EGG_MAP[type];
  return { type, egg, size, incubationMinutes: egg.incubationMinutes[size] };
};

/** Parent → Offspring. Core entry point for the calculator. */
export function getOffspring(aId: string, bId: string): OffspringResult | null {
  const a = getPal(aId);
  const b = getPal(bId);
  if (!a || !b) return null;

  // Special combination override (before anything else).
  const special = getSpecialCombo(aId, bId);
  if (special) {
    const child = getPal(special.child);
    if (child) {
      const note = special.genderNote
        ? ` ⚤ ${special.genderNote}`
        : '';
      const alt = special.altChild ? getPal(special.altChild) : null;
      return {
        child,
        bpTarget: 0,
        formula: `Special combination: ${a.name} + ${b.name} → fixed result (overrides CombiRank).${note}${alt ? ` Alternate outcome: ${alt.name}.` : ''}`,
        special: true,
        specialLabel: 'OFFICIAL SPECIAL COMBO',
        egg: eggInfo(child.egg, child.eggSize)
      };
    }
  }

  // Same species always breeds true.
  if (aId === bId) {
    return {
      child: a,
      bpTarget: a.breedingPower ?? 0,
      formula: 'Same-species pair — offspring is always the same species.',
      special: false,
      egg: eggInfo(a.egg, a.eggSize)
    };
  }

  if (a.breedingPower === null || b.breedingPower === null) {
    const missing = a.breedingPower === null ? a : b;
    return {
      child: null,
      bpTarget: 0,
      formula: `${missing.name} has no CombiRank in the datamine — this pairing cannot be resolved.`,
      special: true,
      specialLabel: 'UNRESOLVED',
      egg: null
    };
  }

  const target = Math.floor((a.breedingPower + b.breedingPower + 1) / 2);
  const child = resolveRank(target);
  if (!child) return null;

  return {
    child,
    bpTarget: target,
    formula: `floor((${a.breedingPower} + ${b.breedingPower} + 1) / 2) = ${target} → nearest eligible rank ${child.breedingPower} (${child.name})`,
    special: false,
    egg: eggInfo(child.egg, child.eggSize)
  };
}

/**
 * Offspring → Parents. Every valid parent pair for a target Pal, sorted by
 * early-game accessibility (special combos and same-species first).
 */
export function findAllParentPairs(targetId: string): ParentPair[] {
  const target = getPal(targetId);
  if (!target) return [];
  const pool = getPalsWithBp();
  const pairs: ParentPair[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < pool.length; i++) {
    for (let j = i; j < pool.length; j++) {
      const a = pool[i];
      const b = pool[j];
      const key = `${a.id}|${b.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const result = getOffspring(a.id, b.id);
      if (!result || !result.child) continue;
      if (result.child.id !== targetId) continue;
      pairs.push({
        a,
        b,
        child: target,
        special: result.special,
        sameSpecies: a.id === b.id,
        accessibility: accessibilityScore(a, b)
      });
    }
  }

  return pairs.sort((x, y) => {
    if (x.sameSpecies !== y.sameSpecies) return x.sameSpecies ? -1 : 1;
    if (x.special !== y.special) return x.special ? -1 : 1;
    return y.accessibility - x.accessibility;
  });
}

/**
 * Accessibility heuristic (0–100) on the 1.0 CombiRank scale (10–3080):
 * high ranks are commons found in the first hours; low ranks are endgame.
 */
export function accessibilityScore(a: Pal, b: Pal): number {
  const rankScore = (p: Pal) => Math.min(100, Math.max(0, ((p.breedingPower ?? 1500) - 10) / 30.7));
  const rankA = rankScore(a);
  const rankB = rankScore(b);
  const bothCommon = rankA >= 60 && rankB >= 60 ? 15 : 0;
  const regionOverlap = a.spawns.some((sa) => b.spawns.some((sb) => sa.region === sb.region && sa.region !== undefined)) ? 10 : 0;
  const elementMatch = a.elements.some((e) => b.elements.includes(e)) ? 5 : 0;
  return Math.round(rankA * 0.35 + rankB * 0.35 + bothCommon + regionOverlap + elementMatch);
}

export interface ChainNode {
  pal: Pal;
  recipe: { aId: string; bId: string; special: boolean } | null;
  depth: number;
}

export interface ChainPlan {
  found: boolean;
  path: ChainNode[]; // ordered from target back to a starting (owned) pal
  frontierCount: number;
}

/**
 * Breeding-chain solver: BFS over reachable species from the owned pool.
 */
export function findBreedingChain(
  ownedIds: string[],
  targetId: string,
  maxDepth = 3
): ChainPlan {
  const owned = new Set(ownedIds.map((id) => getPal(id)).filter((p): p is Pal => !!p).map((p) => p.id));
  if (owned.has(targetId)) {
    return { found: true, path: [{ pal: getPal(targetId)!, recipe: null, depth: 0 }], frontierCount: owned.size };
  }

  const pool = getPalsWithBp();
  const reachable: Map<string, ChainNode> = new Map();
  owned.forEach((id) => {
    const p = getPal(id);
    if (p) reachable.set(id, { pal: p, recipe: null, depth: 0 });
  });

  for (let depth = 1; depth <= maxDepth; depth++) {
    const currentIds = [...reachable.keys()];
    const additions: ChainNode[] = [];

    for (let i = 0; i < currentIds.length; i++) {
      for (let j = i; j < currentIds.length; j++) {
        const aId = currentIds[i];
        const bId = currentIds[j];
        const result = getOffspring(aId, bId);
        if (!result || !result.child) continue;
        if (result.child.breedingPower === null) continue;
        if (reachable.has(result.child.id)) continue;
        additions.push({
          pal: result.child,
          recipe: { aId, bId, special: result.special },
          depth
        });
      }
    }

    // Deterministic preference: special combos first, then accessibility.
    additions.sort((x, y) => {
      if (x.recipe!.special !== y.recipe!.special) return x.recipe!.special ? -1 : 1;
      const xa = getPal(x.recipe!.aId)!;
      const xb = getPal(x.recipe!.bId)!;
      const ya = getPal(y.recipe!.aId)!;
      const yb = getPal(y.recipe!.bId)!;
      return accessibilityScore(ya, yb) - accessibilityScore(xa, xb);
    });

    for (const node of additions) {
      if (!reachable.has(node.pal.id)) reachable.set(node.pal.id, node);
      if (node.pal.id === targetId) {
        return { found: true, path: backtrace(reachable, targetId), frontierCount: reachable.size };
      }
    }
  }

  return { found: false, path: [], frontierCount: reachable.size };
}

function backtrace(reachable: Map<string, ChainNode>, targetId: string): ChainNode[] {
  const path: ChainNode[] = [];
  let id: string | undefined = targetId;
  const guard = new Set<string>();
  while (id && !guard.has(id)) {
    guard.add(id);
    const node = reachable.get(id);
    if (!node) break;
    path.push(node);
    if (!node.recipe) break;
    const a = reachable.get(node.recipe.aId);
    const b = reachable.get(node.recipe.bId);
    const next = (a?.depth ?? -1) >= (b?.depth ?? -1) ? a : b;
    id = next?.pal.id;
  }
  return path.reverse();
}
