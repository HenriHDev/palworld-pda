import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pal, ParentPair } from '../../types';
import { findAllParentPairs } from '../../logic/breeding';
import { ELEMENT_MAP } from '../../data/elements';
import { Badge, GlassCard, MonoText, SectionTitle } from '../ui/primitives';
import { PalSelect } from './PalSelect';
import { PalPortrait } from '../paldeck/PalPortrait';

/**
 * OFFSPRING → PARENTS — all valid parent pairs for a target Pal, sorted by
 * early-game accessibility, with special combos pinned first.
 */
export const ReverseParentPanel: React.FC<{
  onPickParents: (a: Pal, b: Pal) => void;
}> = ({ onPickParents }) => {
  const [target, setTarget] = useState<Pal | null>(null);
  const [limit, setLimit] = useState(15);

  const pairs = useMemo<ParentPair[]>(
    () => (target ? findAllParentPairs(target.id) : []),
    [target]
  );

  return (
    <GlassCard glow="green" hover={false} className="p-4">
      <View className="mb-3">
        <Text className="text-sm font-black text-ink">
          REVERSE <Text className="text-neon">LOOKUP</Text>
        </Text>
        <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">
          Offspring → every valid parent pair · official 1.0 CombiRank table
        </MonoText>
      </View>
      <PalSelect label="Target Pal" value={target} onChange={(p) => setTarget(p)} accent="#10B981" />

      {target && pairs.length === 0 ? (
        <Text className="mt-3 text-xs text-muted font-medium">
          No confirmed parent pairs — {target.name} is likely not resolvable with the datamined Breeding Power table yet.
        </Text>
      ) : null}

      {pairs.length > 0 ? (
        <>
          <MonoText className="mt-3 text-[13px] text-neon">{pairs.length} VALID PARENT PAIRS</MonoText>
          <View className="mt-2 gap-1.5">
            {pairs.slice(0, limit).map((pair, i) => (
              <Pressable
                key={`${pair.a.id}-${pair.b.id}`}
                onPress={() => onPickParents(pair.a, pair.b)}
                className="flex-row items-center gap-2 rounded-lg border border-slate-700/70 bg-well/50 p-2"
              >
                <MonoText className="w-6 text-[13px] text-faint font-medium">#{i + 1}</MonoText>
                <View className="flex-1 flex-row items-center justify-center gap-2">
                  <View className="items-center">
                    <PalPortrait pal={pair.a} size={32} showIndex={false} />
                    <Text className="text-[13px] text-ink" numberOfLines={1}>
                      {pair.a.name}
                    </Text>
                  </View>
                  <MonoText className="text-paldium">+</MonoText>
                  <View className="items-center">
                    <PalPortrait pal={pair.b} size={32} showIndex={false} />
                    <Text className="text-[13px] text-ink" numberOfLines={1}>
                      {pair.b.name}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-0.5">
                  {pair.sameSpecies ? <Badge label="SAME-SPECIES" color="#10B981" /> : null}
                  {pair.special ? <Badge label="SPECIAL" color="#EF4444" /> : null}
                  <MonoText className="text-[13px] text-muted font-medium">ACC {pair.accessibility}</MonoText>
                </View>
              </Pressable>
            ))}
          </View>
          {pairs.length > limit ? (
            <Text className="mt-2 text-center text-[13px] font-bold text-paldium" onPress={() => setLimit((l) => l + 15)}>
              SHOW {Math.min(15, pairs.length - limit)} MORE ▾
            </Text>
          ) : null}
        </>
      ) : null}
    </GlassCard>
  );
};

/** Accessibility legend helper. */
export const AccessibilityHint: React.FC = () => (
  <View className="flex-row flex-wrap gap-2">
    <Badge label="ACC 80–100: early-game commons" color="#10B981" />
    <Badge label="ACC 40–79: mid-game" color="#F59E0B" />
    <Badge label="ACC <40: late/legendary" color="#EF4444" />
  </View>
);
