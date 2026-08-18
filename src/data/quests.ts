import type { BossGuide, LoreEntry, QuestNode } from '../types';

/**
 * QUEST & STORYLINE DATABASE — v1.0 campaign spine:
 * Tutorial → five legacy towers → Feybreak → Sunreach → World Tree climax,
 * plus side quests, tower/raid boss strategies and lore/diary entries.
 */
export const QUESTS: QuestNode[] = [
  {
    id: 'q_tutorial',
    category: 'main',
    chapter: 0,
    title: 'Awakening on Palpagos',
    summary: 'Survive the plateau, build a base, and craft your first Pal Spheres.',
    region: 'windswept',
    unlock: 'Automatic at game start',
    steps: [
      { id: 't1', title: 'Craft a Primitive Workbench', detail: '2 Wood, 5 Fiber — craft from the inventory menu.', done: false },
      { id: 't2', title: 'Craft 5 Pal Spheres', detail: 'Paldium Fragments from blue rocks; Wood; Stone.', done: false },
      { id: 't3', title: 'Catch your first Pal', detail: 'Weaken a Lamball or Chikipi, then throw a sphere.', done: false },
      { id: 't4', title: 'Build the Palbox', detail: 'Foundation of every base; place it on flat ground.', done: false }
    ],
    rewards: ['Base unlocked', 'Ancient Technology Points: 1']
  },
  {
    id: 'q_tower1',
    category: 'main',
    chapter: 1,
    title: 'Rayne Syndicate — First Tower',
    summary: 'Defeat Zoe & Grizzbolt to prove yourself to the Syndicate.',
    region: 'windswept',
    unlock: 'Reach Lv10+ and craft Pelt Armor',
    bossRef: 'b_rayne',
    steps: [
      { id: 'r1', title: 'Reach Player Level 10', detail: 'Farm Chillet and Pengullet north of the plateau.', done: false },
      { id: 'r2', title: 'Equip a ranged weapon', detail: 'Old Bow or crossbow recommended over melee.', done: false },
      { id: 'r3', title: 'Enter the Rayne Syndicate Tower', detail: '5-minute timer in v1.0 — burst damage matters.', done: false }
    ],
    rewards: ['Ancient Technology Points: 5', 'Tower clear flag']
  },
  {
    id: 'q_tower2',
    category: 'main',
    chapter: 2,
    title: 'Free Pal Alliance — Lily & Lyleen Noct',
    summary: 'Second tower gate in the frozen north.',
    region: 'icewind',
    unlock: 'Clear Rayne Tower; craft Metal Armor',
    bossRef: 'b_alliance',
    steps: [
      { id: 'l1', title: 'Craft Heat Resistant Armor', detail: 'Mount Obsidian materials; nights are brutal.', done: false },
      { id: 'l2', title: 'Bring Fire Pals', detail: 'Lyleen Noct is weak to Fire and Dark.', done: false },
      { id: 'l3', title: 'Clear the Free Pal Alliance Tower', detail: 'Interrupt Lyleen Noct\'s channeled heals.', done: false }
    ],
    rewards: ['Ancient Technology Points: 5', 'Access to mid-tier gear']
  },
  {
    id: 'q_tower3',
    category: 'main',
    chapter: 3,
    title: 'Eternal Pyre — Axel & Orserk',
    summary: 'Third tower on the slopes of Mount Obsidian.',
    region: 'volcanic',
    unlock: 'Clear Alliance Tower; Lv30+',
    bossRef: 'b_pyre',
    steps: [
      { id: 'p1', title: 'Craft Heat Resistant Armor', detail: 'Required to survive the volcanic heat.', done: false },
      { id: 'p2', title: 'Bring Ice/Ground Pals', detail: 'Orserk takes bonus damage from Ice and Ground.', done: false },
      { id: 'p3', title: 'Clear the Eternal Pyre Tower', detail: 'Dodge Orserk\'s lightning sweeps.', done: false }
    ],
    rewards: ['Ancient Technology Points: 5']
  },
  {
    id: 'q_tower4',
    category: 'main',
    chapter: 4,
    title: 'PIDF — Marcus & Faleris',
    summary: 'Fourth tower in the Desiccated Desert.',
    region: 'desert',
    unlock: 'Clear Eternal Pyre Tower; Lv40+',
    bossRef: 'b_pidf',
    steps: [
      { id: 'd1', title: 'Craft Heat + Cold protection', detail: 'Desert days burn; nights freeze.', done: false },
      { id: 'd2', title: 'Bring Water/Electric Pals', detail: 'Faleris is Fire — Water hard-counters.', done: false },
      { id: 'd3', title: 'Clear the PIDF Tower', detail: 'Faleris dive-bombs; roll on the telegraph.', done: false }
    ],
    rewards: ['Ancient Technology Points: 5']
  },
  {
    id: 'q_tower5',
    category: 'main',
    chapter: 5,
    title: 'PAL Genetic Research Unit — Victor & Shadowbeak',
    summary: 'Final legacy tower in the astral north.',
    region: 'icewind',
    unlock: 'Clear PIDF Tower; Lv48+',
    bossRef: 'b_genetic',
    steps: [
      { id: 'g1', title: 'Breed or catch strong Darks', detail: 'Shadowbeak is Dark; Dragon damage shines.', done: false },
      { id: 'g2', title: 'Upgrade to Refined Metal gear', detail: 'Plus Pal Metal weaponry if possible.', done: false },
      { id: 'g3', title: 'Clear the Genetic Research Tower', detail: 'Avoid the void orbs — they melt shields.', done: false }
    ],
    rewards: ['Ancient Technology Points: 5', 'Feybreak gate unlocked']
  },
  {
    id: 'q_feybreak',
    category: 'main',
    chapter: 6,
    title: 'Feybreak — Bjorn & Bastigor',
    summary: 'Cross to the Astral Mountains and break the Feybreak blockade.',
    region: 'astral',
    unlock: 'Clear all five legacy towers',
    bossRef: 'b_feybreak',
    steps: [
      { id: 'f1', title: 'Reach the Astral Mountains', detail: 'Boat or flying mount; bring cold gear.', done: false },
      { id: 'f2', title: 'Clear the Feybreak Tower', detail: 'Bastigor hits hard with Ice; bring Fire.', done: false },
      { id: 'f3', title: 'Activate the Sunreach portal', detail: 'The tower portal is the intended entry to Sunreach.', done: false }
    ],
    rewards: ['Sunreach access', 'Hexolite crafting tier']
  },
  {
    id: 'q_sunreach',
    category: 'main',
    chapter: 7,
    title: 'Sunreach Sky Islands',
    summary: 'Ascend the floating islands, harvest Soralite, and topple Shaolong.',
    region: 'sunreach',
    unlock: 'Clear Feybreak Tower',
    bossRef: 'b_sunreach',
    steps: [
      { id: 's1', title: 'Mine Soralite nodes', detail: 'Crystalline Archipelago and Waterlily Gorge.', done: false },
      { id: 's2', title: 'Clear the Ancient Ruins', detail: 'Sky-ruin dungeon hints: light the three beacons in order.', done: false },
      { id: 's3', title: 'Challenge the Sunreach Tower', detail: 'Shaolong — Dragon/Water; Ice and Electric counter.', done: false }
    ],
    rewards: ['Soralite tech tier', 'World Tree gate unlocked']
  },
  {
    id: 'q_worldtree',
    category: 'main',
    chapter: 8,
    title: 'World Tree Climax',
    summary: 'Reach the World Tree, farm Paloxite, and face Astralym.',
    region: 'worldtree',
    unlock: 'Clear Sunreach Tower',
    bossRef: 'b_worldtree',
    steps: [
      { id: 'w1', title: 'Establish the Root Camp', detail: 'Fast-travel point at the World Tree base.', done: false },
      { id: 'w2', title: 'Mine Paloxite nodes', detail: 'Verdant Rootpath, Dusty Ravine, Corroded Hollow.', done: false },
      { id: 'w3', title: 'Collect Radiant Gems', detail: 'Fuel for the Awakening system — strengthen your main Pal.', done: false },
      { id: 'w4', title: 'Breach the Seal', detail: 'Solenne guards the inner seal. Prepare a full Lv80 squad.', done: false },
      { id: 'w5', title: 'Defeat Astralym', detail: 'The World Tree dragon. Cannot be captured — only overcome.', done: false }
    ],
    rewards: ['Ending', 'Radiant Gem farming unlocked']
  },
  // ---- Side quests ----
  {
    id: 'sq_base',
    category: 'side',
    chapter: 1,
    title: 'Base Economy',
    summary: 'Build a self-sufficient base with ranch and plantations.',
    region: 'windswept',
    unlock: 'Palbox built',
    steps: [
      { id: 'b1', title: 'Assign a Chikipi to the Ranch', detail: 'Passive Egg production.', done: false },
      { id: 'b2', title: 'Build Berry Plantations ×3', detail: 'Lifmunk or Tanzee handle Planting.', done: false },
      { id: 'b3', title: 'Build a Crusher and mill Paldium', detail: 'Feeds sphere production.', done: false }
    ],
    rewards: ['Stable food supply', 'Cake ingredients stockpile']
  },
  {
    id: 'sq_catch',
    category: 'collection',
    chapter: 1,
    title: 'Paldex Expansion I',
    summary: 'Catch 10 distinct Pal species.',
    region: 'windswept',
    unlock: 'Paldex acquired',
    steps: [
      { id: 'c1', title: 'Catch 10 distinct species', detail: 'Day/night spawns count separately for some Pals.', done: false }
    ],
    rewards: ['Capture power +1']
  },
  {
    id: 'sq_effigy',
    category: 'collection',
    chapter: 2,
    title: 'Effigy Hunt',
    summary: 'Offer Lifmunk Effigies at the Statue of Power to raise capture power.',
    region: 'windswept',
    unlock: 'First Effigy found',
    steps: [
      { id: 'e1', title: 'Find 5 Effigies', detail: 'Check the PDA map — green markers.', done: false },
      { id: 'e2', title: 'Offer them at the Statue of Power', detail: 'Each tier raises sphere effectiveness.', done: false }
    ],
    rewards: ['Capture power +2']
  },
  {
    id: 'sq_ruins',
    category: 'side',
    chapter: 5,
    title: 'Ancient Ruins: Sunreach',
    summary: 'Solve the sky-ruins beacon puzzle (minigame hints).',
    region: 'sunreach',
    unlock: 'Sunreach access',
    steps: [
      { id: 'u1', title: 'Light the beacons in order', detail: 'Hint: the mural reads Water → Fire → Lightning.', done: false },
      { id: 'u2', title: 'Claim the inner chamber', detail: 'Soralite cache + Radiant Gem Fragment.', done: false }
    ],
    rewards: ['Rare cache', 'Lore entry: The Sky People']
  }
];

/** Tower & raid boss strategy guide (v1.0 reworked encounters). */
export const BOSS_GUIDES: BossGuide[] = [
  {
    id: 'b_rayne', name: 'Zoe & Grizzbolt', palId: 'grizzbolt', kind: 'tower', level: 10,
    location: 'Rayne Syndicate Tower — Windswept Hills',
    reward: 'Ancient Technology Points ×5',
    weaknesses: ['Ground'],
    strategy: [
      'Grizzbolt telegraphs a 3-shot lightning gun — strafe sideways, never backpedal.',
      'Ground Pals (Rushoar, Dumud) resist Electric and deal bonus damage.',
      'v1.0 timer: 5 minutes. Bring a bow and ~150 arrows; aim for the head.',
      'Interrupt his charged slam with your Pal\'s heavy attack to open a damage window.'
    ]
  },
  {
    id: 'b_alliance', name: 'Lily & Lyleen Noct', palId: 'lyleen_noct', kind: 'tower', level: 25,
    location: 'Free Pal Alliance Tower — Ice Wind Island',
    reward: 'Ancient Technology Points ×5',
    weaknesses: ['Fire', 'Dark'],
    strategy: [
      'Lyleen Noct channels a party-wide heal — stagger her during the cast.',
      'Fire Pals (Arsox, Rooby) melt her Ice/Grass typing.',
      'Her wind blades fire in a spread; dodge INTO the gaps.',
      'Keep a Dark Pal in reserve: Dark resists her Dark damage.'
    ]
  },
  {
    id: 'b_pyre', name: 'Axel & Orserk', palId: 'orserk', kind: 'tower', level: 40,
    location: 'Brothers of the Eternal Pyre Tower — Mount Obsidian',
    reward: 'Ancient Technology Points ×5',
    weaknesses: ['Ice', 'Ground'],
    strategy: [
      'Orserk chains lightning between you and your Pal — keep distance from your own Pal.',
      'Ice Pals (Reindrix, Chillet) exploit the Ice weakness.',
      'Heat Resistant Armor is mandatory; the arena floor burns.',
      'His dash leaves a shockwave — jump over it, don\'t roll.'
    ]
  },
  {
    id: 'b_pidf', name: 'Marcus & Faleris', palId: 'faleris', kind: 'tower', level: 45,
    location: 'PIDF Tower — Desiccated Desert',
    reward: 'Ancient Technology Points ×5',
    weaknesses: ['Water', 'Electric'],
    strategy: [
      'Faleris dive-bombs in straight lines — roll perpendicular on the shadow.',
      'Water Pals (Azurobe, Jormuntide) hard-counter the fire dive.',
      'Phase 2 adds fire tornados that orbit the arena; walk counter-clockwise.',
      'Bring both heat and cold protection for the journey, not the fight.'
    ]
  },
  {
    id: 'b_genetic', name: 'Victor & Shadowbeak', palId: 'shadowbeak', kind: 'tower', level: 50,
    location: 'PAL Genetic Research Unit Tower — Ice Wind Island',
    reward: 'Ancient Technology Points ×5',
    weaknesses: ['Dragon'],
    strategy: [
      'Shadowbeak fires homing void orbs — break line of sight on pillars.',
      'Dragon Pals (Quivern, Chillet) exploit the Dragon weakness.',
      'Phase 2: he clones himself; the real one has a visible shadow.',
      'Save your Pal\'s ultimate for the enrage at 25% HP.'
    ]
  },
  {
    id: 'b_feybreak', name: 'Bjorn & Bastigor', palId: 'bastigor', kind: 'tower', level: 55,
    location: 'Feybreak Tower — Astral Mountains',
    reward: 'Sunreach portal activation',
    weaknesses: ['Fire'],
    strategy: [
      'Bastigor\'s ice pillars chain-burst; stand between, not behind them.',
      'Fire Pals from Mount Obsidian pay off big here.',
      'Phase 2: the floor ices over — slide is a feature, use it to reposition.',
      'Bring a shield item; his frozen lance ignores armor tiers.'
    ]
  },
  {
    id: 'b_sunreach', name: 'Shaolong — Sunreach Tower', palId: 'shaolong', kind: 'tower', level: 65,
    location: 'Sunreach Tower — Sky Islands',
    reward: 'World Tree gate unlocked',
    weaknesses: ['Ice', 'Electric'],
    strategy: [
      'Shaolong is Dragon/Water: Ice and Electric both hit bonus damage.',
      'The arena has updraft vents — use them to dodge the tidal slam.',
      'His water spout persists — bait it to one side, fight on the other.',
      'Phase 3 summons sky-island adds; clear them fast, they buff him.'
    ]
  },
  {
    id: 'b_worldtree', name: 'Astralym — World Tree', palId: 'astralym', kind: 'tower', level: 80,
    location: 'Sealed Sanctum — The World Tree',
    reward: 'Ending / New Game+ flag',
    weaknesses: ['Ice', 'Dark'],
    strategy: [
      'Astralym is Neutral and cannot be captured — this is a pure DPS check.',
      'Awaken your main Pal with Radiant Gems before attempting (Awakening system).',
      'The seal phase requires destroying 4 roots within 60 seconds each.',
      'Ice and Dark damage are your best sources; bring both.',
      'His World Tree lance one-shots unshielded players — always carry a shield item.'
    ]
  },
  {
    id: 'b_bellanoir', name: 'Bellanoir (Raid)', palId: 'bellanoir', kind: 'raid', level: 30,
    location: 'Summoning Altar — any base',
    reward: 'Ancient Tech Cores, Bellanoir chance',
    weaknesses: ['Dragon', 'Neutral'],
    strategy: [
      'Raid bosses are wave-based in v1.0 — defend your base first.',
      'Dragon damage is your best counter to Dark Bellanoir.',
      'Bring 20+ Pals in base slots; she wipes squads fast.',
      'Summoning slabs are consumed per attempt — farm them first.'
    ]
  },
  {
    id: 'b_ryu', name: 'Blazamut Ryu (Raid)', palId: 'blazamut_ryu', kind: 'raid', level: 50,
    location: 'Summoning Altar — any base',
    reward: 'Ancient Tech Cores, Blazamut Ryu chance',
    weaknesses: ['Water', 'Ground'],
    strategy: [
      'Ryu\'s meteor rain targets the Palbox — move it or shield it.',
      'Water Pals (Jormuntide) survive the fire phases.',
      'Phase 2 ignites the ground: rotate Pals to avoid mass KO.',
      'A dedicated base with 15+ defenders and a healer is the minimum bar.'
    ]
  }
];

/** Lore, diary & hidden-secret entries for v1.0 regions. */
export const LORE: LoreEntry[] = [
  {
    id: 'lo_sky1', title: 'Diary: The Plateau Castaway', region: 'windswept', kind: 'diary',
    text: 'I have seen the islands in the sky at dawn. They hum like the machines in my dreams. If the Syndicate learns of this… no. I write only for myself now.'
  },
  {
    id: 'lo_sky2', title: 'Diary: The Frozen North', region: 'icewind', kind: 'diary',
    text: 'The Alliance keeps something beneath the ice. A Pal that is not a Pal. Lily knows. She has stopped speaking of it.'
  },
  {
    id: 'lo_sky3', title: 'Diary: Ash & Ember', region: 'volcanic', kind: 'diary',
    text: 'Axel\'s sermons grow stranger. He calls the volcano a door. A door to what? The god that sleeps under the Tree?'
  },
  {
    id: 'lo_sky4', title: 'Diary: Dunes End', region: 'desert', kind: 'diary',
    text: 'The desert mirrors the sky. Twice now I have seen a second sun at midnight — and it had wings.'
  },
  {
    id: 'lo_sun1', title: 'The Sky People (Sunreach)', region: 'sunreach', kind: 'lore',
    text: 'The Sunreach islands were built, not born. Soralite lattices still power their wells. Whoever the Sky People were, they mined the sky itself — and then, abruptly, they left.'
  },
  {
    id: 'lo_sun2', title: 'Beacon Riddle', region: 'sunreach', kind: 'ancient',
    text: 'Ancient Ruins minigame hint: "First the wave that quenches, then the spark that feeds the flame, then the storm that splits the stone." Light the beacons Water → Fire → Lightning.'
  },
  {
    id: 'lo_sun3', title: 'Shaolong\'s Vigil', region: 'sunreach', kind: 'secret',
    text: 'Shaolong does not guard the islands from invaders. It guards the sky from the Tree — and the Tree from the sky.'
  },
  {
    id: 'lo_wt1', title: 'The World Tree', region: 'worldtree', kind: 'lore',
    text: 'The World Tree is the last intact root-system of the old world. Paloxite grows where its sap has mineralized. Radiant Gems are said to be its crystallized memories — the Awakening system feeds them back to your Pals.'
  },
  {
    id: 'lo_wt2', title: 'The Seal', region: 'worldtree', kind: 'secret',
    text: 'Solenne is not a guardian. It is a key. The seal breaks only when the key is defeated — this is why Astralym cannot be captured: it was never a Pal. It is the Tree\'s immune system.'
  },
  {
    id: 'lo_wt3', title: 'Diary: Root Camp', region: 'worldtree', kind: 'diary',
    text: 'We found the camp empty. Not abandoned — empty. The fires were lit. The tools were warm. Whoever built it left five minutes before we arrived. They are still here, somewhere above us.'
  },
  {
    id: 'lo_fe1', title: 'Diary: The Blockade', region: 'astral', kind: 'diary',
    text: 'Bjorn is not cruel. He is terrified. He believes the Feybreak wall is the only thing keeping the Tree\'s attention away from the mainland. I am starting to believe him.'
  },
  {
    id: 'lo_sa1', title: 'Diary: Cherry Petals', region: 'sakurajima', kind: 'diary',
    text: 'On Sakurajima the blossoms fall upward on the night of the new moon. The islanders call it "the sky drinking the spring". I call it a warning.'
  }
];
