import type { Pal, PalStats, PassiveSkillDef } from '../types';
import { PASSIVE_MAP } from '../data/skills';

/**
 * STAT ENGINE — level-1 base stats → projected stats at level L with IVs
 * (0–30 per stat) and passive modifiers. Follows the community-documented
 * growth model: stat = base + base × 0.075 × (L−1) × (1 + IV/100), plus
 * additive passive percentages. HP additionally gets +500 flat (player-Pals
 * convention) — tunable constants below.
 */
export const STAT_GROWTH = 0.075;
export const HP_FLAT_BONUS = 500;
export const IV_MAX = 30;

export interface StatProjection {
  hp: number;
  meleeAtk: number;
  rangedAtk: number;
  def: number;
  workSpeed: number;
}

export interface Ivs {
  hp: number;
  meleeAtk: number;
  rangedAtk: number;
  def: number;
  workSpeed: number;
}

export const EMPTY_IVS: Ivs = { hp: 0, meleeAtk: 0, rangedAtk: 0, def: 0, workSpeed: 0 };

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function projectStats(
  pal: Pal,
  level: number,
  ivs: Ivs = EMPTY_IVS,
  passives: string[] = []
): StatProjection {
  const base: PalStats = pal.stats ?? { hp: 100, meleeAtk: 100, rangedAtk: 100, def: 100, workSpeed: 100 };
  const lvl = clamp(Math.round(level), 1, 80);
  const mods = passiveMods(passives);

  const growth = (b: number, iv: number) =>
    b * STAT_GROWTH * (lvl - 1) * (1 + clamp(iv, 0, IV_MAX) / 100);

  return {
    hp: Math.floor(HP_FLAT_BONUS + base.hp + growth(base.hp, ivs.hp) * (1 + (mods.hp ?? 0) / 100)),
    meleeAtk: Math.floor((base.meleeAtk + growth(base.meleeAtk, ivs.meleeAtk)) * (1 + (mods.atk ?? 0) / 100)),
    rangedAtk: Math.floor((base.rangedAtk + growth(base.rangedAtk, ivs.rangedAtk)) * (1 + (mods.atk ?? 0) / 100)),
    def: Math.floor((base.def + growth(base.def, ivs.def)) * (1 + (mods.def ?? 0) / 100)),
    workSpeed: Math.floor((base.workSpeed + growth(base.workSpeed, ivs.workSpeed)) * (1 + (mods.workSpeed ?? 0) / 100))
  };
}

export function passiveMods(passives: string[]): Partial<Record<'hp' | 'atk' | 'def' | 'workSpeed' | 'moveSpeed', number>> {
  const out: Record<string, number> = {};
  for (const id of passives) {
    const def: PassiveSkillDef | undefined = PASSIVE_MAP[id];
    if (!def) continue;
    for (const [k, v] of Object.entries(def.effects)) {
      out[k] = (out[k] ?? 0) + v;
    }
  }
  return out;
}

/**
 * Percentile rank helpers removed — deck maxima live in logic/filter.ts
 * (single source of truth).
 */
