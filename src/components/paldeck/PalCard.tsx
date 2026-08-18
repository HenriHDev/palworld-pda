import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pal } from '../../types';
import { ELEMENT_MAP } from '../../data/elements';
import { PalPortrait } from './PalPortrait';
import { MonoText, TypeChip } from '../ui/primitives';

export const PalCard: React.FC<{
  pal: Pal;
  onPress: () => void;
  captured?: boolean;
  onToggleCaptured: () => void;
}> = ({ pal, onPress, captured, onToggleCaptured }) => {
  const accent = ELEMENT_MAP[pal.elements[0]]?.color ?? '#06B6D4';

  return (
    <Pressable onPress={onPress} className="pda-card overflow-hidden rounded-xl border border-slate-800 bg-panel/90 shadow-card">
      {/* artwork band */}
      <View className="relative items-center justify-center py-3" style={{ backgroundColor: `${accent}0D` }}>
        <PalPortrait pal={pal} size={74} showIndex={false} />
        {/* capture toggle — works without opening the dossier */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleCaptured();
          }}
          hitSlop={8}
          className={`pda-btn absolute right-1.5 top-1.5 h-7 w-7 items-center justify-center rounded-full border ${
            captured ? 'border-neon bg-neon/25 shadow-neonglow' : 'border-slate-600 bg-well/90'
          }`}
        >
          <Text className="text-[13px]" style={{ color: captured ? '#10B981' : '#64748B' }}>
            {captured ? '✓' : '◯'}
          </Text>
        </Pressable>
      </View>

      <View className="border-t border-slate-800/70 px-3 py-2.5">
        <View className="flex-row items-center justify-between">
          <MonoText className="text-[13px] text-paldium">#{String(pal.dexNo).padStart(3, '0')}</MonoText>
          {captured ? (
            <View className="rounded border border-neon/50 bg-neon/10 px-1.5 py-0.5">
              <Text className="text-[13px] font-bold text-neon">✓ GOT IT</Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-0.5 text-[13px] font-bold text-ink" numberOfLines={1}>
          {pal.name}
        </Text>
        <Text className="text-[13px] text-muted font-medium" numberOfLines={1}>
          {pal.title || '—'}
        </Text>
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row flex-wrap gap-1">
            {pal.elements.map((e) => (
              <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} />
            ))}
          </View>
          <MonoText className="text-[13px] text-faint font-medium">BP {pal.breedingPower !== null ? pal.breedingPower : '?'}</MonoText>
        </View>
      </View>
    </Pressable>
  );
};
