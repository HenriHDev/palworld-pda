import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pal } from '../../types';
import { ALL_PALS } from '../../data/pals';
import { ELEMENT_MAP } from '../../data/elements';
import { SheetModal } from '../ui/Modal';
import { SearchBar } from '../ui/SearchBar';
import { MonoText, TypeChip } from '../ui/primitives';
import { PalPortrait } from '../paldeck/PalPortrait';

/** SEARCHABLE PAL SELECT — image-first dropdown for the breeding module. */
export const PalSelect: React.FC<{
  label: string;
  value: Pal | null;
  onChange: (pal: Pal) => void;
  accent: string;
}> = ({ label, value, onChange, accent }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_PALS;
    return ALL_PALS.filter((p) =>
      `${p.name} ${p.id} #${String(p.dexNo).padStart(3, '0')} ${p.elements.join(' ')}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View>
      <Text className="mb-1 text-[13px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="pda-btn flex-row items-center gap-2.5 rounded-lg border border-slate-700 bg-well/80 p-2.5"
      >
        {value ? (
          <>
            <PalPortrait pal={value} size={42} showIndex={false} />
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-bold text-ink">{value.name}</Text>
              <View className="flex-row gap-1">
                {value.elements.map((e) => (
                  <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} />
                ))}
              </View>
            </View>
            <MonoText className="text-[13px] text-muted font-medium">BP {value.breedingPower ?? '??'}</MonoText>
          </>
        ) : (
          <>
            <View className="h-10 w-10 items-center justify-center rounded-lg border border-dashed" style={{ borderColor: `${accent}55` }}>
              <Text style={{ color: accent }}>＋</Text>
            </View>
            <Text className="text-xs text-faint font-medium">TAP TO SELECT PAL…</Text>
          </>
        )}
      </Pressable>

      <SheetModal visible={open} title={`Select ${label}`} onClose={() => setOpen(false)}>
        <SearchBar value={query} onChange={setQuery} placeholder="Filter by name, element, #dex…" />
        <MonoText className="mt-2 text-[13px] text-faint font-medium">{options.length} MATCHES · SCROLL TO BROWSE</MonoText>
        <View className="mt-1.5 pb-4">
          {options.slice(0, 150).map((p) => (
            <Pressable
              key={p.id}
              onPress={() => {
                onChange(p);
                setOpen(false);
                setQuery('');
              }}
              className="pda-row flex-row items-center gap-2.5 rounded-lg border border-transparent px-1.5 py-1.5"
            >
              <PalPortrait pal={p} size={38} showIndex={false} />
              <View className="min-w-0 flex-1">
                <View className="flex-row items-baseline gap-1.5">
                  <Text className="text-xs font-bold text-ink">{p.name}</Text>
                  <MonoText className="text-[13px] text-faint font-medium">#{String(p.dexNo).padStart(3, '0')}</MonoText>
                </View>
                <View className="flex-row items-center gap-1.5">
                  {p.elements.map((e) => (
                    <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} />
                  ))}
                  <MonoText className="text-[13px] text-faint font-medium">BP {p.breedingPower ?? '?'}</MonoText>
                  {p.quality === 'minimal' ? <MonoText className="text-[13px] text-faint font-medium">SCAN</MonoText> : null}
                </View>
              </View>
              <Text className="text-[13px] text-paldium">PICK ▸</Text>
            </Pressable>
          ))}
          {options.length > 150 ? (
            <Text className="mt-2 text-center text-[13px] text-muted font-medium">+{options.length - 150} more — refine search</Text>
          ) : null}
        </View>
      </SheetModal>
    </View>
  );
};
