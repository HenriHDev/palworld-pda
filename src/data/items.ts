import type { CakeDef, ItemDef, Recipe } from '../types';

/**
 * ITEM DATABASE — resources (incl. v1.0 Soralite / Paloxite / Radiant Gems),
 * equipment, consumables and the four v1.0 breeding Cakes with their recipes.
 */
export const ITEMS: ItemDef[] = [
  // ---- v1.0 endgame resources ----
  { id: 'soralite', name: 'Soralite', category: 'resource', rarity: 4, description: 'v1.0 crystal ore harvested from Sunreach sky-island nodes.' },
  { id: 'paloxite', name: 'Paloxite', category: 'resource', rarity: 5, description: 'v1.0 deep ore found at the roots of the World Tree.' },
  { id: 'radiant_gem', name: 'Radiant Gem', category: 'resource', rarity: 5, description: 'World Tree gem; fuel for the Awakening system that strengthens Pals.' },
  { id: 'radiant_gem_fragment', name: 'Radiant Gem Fragment', category: 'resource', rarity: 4, description: 'Shard of a Radiant Gem; drops from World Tree encounters.' },
  // ---- core resources ----
  { id: 'paldium_fragment', name: 'Paldium Fragment', category: 'resource', rarity: 1, description: 'Basic building resource mined from blue nodes.' },
  { id: 'ingot', name: 'Ingot', category: 'material', rarity: 1, description: 'Smelted from ore at a primitive furnace.' },
  { id: 'refined_ingot', name: 'Refined Ingot', category: 'material', rarity: 2, description: 'Coal-forged ingot for mid-tier crafts.' },
  { id: 'pal_metal_ingot', name: 'Pal Metal Ingot', category: 'material', rarity: 3, description: 'Pal-world alloy for high-tier equipment.' },
  { id: 'hexolite_quartz', name: 'Hexolite Quartz', category: 'material', rarity: 4, description: 'Astral Mountains crystal; exotic endgame crafts.' },
  { id: 'carbon_fiber', name: 'Carbon Fiber', category: 'material', rarity: 3, description: 'Advanced composite woven from coal.' },
  { id: 'polymer', name: 'Polymer', category: 'material', rarity: 3, description: 'Plastic compound from High Quality Pal Oil.' },
  { id: 'ancient_civilization_parts', name: 'Ancient Civilization Parts', category: 'material', rarity: 4, description: 'Salvaged from bosses and dungeons.' },
  { id: 'ancient_tech_core', name: 'Ancient Tech Core', category: 'material', rarity: 5, description: 'Rare core from raid bosses.' },
  { id: 'pal_fluids', name: 'Pal Fluids', category: 'material', rarity: 1, description: 'Dropped by water Pals.' },
  { id: 'high_quality_pal_oil', name: 'High Quality Pal Oil', category: 'material', rarity: 3, description: 'Dropped by specific Pals (Woolipop, Dumud…).' },
  { id: 'pure_quartz', name: 'Pure Quartz', category: 'material', rarity: 3, description: 'Mined from white nodes in the frozen north.' },
  { id: 'coal', name: 'Coal', category: 'material', rarity: 1, description: 'Mined in desert regions.' },
  { id: 'ore', name: 'Ore', category: 'material', rarity: 1, description: 'Mined from copper nodes.' },
  { id: 'wood', name: 'Wood', category: 'material', rarity: 1, description: 'Chopped from trees.' },
  { id: 'stone', name: 'Stone', category: 'material', rarity: 1, description: 'Mined from rocks.' },
  { id: 'fiber', name: 'Fiber', category: 'material', rarity: 1, description: 'Harvested from shrubs.' },
  { id: 'leather', name: 'Leather', category: 'material', rarity: 1, description: 'Dropped by animal-like Pals.' },
  { id: 'bone', name: 'Bone', category: 'material', rarity: 1, description: 'Dropped by Ground and Neutral Pals.' },
  { id: 'horn', name: 'Horn', category: 'material', rarity: 1, description: 'Dropped by horned Pals.' },
  { id: 'venom_gland', name: 'Venom Gland', category: 'material', rarity: 1, description: 'Dropped by Dark Pals.' },
  { id: 'flame_organ', name: 'Flame Organ', category: 'material', rarity: 1, description: 'Dropped by Fire Pals.' },
  { id: 'ice_organ', name: 'Ice Organ', category: 'material', rarity: 1, description: 'Dropped by Ice Pals.' },
  { id: 'electric_organ', name: 'Electric Organ', category: 'material', rarity: 1, description: 'Dropped by Electric Pals.' },
  { id: 'beautiful_flower', name: 'Beautiful Flower', category: 'material', rarity: 2, description: 'Gathered from rare flora.' },
  { id: 'precious_pelt', name: 'Precious Pelt', category: 'material', rarity: 3, description: 'Rare hide for saddles.' },
  { id: 'precious_claw', name: 'Precious Claw', category: 'material', rarity: 3, description: 'Rare claw for high-tier crafts.' },
  { id: 'precious_plume', name: 'Precious Plume', category: 'material', rarity: 3, description: 'Rare feather for armor.' },
  { id: 'predator_core', name: 'Predator Core', category: 'material', rarity: 4, description: 'Dropped by Predator Pals (v1.0).' },
  { id: 'golmoa_scale', name: 'Golmoa Scale', category: 'material', rarity: 2, description: 'Scale shed by Golmoa.' },
  { id: 'large_pal_soul', name: 'Large Pal Soul', category: 'material', rarity: 4, description: 'Pal enhancement material.' },
  { id: 'medium_pal_soul', name: 'Medium Pal Soul', category: 'material', rarity: 3, description: 'Pal enhancement material.' },
  { id: 'small_pal_soul', name: 'Small Pal Soul', category: 'material', rarity: 2, description: 'Pal enhancement material.' },
  { id: 'dog_coin', name: 'Dog Coin', category: 'material', rarity: 3, description: 'Currency of the Black Marketeers.' },
  { id: 'gold_coin', name: 'Gold Coin', category: 'material', rarity: 3, description: 'Dug up by Mau and traded for goods.' },
  { id: 'arrow', name: 'Arrow', category: 'material', rarity: 1, description: 'Ammunition for bows.' },
  { id: 'cement', name: 'Cement', category: 'material', rarity: 3, description: 'High-tier construction material.' },
  { id: 'charcoal', name: 'Charcoal', category: 'material', rarity: 1, description: 'Burned wood; used in gunpowder and carbon fiber.' },
  { id: 'broncherry_meat', name: 'Broncherry Meat', category: 'consumable', rarity: 2, description: 'Meat from Broncherry.' },
  { id: 'mammorest_meat', name: 'Mammorest Meat', category: 'consumable', rarity: 3, description: 'Meat from Mammorest.' },
  { id: 'low_grade_medical_supplies', name: 'Low Grade Medical Supplies', category: 'consumable', rarity: 1, description: 'Basic medical crafting material.' },
  { id: 'tech_manual', name: 'High Grade Technical Manual', category: 'material', rarity: 4, description: 'Grants tech points when consumed.' },
  // ---- consumables ----
  { id: 'red_berries', name: 'Red Berries', category: 'consumable', rarity: 1, description: 'Basic food for Pals.' },
  { id: 'baked_berries', name: 'Baked Berries', category: 'consumable', rarity: 1, description: 'Cooked Red Berries; better nutrition.' },
  { id: 'fried_egg', name: 'Fried Egg', category: 'consumable', rarity: 1, description: 'Simple early meal.' },
  { id: 'mushroom', name: 'Mushroom', category: 'consumable', rarity: 1, description: 'Foraged from the ground; Pal food.' },
  { id: 'milk', name: 'Milk', category: 'consumable', rarity: 1, description: 'Produced by Mozzarina at the ranch.' },
  { id: 'egg', name: 'Egg', category: 'consumable', rarity: 1, description: 'Laid by Chikipi at the ranch.' },
  { id: 'honey', name: 'Honey', category: 'consumable', rarity: 2, description: 'Farmable from Beegarde.' },
  { id: 'flour', name: 'Flour', category: 'consumable', rarity: 1, description: 'Milled from Wheat.' },
  { id: 'wheat', name: 'Wheat', category: 'consumable', rarity: 1, description: 'Grown in Wheat Plantations.' },
  { id: 'lettuce', name: 'Lettuce', category: 'consumable', rarity: 1, description: 'Grown in Lettuce Plantations.' },
  { id: 'tomato', name: 'Tomato', category: 'consumable', rarity: 1, description: 'Grown in Tomato Plantations.' },
  { id: 'carrot', name: 'Carrot', category: 'consumable', rarity: 1, description: 'Grown in Carrot Plantations.' },
  { id: 'cotton_candy', name: 'Cotton Candy', category: 'consumable', rarity: 1, description: 'Produced by Woolipop.' },
  { id: 'mystery_meat', name: 'Mystery Meat', category: 'consumable', rarity: 1, description: 'Pal meat.' },
  { id: 'chikipi_poultry', name: 'Chikipi Poultry', category: 'consumable', rarity: 1, description: 'Poultry from Chikipi.' },
  { id: 'lamball_mutton', name: 'Lamball Mutton', category: 'consumable', rarity: 1, description: 'Mutton from Lamball.' },
  { id: 'rushoar_pork', name: 'Rushoar Pork', category: 'consumable', rarity: 1, description: 'Pork from Rushoar.' },
  { id: 'caprity_meat', name: 'Caprity Meat', category: 'consumable', rarity: 1, description: 'Meat from Caprity.' },
  { id: 'eikthyrdeer_venison', name: 'Eikthyrdeer Venison', category: 'consumable', rarity: 2, description: 'Venison from Eikthyrdeer.' },
  { id: 'dumud_chowder', name: 'Dumud Chowder', category: 'consumable', rarity: 2, description: 'Dropped by Dumud.' },
  { id: 'raw_kelpsea', name: 'Raw Kelpsea', category: 'consumable', rarity: 1, description: 'Dropped by Kelpsea.' },
  { id: 'tocotoco_feather', name: 'Tocotoco Feather', category: 'material', rarity: 2, description: 'Volatile feather used in gunpowder crafts.' },
  { id: 'gunpowder', name: 'Gunpowder', category: 'material', rarity: 2, description: 'Dropped by Tocotoco; explosive crafts.' },
  { id: 'wool', name: 'Wool', category: 'material', rarity: 1, description: 'Sheared from Lamball, Melpaca, Cremis.' },
  { id: 'ruby', name: 'Ruby', category: 'material', rarity: 2, description: 'Dropped by Direhowl.' },
  { id: 'sapphire', name: 'Sapphire', category: 'material', rarity: 2, description: 'Dropped by Mau Cryst.' },
  { id: 'emerald', name: 'Emerald', category: 'material', rarity: 3, description: 'Dropped by rare Pals.' },
  { id: 'diamond', name: 'Diamond', category: 'material', rarity: 4, description: 'Dropped by rare Pals.' },
  { id: 'crude_oil', name: 'Crude Oil', category: 'material', rarity: 3, description: 'Extracted in Astral Mountains.' },
  { id: 'plasteel', name: 'Plasteel', category: 'material', rarity: 4, description: 'Feybreak composite.' },
  { id: 'nightstar_sand', name: 'Nightstar Sand', category: 'material', rarity: 4, description: 'Feybreak resource.' },
  { id: 'dark_fragment', name: 'Dark Fragment', category: 'material', rarity: 4, description: 'Feybreak resource.' },
  // ---- equipment (representative) ----
  { id: 'cloth_armor', name: 'Cloth Armor', category: 'equipment', rarity: 1, description: 'Starter armor set.' },
  { id: 'pelt_armor', name: 'Pelt Armor', category: 'equipment', rarity: 2, description: 'Mid-tier armor set.' },
  { id: 'metal_armor', name: 'Metal Armor', category: 'equipment', rarity: 3, description: 'Ingot armor set.' },
  { id: 'refined_metal_armor', name: 'Refined Metal Armor', category: 'equipment', rarity: 3, description: 'Refined ingot armor set.' },
  { id: 'pal_metal_armor', name: 'Pal Metal Armor', category: 'equipment', rarity: 4, description: 'Pal metal armor set.' },
  { id: 'hexolite_armor', name: 'Hexolite Armor', category: 'equipment', rarity: 5, description: 'Endgame armor set.' },
  { id: 'old_bow', name: 'Old Bow', category: 'equipment', rarity: 1, description: 'Starter ranged weapon.' },
  { id: 'musket', name: 'Musket', category: 'equipment', rarity: 2, description: 'Early firearm.' },
  { id: 'handgun', name: 'Handgun', category: 'equipment', rarity: 2, description: 'Sidearm.' },
  { id: 'pump_action_shotgun', name: 'Pump-Action Shotgun', category: 'equipment', rarity: 3, description: 'Close-range power.' },
  { id: 'assault_rifle', name: 'Assault Rifle', category: 'equipment', rarity: 4, description: 'Automatic rifle.' },
  { id: 'rocket_launcher', name: 'Rocket Launcher', category: 'equipment', rarity: 4, description: 'Heavy explosive weapon.' },
  { id: 'beam_launcher', name: 'Beam Launcher', category: 'equipment', rarity: 5, description: 'v1.0 energy weapon.' },
  { id: 'mechanical_bow', name: 'Mechanical Bow', category: 'equipment', rarity: 3, description: 'v1.0 compound bow.' },
  { id: 'wing_pack', name: 'Wing Pack', category: 'equipment', rarity: 5, description: 'v1.0 glider upgrade.' },
  // ---- schematics (representative) ----
  { id: 'schematic_feathered_hair_band', name: 'Feathered Hair Band Schematic', category: 'schematic', rarity: 2, description: 'Unlocks the Feathered Hair Band recipe.' },
  { id: 'schematic_metal_helm', name: 'Metal Helm Schematic', category: 'schematic', rarity: 3, description: 'Unlocks the Metal Helm recipe.' },
  { id: 'schematic_pal_metal_helm', name: 'Pal Metal Helm Schematic', category: 'schematic', rarity: 4, description: 'Unlocks the Pal Metal Helm recipe.' },
  { id: 'schematic_hexolite_helm', name: 'Hexolite Helm Schematic', category: 'schematic', rarity: 5, description: 'Unlocks the Hexolite Helm recipe.' },
  { id: 'schematic_heat_resistant', name: 'Heat Resistant Undershirt Schematic', category: 'schematic', rarity: 3, description: 'Unlocks heat-resistant undershirt.' },
  { id: 'schematic_cold_resistant', name: 'Cold Resistant Undershirt Schematic', category: 'schematic', rarity: 3, description: 'Unlocks cold-resistant undershirt.' },
  // ---- key items ----
  { id: 'pal_sphere', name: 'Pal Sphere', category: 'keyitem', rarity: 1, description: 'Basic capture device.' },
  { id: 'mega_sphere', name: 'Mega Sphere', category: 'keyitem', rarity: 2, description: 'Improved capture device.' },
  { id: 'giga_sphere', name: 'Giga Sphere', category: 'keyitem', rarity: 3, description: 'Advanced capture device.' },
  { id: 'hyper_sphere', name: 'Hyper Sphere', category: 'keyitem', rarity: 4, description: 'High-tier capture device.' },
  { id: 'ultimate_sphere', name: 'Ultimate Sphere', category: 'keyitem', rarity: 4, description: 'Top-tier capture device.' },
  { id: 'exotic_sphere', name: 'Exotic Sphere', category: 'keyitem', rarity: 5, description: 'Endgame capture device.' },
  { id: 'effigy', name: 'Lifmunk Effigy', category: 'keyitem', rarity: 3, description: 'Offered at the Statue of Power to raise capture power.' },
  { id: 'lifmunk_statue_charges', name: 'Statue Charges', category: 'keyitem', rarity: 1, description: 'Used to enhance the player via Lifmunk Statues.' }
];

export const ITEM_MAP: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** v1.0 breeding cakes (four specialty cakes + the classic standard cake). */
export const CAKES: CakeDef[] = [
  {
    id: 'standard',
    name: 'Cake',
    description: 'Classic breeding fuel. 1% mutation chance per egg — the baseline for all rolls.',
    recipe: [
      { itemId: 'flour', quantity: 5 },
      { itemId: 'red_berries', quantity: 5 },
      { itemId: 'milk', quantity: 7 },
      { itemId: 'egg', quantity: 8 },
      { itemId: 'honey', quantity: 2 }
    ],
    modifiers: { mutationChanceMultiplier: 1, inheritChanceMultiplier: 1, doubleEggChance: 0, statFloorBonus: 0 }
  },
  {
    id: 'mushroom',
    name: 'Mushroom Cake',
    description: 'Slightly raises the chance of higher stats at birth (stat floor boost).',
    recipe: [
      { itemId: 'flour', quantity: 6 },
      { itemId: 'mushroom', quantity: 8 },
      { itemId: 'milk', quantity: 7 },
      { itemId: 'egg', quantity: 8 },
      { itemId: 'honey', quantity: 4 },
      { itemId: 'soralite', quantity: 2 }
    ],
    modifiers: { mutationChanceMultiplier: 1, inheritChanceMultiplier: 1, doubleEggChance: 0, statFloorBonus: 8 }
  },
  {
    id: 'vegetable',
    name: 'Vegetable Cake',
    description: 'Produces TWO Pal Eggs per breeding cycle — doubles mutation rolls per batch.',
    recipe: [
      { itemId: 'flour', quantity: 5 },
      { itemId: 'lettuce', quantity: 6 },
      { itemId: 'tomato', quantity: 6 },
      { itemId: 'carrot', quantity: 6 },
      { itemId: 'milk', quantity: 5 },
      { itemId: 'egg', quantity: 6 }
    ],
    modifiers: { mutationChanceMultiplier: 1, inheritChanceMultiplier: 1, doubleEggChance: 1, statFloorBonus: 0 }
  },
  {
    id: 'deluxe',
    name: 'Deluxe Vegetable Cake',
    description: 'Raises mutation chance from 1% to 3% and adds a stat-talent bonus — the mutation hunter\'s pick.',
    recipe: [
      { itemId: 'flour', quantity: 8 },
      { itemId: 'lettuce', quantity: 8 },
      { itemId: 'tomato', quantity: 8 },
      { itemId: 'carrot', quantity: 8 },
      { itemId: 'milk', quantity: 8 },
      { itemId: 'egg', quantity: 8 },
      { itemId: 'honey', quantity: 6 },
      { itemId: 'soralite', quantity: 4 }
    ],
    modifiers: { mutationChanceMultiplier: 3, inheritChanceMultiplier: 1, doubleEggChance: 0, statFloorBonus: 5 }
  },
  {
    id: 'special',
    name: 'Special Cake',
    description: 'Forces the child to inherit ALL available parent passives (up to 4) — the trait-merge pick.',
    recipe: [
      { itemId: 'flour', quantity: 8 },
      { itemId: 'red_berries', quantity: 8 },
      { itemId: 'milk', quantity: 8 },
      { itemId: 'egg', quantity: 8 },
      { itemId: 'honey', quantity: 8 },
      { itemId: 'paloxite', quantity: 2 }
    ],
    modifiers: { mutationChanceMultiplier: 1, inheritChanceMultiplier: 1, doubleEggChance: 0, statFloorBonus: 0, forceFourPassives: true }
  }
];

export const CAKE_MAP: Record<string, CakeDef> = Object.fromEntries(CAKES.map((c) => [c.id, c]));

/** Representative crafting recipes across tech tiers. */
export const RECIPES: Recipe[] = [
  { id: 'r_ingot', outputItemId: 'ingot', quantity: 1, techLevel: 10, station: 'Primitive Furnace', ingredients: [{ itemId: 'ore', quantity: 2 }] },
  { id: 'r_refined_ingot', outputItemId: 'refined_ingot', quantity: 1, techLevel: 34, station: 'Improved Furnace', ingredients: [{ itemId: 'ore', quantity: 2 }, { itemId: 'coal', quantity: 2 }] },
  { id: 'r_pal_metal_ingot', outputItemId: 'pal_metal_ingot', quantity: 1, techLevel: 44, station: 'Electric Furnace', ingredients: [{ itemId: 'ore', quantity: 4 }, { itemId: 'paldium_fragment', quantity: 2 }] },
  { id: 'r_polymer', outputItemId: 'polymer', quantity: 1, techLevel: 33, station: 'High Quality Workbench', ingredients: [{ itemId: 'high_quality_pal_oil', quantity: 2 }] },
  { id: 'r_carbon_fiber', outputItemId: 'carbon_fiber', quantity: 1, techLevel: 35, station: 'Production Assembly Line', ingredients: [{ itemId: 'coal', quantity: 2 }, { itemId: 'charcoal', quantity: 2 }] },
  { id: 'r_flour', outputItemId: 'flour', quantity: 1, techLevel: 15, station: 'Mill', ingredients: [{ itemId: 'wheat', quantity: 3 }] },
  { id: 'r_cloth', outputItemId: 'cloth_armor', quantity: 1, techLevel: 4, station: 'Primitive Workbench', ingredients: [{ itemId: 'fiber', quantity: 20 }, { itemId: 'wood', quantity: 5 }] },
  { id: 'r_pelt', outputItemId: 'pelt_armor', quantity: 1, techLevel: 14, station: 'Primitive Workbench', ingredients: [{ itemId: 'leather', quantity: 10 }, { itemId: 'fiber', quantity: 10 }] },
  { id: 'r_metal_armor', outputItemId: 'metal_armor', quantity: 1, techLevel: 21, station: 'Primitive Workbench', ingredients: [{ itemId: 'ingot', quantity: 30 }, { itemId: 'leather', quantity: 5 }] },
  { id: 'r_refined_armor', outputItemId: 'refined_metal_armor', quantity: 1, techLevel: 36, station: 'High Quality Workbench', ingredients: [{ itemId: 'refined_ingot', quantity: 40 }, { itemId: 'leather', quantity: 10 }] },
  { id: 'r_pal_metal_armor', outputItemId: 'pal_metal_armor', quantity: 1, techLevel: 46, station: 'Production Assembly Line', ingredients: [{ itemId: 'pal_metal_ingot', quantity: 30 }, { itemId: 'polymer', quantity: 20 }] },
  { id: 'r_hexolite_armor', outputItemId: 'hexolite_armor', quantity: 1, techLevel: 60, station: 'Advanced Assembly Line', ingredients: [{ itemId: 'hexolite_quartz', quantity: 30 }, { itemId: 'plasteel', quantity: 20 }, { itemId: 'paloxite', quantity: 5 }] },
  { id: 'r_pal_sphere', outputItemId: 'pal_sphere', quantity: 1, techLevel: 2, station: 'Primitive Workbench', ingredients: [{ itemId: 'paldium_fragment', quantity: 1 }, { itemId: 'wood', quantity: 3 }, { itemId: 'stone', quantity: 3 }] },
  { id: 'r_mega_sphere', outputItemId: 'mega_sphere', quantity: 1, techLevel: 14, station: 'Sphere Workbench', ingredients: [{ itemId: 'paldium_fragment', quantity: 1 }, { itemId: 'ingot', quantity: 1 }, { itemId: 'wood', quantity: 5 }, { itemId: 'stone', quantity: 5 }] },
  { id: 'r_giga_sphere', outputItemId: 'giga_sphere', quantity: 1, techLevel: 27, station: 'Sphere Workbench', ingredients: [{ itemId: 'paldium_fragment', quantity: 2 }, { itemId: 'ingot', quantity: 3 }, { itemId: 'wood', quantity: 7 }, { itemId: 'stone', quantity: 7 }] },
  { id: 'r_hyper_sphere', outputItemId: 'hyper_sphere', quantity: 1, techLevel: 35, station: 'Sphere Assembly Line', ingredients: [{ itemId: 'paldium_fragment', quantity: 3 }, { itemId: 'refined_ingot', quantity: 3 }, { itemId: 'carbon_fiber', quantity: 2 }, { itemId: 'cement', quantity: 2 }] },
  { id: 'r_ultimate_sphere', outputItemId: 'ultimate_sphere', quantity: 1, techLevel: 44, station: 'Sphere Assembly Line II', ingredients: [{ itemId: 'paldium_fragment', quantity: 4 }, { itemId: 'refined_ingot', quantity: 5 }, { itemId: 'carbon_fiber', quantity: 3 }, { itemId: 'polymer', quantity: 2 }] },
  { id: 'r_exotic_sphere', outputItemId: 'exotic_sphere', quantity: 1, techLevel: 58, station: 'Advanced Assembly Line', ingredients: [{ itemId: 'paldium_fragment', quantity: 5 }, { itemId: 'pal_metal_ingot', quantity: 5 }, { itemId: 'carbon_fiber', quantity: 3 }, { itemId: 'paloxite', quantity: 1 }] },
  { id: 'r_musket', outputItemId: 'musket', quantity: 1, techLevel: 21, station: 'Weapon Workbench', ingredients: [{ itemId: 'ingot', quantity: 30 }, { itemId: 'wood', quantity: 15 }, { itemId: 'gunpowder', quantity: 5 }] },
  { id: 'r_handgun', outputItemId: 'handgun', quantity: 1, techLevel: 29, station: 'Weapon Workbench', ingredients: [{ itemId: 'ingot', quantity: 40 }, { itemId: 'high_quality_pal_oil', quantity: 3 }] },
  { id: 'r_shotgun', outputItemId: 'pump_action_shotgun', quantity: 1, techLevel: 39, station: 'Weapon Assembly Line', ingredients: [{ itemId: 'refined_ingot', quantity: 50 }, { itemId: 'polymer', quantity: 15 }, { itemId: 'carbon_fiber', quantity: 10 }] },
  { id: 'r_assault_rifle', outputItemId: 'assault_rifle', quantity: 1, techLevel: 45, station: 'Weapon Assembly Line II', ingredients: [{ itemId: 'refined_ingot', quantity: 60 }, { itemId: 'polymer', quantity: 30 }, { itemId: 'carbon_fiber', quantity: 30 }] },
  { id: 'r_rocket_launcher', outputItemId: 'rocket_launcher', quantity: 1, techLevel: 49, station: 'Weapon Assembly Line II', ingredients: [{ itemId: 'pal_metal_ingot', quantity: 75 }, { itemId: 'polymer', quantity: 30 }, { itemId: 'carbon_fiber', quantity: 30 }] },
  { id: 'r_beam_launcher', outputItemId: 'beam_launcher', quantity: 1, techLevel: 62, station: 'Advanced Assembly Line', ingredients: [{ itemId: 'hexolite_quartz', quantity: 40 }, { itemId: 'plasteel', quantity: 30 }, { itemId: 'radiant_gem_fragment', quantity: 4 }] },
  { id: 'r_wing_pack', outputItemId: 'wing_pack', quantity: 1, techLevel: 55, station: 'Advanced Assembly Line', ingredients: [{ itemId: 'carbon_fiber', quantity: 40 }, { itemId: 'hexolite_quartz', quantity: 10 }, { itemId: 'precious_plume', quantity: 5 }] }
];

export const RECIPE_MAP: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
