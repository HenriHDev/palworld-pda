import type { ElementDef, EggDef } from '../types';

/**
 * Element definitions incl. the v1.0 effectiveness relationships.
 * Relationships are the standard Palworld damage table.
 */
export const ELEMENTS: ElementDef[] = [
  { id: 'Neutral', color: '#94A3B8', strongVs: [], weakVs: ['Dark'] },
  { id: 'Fire', color: '#EF4444', strongVs: ['Grass', 'Ice'], weakVs: ['Water'] },
  { id: 'Water', color: '#38BDF8', strongVs: ['Fire'], weakVs: ['Electric'] },
  { id: 'Electric', color: '#FACC15', strongVs: ['Water'], weakVs: ['Ground'] },
  { id: 'Grass', color: '#4ADE80', strongVs: ['Ground'], weakVs: ['Fire'] },
  { id: 'Ice', color: '#67E8F9', strongVs: ['Dragon'], weakVs: ['Fire'] },
  { id: 'Ground', color: '#D6A35C', strongVs: ['Electric'], weakVs: ['Grass'] },
  { id: 'Dark', color: '#8B5CF6', strongVs: ['Neutral'], weakVs: ['Dragon'] },
  { id: 'Dragon', color: '#C084FC', strongVs: ['Dark'], weakVs: ['Ice'] }
];

export const ELEMENT_MAP: Record<string, ElementDef> = Object.fromEntries(
  ELEMENTS.map((e) => [e.id, e])
);

export const EGGS: EggDef[] = [
  { id: 'Common', color: '#A8A29E', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Damp', color: '#38BDF8', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Dragon', color: '#C084FC', incubationMinutes: { small: 60, medium: 120, large: 180, huge: 240 } },
  { id: 'Electric', color: '#FACC15', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Rocky', color: '#B45309', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Scorching', color: '#EF4444', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Verdant', color: '#4ADE80', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Frozen', color: '#67E8F9', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } },
  { id: 'Dark', color: '#8B5CF6', incubationMinutes: { small: 30, medium: 60, large: 90, huge: 120 } }
];

export const EGG_MAP: Record<string, EggDef> = Object.fromEntries(
  EGGS.map((e) => [e.id, e])
);

export const REGION_META: Record<string, { name: string; blurb: string; v10: boolean }> = {
  windswept: { name: 'Windswept Hills', blurb: 'Starting region of the main island.', v10: false },
  marsh: { name: 'Marsh Island', blurb: 'Western swamp biome.', v10: false },
  eastern: { name: 'Eastern Wild Island', blurb: 'Highland plains, early desert fringe.', v10: false },
  icewind: { name: 'Ice Wind Island', blurb: 'Frozen tundra of the north.', v10: false },
  forgotten: { name: 'Forgotten Island', blurb: 'Southern isle with ancient ruins.', v10: false },
  volcanic: { name: 'Mount Obsidian', blurb: 'Volcanic region of the west.', v10: false },
  desert: { name: 'Desiccated Desert', blurb: 'Harsh dunes of the northeast.', v10: false },
  verdant: { name: 'Verdant Brook', blurb: 'Grassy mid-map riverside.', v10: false },
  bamboo: { name: 'Bamboo Groves', blurb: 'Mountain forests south of the desert.', v10: false },
  astral: { name: 'Astral Mountains (Feybreak)', blurb: 'Endgame island of the far southwest.', v10: false },
  sakurajima: { name: 'Sakurajima', blurb: 'Cherry-blossom island, spring of 2024.', v10: false },
  sanctuary: { name: 'Wildlife Sanctuaries', blurb: 'Restricted islets with rare spawns.', v10: false },
  sunreach: { name: 'Sunreach Sky Islands', blurb: 'v1.0 floating islands — Soralite zone.', v10: true },
  worldtree: { name: 'World Tree', blurb: 'v1.0 endgame — Paloxite zone, Radiant Gems.', v10: true },
  islets: { name: 'New Islets (v1.0)', blurb: 'Seven small islands & sanctuaries added in 1.0.', v10: true }
};

export const WORK_TYPES = [
  'Handiwork',
  'Kindling',
  'Watering',
  'Planting',
  'Generating Electricity',
  'Medicine Production',
  'Gathering',
  'Lumbering',
  'Mining',
  'Cooling',
  'Transporting',
  'Farming'
] as const;
