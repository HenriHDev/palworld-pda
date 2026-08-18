import type { ActiveSkillDef, PassiveSkillDef } from '../types';

/**
 * ACTIVE SKILL DATABASE — representative v1.0 moveset (names/power/cooldown
 * follow the community datamined tables; CT values from the v1.0 CT system).
 */
export const ACTIVE_SKILLS: ActiveSkillDef[] = [
  { id: 'air_cannon', name: 'Air Cannon', element: 'Neutral', power: 25, cooldownSec: 2, ct: 0 },
  { id: 'power_shot', name: 'Power Shot', element: 'Neutral', power: 35, cooldownSec: 4, ct: 4 },
  { id: 'power_bomb', name: 'Power Bomb', element: 'Neutral', power: 70, cooldownSec: 15, ct: 14 },
  { id: 'wind_cutter', name: 'Wind Cutter', element: 'Grass', power: 30, cooldownSec: 2, ct: 4 },
  { id: 'sand_blast', name: 'Sand Blast', element: 'Ground', power: 40, cooldownSec: 4, ct: 4 },
  { id: 'sand_tornado', name: 'Sand Tornado', element: 'Ground', power: 80, cooldownSec: 18, ct: 16 },
  { id: 'stone_cannon', name: 'Stone Cannon', element: 'Ground', power: 70, cooldownSec: 15, ct: 14 },
  { id: 'rock_lance', name: 'Rock Lance', element: 'Ground', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'ignis_blast', name: 'Ignis Blast', element: 'Fire', power: 30, cooldownSec: 2, ct: 4 },
  { id: 'flare_storm', name: 'Flare Storm', element: 'Fire', power: 80, cooldownSec: 18, ct: 16 },
  { id: 'fire_ball', name: 'Fire Ball', element: 'Fire', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'spirit_fire', name: 'Spirit Fire', element: 'Fire', power: 45, cooldownSec: 7, ct: 8 },
  { id: 'flame_wall', name: 'Flame Wall', element: 'Fire', power: 60, cooldownSec: 10, ct: 10 },
  { id: 'flare_arrow', name: 'Flare Arrow', element: 'Fire', power: 55, cooldownSec: 10, ct: 10 },
  { id: 'fire_blast', name: 'Fire Blast', element: 'Fire', power: 120, cooldownSec: 40, ct: 32 },
  { id: 'aqua_gun', name: 'Aqua Gun', element: 'Water', power: 40, cooldownSec: 4, ct: 4 },
  { id: 'bubble_blast', name: 'Bubble Blast', element: 'Water', power: 65, cooldownSec: 13, ct: 12 },
  { id: 'hydro_jet', name: 'Hydro Jet', element: 'Water', power: 95, cooldownSec: 40, ct: 32 },
  { id: 'water_gun', name: 'Water Gun', element: 'Water', power: 25, cooldownSec: 2, ct: 0 },
  { id: 'hydro_laser', name: 'Hydro Laser', element: 'Water', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'aqua_burst', name: 'Aqua Burst', element: 'Water', power: 100, cooldownSec: 30, ct: 26 },
  { id: 'spark_blast', name: 'Spark Blast', element: 'Electric', power: 30, cooldownSec: 2, ct: 4 },
  { id: 'shockwave', name: 'Shockwave', element: 'Electric', power: 40, cooldownSec: 4, ct: 4 },
  { id: 'electric_ball', name: 'Electric Ball', element: 'Electric', power: 50, cooldownSec: 9, ct: 8 },
  { id: 'lightning_strike', name: 'Lightning Strike', element: 'Electric', power: 120, cooldownSec: 40, ct: 32 },
  { id: 'lightning_bolt', name: 'Lightning Bolt', element: 'Electric', power: 90, cooldownSec: 40, ct: 32 },
  { id: 'thunder_rain', name: 'Thunder Rain', element: 'Electric', power: 90, cooldownSec: 45, ct: 40 },
  { id: 'lock_on_laser', name: 'Lock-On Laser', element: 'Electric', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'tri_lightning', name: 'Tri-Lightning', element: 'Electric', power: 100, cooldownSec: 22, ct: 22 },
  { id: 'icicle_cutter', name: 'Icicle Cutter', element: 'Ice', power: 55, cooldownSec: 10, ct: 10 },
  { id: 'ice_missile', name: 'Ice Missile', element: 'Ice', power: 30, cooldownSec: 3, ct: 4 },
  { id: 'blizzard_spike', name: 'Blizzard Spike', element: 'Ice', power: 130, cooldownSec: 45, ct: 40 },
  { id: 'cryst_breath', name: 'Cryst Breath', element: 'Ice', power: 90, cooldownSec: 22, ct: 22 },
  { id: 'frost_breath', name: 'Frost Breath', element: 'Ice', power: 70, cooldownSec: 15, ct: 14 },
  { id: 'iceberg', name: 'Iceberg', element: 'Ice', power: 70, cooldownSec: 15, ct: 14 },
  { id: 'dragon_cannon', name: 'Dragon Cannon', element: 'Dragon', power: 30, cooldownSec: 2, ct: 4 },
  { id: 'dragon_meteor', name: 'Dragon Meteor', element: 'Dragon', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'dragon_burst', name: 'Dragon Burst', element: 'Dragon', power: 55, cooldownSec: 10, ct: 10 },
  { id: 'dragon_breath', name: 'Dragon Breath', element: 'Dragon', power: 70, cooldownSec: 15, ct: 14 },
  { id: 'dark_ball', name: 'Dark Ball', element: 'Dark', power: 40, cooldownSec: 4, ct: 4 },
  { id: 'shadow_burst', name: 'Shadow Burst', element: 'Dark', power: 55, cooldownSec: 10, ct: 10 },
  { id: 'nightmare_ball', name: 'Nightmare Ball', element: 'Dark', power: 100, cooldownSec: 30, ct: 26 },
  { id: 'apocalypse', name: 'Apocalypse', element: 'Dark', power: 100, cooldownSec: 30, ct: 26 },
  { id: 'poison_blast', name: 'Poison Blast', element: 'Dark', power: 30, cooldownSec: 2, ct: 4 },
  { id: 'dark_laser', name: 'Dark Laser', element: 'Dark', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'seed_machine_gun', name: 'Seed Machine Gun', element: 'Grass', power: 50, cooldownSec: 9, ct: 8 },
  { id: 'seed_mine', name: 'Seed Mine', element: 'Grass', power: 65, cooldownSec: 13, ct: 12 },
  { id: 'grass_tornado', name: 'Grass Tornado', element: 'Grass', power: 80, cooldownSec: 18, ct: 16 },
  { id: 'solar_blast', name: 'Solar Blast', element: 'Grass', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'spine_rain', name: 'Spine Rain', element: 'Grass', power: 75, cooldownSec: 14, ct: 14 },
  { id: 'mega_implant', name: 'Mega Implant', element: 'Grass', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'pal_blast', name: 'Pal Blast', element: 'Neutral', power: 150, cooldownSec: 55, ct: 50 },
  { id: 'implode', name: 'Implode', element: 'Neutral', power: 180, cooldownSec: 55, ct: 50 },
  { id: 'twin_spears', name: 'Twin Spears', element: 'Dragon', power: 120, cooldownSec: 40, ct: 32 },
  { id: 'divine_disaster', name: 'Divine Disaster', element: 'Neutral', power: 145, cooldownSec: 45, ct: 40 },
  { id: 'meteor_rain', name: 'Meteor Rain', element: 'Fire', power: 130, cooldownSec: 45, ct: 40 },
  { id: 'crystal_wing', name: 'Crystal Wing', element: 'Ice', power: 110, cooldownSec: 24, ct: 24 },
  { id: 'crystal_breath', name: 'Crystal Breath', element: 'Ice', power: 90, cooldownSec: 22, ct: 22 },
  { id: 'sacred_light', name: 'Sacred Light', element: 'Neutral', power: 100, cooldownSec: 30, ct: 26 }
];

export const SKILL_MAP: Record<string, ActiveSkillDef> = Object.fromEntries(
  ACTIVE_SKILLS.map((s) => [s.id, s])
);

/**
 * PASSIVE SKILL DATABASE — the standard community-documented pool plus the
 * v1.0 mutation-exclusive pool (marked `mutationExclusive`, modeled).
 */
export const PASSIVE_SKILLS: PassiveSkillDef[] = [
  { id: 'legend', name: 'Legend', tier: 3, description: '+20% ATK, +20% DEF, +15% move speed', effects: { atk: 20, def: 20, moveSpeed: 15 } },
  { id: 'lucky', name: 'Lucky', tier: 3, description: '+15% ATK, +15% Work Speed', effects: { atk: 15, workSpeed: 15 } },
  { id: 'ferocious', name: 'Ferocious', tier: 2, description: '+20% ATK', effects: { atk: 20 } },
  { id: 'musclehead', name: 'Musclehead', tier: 2, description: '+30% ATK, -50% Work Speed', effects: { atk: 30, workSpeed: -50 } },
  { id: 'burly_body', name: 'Burly Body', tier: 2, description: '+20% DEF', effects: { def: 20 } },
  { id: 'brave', name: 'Brave', tier: 1, description: '+10% ATK', effects: { atk: 10 } },
  { id: 'aggressive', name: 'Aggressive', tier: 1, description: '+10% ATK, -10% DEF', effects: { atk: 10, def: -10 } },
  { id: 'swift', name: 'Swift', tier: 3, description: '+30% move speed', effects: { moveSpeed: 30 } },
  { id: 'runner', name: 'Runner', tier: 2, description: '+20% move speed', effects: { moveSpeed: 20 } },
  { id: 'nimble', name: 'Nimble', tier: 1, description: '+10% move speed', effects: { moveSpeed: 10 } },
  { id: 'artisan', name: 'Artisan', tier: 2, description: '+50% Work Speed', effects: { workSpeed: 50 } },
  { id: 'serious', name: 'Serious', tier: 2, description: '+20% Work Speed', effects: { workSpeed: 20 } },
  { id: 'work_slave', name: 'Work Slave', tier: 2, description: '+30% Work Speed, -30% ATK', effects: { workSpeed: 30, atk: -30 } },
  { id: 'workaholic', name: 'Workaholic', tier: 1, description: '+15% Work Speed, SAN drains slower', effects: { workSpeed: 15 } },
  { id: 'diet_lover', name: 'Diet Lover', tier: 1, description: 'Hunger drains slower', effects: {} },
  { id: 'dainty_eater', name: 'Dainty Eater', tier: 1, description: 'Hunger drains slower (small)', effects: {} },
  { id: 'vanguard', name: 'Vanguard', tier: 2, description: '+10% player ATK while in team', effects: {} },
  { id: 'stronghold_strategist', name: 'Stronghold Strategist', tier: 2, description: '+10% player DEF while in team', effects: {} },
  { id: 'positive_thinker', name: 'Positive Thinker', tier: 1, description: 'SAN drains 10% slower', effects: {} },
  { id: 'cheery', name: 'Cheery', tier: 1, description: '+10% move speed (small)', effects: { moveSpeed: 10 } },
  { id: 'hard_skin', name: 'Hard Skin', tier: 1, description: '+10% DEF', effects: { def: 10 } },
  { id: 'coward', name: 'Coward', tier: -1, description: '-10% ATK', effects: { atk: -10 } },
  { id: 'pacifist', name: 'Pacifist', tier: -1, description: '-20% ATK', effects: { atk: -20 } },
  { id: 'glutton', name: 'Glutton', tier: -1, description: 'Hunger drains faster', effects: {} },
  { id: 'mine_foreman', name: 'Mine Foreman', tier: 1, description: '+25% player mining efficiency', effects: {} },
  { id: 'logging_foreman', name: 'Logging Foreman', tier: 1, description: '+25% player lumbering efficiency', effects: {} },
  { id: 'motivational_leader', name: 'Motivational Leader', tier: 2, description: '+25% player move speed while in team', effects: {} },
  { id: 'zen_mind', name: 'Zen Mind', tier: 1, description: '+10% DEF, +10% Work Speed', effects: { def: 10, workSpeed: 10 } },
  { id: 'hooligan', name: 'Hooligan', tier: 1, description: '+15% ATK, -10% Work Speed', effects: { atk: 15, workSpeed: -10 } },
  { id: 'conceited', name: 'Conceited', tier: 1, description: '+10% ATK, -10% DEF', effects: { atk: 10, def: -10 } },
  { id: 'bottomless_stomach', name: 'Bottomless Stomach', tier: -1, description: 'Hunger drains much faster', effects: {} },
  { id: 'heart_of_immovable_king', name: 'Heart of the Immovable King', tier: 3, description: '+20% DEF while in base', effects: { def: 20 } },
  { id: 'divine_dragon', name: 'Divine Dragon', tier: 3, description: '+20% Dragon damage', effects: {} },
  { id: 'lord_of_the_sea', name: 'Lord of the Sea', tier: 3, description: '+20% Water damage', effects: {} },
  { id: 'lord_of_lightning', name: 'Lord of Lightning', tier: 3, description: '+20% Electric damage', effects: {} },
  { id: 'flame_emperor', name: 'Flame Emperor', tier: 3, description: '+20% Fire damage', effects: {} },
  { id: 'ice_emperor', name: 'Ice Emperor', tier: 3, description: '+20% Ice damage', effects: {} },
  { id: 'earth_emperor', name: 'Earth Emperor', tier: 3, description: '+20% Ground damage', effects: {} },
  { id: 'spirit_emperor', name: 'Spirit Emperor', tier: 3, description: '+20% Grass damage', effects: {} },
  { id: 'celestial_dragon', name: 'Celestial Dragon', tier: 3, description: '+20% Dragon damage', effects: {} },
  { id: 'siren_of_the_void', name: 'Siren of the Void', tier: 3, description: '+30% Dark damage, +30% Ice damage', effects: {} },
  { id: 'eternal_flame', name: 'Eternal Flame', tier: 3, description: '+30% Fire damage, +30% Electric damage', effects: {} },
  { id: 'invader', name: 'Invader', tier: 3, description: '+30% Dragon damage, +30% Dark damage', effects: {} },
  { id: 'otherworldly_cells', name: 'Otherworldly Cells', tier: 3, description: '+10% ATK, +10% DEF', effects: { atk: 10, def: 10 } },
  { id: 'vampiric', name: 'Vampiric', tier: 3, description: 'Life-steal on attacks (v1.0 pool)', effects: {} },
  { id: 'demon_god', name: 'Demon God', tier: 3, description: '+30% ATK, +5% DEF', effects: { atk: 30, def: 5 } },
  { id: 'diamond_body', name: 'Diamond Body', tier: 3, description: '+30% DEF', effects: { def: 30 } },
  { id: 'remarkable_craftsmanship', name: 'Remarkable Craftsmanship', tier: 2, description: '+75% Work Speed', effects: { workSpeed: 75 } },
  // ---- v1.0 mutation-exclusive passives (community-documented pool) ----
  { id: 'immortality', name: 'Immortality', tier: 4, description: 'Mutation: +5% Life Steal, +100% Pal auto-regeneration, +15% ATK', effects: { atk: 15, def: 0 }, mutationExclusive: true },
  { id: 'idiosyncratic', name: 'Idiosyncratic', tier: 4, description: 'Mutation: +50% Pal & player AHR, +25% DEF, immune to Poison and Burn', effects: { def: 25 }, mutationExclusive: true },
  { id: 'babysitter', name: 'Babysitter', tier: 4, description: 'Mutation: at base, +30% egg production & incubation speed', effects: { workSpeed: 15 }, mutationExclusive: true },
  { id: 'heavily_armored', name: 'Heavily Armored', tier: 4, description: 'Mutation: immune to explosions', effects: { def: 15 }, mutationExclusive: true },
  { id: 'lightfooted', name: 'Lightfooted', tier: 4, description: 'Mutation: mounted jump count +1', effects: { moveSpeed: 10 }, mutationExclusive: true },
  { id: 'god_of_destruction', name: 'God of Destruction', tier: 4, description: 'Mutation: heavy ATK/DEF boost at a cost', effects: { atk: 30, def: 15 }, mutationExclusive: true }
];

export const PASSIVE_MAP: Record<string, PassiveSkillDef> = Object.fromEntries(
  PASSIVE_SKILLS.map((p) => [p.id, p])
);

export const MUTATION_PASSIVES = PASSIVE_SKILLS.filter((p) => p.mutationExclusive).map((p) => p.id);
