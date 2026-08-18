import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pal } from '../../types';
import { findBreedingChain } from '../../logic/breeding';
import { getPal } from '../../data/pals';
import { ELEMENT_MAP } from '../../data/elements';
import { GlassCard, MonoText, TypeChip } from '../ui/primitives';
import { PalPortrait } from '../paldeck/PalPortrait';
import { PalSelect } from './PalSelect';

/**
 * CHAIN SOLVER — "I own these Pals, how do I breed [target]?"
 * Uses the persisted captured checklist as the starting pool.
 */
export const ChainSolverPanel: React.FC<{
  ownedIds: string[];
  onResult: (target: Pal) => void;
}> = ({ ownedIds, onResult }) => {
  const [target, setTarget] = useState<Pal | null>(null);
  const [maxDepth, setMaxDepth] = useState(3);

  const plan = useMemo(
    () => (target ? findBreedingChain(ownedIds, target.id, maxDepth) : null),
    [ownedIds, target, maxDepth]
  );

  return (
    <GlassCard glow="cyan" hover={false} className="p-4">
      <View className="mb-2">
        <Text className="text-sm font-black text-ink">
          CHAIN <Text className="text-paldium">SOLVER</Text>
        </Text>
        <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">
          Breed a target from your captured species · BFS ≤ 3 generations
        </MonoText>
      </View>

      <View className="mt-2">
        <PalSelect label="BREED TARGET" value={target} onChange={setTarget} accent="#06B6D4" />
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <MonoText className="text-[13px] text-muted font-medium">OWNED: {ownedIds.length} SPECIES</MonoText>
        <View className="flex-row gap-1">
          {[1, 2, 3].map((d) => (
            <Text
              key={d}
              onPress={() => setMaxDepth(d)}
              className={`rounded px-1.5 py-0.5 text-[13px] ${maxDepth === d ? 'bg-paldium/20 text-paldium' : 'text-muted'}`}
            >
              {d} GEN
            </Text>
          ))}
        </View>
      </View>

      {plan && target ? (
        plan.found ? (
          <View className="mt-3">
            <MonoText className="text-[13px] text-neon">CHAIN FOUND — {plan.path.length - 1} BREEDING STEP(S)</MonoText>
            <View className="mt-2 gap-1.5">
              {plan.path.map((node, i) => (
                <View key={`${node.pal.id}-${i}`} className="flex-row items-center gap-2">
                  <View className="w-7 items-center">
                    {i === 0 ? (
                      <MonoText className="text-[13px] text-neon">OWNED</MonoText>
                    ) : (
                      <MonoText className="text-[13px] text-gold">STEP {i}</MonoText>
                    )}
                  </View>
                  <Pressable
                    onPress={() => onResult(node.pal)}
                    className="pda-row flex-1 rounded-lg border border-slate-700 bg-well/60 p-2"
                  >
                    <View className="flex-row items-center gap-2">
                      <PalPortrait pal={node.pal} size={30} showIndex={false} />
                      <Text className="flex-1 text-xs font-bold text-ink">{node.pal.name}</Text>
                      <View className="flex-row gap-1">
                        {node.pal.elements.map((e) => (
                          <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} />
                        ))}
                      </View>
                    </View>
                    {node.recipe ? (
                      <MonoText className="mt-1 text-[13px] text-paldium">
                        = {getPal(node.recipe.aId)?.name ?? node.recipe.aId} +{' '}
                        {getPal(node.recipe.bId)?.name ?? node.recipe.bId}
                        {node.recipe.special ? ' · SPECIAL' : ''}
                      </MonoText>
                    ) : (
                      <MonoText className="mt-1 text-[13px] text-neon">OWNED / CATCHABLE</MonoText>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
            <Text className="mt-2 text-[13px] leading-4 text-muted font-medium">
              Chain uses your captured species as the gene pool. Special-combo steps are preferred automatically.
            </Text>
          </View>
        ) : (
          <Text className="mt-3 text-xs text-gold">
            No chain ≤ {maxDepth} generations from your current captures. In 1.0, most targets need at least one
            rare parent — catch a low-rank Pal or a special-combo variant, then retry.
          </Text>
        )
      ) : null}
    </GlassCard>
  );
};
