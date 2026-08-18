import type { MapPoint, MapPointType } from '../types';
import { REAL_MAP_POINTS } from './mapPoints';

/**
 * MAP DATABASE — real Palworld 1.0 markers extracted from the game files via
 * pal-atlas (Awy64/palworld-atlas-data + Nifrendil/pal-atlas, MIT).
 * 1329 points across Palpagos and the World Tree with in-game world
 * coordinates; the map screen plots them onto the bundled game-extracted
 * base maps (assets/maps/*.png).
 */

export const MAP_POINTS: MapPoint[] = REAL_MAP_POINTS;

export type MapMode = 'palpagos' | 'worldtree';

/** World-coordinate bounds per map — pal-atlas DEFAULT_MAPS calibration. */
export const MAP_CALIBRATION: Record<MapMode, { minX: number; maxX: number; minY: number; maxY: number }> = {
  palpagos: { minX: -1099400, maxX: 349400, minY: -724400, maxY: 724400 },
  worldtree: { minX: 347351.5, maxX: 689148.5, minY: -818197, maxY: -476400 }
};

/** world coords → 0..100 percentage on the bundled base map image.
 *  The ORIGINAL projection used by this app: simple linear world-bounds
 *  mapping (north-up), which is how the map has always been displayed. */
export function worldToPercent(mapId: MapMode, x: number, y: number): { xPct: number; yPct: number } {
  const c = MAP_CALIBRATION[mapId];
  const xPct = ((x - c.minX) / (c.maxX - c.minX)) * 100;
  const yPct = ((c.maxY - y) / (c.maxY - c.minY)) * 100;
  return { xPct, yPct };
}

export const MAP_TYPE_META: Record<MapPointType, { label: string; color: string; icon: string }> = {
  alpha: { label: 'Alpha Boss', color: '#EF4444', icon: '◆' },
  tower: { label: 'Tower Boss', color: '#F59E0B', icon: '▲' },
  fasttravel: { label: 'Fast Travel', color: '#06B6D4', icon: '◈' },
  effigy: { label: 'Effigy', color: '#10B981', icon: '✦' },
  chest: { label: 'Chest', color: '#F59E0B', icon: '■' },
  dungeon: { label: 'Dungeon', color: '#8B5CF6', icon: '◈' },
  soralite: { label: 'Soralite', color: '#38BDF8', icon: '●' }
};
