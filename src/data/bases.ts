/**
 * BASE BUILDING DATABASE — blueprints, core workers and prime locations.
 * Worker claims match the official 1.0 work-suitability table (pal-atlas
 * datamine). Location coordinates are in-game world units from the same
 * datamine — they plot directly on the World Map screen.
 */

export interface BasePal {
  palId: string;
  role: string;
}

export interface BaseLocation {
  name: string;
  mapId: 'palpagos' | 'worldtree';
  x: number;
  y: number;
  why: string;
}

export interface BasePreset {
  id: string;
  name: string;
  purpose: string;
  tier: 'early' | 'mid' | 'endgame';
  location: BaseLocation;
  layout: string[];
  corePals: BasePal[];
  tips: string[];
}

export const BASE_PRESETS: BasePreset[] = [
  {
    id: 'starter',
    name: 'Starter Homestead',
    purpose: 'All-round early economy',
    tier: 'early',
    location: {
      name: 'Windswept Islands plateau',
      mapId: 'palpagos',
      x: -321596,
      y: 209085,
      why: 'Beside the first tower (Zoe & Grizzbolt), flat ground, ore, stone and berries within a minute\'s walk.'
    },
    layout: [
      'Palbox centre with feed box and 8 Pal beds in a ring',
      '1 Ranch (eggs + wool), 3 Berry Plantations',
      'Primitive Workbench, Campfire, Crusher on the work side',
      '1 Hot Spring — keeps early workers working through SAN drain',
      'Defensive wall + gate on the north face only (raids come from the cliff side)'
    ],
    corePals: [
      { palId: 'chikipi', role: 'Farming 1 — eggs for cakes & food' },
      { palId: 'lamball', role: 'Handiwork / Transport / Farming 1 — the starter all-rounder' },
      { palId: 'cattiva', role: 'Handiwork, Gathering, Mining & Transport 1' },
      { palId: 'lifmunk', role: 'Planting 1 — keeps berries seeded' },
      { palId: 'foxparks', role: 'Kindling 1 — cooks berries & ingots' },
      { palId: 'teafant', role: 'Watering 1 — keeps plantations irrigated' },
      { palId: 'vixy', role: 'Ranch digger — passive spheres & arrows' }
    ],
    tips: [
      'Assign Vixy and Chikipi to the Ranch day one — free Pal Spheres and eggs.',
      'Put a Flopie in the team early; it auto-collects drops around the base.'
    ]
  },
  {
    id: 'ore',
    name: 'Ore Mining Outpost',
    purpose: 'Ore & Paldium production',
    tier: 'early',
    location: {
      name: 'Desolate Church ore fields',
      mapId: 'palpagos',
      x: -465895,
      y: -62138,
      why: 'Dense ore clusters plus a fast-travel statue (Fisherman\'s Point) on the doorstep; Paldium along the shore.'
    },
    layout: [
      'Palbox beside the ore field, NOT in it — keep spawn area clear',
      '6 beds + 1 Hot Spring (mining drains SAN fast)',
      '3 primitive furnaces on the smelting side, fed by a dedicated chest',
      'Feed box closest to the ore — minimises walk time'
    ],
    corePals: [
      { palId: 'rushoar', role: 'Mining 1 — the early rock smasher' },
      { palId: 'digtoise', role: 'Mining 3 — the classic drill turtle' },
      { palId: 'cattiva', role: 'Transport 1 — hauls ore to chests' },
      { palId: 'tombat', role: 'Mining 2 + Gathering 2 night shift' },
      { palId: 'anubis', role: 'Mining 3 + Handiwork 6 — mine and craft in one' }
    ],
    tips: [
      'Upgrade to Astegon (Mining 7) the moment you can breed or catch one.',
      'A Palbox here doubles as a fast-travel anchor — build one at every farm site.'
    ]
  },
  {
    id: 'coal',
    name: 'Coal & Sulfur Works',
    purpose: 'Refined ingots & gunpowder',
    tier: 'mid',
    location: {
      name: 'Duneshelter, Desiccated Desert',
      mapId: 'palpagos',
      x: 35589,
      y: 321331,
      why: 'Coal nodes surround Duneshelter; sulfur is a short flight east. One base feeds both.'
    },
    layout: [
      'Palbox on the ridge above the coal seam',
      'Improved Furnace ×3 for Refined Ingots',
      'Gunpowder bench beside the sulfur crate',
      'Heat-resistant armor for YOU — day heat is lethal',
      'Beds in shade; 2 Hot Springs (digging in heat drains SAN)'
    ],
    corePals: [
      { palId: 'digtoise', role: 'Mining 3 — coal and sulfur' },
      { palId: 'reptyro', role: 'Kindling 3 + Mining 3 — melts and digs' },
      { palId: 'blazamut', role: 'Kindling 3 / Mining 7 — the desert furnace king' },
      { palId: 'jormuntide_ignis', role: 'Kindling 7 — refined ingots at speed' },
      { palId: 'anubis', role: 'Handiwork 6 + Mining 3 — crafts while others dig' }
    ],
    tips: [
      'Blazamut doubles as a raid deterrent — nothing raids a Magma Kaiser base twice.',
      'Move gunpowder production here; Tocotoco feathers arrive from anywhere.'
    ]
  },
  {
    id: 'farming',
    name: 'Ranch & Cake Factory',
    purpose: 'Food, cake ingredients, ranch outputs',
    tier: 'mid',
    location: {
      name: 'Cinnamoth Forest meadow',
      mapId: 'palpagos',
      x: -248770,
      y: 126206,
      why: 'Big flat meadow, mild climate — plantations and ranch pals never overheat or freeze.'
    },
    layout: [
      '4 Berry + 3 Wheat + 2 Lettuce + 2 Tomato plantations in rows',
      'Ranch ×2 (eggs, milk, honey, berries from ranch pals)',
      'Mill beside the wheat silo, Cooking Pot + Kindling pal on the cake line',
      'Fridge chests for cooked food overflow'
    ],
    corePals: [
      { palId: 'mozzarina', role: 'Ranch — Milk (cake ingredient)' },
      { palId: 'chikipi', role: 'Ranch — Eggs (cake ingredient)' },
      { palId: 'beegarde', role: 'Ranch — Honey (cake ingredient)' },
      { palId: 'caprity', role: 'Ranch — Red Berries + Planting 1' },
      { palId: 'lyleen', role: 'Planting 7 — the Harvest Goddess' },
      { palId: 'wumpo_botan', role: 'Lumbering 3 + Transport 6 — field hauling' }
    ],
    tips: [
      'This base makes the Breeding Ranch self-sufficient — cake ingredients on tap.',
      'Petallia Ignis (Kindling) or Jormuntide Ignis cooks the cakes between breeding cycles.'
    ]
  },
  {
    id: 'breeding',
    name: 'Breeding Ranch',
    purpose: 'Egg production & incubation',
    tier: 'mid',
    location: {
      name: 'Bamboo Groves flats',
      mapId: 'palpagos',
      x: -215389,
      y: 8854,
      why: 'Flat, quiet and low-level — nothing wanders in to interrupt the breeding meter.'
    },
    layout: [
      'Breeding Farm ×2 with the feed box OUTSIDE the fence',
      'Egg Incubator cluster split into two rooms: heated (campfire) for Scorching eggs, cold for Frozen eggs',
      'Cake chest adjacent to the farms — cakes never interrupt breeding',
      'No production buildings — keep the base job list pure'
    ],
    corePals: [
      { palId: 'chikipi', role: 'Tiny — keeps the base alive without pathing over the farm' },
      { palId: 'mozzarina', role: 'Ranch milk feed for cakes' },
      { palId: 'beegarde', role: 'Ranch honey feed' },
      { palId: 'teafant', role: 'Watering 1 — berry patch to feed the parents' }
    ],
    tips: [
      '1.0 halved incubation in new worlds — with a heated + cooled room you hatch a generation in minutes.',
      'Keep 5+ cakes stocked. The bar pauses (not resets) when the box empties.'
    ]
  },
  {
    id: 'production',
    name: 'Production HQ',
    purpose: 'Hexolite & Pal Metal industry',
    tier: 'endgame',
    location: {
      name: 'Astral Mountains garden plateau',
      mapId: 'palpagos',
      x: -266563,
      y: 174506,
      why: 'Hexolite Quartz and Plasteel deposits, with a tower fast-travel a glide away for resupply.'
    },
    layout: [
      'Advanced Assembly Lines ×2 on a raised deck',
      'Electric Furnace bank ×4 fed by dedicated transport',
      'Power: 2 Orserk-class generators with battery buffers',
      'Pal beds + hot springs around the perimeter — this base runs 24/7'
    ],
    corePals: [
      { palId: 'solenne', role: 'Handiwork 8 — best crafter in the game' },
      { palId: 'renjishi', role: 'Kindling 8 — best furnace operator' },
      { palId: 'astegon', role: 'Mining 7 — Hexolite veins' },
      { palId: 'aegidron', role: 'Mining 8 — the v1.0 apex miner' },
      { palId: 'orserk', role: 'Electricity 8 — powers the whole deck' },
      { palId: 'knocklem', role: 'Transport 7 — moves mountains of ingots' }
    ],
    tips: [
      'Solenne + Renjishi are the 1.0 meta pair — craft and smelt faster than any other combo.',
      'Route Paloxite from the World Tree base here for the final-tier recipes.'
    ]
  },
  {
    id: 'raid',
    name: 'Raid Defense Fortress',
    purpose: 'Wave-raid survival',
    tier: 'endgame',
    location: {
      name: 'World Tree — Shinespore Root',
      mapId: 'worldtree',
      x: 405135,
      y: -730345,
      why: 'Endgame raid summons expect maxed bases; the Root plateau is a natural chokepoint.'
    },
    layout: [
      'Fortified ring wall with 2 chokepoint gates',
      '15–20 base slots ALL filled with combat Pals',
      'Missile & turret placements on the inner ring',
      'Palbox buried behind the innermost wall — raid AI targets it'
    ],
    corePals: [
      { palId: 'jetragon', role: '140 ATK aerial rocket — raid opener' },
      { palId: 'frostallion', role: '140 ATK + Ice control' },
      { palId: 'necromus', role: '145 ATK dark cavalry' },
      { palId: 'neptilius', role: '145 ATK sea titan' },
      { palId: 'bellanoir', role: '150 ATK nightmare bloom' },
      { palId: 'lyleen_noct', role: 'Healer — keeps the garrison alive' },
      { palId: 'warsect', role: 'Hard Armor tank + player DEF buff' },
      { palId: 'bastigor', role: 'Cooling 8 + frontline bruiser' }
    ],
    tips: [
      'The negotiator NPC can cancel one raid for gold — save it for the hardest wave.',
      'Raid bosses are 45,000+ HP in 1.0; bring your own raid boss (Blazamut Ryu) to even the odds.'
    ]
  }
];

/** Prime spots — the classic community-tested base locations (datamine coords). */
export const PRIME_LOCATIONS: BaseLocation[] = [
  {
    name: 'Desolate Church plateau',
    mapId: 'palpagos',
    x: -465895,
    y: -62138,
    why: 'The famous ore-farm spot — 8+ ore nodes, coal nearby, fast travel on site.'
  },
  {
    name: 'Foot of the Volcano',
    mapId: 'palpagos',
    x: -349536,
    y: -4035,
    why: 'Ore + sulfur + coal in one valley; Scorching-egg incubation is free here.'
  },
  {
    name: 'Deep Bamboo Thicket',
    mapId: 'palpagos',
    x: -215389,
    y: 8854,
    why: 'Peaceful flats for breeding and farming; no aggressive spawns.'
  },
  {
    name: 'Duneshelter oasis',
    mapId: 'palpagos',
    x: 35589,
    y: 321331,
    why: 'Coal central — the Refined Ingot economy lives here.'
  },
  {
    name: 'Astral Mountains garden',
    mapId: 'palpagos',
    x: -266563,
    y: 174506,
    why: 'Hexolite Quartz country; the endgame production capital.'
  },
  {
    name: 'World Tree root plateau',
    mapId: 'worldtree',
    x: 405135,
    y: -730345,
    why: 'Paloxite, Radiant Gems and the Awakening system — endgame everything.'
  }
];
