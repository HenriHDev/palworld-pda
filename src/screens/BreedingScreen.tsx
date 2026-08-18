import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Pal } from '../types';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { usePersistence } from '../hooks/usePersistence';
import { useRouter } from '../navigation/router';
import { getOffspring } from '../logic/breeding';
import { getPal } from '../data/pals';
import { AccessibilityHint, ReverseParentPanel } from '../components/breeding/ReverseParentPanel';
import { ChainSolverPanel } from '../components/breeding/ChainSolverPanel';
import { MutationSimPanel } from '../components/breeding/MutationSimPanel';
import { OffspringCard } from '../components/breeding/OffspringCard';
import { PalSelect } from '../components/breeding/PalSelect';
import { GlassCard, MonoText, SectionTitle, Segmented } from '../components/ui/primitives';

type LabTab = 'calculator' | 'reverse' | 'chain' | 'simulator';

export const BreedingScreen: React.FC = () => {
  const [tab, setTab] = useState<LabTab>('calculator');
  const [parentA, setParentA] = useState<Pal | null>(null);
  const [parentB, setParentB] = useState<Pal | null>(null);
  const { checklist, breedingPlans, saveBreedingPlan, deleteBreedingPlan } = usePersistence();
  const { navigate, route } = useRouter();
  const bp = useBreakpoint();

  // Deep link: arriving with a requested parent pair prefills the calculator.
  const requestedParents = route.name === 'breeding' ? route.parents : null;
  React.useEffect(() => {
    if (!requestedParents) return;
    const a = getPal(requestedParents.a);
    const b = getPal(requestedParents.b);
    if (a && b) {
      setParentA(a);
      setParentB(b);
      setTab('calculator');
    }
  }, [requestedParents?.a, requestedParents?.b]);

  const result = useMemo(
    () => (parentA && parentB ? getOffspring(parentA.id, parentB.id) : null),
    [parentA, parentB]
  );
  const child = result?.child ?? null;

  const ownedIds = useMemo(
    () => Object.keys(checklist.captured).filter((id) => checklist.captured[id]),
    [checklist.captured]
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pb-10">
        {/* header */}
        <View className="pda-gridbg mb-3 flex-row items-center justify-between rounded-xl border border-slate-800 bg-panel/80 p-4 shadow-card">
          <View>
            <Text className="text-lg font-black text-ink">
              BREEDING <Text className="text-gold">LAB</Text>
            </Text>
            <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">CombiRank engine · v1.0 mutation rules</MonoText>
          </View>
          <View className="items-end">
            <MonoText className="text-[13px] text-neon">{ownedIds.length} SPECIES OWNED</MonoText>
            <MonoText className="text-[13px] text-faint font-medium">feedstock for chain solver</MonoText>
          </View>
        </View>

        <Segmented
          accent="#F59E0B"
          options={[
            { id: 'calculator', label: 'CALCULATOR', icon: '⚭' },
            { id: 'reverse', label: 'REVERSE', icon: '◂' },
            { id: 'chain', label: 'CHAIN', icon: '⇶' },
            { id: 'simulator', label: 'MUTATION', icon: '⚗' }
          ]}
          value={tab}
          onChange={(id) => setTab(id as LabTab)}
        />

        <View className="mt-3 gap-3">
          {tab === 'calculator' ? (
            <>
              <GlassCard glow="cyan" hover={false} className="p-4">
                <SectionTitle color="#06B6D4">Parent → Offspring</SectionTitle>
                <View className={`gap-3 ${bp.isDesktop ? 'flex-row' : ''}`}>
                  <View className="flex-1">
                    <PalSelect label="PARENT A" value={parentA} onChange={setParentA} accent="#06B6D4" />
                  </View>
                  <View className="flex-1">
                    <PalSelect label="PARENT B" value={parentB} onChange={setParentB} accent="#8B5CF6" />
                  </View>
                </View>
                <View className="mt-3">
                  <OffspringCard result={result} parentA={parentA} parentB={parentB} />
                </View>
                {child && child.id !== parentA?.id && child.id !== parentB?.id ? (
                  <Text
                    className="pda-btn mt-3 text-center text-[13px] font-bold text-paldium"
                    onPress={() => navigate({ name: 'pal', palId: child.id })}
                  >
                    OPEN {child.name.toUpperCase()} DOSSIER ▸
                  </Text>
                ) : null}
              </GlassCard>

              {child && parentA && parentB ? (
                <GlassCard glow="green" hover={false} className="p-4">
                  <SectionTitle color="#10B981">Save Breeding Plan</SectionTitle>
                  <Text className="text-[13px] text-muted font-medium">
                    {parentA.name} × {parentB.name} → {child.name}
                  </Text>
                  <View className="mt-2">
                    <Text
                      className="pda-btn self-start rounded-lg border border-neon/70 bg-neon/10 px-3.5 py-2 text-[13px] font-bold text-neon"
                      onPress={() =>
                        saveBreedingPlan({
                          name: `${parentA.name} × ${parentB.name}`,
                          targetPalId: child.id,
                          parents: { a: parentA.id, b: parentB.id },
                          cake: 'standard',
                          desiredPassives: [],
                          targetIvs: {}
                        })
                      }
                    >
                      ⬇ SAVE PLAN
                    </Text>
                  </View>
                </GlassCard>
              ) : null}

              <SavedPlans plans={breedingPlans} onDelete={deleteBreedingPlan} onOpen={(id) => navigate({ name: 'pal', palId: id })} />
            </>
          ) : null}

          {tab === 'reverse' ? (
            <>
              <AccessibilityHint />
              <ReverseParentPanel
                onPickParents={(a, b) => {
                  setParentA(a);
                  setParentB(b);
                  setTab('calculator');
                }}
              />
            </>
          ) : null}

          {tab === 'chain' ? <ChainSolverPanel ownedIds={ownedIds} onResult={(p) => navigate({ name: 'pal', palId: p.id })} /> : null}

          {tab === 'simulator' ? <MutationSimPanel /> : null}
        </View>
      </View>
    </ScrollView>
  );
};

const SavedPlans: React.FC<{
  plans: { id: string; name: string; targetPalId: string; createdAt: number }[];
  onDelete: (id: string) => void;
  onOpen: (palId: string) => void;
}> = ({ plans, onDelete, onOpen }) => {
  const [open, setOpen] = useState(false);
  if (plans.length === 0) return null;
  return (
    <GlassCard glow="none" hover={false} className="p-4">
      <Pressable className="flex-row items-center justify-between" onPress={() => setOpen((o) => !o)}>
        <SectionTitle>Saved Breeding Plans ({plans.length})</SectionTitle>
        <Text className="text-paldium">{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open ? (
        <View className="gap-1.5">
          {plans.map((p) => (
            <View key={p.id} className="pda-row flex-row items-center justify-between rounded-lg border border-slate-800 bg-well/60 p-2.5">
              <View className="flex-1">
                <Text className="text-xs font-bold text-ink" onPress={() => onOpen(p.targetPalId)}>
                  {p.name}
                </Text>
                <MonoText className="text-[13px] text-faint font-medium">{new Date(p.createdAt).toLocaleString()}</MonoText>
              </View>
              <Pressable onPress={() => onDelete(p.id)} className="pda-btn rounded border border-ember/50 px-2 py-1">
                <Text className="text-[13px] font-bold text-ember">DELETE</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </GlassCard>
  );
};
