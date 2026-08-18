import React from 'react';
import { Text, View } from 'react-native';
import type { OffspringResult, Pal } from '../../types';
import { ELEMENT_MAP } from '../../data/elements';
import { Badge, GlassCard, MonoText, TypeChip } from '../ui/primitives';
import { PalPortrait } from '../paldeck/PalPortrait';

/** OFFSPRING CARD — renders the breeding result with formula readout. */
export const OffspringCard: React.FC<{
  result: OffspringResult | null;
  parentA: Pal | null;
  parentB: Pal | null;
}> = ({ result, parentA, parentB }) => {
  if (!result) {
    return (
      <GlassCard glow="gold" hover={false} className="p-4">
        <MonoText className="text-center text-xs text-muted font-medium">
          {parentA && parentB ? 'CALCULATING…' : 'SELECT BOTH PARENTS TO RESOLVE OFFSPRING'}
        </MonoText>
      </GlassCard>
    );
  }

  if (!result.child) {
    return (
      <GlassCard glow="red" hover={false} className="p-4">
        <View className="flex-row items-center gap-2">
          <Badge label={result.specialLabel ?? 'UNRESOLVED'} color="#EF4444" />
        </View>
        <MonoText className="mt-2 text-[13px] leading-4 text-ink/80">{result.formula}</MonoText>
        <Text className="mt-2 text-[13px] leading-3.5 text-faint font-medium">
          Registered species are excluded from rank math until official values ship — the engine never guesses.
        </Text>
      </GlassCard>
    );
  }

  const { child } = result;

  return (
    <GlassCard glow={result.special ? 'red' : 'cyan'} hover={false} className="p-4">
      {/* visual equation */}
      <View className="flex-row items-center justify-center gap-3">
        {parentA ? (
          <View className="items-center gap-1">
            <PalPortrait pal={parentA} size={64} showIndex={false} />
            <Text className="text-[13px] font-bold text-ink">{parentA.name}</Text>
          </View>
        ) : null}
        <MonoText className="text-lg text-muted font-medium">+</MonoText>
        {parentB ? (
          <View className="items-center gap-1">
            <PalPortrait pal={parentB} size={64} showIndex={false} />
            <Text className="text-[13px] font-bold text-ink">{parentB.name}</Text>
          </View>
        ) : null}
        <MonoText className="text-lg text-paldium">=</MonoText>
        <View className="items-center gap-1">
          <PalPortrait pal={child} size={72} />
          <Text className="text-[13px] font-black text-paldium">{child.name}</Text>
        </View>
      </View>

      {/* meta row */}
      <View className="mt-3 flex-row flex-wrap items-center justify-center gap-1.5">
        {child.elements.map((e) => (
          <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} />
        ))}
        {result.special ? <Badge label={result.specialLabel ?? 'SPECIAL'} color="#EF4444" /> : null}
      </View>

      <View className="mt-3 rounded-lg border border-slate-800 bg-well/80 p-2.5">
        <MonoText className="text-[13px] leading-4 text-neon">{result.formula}</MonoText>
      </View>

      {result.egg ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          <Badge label={`${result.egg.type} EGG`} color="#06B6D4" />
          <Badge label={result.egg.size.toUpperCase()} color="#F59E0B" />
          <Badge label={`INCUBATION ≈ ${result.egg.incubationMinutes} min`} color="#10B981" />
          {child.breedingPower !== null ? (
            <Badge label={`BP ${child.breedingPower}`} color="#8B5CF6" />
          ) : (
            <Badge label="BP PENDING" color="#EF4444" />
          )}
        </View>
      ) : null}
    </GlassCard>
  );
};
