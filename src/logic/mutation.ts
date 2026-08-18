import type {
  CakeDef,
  MutationRoll,
  MutationSimulation,
  Pal,
  PalStats,
  PassiveSkillDef
} from '../types';
import { CAKE_MAP } from '../data/items';
import { MUTATION_PASSIVES, PASSIVE_MAP } from '../data/skills';
import { getPal } from '../data/pals';
import { createRng, pick, type Rng } from './rng';

/**
 * MUTATION & PASSIVE INHERITANCE — Palworld 1.0 rules (wiki.gg / community
 * datamines, v1.0.3):
 *
 *  EGG MUTATION
 *    Base 1% per egg. The Extravagant (Deluxe) Vegetable Cake raises it to
 *    3%. A mutated egg hatches:
 *      - a rarer species than the parents (stronger breeding score),
 *      - at Condensation level 2 (★★),
 *      - always Alpha,
 *      - IVs of at least 90,
 *      - 4 passives with at least two Tier-4s, including ONE
 *        mutation-exclusive passive (Immortality / Idiosyncratic /
 *        Babysitter / Heavily Armored / Lightfooted / God of Destruction).
 *    The conditional species distribution is MODELED (the native
 *    mutation-rank coefficient table is not publicly dumped): eligible
 *    species are those with a breeding rank LOWER (stronger) than the
 *    weaker-ranked parent, weighted by 1/(rank gap). Tunable below.
 *
 *  PASSIVE INHERITANCE (1.0 table)
 *    The child inherits 1/2/3/4 parent passives with probabilities
 *    40% / 30% / 20% / 10%, then draws that many DISTINCT passives from the
 *    unique union of both parents' pools. Remaining slots fill with random
 *    non-mutation passives. The Special Cake forces the count to 4.
 */

export const BASE_MUTATION = 0.01; // 1% per egg
export const MUTATION_IV_MIN = 90; // mutated eggs: IV floor
export const MUTATION_CONDENSATION = 2; // ★★

const INHERIT_COUNT_PROBS: Record<number, number> = { 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1 };

const RANDOM_POOL = Object.values(PASSIVE_MAP).filter((p) => !p.mutationExclusive);

const STAT_KEYS: (keyof PalStats)[] = ['hp', 'meleeAtk', 'rangedAtk', 'def', 'workSpeed'];

/** Distinct union of both parents' passives. */
export const parentPool = (a: string[], b: string[]): PassiveSkillDef[] => {
  const seen = new Set<string>();
  const out: PassiveSkillDef[] = [];
  for (const id of [...a, ...b]) {
    if (seen.has(id)) continue;
    seen.add(id);
    const def = PASSIVE_MAP[id];
    if (def) out.push(def);
  }
  return out;
};

export interface InheritanceSim {
  desired: string[];
  cake: CakeDef;
  trials: number;
  empiricalChance: number;
  expectedEggs: number;
  /** per-passive P(appears on child) — closed form */
  perPassive: Record<string, number>;
}

const C = (n: number, k: number): number => {
  if (k > n) return 0;
  let num = 1;
  let den = 1;
  for (let i = 0; i < k; i++) {
    num *= n - i;
    den *= i + 1;
  }
  return num / den;
};

/**
 * Closed-form P(passive appears), count-based 1.0 model.
 * A passive appears either by inheritance (k-of-pool draw) or as a random
 * fill in one of the remaining slots (random pool = non-mutation-exclusive
 * passives, which includes many parent passives).
 */
function passiveAppearOdds(poolSize: number, forceFour: boolean): number {
  let p = 0;
  const randN = RANDOM_POOL.length || 1;
  for (let k = 1; k <= 4; k++) {
    const probK = forceFour ? (k === 4 ? 1 : 0) : INHERIT_COUNT_PROBS[k];
    if (poolSize === 0) continue;
    const share = Math.min(1, k / Math.max(1, poolSize));
    const fillShare = (4 - Math.min(k, poolSize)) / randN;
    p += probK * (share + fillShare);
  }
  return Math.min(1, p);
}

/** Monte-Carlo estimate of inheriting every desired passive onto the child. */
export function simulateInheritance(
  parentAPassives: string[],
  parentBPassives: string[],
  desired: string[],
  cakeId: string,
  trials = 50000,
  seed = 1337
): InheritanceSim {
  const cake = CAKE_MAP[cakeId] ?? CAKE_MAP.standard;
  const forceFour = !!cake.modifiers.forceFourPassives;
  const pool = parentPool(parentAPassives, parentBPassives);
  const rng = createRng(seed);
  let hits = 0;

  for (let t = 0; t < trials; t++) {
    // 1. roll inheritance count
    let count = 4;
    if (!forceFour) {
      const r = rng();
      count = r < 0.4 ? 1 : r < 0.7 ? 2 : r < 0.9 ? 3 : 4;
    }
    count = Math.min(count, Math.max(0, pool.length));
    // 2. draw `count` distinct passives from the unique pool (Fisher–Yates)
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const child: string[] = shuffled.slice(0, count).map((d) => d.id);
    // 3. fill remaining slots randomly
    while (child.length < 4) {
      const def = RANDOM_POOL.length > 0 ? pick(rng, RANDOM_POOL) : shuffled[0];
      child.push(def.id);
    }
    if (desired.every((d) => child.includes(d))) hits++;
  }

  const empiricalChance = hits / trials;
  const perPassive: Record<string, number> = {};
  const poolSize = pool.length;
  for (const id of [...parentAPassives, ...parentBPassives]) {
    if (PASSIVE_MAP[id] && perPassive[id] === undefined) {
      perPassive[id] = passiveAppearOdds(poolSize, forceFour);
    }
  }

  return {
    desired,
    cake,
    trials,
    empiricalChance,
    expectedEggs: empiricalChance > 0 ? Math.ceil(1 / empiricalChance) : Infinity,
    perPassive
  };
}

// ============================================================================
// MUTATED-SPECIES DISTRIBUTION (modeled — see header note)
// ============================================================================
export interface MutationSpeciesEntry {
  pal: Pal;
  /** conditional probability given the egg mutated (0–1) */
  conditionalPct: number;
}

const MUTATION_WINDOW = 900; // rank window below the weaker parent
const EXCLUDED_MUTATION_IDS = new Set(['astralym', 'panthalus']); // story-only species

/** Top mutated species for a parent pair, weighted rarer-closer first. */
export function mutationSpeciesDistribution(
  parentA: Pal,
  parentB: Pal
): MutationSpeciesEntry[] {
  const minRank = Math.min(parentA.breedingPower ?? 9999, parentB.breedingPower ?? 9999);
  const pool = Object.values(require('../data/pals').PAL_BY_ID as Record<string, Pal>).filter(
    (p) =>
      p.breedingPower !== null &&
      p.breedingPower < minRank &&
      p.id !== parentA.id &&
      p.id !== parentB.id &&
      !EXCLUDED_MUTATION_IDS.has(p.id)
  );
  if (pool.length === 0) return [];

  const weighted = pool.map((p) => {
    const gap = minRank - p.breedingPower!;
    const weight = 1 / (gap + 25); // species just below the parents dominate
    return { p, weight };
  });
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  return weighted
    .map(({ p, weight }) => ({ pal: p, conditionalPct: weight / total }))
    .sort((a, b) => b.conditionalPct - a.conditionalPct);
}

export function rollMutation(cakeId: string, rng: Rng): MutationRoll {
  const cake = CAKE_MAP[cakeId] ?? CAKE_MAP.standard;
  const chance = BASE_MUTATION * cake.modifiers.mutationChanceMultiplier;
  const mutated = rng() < chance;

  if (!mutated) {
    return { mutated: false, boostedStats: [], growthBonusPct: 0, exclusivePassive: null, cakeUsed: cake.id };
  }

  const count = 1 + Math.floor(rng() * 3); // 1–3 boosted stats
  const shuffled = [...STAT_KEYS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const boostedStats = shuffled.slice(0, count);
  const growthBonusPct = Math.round(2 + rng() * 8); // +2–10%
  const exclusivePassive = pick(rng, MUTATION_PASSIVES); // always one on mutated eggs

  return { mutated: true, boostedStats, growthBonusPct, exclusivePassive, cakeUsed: cake.id };
}

export function simulateMutations(cakeId: string, trials = 20000, seed = 42): MutationSimulation {
  const cake = CAKE_MAP[cakeId] ?? CAKE_MAP.standard;
  const chance = BASE_MUTATION * cake.modifiers.mutationChanceMultiplier;
  const rng = createRng(seed);

  let mutated = 0;
  let exclusive = 0;
  const perStatBoostOdds: Record<keyof PalStats, number> = {
    hp: 0,
    meleeAtk: 0,
    rangedAtk: 0,
    def: 0,
    workSpeed: 0
  };
  const sampleRolls: MutationRoll[] = [];

  for (let t = 0; t < trials; t++) {
    const roll = rollMutation(cakeId, rng);
    if (roll.mutated) {
      mutated++;
      if (roll.exclusivePassive) exclusive++;
      for (const s of roll.boostedStats) perStatBoostOdds[s]++;
      if (sampleRolls.length < 6) sampleRolls.push(roll);
    }
  }

  return {
    trials,
    mutationChancePct: chance * 100,
    outcomeOdds: {
      mutated: mutated / trials,
      clean: (mutated - exclusive) / trials,
      exclusivePassive: exclusive / trials
    },
    perStatBoostOdds: Object.fromEntries(
      STAT_KEYS.map((k) => [k, perStatBoostOdds[k] / trials])
    ) as Record<keyof PalStats, number>,
    sampleRolls
  };
}

export { MUTATION_IV_MIN as IV_MIN_MUTATED };
export { MUTATION_CONDENSATION as CONDENSATION_STARS };
