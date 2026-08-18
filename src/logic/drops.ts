/**
 * DROP LOOKUP ENGINE — reverse drop table: ask for an item, get every Pal
 * that drops it (kill loot) with its drop chance, sorted by rate.
 */
import { ALL_PALS } from '../data/pals';
import { ITEM_MAP } from '../data/items';

export interface DropSource {
  palId: string;
  chance: number;
}

export interface DropItemEntry {
  itemId: string;
  name: string;
  dropperCount: number;
}

/** Every item that appears in at least one Pal's drop table. */
export function itemsWithDrops(): DropItemEntry[] {
  const counts = new Map<string, number>();
  for (const pal of ALL_PALS) {
    for (const d of pal.drops) {
      counts.set(d.itemId, (counts.get(d.itemId) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([itemId, dropperCount]) => ({
      itemId,
      name: ITEM_MAP[itemId]?.name ?? itemId,
      dropperCount
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** All Pals dropping `itemId`, best rates first. */
export function findDroppers(itemId: string): DropSource[] {
  return ALL_PALS.filter((p) => p.drops.some((d) => d.itemId === itemId))
    .map((p) => ({ palId: p.id, chance: p.drops.find((d) => d.itemId === itemId)!.chance }))
    .sort((a, b) => b.chance - a.chance);
}
