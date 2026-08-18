/**
 * DROP TABLE PATCH — community-documented kill-drop rates added on top of the
 * hand-curated chunks (palworld.wiki data). Applied by the registry.
 */
import type { PalDrop } from '../../types';

export const DROP_PATCH: Record<string, PalDrop[]> = {
  // ---- Medium Pal Soul (100%) — mid/late game roster ----
  anubis: [{ itemId: 'medium_pal_soul', chance: 100 }],
  astegon: [{ itemId: 'medium_pal_soul', chance: 100 }],
  blazehowl: [{ itemId: 'medium_pal_soul', chance: 100 }],
  blazehowl_noct: [{ itemId: 'medium_pal_soul', chance: 100 }],
  broncherry: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'wheat', chance: 30 }],
  broncherry_aqua: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'lettuce', chance: 30 }],
  bushi: [{ itemId: 'medium_pal_soul', chance: 100 }],
  cryolinx: [{ itemId: 'medium_pal_soul', chance: 100 }],
  dinossom: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'wheat', chance: 30 }],
  dinossom_lux: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'wheat', chance: 30 }],
  elphidran: [{ itemId: 'medium_pal_soul', chance: 100 }],
  elphidran_aqua: [{ itemId: 'medium_pal_soul', chance: 100 }],
  faleris: [{ itemId: 'medium_pal_soul', chance: 100 }],
  felbat: [{ itemId: 'medium_pal_soul', chance: 100 }],
  grizzbolt: [{ itemId: 'medium_pal_soul', chance: 100 }],
  helzephyr: [{ itemId: 'medium_pal_soul', chance: 100 }],
  incineram: [{ itemId: 'medium_pal_soul', chance: 100 }],
  incineram_noct: [{ itemId: 'medium_pal_soul', chance: 100 }],
  jormuntide: [{ itemId: 'medium_pal_soul', chance: 100 }],
  jormuntide_ignis: [{ itemId: 'medium_pal_soul', chance: 100 }],
  katress: [{ itemId: 'medium_pal_soul', chance: 100 }],
  kitsun: [{ itemId: 'medium_pal_soul', chance: 100 }],
  lyleen: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'beautiful_flower', chance: 50 }],
  lyleen_noct: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'emerald', chance: 30 }],
  mammorest: [{ itemId: 'medium_pal_soul', chance: 100 }],
  mammorest_cryst: [{ itemId: 'medium_pal_soul', chance: 100 }],
  maraith: [{ itemId: 'medium_pal_soul', chance: 100 }],
  menasting: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'emerald', chance: 30 }],
  mossanda: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'lettuce', chance: 30 }],
  mossanda_lux: [{ itemId: 'medium_pal_soul', chance: 100 }],
  nitewing: [{ itemId: 'medium_pal_soul', chance: 100 }],
  orserk: [{ itemId: 'medium_pal_soul', chance: 100 }],
  petallia: [{ itemId: 'medium_pal_soul', chance: 100 }],
  quivern: [{ itemId: 'medium_pal_soul', chance: 100 }],
  quivern_botan: [{ itemId: 'medium_pal_soul', chance: 100 }],
  ragnahawk: [{ itemId: 'medium_pal_soul', chance: 100 }],
  reindrix: [{ itemId: 'medium_pal_soul', chance: 100 }],
  reptyro: [{ itemId: 'medium_pal_soul', chance: 100 }],
  ice_reptyro: [{ itemId: 'medium_pal_soul', chance: 100 }],
  shadowbeak: [{ itemId: 'medium_pal_soul', chance: 100 }],
  sibelyx: [{ itemId: 'medium_pal_soul', chance: 100 }],
  suzaku: [{ itemId: 'medium_pal_soul', chance: 100 }],
  suzaku_aqua: [{ itemId: 'medium_pal_soul', chance: 100 }],
  vanwyrm: [{ itemId: 'medium_pal_soul', chance: 100 }],
  vanwyrm_cryst: [{ itemId: 'medium_pal_soul', chance: 100 }],
  verdash: [{ itemId: 'medium_pal_soul', chance: 100 }],
  vaelet: [{ itemId: 'medium_pal_soul', chance: 100 }],
  warsect: [{ itemId: 'medium_pal_soul', chance: 100 }],
  wumpo: [{ itemId: 'medium_pal_soul', chance: 100 }],
  wumpo_botan: [{ itemId: 'medium_pal_soul', chance: 100 }, { itemId: 'beautiful_flower', chance: 30 }],

  // ---- Emerald (30%) — high-tier darks & legendaries ----
  paladius: [{ itemId: 'emerald', chance: 30 }],
  necromus: [{ itemId: 'emerald', chance: 30 }],

  // ---- Crops & farm drops ----
  flopie: [{ itemId: 'tomato', chance: 30 }],
  robinquill: [{ itemId: 'wheat', chance: 30 }],
  robinquill_terra: [{ itemId: 'wheat', chance: 30 }],

  // ---- High Quality Pal Oil extras ----
  digtoise: [{ itemId: 'high_quality_pal_oil', chance: 30 }]
};
