import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import type { MapPoint, MapPointType } from '../types';
import { MAP_POINTS, type MapMode } from '../data/locations';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { usePersistence } from '../hooks/usePersistence';
import { useRouter } from '../navigation/router';
import { getPal } from '../data/pals';
import { ALL_MAP_TYPES, MapFilterRow, MapPointCard, RealWorldMap } from '../components/map/WorldMap';
import { PalPortrait } from '../components/paldeck/PalPortrait';
import { MonoText, SectionTitle, Segmented } from '../components/ui/primitives';

const DEFAULT_TYPES: MapPointType[] = ['alpha', 'tower', 'fasttravel', 'effigy', 'soralite', 'dungeon'];

export const MapScreen: React.FC = () => {
  const { checklist, toggleMapPoint } = usePersistence();
  const { navigate } = useRouter();
  const bp = useBreakpoint();
  const { height: winH } = useWindowDimensions();
  const [mode, setMode] = useState<MapMode>('palpagos');
  const [activeTypes, setActiveTypes] = useState<MapPointType[]>(DEFAULT_TYPES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFound, setShowFound] = useState(true);

  // Map square cap (desktop only): the map is square, so capping the column
  // width caps its height too — it can never overflow into the dock/taskbar.
  // Guarded against NaN/0 window heights with a sane fallback.
  const safeH = typeof winH === 'number' && Number.isFinite(winH) && winH > 500 ? winH : 900;
  const mapColMax = Math.min(1000, Math.max(420, safeH - 240));
  const listMax = Math.max(280, safeH - 260);

  const toggleType = (t: MapPointType) =>
    setActiveTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const foundIds = useMemo(() => new Set(Object.keys(checklist.found).filter((k) => checklist.found[k])), [checklist.found]);

  const visiblePoints: MapPoint[] = useMemo(
    () =>
      MAP_POINTS.filter((p) => p.mapId === mode && activeTypes.includes(p.type)).filter((p) =>
        showFound ? true : !foundIds.has(p.id)
      ),
    [mode, activeTypes, foundIds, showFound]
  );

  const selected = MAP_POINTS.find((p) => p.id === selectedId) ?? null;
  const doneCount = MAP_POINTS.filter((p) => checklist.found[p.id]).length;
  const selectedPal = selected?.palRef ? getPal(selected.palRef) : null;

  return (
    <View className="flex-1">
      {/* header */}
      <View className="mb-3 flex-row flex-wrap items-center justify-between gap-2">
        <View>
          <Text className="text-lg font-black text-ink">
            WORLD <Text className="text-[#38BDF8]">MAP</Text>
          </Text>
          <MonoText className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium">
            Game-file coordinates · pal-atlas datamine
          </MonoText>
        </View>
        <View className="rounded-lg border border-slate-700 bg-panel px-3 py-2">
          <MonoText className="text-[11px] text-neon">
            {doneCount}<MonoText className="text-faint font-medium">/{MAP_POINTS.length} FOUND</MonoText>
          </MonoText>
        </View>
      </View>

      {/* map switcher */}
      <View className="mb-3">
        <Segmented
          accent="#38BDF8"
          options={[
            { id: 'palpagos', label: 'PALPAGOS ISLANDS', icon: '◫' },
            { id: 'worldtree', label: 'WORLD TREE', icon: '▲' }
          ]}
          value={mode}
          onChange={(id) => {
            setMode(id as MapMode);
            setSelectedId(null);
          }}
        />
      </View>

      {/* filters */}
      <View className="mb-3">
        <MapFilterRow active={activeTypes} onChange={toggleType} />
      </View>

      {/* map + side list */}
      <View className={`gap-3 ${bp.isDesktop ? 'flex-row' : ''}`}>
        <View className="min-w-0" style={bp.isDesktop ? { flex: 1, maxWidth: mapColMax } : undefined}>
          <RealWorldMap
            mode={mode}
            points={MAP_POINTS}
            activeTypes={activeTypes}
            selectedId={selectedId}
            onSelect={(p) => setSelectedId(p.id)}
            foundIds={foundIds}
          />
          <View className="mt-2 flex-row flex-wrap items-center justify-between gap-2">
            <Pressable onPress={() => setShowFound((s) => !s)} className="pda-btn rounded-lg border border-slate-700 bg-panel px-2.5 py-1.5">
              <Text className="text-[11px] font-bold text-muted">{showFound ? '◉ FOUND: VISIBLE' : '◌ FOUND: HIDDEN'}</Text>
            </Pressable>
            <MonoText className="text-[9px] text-faint font-medium">
              DRAG TO PAN · SCROLL / PINCH TO ZOOM · ＋－⟳ CONTROLS
            </MonoText>
          </View>
        </View>

        <View className={bp.isDesktop ? 'w-[360px] shrink-0' : ''} style={bp.isDesktop ? { maxHeight: listMax } : undefined}>
          {selected ? (
            <View className="mb-2 rounded-xl border border-slate-700 bg-well/70 p-3">
              <SectionTitle color={selected.type === 'alpha' ? '#EF4444' : '#06B6D4'}>Selected Marker</SectionTitle>
              {selectedPal ? (
                <View className="mb-2 flex-row items-center gap-3">
                  <PalPortrait pal={selectedPal} size={54} />
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-ink">{selectedPal.name}</Text>
                    <MonoText className="text-[10px] text-faint font-medium">#{String(selectedPal.dexNo).padStart(3, '0')} · LV {selected.level ?? '?'}</MonoText>
                  </View>
                  <Pressable onPress={() => navigate({ name: 'pal', palId: selectedPal.id })} className="pda-btn rounded-lg border border-paldium/60 bg-paldium/10 px-2.5 py-1.5">
                    <Text className="text-[11px] font-bold text-paldium">DOSSIER ▸</Text>
                  </Pressable>
                </View>
              ) : null}
              <MapPointCard
                point={selected}
                found={foundIds.has(selected.id)}
                defeated={!!checklist.alphaDefeated[selected.id]}
                onToggleFound={() => toggleMapPoint(selected.id, 'found')}
                onToggleDefeated={selected.type === 'alpha' ? () => toggleMapPoint(selected.id, 'alphaDefeated') : undefined}
              />
            </View>
          ) : (
            <Text className="mb-2 rounded-lg border border-dashed border-slate-700 p-3 text-center text-[11px] text-muted font-medium">
              TAP A MARKER ON THE MAP TO INSPECT IT
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false} style={bp.isDesktop ? { maxHeight: listMax - 60 } : undefined}>
            <View className="gap-1.5 pb-4">
              {visiblePoints.slice(0, 80).map((p) => (
                <MapPointCard
                  key={p.id}
                  point={p}
                  found={foundIds.has(p.id)}
                  defeated={!!checklist.alphaDefeated[p.id]}
                  onToggleFound={() => toggleMapPoint(p.id, 'found')}
                  onToggleDefeated={p.type === 'alpha' ? () => toggleMapPoint(p.id, 'alphaDefeated') : undefined}
                />
              ))}
              {visiblePoints.length > 80 ? (
                <Text className="py-2 text-center text-[11px] text-faint font-medium">+{visiblePoints.length - 80} MORE — TAP MARKERS ON THE MAP</Text>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
