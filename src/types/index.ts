/**
 * PALWORLD ULTIMATE COMPANION PDA — Core type system (v1.0 dataset model)
 * ---------------------------------------------------------------------
 * Every module (data, logic, hooks, components) is typed against these
 * interfaces. Field notes mark which values are datamined/verified vs
 * modeled (pending official tables) — see README "Data provenance".
 */

// ---------------------------------------------------------------------------
// ELEMENTS
// ---------------------------------------------------------------------------
export type ElementType =
  | 'Neutral'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Ground'
  | 'Dark'
  | 'Dragon';

export interface ElementDef {
  id: ElementType;
  color: string;
  /** Elements this element deals bonus damage to (×1.2–1.5 depending on target) */
  strongVs: ElementType[];
  weakVs: ElementType[];
}

// ---------------------------------------------------------------------------
// EGGS & BREEDING
// ---------------------------------------------------------------------------
export type EggType =
  | 'Common'
  | 'Damp'
  | 'Dragon'
  | 'Electric'
  | 'Rocky'
  | 'Scorching'
  | 'Verdant'
  | 'Frozen'
  | 'Dark';

export type EggSize = 'small' | 'medium' | 'large' | 'huge';

export interface EggDef {
  id: EggType;
  color: string;
  /** Base incubation minutes on default world settings (Normal). */
  incubationMinutes: Record<EggSize, number>;
}

/** Data provenance per Pal record. */
export type DataQuality =
  /** Full verified record: stats, BP, works, moves, drops, spawns. */
  | 'complete'
  /** Core record: stats, BP, egg, works. Moves/drops/spawns partial or absent. */
  | 'core'
  /** Registry record: identity + typing only. Excluded from BP-based math. */
  | 'minimal';

// ---------------------------------------------------------------------------
// PAL DECK
// ---------------------------------------------------------------------------
export interface PalStats {
  hp: number;
  meleeAtk: number;
  rangedAtk: number;
  def: number;
  workSpeed: number;
}

export type WorkType =
  | 'Handiwork'
  | 'Kindling'
  | 'Watering'
  | 'Planting'
  | 'Generating Electricity'
  | 'Medicine Production'
  | 'Gathering'
  | 'Lumbering'
  | 'Mining'
  | 'Cooling'
  | 'Transporting'
  | 'Farming';

export interface WorkSuitability {
  type: WorkType;
  /** v1.0 scale: 1–10 */
  level: number;
}

export interface PartnerSkill {
  name: string;
  description: string;
  /** Seconds of cooldown; 0 = passive */
  cooldownSec: number;
}

export interface ActiveSkill {
  id: string;
  /** Level at which the move is learned (0 = innate). */
  levelLearned: number;
}

export interface PalDrop {
  itemId: string;
  /** 0–100 */
  chance: number;
}

export type DayPhase = 'day' | 'night' | 'both';

export type RegionId =
  | 'windswept'
  | 'marsh'
  | 'eastern'
  | 'icewind'
  | 'forgotten'
  | 'volcanic'
  | 'desert'
  | 'verdant'
  | 'bamboo'
  | 'astral'
  | 'sakurajima'
  | 'sanctuary'
  | 'sunreach'
  | 'worldtree'
  | 'islets';

export interface SpawnLocation {
  region?: RegionId;
  label: string;
  /** In-game display coordinates (pal-map grid). */
  x: number;
  y: number;
  phase: DayPhase;
  isAlpha?: boolean;
  alphaLevel?: number;
}

export interface Pal {
  /** Unique slug (stable key). */
  id: string;
  dexNo: number;
  /** Official v1.0 Paldeck number where confirmed; null when legacy numbering used. */
  v10DexNo: number | null;
  name: string;
  title: string;
  elements: ElementType[];
  egg: EggType;
  eggSize: EggSize;
  /** Hidden CombiRank value (10–1500). Null = unknown → excluded from offspring math. */
  breedingPower: number | null;
  quality: DataQuality;
  /** Optional official artwork URL. When present, the portrait renders it;
   *  otherwise the procedural SVG avatar is used (no raster assets required). */
  imageUrl?: string;
  stats: PalStats | null;
  works: WorkSuitability[];
  partnerSkill: PartnerSkill | null;
  activeSkills: ActiveSkill[];
  drops: PalDrop[];
  spawns: SpawnLocation[];
  isAlphaBoss?: boolean;
  isRaidBoss?: boolean;
  lore: string;
}

// ---------------------------------------------------------------------------
// SKILLS (ACTIVE & PASSIVE)
// ---------------------------------------------------------------------------
export interface ActiveSkillDef {
  id: string;
  name: string;
  element: ElementType;
  power: number;
  /** Seconds */
  cooldownSec: number;
  /** CT cost (v1.0 CT system) */
  ct: number;
}

export interface PassiveSkillDef {
  id: string;
  name: string;
  tier: number;
  description: string;
  /** Stat modifiers, additive percentages. */
  effects: Partial<Record<'hp' | 'atk' | 'def' | 'workSpeed' | 'moveSpeed', number>>;
  /** True for the v1.0 mutation-exclusive pool (modeled — see README). */
  mutationExclusive?: boolean;
}

// ---------------------------------------------------------------------------
// ITEMS, DROPS & RECIPES
// ---------------------------------------------------------------------------
export type ItemCategory =
  | 'resource'
  | 'equipment'
  | 'schematic'
  | 'consumable'
  | 'cake'
  | 'material'
  | 'keyitem';

export interface ItemDef {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  /** Value tier for sorting: 1 common → 5 legendary */
  rarity: 1 | 2 | 3 | 4 | 5;
}

export interface Recipe {
  id: string;
  outputItemId: string;
  quantity: number;
  /** Station unlock tier */
  techLevel: number;
  station: string;
  ingredients: { itemId: string; quantity: number }[];
}

// ---------------------------------------------------------------------------
// CAKES (v1.0 breeding modifiers)
// ---------------------------------------------------------------------------
export type CakeId = 'standard' | 'mushroom' | 'vegetable' | 'deluxe' | 'special';

export interface CakeDef {
  id: CakeId;
  name: string;
  description: string;
  recipe: { itemId: string; quantity: number }[];
  /** Modeled multipliers — tunable in one place (see README data provenance). */
  modifiers: {
    mutationChanceMultiplier: number;
    inheritChanceMultiplier: number;
    doubleEggChance: number; // 0–1
    statFloorBonus: number; // 0–100 IV-equivalent bonus
    /** Special Cake: forces the child's parent-passive inheritance count to 4. */
    forceFourPassives?: boolean;
  };
}

// ---------------------------------------------------------------------------
// QUESTS & LORE
// ---------------------------------------------------------------------------
export type QuestCategory = 'main' | 'side' | 'raid' | 'collection';

export interface QuestStep {
  id: string;
  title: string;
  detail: string;
  done: boolean;
}

export interface QuestNode {
  id: string;
  category: QuestCategory;
  chapter: number;
  title: string;
  summary: string;
  region: RegionId;
  /** Quest-giver / unlock condition */
  unlock: string;
  steps: QuestStep[];
  rewards: string[];
  /** Tower / raid boss this node gates */
  bossRef?: string;
}

export interface BossGuide {
  id: string;
  name: string;
  palId: string | null;
  kind: 'tower' | 'raid';
  level: number;
  location: string;
  reward: string;
  strategy: string[];
  weaknesses: ElementType[];
}

export interface LoreEntry {
  id: string;
  title: string;
  region: RegionId;
  kind: 'diary' | 'lore' | 'secret' | 'ancient';
  text: string;
}

// ---------------------------------------------------------------------------
// MAP
// ---------------------------------------------------------------------------
export type MapPointType =
  | 'alpha'
  | 'tower'
  | 'effigy'
  | 'chest'
  | 'dungeon'
  | 'soralite'
  | 'fasttravel';

export interface MapPoint {
  id: string;
  type: MapPointType;
  label: string;
  /** Which bundled base map this point belongs to. */
  mapId: 'palpagos' | 'worldtree';
  region?: RegionId;
  /** In-game world coordinates (datamine units). */
  x: number;
  y: number;
  detail: string;
  palRef?: string;
  level?: number;
}

export interface ChecklistState {
  captured: Record<string, boolean>; // palId -> captured
  alphaDefeated: Record<string, boolean>; // mapPoint id
  found: Record<string, boolean>; // mapPoint id -> visited
}

// ---------------------------------------------------------------------------
// BREEDING RESULTS
// ---------------------------------------------------------------------------
export interface OffspringResult {
  /** null when the pairing cannot be resolved (unconfirmed Breeding Power). */
  child: Pal | null;
  bpTarget: number;
  formula: string;
  /** true when a special combo override fired */
  special: boolean;
  specialLabel?: string;
  egg: {
    type: EggType;
    egg: EggDef;
    size: EggSize;
    incubationMinutes: number;
  } | null;
}

export interface ParentPair {
  a: Pal;
  b: Pal;
  child: Pal;
  special: boolean;
  /** Same-species pair (self-replication) */
  sameSpecies?: boolean;
  /** Accessibility score 0–100: commons/early-game pairs score higher. */
  accessibility: number;
}

export interface BreedingPlan {
  id: string;
  name: string;
  targetPalId: string;
  parents: { a: string; b: string };
  cake: CakeId;
  desiredPassives: string[];
  targetIvs: Partial<Record<'hp' | 'meleeAtk' | 'rangedAtk' | 'def' | 'workSpeed', number>>;
  createdAt: number;
}

export interface MutationRoll {
  mutated: boolean;
  boostedStats: (keyof PalStats)[];
  growthBonusPct: number;
  exclusivePassive: string | null;
  cakeUsed: CakeId;
}

export interface MutationSimulation {
  trials: number;
  mutationChancePct: number;
  outcomeOdds: { mutated: number; clean: number; exclusivePassive: number };
  perStatBoostOdds: Record<keyof PalStats, number>;
  sampleRolls: MutationRoll[];
}

// ---------------------------------------------------------------------------
// FILTER / SORT (PALDECK ENGINE)
// ---------------------------------------------------------------------------
export interface PalFilterState {
  query: string;
  elements: ElementType[];
  /** Show pals having a work type at level >= threshold */
  workType: WorkType | null;
  workMinLevel: number; // 1–10
  eggType: EggType | null;
  region: RegionId | null;
  onlyCaptured: boolean;
  quality: DataQuality | null;
}

export type SortKey =
  | 'dex'
  | 'name'
  | 'hp'
  | 'meleeAtk'
  | 'rangedAtk'
  | 'def'
  | 'workSpeed'
  | 'breedingPower';

export interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// PERSISTENCE
// ---------------------------------------------------------------------------
export interface PersistedState {
  version: 1;
  checklist: ChecklistState;
  breedingPlans: BreedingPlan[];
}
