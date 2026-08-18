import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import type { MapPoint, MapPointType } from '../../types';
import { MAP_CALIBRATION, MAP_TYPE_META, worldToPercent, type MapMode } from '../../data/locations';
import type { HabitatPoint } from '../../data/habitats';
import { MonoText } from '../ui/primitives';

/**
 * INTERACTIVE WORLD MAP — the real game-extracted base maps (pal-atlas, MIT).
 *
 * Navigation model (v4, known-good):
 *  - Memoized marker layer: pan/zoom only mutate one transform style.
 *  - Web: imperative panning — the transform is written straight to the DOM
 *    node during drag (zero React renders), committed once on drag end.
 *  - Native image-drag suppressed (draggable=false + dragstart blocker +
 *    pointerdown preventDefault); marker/control presses exempt, no pointer
 *    capture → marker clicks always land.
 *  - Starts slightly zoomed-out (×0.95 fit).
 */

export const ALL_MAP_TYPES = Object.keys(MAP_TYPE_META) as MapPointType[];

const MAP_IMAGES: Record<MapMode, number> = {
  palpagos: require('../../../assets/maps/palpagos.png'),
  worldtree: require('../../../assets/maps/worldtree.png')
};

const MIN_SCALE = 0.85;
const MAX_SCALE = 4;
const INITIAL_SCALE = 0.95;
const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

/** Deterministic sampling cap for high-volume layers. */
const CAPS: Partial<Record<MapPointType, number>> = {
  chest: 150,
  effigy: 220,
  soralite: 160
};

const samplePoints = (points: MapPoint[], type: MapPointType): MapPoint[] => {
  const cap = CAPS[type];
  if (!cap || points.length <= cap) return points;
  const step = points.length / cap;
  const out: MapPoint[] = [];
  for (let i = 0; i < cap; i++) out.push(points[Math.floor(i * step)]);
  return out;
};

interface ViewState {
  scale: number;
  tx: number;
  ty: number;
}

const INITIAL_VIEW: ViewState = { scale: INITIAL_SCALE, tx: 0, ty: 0 };

/** MEMOIZED LAYER — image + markers + habitat. Re-renders only on data changes. */
interface MapLayerProps {
  mode: MapMode;
  points: MapPoint[];
  active: Set<MapPointType>;
  selectedId: string | null;
  foundIds: Set<string>;
  onSelect: (p: MapPoint) => void;
  habitat?: HabitatPoint[] | null;
}

const MapLayer = React.memo(function MapLayer({ mode, points, active, selectedId, foundIds, onSelect, habitat }: MapLayerProps) {
  const visible = useMemo(() => {
    const mine = points.filter((p) => p.mapId === mode && active.has(p.type));
    const byType = new Map<MapPointType, MapPoint[]>();
    for (const t of ALL_MAP_TYPES) byType.set(t, mine.filter((p) => p.type === t));
    const out: MapPoint[] = [];
    for (const t of ALL_MAP_TYPES) out.push(...samplePoints(byType.get(t) ?? [], t));
    return out;
  }, [points, mode, active]);

  const habitatHere = useMemo(
    () => (habitat ? habitat.filter((h) => h.mapId === mode) : []),
    [habitat, mode]
  );

  return (
    <View style={{ width: '100%', aspectRatio: 1 }}>
      <Image
        source={MAP_IMAGES[mode]}
        style={{ width: '100%', height: '100%' }}
        resizeMode="stretch"
        {...({ draggable: false } as object)}
      />
      {/* habitat spawn points — green diamonds (wild) / red (alpha) */}
      {habitatHere.map((h, i) => {
        const { xPct, yPct } = worldToPercent(mode, h.x, h.y);
        if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return null;
        return (
          <View
            key={`hab-${i}`}
            className="absolute items-center justify-center"
            style={{ left: `${xPct}%`, top: `${yPct}%`, width: 14, height: 14, marginLeft: -7, marginTop: -7 }}
          >
            <View
              style={{
                width: h.alpha ? 9 : 7,
                height: h.alpha ? 9 : 7,
                transform: [{ rotate: '45deg' }],
                backgroundColor: h.alpha ? '#EF4444' : '#10B981',
                borderColor: h.alpha ? '#FECACA' : '#0B1120',
                borderWidth: h.alpha ? 2 : 1,
                shadowColor: h.alpha ? '#EF4444' : '#10B981',
                shadowOpacity: 0.9,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 0 }
              }}
            />
          </View>
        );
      })}
      {/* markers */}
      {visible.map((p) => {
        const meta = MAP_TYPE_META[p.type];
        const { xPct, yPct } = worldToPercent(mode, p.x, p.y);
        if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return null;
        const selected = selectedId === p.id;
        const found = foundIds.has(p.id);
        const color = found ? '#3D4A5C' : meta.color;
        const size = selected ? 12 : p.type === 'alpha' || p.type === 'tower' ? 9 : 6;
        return (
          <Pressable
            key={p.id}
            onPress={() => onSelect(p)}
            hitSlop={8}
            {...({ dataSet: { marker: '1' } } as object)}
            className="absolute items-center justify-center"
            style={
              Platform.OS === 'web'
                ? ({ left: `${xPct}%`, top: `${yPct}%`, width: 18, height: 18, marginLeft: -9, marginTop: -9, cursor: 'pointer' } as never)
                : { left: `${xPct}%`, top: `${yPct}%`, width: 18, height: 18, marginLeft: -9, marginTop: -9 }
            }
          >
            <View
              className="rounded-full border"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                borderColor: selected ? '#FFFFFF' : 'rgba(11,17,32,0.95)',
                borderWidth: selected ? 2 : 1,
                shadowColor: selected ? '#06B6D4' : color,
                shadowOpacity: selected ? 1 : 0.6,
                shadowRadius: selected ? 6 : 2,
                shadowOffset: { width: 0, height: 0 }
              }}
            />
            {selected ? <View className="absolute h-7 w-7 rounded-full border-2 border-paldium" style={{ opacity: 0.85 }} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
});

export const RealWorldMap: React.FC<{
  mode: MapMode;
  points: MapPoint[];
  activeTypes: MapPointType[];
  selectedId: string | null;
  onSelect: (p: MapPoint) => void;
  foundIds: Set<string>;
  habitat?: HabitatPoint[] | null;
}> = ({ mode, points, activeTypes, selectedId, onSelect, foundIds, habitat }) => {
  const active = useMemo(() => new Set(activeTypes), [activeTypes]);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [size, setSize] = useState(300);
  const containerRef = useRef<View | null>(null);
  const layerRef = useRef<View | null>(null);

  const viewRef = useRef(view);
  viewRef.current = view;
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const clampOffset = (s: number, v: number) => {
    const m = Math.abs(((s - 1) * sizeRef.current) / 2);
    return Math.min(m, Math.max(-m, v));
  };

  const commitView = (next: ViewState) => {
    viewRef.current = next;
    setView(next);
  };

  const zoomBy = (factor: number) => {
    const cur = viewRef.current;
    const next = clampScale(cur.scale * factor);
    commitView({ scale: next, tx: clampOffset(next, cur.tx), ty: clampOffset(next, cur.ty) });
  };

  const resetView = () => commitView(INITIAL_VIEW);

  // ------------------------------------------------------------------ WEB
  // Native DOM listeners. Panning is IMPERATIVE (direct DOM writes, no React
  // renders per frame). Native image-drag fully suppressed.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = containerRef.current as unknown as HTMLElement | null;
    const layer = layerRef.current as unknown as HTMLElement | null;
    if (!el || !layer) return;

    interface DragState {
      startX: number;
      startY: number;
      baseTx: number;
      baseTy: number;
      active: boolean;
    }
    let drag: DragState | null = null;

    const applyTransform = (s: number, tx: number, ty: number) => {
      layer.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    };

    const isExempt = (target: EventTarget | null) => {
      const t = target as HTMLElement | null;
      return (
        !!t &&
        typeof t.closest === 'function' &&
        (!!t.closest('[data-marker]') || !!t.closest('[data-map-control]'))
      );
    };

    const down = (e: PointerEvent) => {
      if (isExempt(e.target)) return; // marker/button press — leave the click alone
      e.preventDefault(); // kills native image-drag + text selection
      drag = {
        startX: e.clientX,
        startY: e.clientY,
        baseTx: viewRef.current.tx,
        baseTy: viewRef.current.ty,
        active: false
      };
      el.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.active) {
        if (Math.hypot(dx, dy) < 4) return;
        drag.active = true;
      }
      const s = viewRef.current.scale;
      const tx = clampOffset(s, drag.baseTx + dx);
      const ty = clampOffset(s, drag.baseTy + dy);
      viewRef.current = { scale: s, tx, ty }; // ref in sync, NO setState
      applyTransform(s, tx, ty); // direct DOM write — zero React work
    };

    const up = () => {
      if (drag) {
        if (drag.active) setView({ ...viewRef.current }); // single commit per drag
        drag = null;
      }
      el.style.cursor = 'grab';
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };

    const dragStart = (e: Event) => e.preventDefault();

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('dragstart', dragStart);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('dragstart', dragStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ---------------------------------------------------------------- NATIVE
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const baseRef = useRef<{ tx: number; ty: number } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, g) =>
        (evt.nativeEvent.touches && evt.nativeEvent.touches.length >= 2) || Math.abs(g.dx) + Math.abs(g.dy) > 8,
      onPanResponderGrant: () => {
        baseRef.current = { tx: viewRef.current.tx, ty: viewRef.current.ty };
        pinchRef.current = null;
      },
      onPanResponderMove: (evt, g) => {
        const touches = evt.nativeEvent.touches;
        if (touches && touches.length >= 2) {
          const [t1, t2] = touches;
          const d = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
          if (!pinchRef.current) pinchRef.current = { dist: d, scale: viewRef.current.scale };
          if (pinchRef.current.dist > 0) {
            const next = clampScale(pinchRef.current.scale * (d / pinchRef.current.dist));
            setView((v) => ({
              scale: next,
              tx: clampOffset(next, v.tx),
              ty: clampOffset(next, v.ty)
            }));
          }
          return;
        }
        if (baseRef.current) {
          const s = viewRef.current.scale;
          setView((v) => ({
            ...v,
            tx: clampOffset(s, baseRef.current!.tx + g.dx),
            ty: clampOffset(s, baseRef.current!.ty + g.dy)
          }));
        }
      },
      onPanResponderRelease: () => {
        baseRef.current = null;
        pinchRef.current = null;
      },
      onPanResponderTerminate: () => {
        baseRef.current = null;
        pinchRef.current = null;
      }
    })
  ).current;

  const isWeb = Platform.OS === 'web';

  return (
    <View
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-paldium/40 bg-well shadow-glow"
      onLayout={(e) => {
        const w = Math.max(200, e.nativeEvent.layout.width);
        if (Math.abs(w - sizeRef.current) > 1) setSize(w);
      }}
      style={isWeb ? ({ width: '100%', touchAction: 'none', cursor: 'grab', userSelect: 'none' } as never) : { width: '100%' }}
      {...(isWeb ? {} : panResponder.panHandlers)}
    >
      {/* transformed wrapper — the ONLY thing that changes during pan/zoom */}
      <View
        ref={layerRef}
        style={
          {
            width: '100%',
            aspectRatio: 1,
            willChange: 'transform',
            transform: [{ translateX: view.tx }, { translateY: view.ty }, { scale: view.scale }]
          } as never
        }
      >
        <MapLayer
          mode={mode}
          points={points}
          active={active}
          selectedId={selectedId}
          foundIds={foundIds}
          onSelect={onSelect}
          habitat={habitat}
        />
      </View>

      {/* zoom controls */}
      <View {...({ dataSet: { mapControl: '1' } } as object)} className="absolute right-2 top-2 gap-1.5">
        <Pressable onPress={() => zoomBy(1.4)} className="pda-btn h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-well/95">
          <Text className="text-base text-paldium">＋</Text>
        </Pressable>
        <Pressable onPress={() => zoomBy(1 / 1.4)} className="pda-btn h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-well/95">
          <Text className="text-base text-paldium">－</Text>
        </Pressable>
        <Pressable onPress={resetView} className="pda-btn h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-well/95">
          <Text className="text-sm text-paldium">⟳</Text>
        </Pressable>
      </View>

      {/* scale badge */}
      <View className="absolute left-2 top-2 rounded border border-slate-700 bg-well/95 px-2 py-0.5">
        <MonoText className="text-[10px] text-paldium">×{view.scale.toFixed(2)}</MonoText>
      </View>

      {/* legend */}
      <View className="absolute bottom-2 left-2 right-14 flex-row flex-wrap gap-1 rounded-lg border border-slate-700 bg-well/95 p-1.5">
        {ALL_MAP_TYPES.filter((t) => active.has(t)).slice(0, 6).map((t) => (
          <View key={t} className="flex-row items-center gap-1">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: MAP_TYPE_META[t].color }} />
            <Text className="text-[10px] font-semibold text-muted">{MAP_TYPE_META[t].label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const MapFilterRow: React.FC<{ active: MapPointType[]; onChange: (t: MapPointType) => void }> = ({ active, onChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
    <View className="flex-row gap-1.5 pb-1">
      {ALL_MAP_TYPES.map((t) => {
        const meta = MAP_TYPE_META[t];
        const isOn = active.includes(t);
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            className={`pda-btn rounded-full border px-3 py-1.5 ${isOn ? '' : 'border-slate-800 bg-panel/70'}`}
            style={isOn ? { borderColor: meta.color, backgroundColor: `${meta.color}22` } : undefined}
          >
            <Text className="text-[11px] font-bold" style={{ color: isOn ? meta.color : '#AEB9CC' }}>
              {meta.icon} {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </ScrollView>
);

export const MapPointCard: React.FC<{
  point: MapPoint;
  found: boolean;
  defeated: boolean;
  onToggleFound: () => void;
  onToggleDefeated?: () => void;
}> = ({ point, found, defeated, onToggleFound, onToggleDefeated }) => {
  const meta = MAP_TYPE_META[point.type];
  const regionName = point.mapId === 'worldtree' ? 'World Tree' : 'Palpagos Islands';
  return (
    <View
      className={`pda-row rounded-lg border p-3 ${found ? 'border-slate-800 bg-panel/40' : 'border-slate-700 bg-panel/90'}`}
      style={found ? undefined : { borderColor: `${meta.color}44` }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: found ? '#475569' : meta.color }} />
          <Text className="text-[13px] font-bold text-ink">{point.label}</Text>
        </View>
        {point.level ? <MonoText className="text-[11px] font-semibold text-gold">LV {point.level}</MonoText> : null}
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <MonoText className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {regionName} · {Math.round(point.x)},{Math.round(point.y)}
        </MonoText>
        <View className="flex-row gap-1.5">
          {onToggleDefeated && point.type === 'alpha' ? (
            <Pressable onPress={onToggleDefeated} className={`pda-btn rounded border px-2 py-1 ${defeated ? 'border-ember bg-ember/20' : 'border-slate-600'}`}>
              <Text className={`text-[10px] font-bold ${defeated ? 'text-ember' : 'text-muted'}`}>{defeated ? 'DEFEATED' : 'MARK DEFEATED'}</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={onToggleFound} className={`pda-btn rounded border px-2 py-1 ${found ? 'border-neon bg-neon/20' : 'border-slate-600'}`}>
            <Text className={`text-[10px] font-bold ${found ? 'text-neon' : 'text-muted'}`}>{found ? '✓ FOUND' : 'MARK FOUND'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
