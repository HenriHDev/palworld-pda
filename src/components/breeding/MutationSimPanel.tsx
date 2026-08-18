import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { CakeId, Pal } from '../../types';
import { CAKES } from '../../data/items';
import { PASSIVE_SKILLS } from '../../data/skills';
import {
  BASE_MUTATION,
  MUTATION_CONDENSATION,
  MUTATION_IV_MIN,
  mutationSpeciesDistribution,
  simulateInheritance,
  simulateMutations
} from '../../logic/mutation';
import { getOffspring } from '../../logic/breeding';
import { projectStats } from '../../logic/stats';
import { GlassCard, MonoText, Toggle } from '../ui/primitives';
import { PalSelect } from './PalSelect';
import { PalPortrait } from '../paldeck/PalPortrait';

const PASSIVE_CHOICES = PASSIVE_SKILLS.filter((p) => p.tier > 0 && !p.mutationExclusive);

const passiveName = (id: string) => PASSIVE_SKILLS.find((p) => p.id === id)?.name ?? id;

/**
 * MUTATION LAB — Palworld 1.0 rules.
 *  - Pick the two parents in your Breeding Farm → normal offspring + the
 *    MUTATION OUTCOME (rarer mutated species distribution, ★★ hatch, alpha,
 *    ≥90 IVs, mutation-exclusive passive).
 *  - Egg mutation odds: 1% base, 3% with the Extravagant/Deluxe Vegetable
 *    Cake. Conditional species distribution is modeled (native coefficient
 *    table not public) — clearly labeled.
 *  - Passive inheritance uses the 1.0 count table (1/2/3/4 → 40/30/20/10%);
 *    Special Cake forces 4.
 */
export const MutationSimPanel: React.FC = () => {
  const [parentA, setParentA] = useState<Pal | null>(null);
  const [parentB, setParentB] = useState<Pal | null>(null);
  const [passivesA, setPassivesA] = useState<string[]>(['legend', 'ferocious', 'musclehead', 'swift']);
  const [passivesB, setPassivesB] = useState<string[]>(['legend', 'burly_body', 'lucky', 'swift']);
  const [desired, setDesired] = useState<string[]>(['legend', 'ferocious', 'musclehead', 'swift']);
  const [cake, setCake] = useState<CakeId>('standard');
  const [mutationRoll, setMutationRoll] = useState(true);

  const inheritance = useMemo(
    () => simulateInheritance(passivesA, passivesB, desired, cake, 50000, 1337),
    [passivesA, passivesB, desired, cake]
  );

  const offspring = useMemo(
    () => (parentA && parentB ? getOffspring(parentA.id, parentB.id) : null),
    [parentA, parentB]
  );

  const mutation = useMemo(() => simulateMutations(cake, 20000, 42), [cake]);

  const speciesDist = useMemo(
    () => (parentA && parentB ? mutationSpeciesDistribution(parentA, parentB) : []),
    [parentA, parentB]
  );

  const cakeDef = CAKES.find((c) => c.id === cake)!;
  const eggChancePct = BASE_MUTATION * cakeDef.modifiers.mutationChanceMultiplier * 100;
  const eggsForOne = eggChancePct > 0 ? Math.max(1, Math.round(100 / eggChancePct)) : Infinity;

  return (
    <GlassCard glow="gold" hover={false} className="p-5">
      {/* ---------- header ---------- */}
      <View className="mb-5">
        <Text className="text-base font-black text-ink">
          PASSIVE <Text className="text-gold">INHERITANCE</Text> & v1.0 MUTATION LAB
        </Text>
        <MonoText className="text-[10px] uppercase tracking-[0.25em] text-muted">
          1.0 rules · mutated eggs hatch rarer ★★ species
        </MonoText>
      </View>

      {/* ---------- parents + passives ---------- */}
      <View className="gap-3">
        <View className="flex-row flex-wrap items-start gap-3">
          <View style={{ flexBasis: 280, flexGrow: 1, minWidth: 220 }}>
            <PalSelect label="PARENT A" value={parentA} onChange={setParentA} accent="#06B6D4" />
            <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
              <MonoText className="text-[10px] uppercase tracking-wider text-faint">PASSIVES:</MonoText>
              {passivesA.map((id) => (
                <View key={id} className="rounded-full border border-paldium/40 bg-paldium/10 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-paldium">{passiveName(id)}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flexBasis: 280, flexGrow: 1, minWidth: 220 }}>
            <PalSelect label="PARENT B" value={parentB} onChange={setParentB} accent="#8B5CF6" />
            <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
              <MonoText className="text-[10px] uppercase tracking-wider text-faint">PASSIVES:</MonoText>
              {passivesB.map((id) => (
                <View key={id} className="rounded-full border border-dark/40 bg-dark/10 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-[#8B5CF6]">{passiveName(id)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ---------- cake selector ---------- */}
      <View className="mt-5 border-t border-slate-800 pt-4">
        <Text className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gold">Cake Selection</Text>
        <View className="flex-row flex-wrap gap-1.5">
          {CAKES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCake(c.id as CakeId)}
              className={`pda-btn rounded-lg border px-2.5 py-1.5 ${cake === c.id ? 'border-gold bg-gold/10' : 'border-slate-700'}`}
            >
              <Text className={`text-[12px] font-bold ${cake === c.id ? 'text-gold' : 'text-muted'}`}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text className="mt-2 text-[11px] leading-4 text-muted">{cakeDef.description}</Text>
      </View>

      {/* ---------- result + mutation outcome ---------- */}
      {parentA && parentB ? (
        <View className="mt-5 gap-3">
          {/* normal offspring */}
          <View className="rounded-xl border border-slate-700 bg-well/60 p-4">
            <MonoText className="text-[10px] uppercase tracking-[0.25em] text-muted">Standard Offspring</MonoText>
            <View className="mt-3 flex-row flex-wrap items-center gap-2.5">
              <PalPortrait pal={parentA} size={40} showIndex={false} />
              <MonoText className="text-[11px] text-muted">+</MonoText>
              <PalPortrait pal={parentB} size={40} showIndex={false} />
              <MonoText className="text-[11px] text-paldium">=</MonoText>
              {offspring?.child ? (
                <>
                  <PalPortrait pal={offspring.child} size={48} />
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-black text-ink">
                      {offspring.child.name}
                      {offspring.special ? <MonoText className="text-[10px] text-ember"> · SPECIAL COMBO</MonoText> : null}
                    </Text>
                    <MonoText className="mt-0.5 text-[10px] leading-3.5 text-muted" numberOfLines={2}>
                      {offspring.formula}
                    </MonoText>
                  </View>
                </>
              ) : (
                <View className="min-w-0 flex-1">
                  <MonoText className="text-[11px] text-ember">{offspring?.formula ?? 'UNRESOLVED PAIR'}</MonoText>
                </View>
              )}
            </View>
          </View>

          {/* mutation outcome */}
          <View className="rounded-xl border border-ember/40 bg-ember/5 p-4">
            <View className="flex-row flex-wrap items-center justify-between gap-2">
              <MonoText className="text-[10px] uppercase tracking-[0.25em] text-ember">Mutation Outcome</MonoText>
              <MonoText className="rounded border border-ember/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-ember">
                {eggChancePct.toFixed(eggChancePct < 1 ? 1 : 0)}% PER EGG
              </MonoText>
            </View>

            <View className="mt-2.5 flex-row flex-wrap items-end gap-x-4 gap-y-1">
              <MonoText className="text-3xl text-ember">{eggChancePct.toFixed(eggChancePct < 1 ? 1 : 0)}%</MonoText>
              <View className="mb-1">
                <MonoText className="text-[11px] text-muted">
                  egg mutation chance · ≈ 1 in {Number.isFinite(eggsForOne) ? eggsForOne.toLocaleString() : '∞'} eggs
                </MonoText>
                <MonoText className="text-[10px] text-faint">
                  {cakeDef.id === 'deluxe'
                    ? 'Extravagant/Deluxe Vegetable Cake: 1% → 3%'
                    : 'use the Deluxe Vegetable Cake for 3%'}
                </MonoText>
              </View>
            </View>

            {/* mutated hatch properties */}
            <View className="mt-3 flex-row flex-wrap gap-1.5">
              <MonoText className="rounded border border-gold/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-gold">★★ CONDENSATION 2</MonoText>
              <MonoText className="rounded border border-ember/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-ember">ALPHA</MonoText>
              <MonoText className="rounded border border-paldium/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-paldium">IVs ≥ {MUTATION_IV_MIN}</MonoText>
              <MonoText className="rounded border border-neon/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-neon">+2–10% STAT GROWTH</MonoText>
              <MonoText className="rounded border border-dark/50 bg-well/60 px-2 py-0.5 text-[10px] font-semibold text-[#8B5CF6]">EXCLUSIVE PASSIVE</MonoText>
            </View>

            {/* conditional species table */}
            {speciesDist.length > 0 ? (
              <View className="mt-4">
                <View className="flex-row items-center justify-between">
                  <MonoText className="text-[10px] uppercase tracking-[0.25em] text-gold">If the egg mutates — mutated species</MonoText>
                  <MonoText className="text-[9px] text-faint">MODELED DISTRIBUTION</MonoText>
                </View>
                <View className="mt-2.5 gap-2">
                  {speciesDist.slice(0, 6).map((entry, i) => (
                    <View
                      key={entry.pal.id}
                      className={`flex-row items-center gap-3 rounded-lg border p-2.5 ${
                        i === 0 ? 'border-gold/50 bg-gold/10' : 'border-slate-700 bg-well/60'
                      }`}
                    >
                      <MonoText className="w-6 text-center text-[11px] text-faint">#{i + 1}</MonoText>
                      <PalPortrait pal={entry.pal} size={42} showIndex={false} />
                      <View className="min-w-0 flex-1">
                        <View className="flex-row flex-wrap items-center gap-1.5">
                          <Text className="text-[13px] font-black text-ink">{entry.pal.name}</Text>
                          <MonoText className="text-[10px] text-gold">★★</MonoText>
                          {i === 0 ? <MonoText className="text-[9px] text-ember">MOST LIKELY MUTATED HATCH</MonoText> : null}
                        </View>
                        <MonoText className="text-[10px] text-faint">
                          BP {entry.pal.breedingPower} · rarer than parents
                        </MonoText>
                      </View>
                      <MonoText className="text-lg text-gold">{(entry.conditionalPct * 100).toFixed(1)}%</MonoText>
                    </View>
                  ))}
                </View>
                <MonoText className="mt-2 text-[9px] leading-3.5 text-faint">
                  SPECIES RANKING IS MODELED (rarer-than-parents, weighted by rank distance) — THE NATIVE COEFFICIENT
                  TABLE IS NOT PUBLIC. MUTATED EGGS ARE ★★, ALPHA, ≥{MUTATION_IV_MIN} IVs AND ALWAYS CARRY ONE OF:
                  Immortality · Idiosyncratic · Babysitter · Heavily Armored · Lightfooted · God of Destruction.
                </MonoText>
              </View>
            ) : (
              <MonoText className="mt-3 text-[10px] text-muted">
                No rarer species resolvable for this pair — mutation rolls would still boost stats on the standard offspring.
              </MonoText>
            )}
          </View>

          {/* inheritance odds */}
          <View className="rounded-xl border border-slate-700 bg-well/60 p-4">
            <MonoText className="text-[10px] uppercase tracking-[0.25em] text-paldium">Passive Inheritance — {cakeDef.name}</MonoText>
            <MonoText className="mt-0.5 text-[9px] text-faint">
              1.0 COUNT TABLE: 1/2/3/4 inherited → 40/30/20/10%{cakeDef.modifiers.forceFourPassives ? ' · SPECIAL CAKE FORCES 4' : ''}
            </MonoText>
            <View className="mt-3 gap-2">
              {Object.entries(inheritance.perPassive)
                .sort((a, b) => b[1] - a[1])
                .map(([id, pct]) => {
                  const desiredHit = desired.includes(id);
                  return (
                    <View key={id} className="flex-row items-center gap-2">
                      <Text className={`w-44 text-[11px] font-bold ${desiredHit ? 'text-neon' : 'text-ink'}`} numberOfLines={1}>
                        {passiveName(id)}{desiredHit ? ' ✓' : ''}
                      </Text>
                      <View className="flex-1">
                        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-700/60">
                          <View
                            className="h-2 rounded-full"
                            style={{ width: `${Math.min(100, pct * 100)}%`, backgroundColor: desiredHit ? '#10B981' : '#06B6D4' }}
                          />
                        </View>
                      </View>
                      <MonoText className="w-14 text-right text-[11px]" style={{ color: desiredHit ? '#10B981' : '#06B6D4' }}>
                        {(pct * 100).toFixed(1)}%
                      </MonoText>
                    </View>
                  );
                })}
            </View>
            <View className="mt-3.5 border-t border-slate-800 pt-3">
              <View className="flex-row flex-wrap items-end gap-2">
                <MonoText className="text-xl text-neon">{(inheritance.empiricalChance * 100).toFixed(2)}%</MonoText>
                <MonoText className="mb-0.5 text-[10px] text-muted">
                  chance the child carries ALL {desired.length} desired passives
                </MonoText>
              </View>
              <MonoText className="mt-1 text-[10px] text-gold">
                ≈ 1 in {Number.isFinite(inheritance.expectedEggs) ? inheritance.expectedEggs.toLocaleString() : '∞'} eggs for the clean target
              </MonoText>
            </View>
          </View>

          {/* mutated stat projection */}
          {offspring?.child && offspring.child.stats ? (
            <View className="rounded-xl border border-slate-700 bg-well/60 p-4">
              <MonoText className="text-[10px] uppercase tracking-[0.25em] text-ember">Mutated Stat Projection — Lv50</MonoText>
              <View className="mt-2.5 gap-1.5">
                {(
                  [
                    ['hp', 'HP'],
                    ['meleeAtk', 'ATK'],
                    ['def', 'DEF'],
                    ['workSpeed', 'WORK']
                  ] as const
                ).map(([key, label]) => {
                  const base = projectStats(offspring.child!, 50)[key];
                  const min = Math.floor(base * 1.02);
                  const max = Math.floor(base * 1.1);
                  return (
                    <View key={key} className="flex-row items-center justify-between">
                      <MonoText className="text-[10px] text-faint">{label}</MonoText>
                      <MonoText className="text-[11px] text-ink">
                        {base} <MonoText className="text-ember">→ {min}–{max}</MonoText>
                      </MonoText>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <View className="mt-5 rounded-lg border border-dashed border-slate-700 p-4">
          <MonoText className="text-center text-[11px] text-muted">
            SELECT BOTH PARENTS TO PROJECT THE STANDARD OFFSPRING, THE MUTATION OUTCOME AND PASSIVE INHERITANCE
          </MonoText>
        </View>
      )}

      {/* ---------- mutation roll + pickers ---------- */}
      <View className="mt-5 border-t border-slate-800 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-bold uppercase tracking-widest text-ember">v1.0 Mutation Roll</Text>
          <Toggle value={mutationRoll} onChange={setMutationRoll} />
        </View>
      </View>

      <View className="mt-4 gap-3">
        <PassivePicker label="PARENT A PASSIVES (tap to change)" ids={passivesA} onChange={setPassivesA} accent="#06B6D4" />
        <PassivePicker label="PARENT B PASSIVES (tap to change)" ids={passivesB} onChange={setPassivesB} accent="#8B5CF6" />
        <PassivePicker label="DESIRED ON CHILD (clean target)" ids={desired} onChange={setDesired} accent="#10B981" />
      </View>

      {/* ---------- Monte-Carlo detail ---------- */}
      {mutationRoll ? (
        <View className="mt-4 rounded-xl border border-slate-700 bg-well/60 p-3.5">
          <MonoText className="text-[10px] uppercase tracking-widest text-faint">
            Monte-Carlo detail — {inheritance.trials.toLocaleString()} inheritance / {mutation.trials.toLocaleString()} mutation trials
          </MonoText>
          <View className="mt-2.5 flex-row flex-wrap gap-2">
            <View className="rounded border border-slate-700 px-2 py-1">
              <MonoText className="text-[10px] text-gold">EXCLUSIVE PASSIVE {(mutation.outcomeOdds.exclusivePassive * 100).toFixed(2)}%</MonoText>
            </View>
            <View className="rounded border border-slate-700 px-2 py-1">
              <MonoText className="text-[10px] text-gold">STAT BOOST ONLY {(mutation.outcomeOdds.clean * 100).toFixed(2)}%</MonoText>
            </View>
          </View>
          {mutation.sampleRolls.length > 0 ? (
            <View className="mt-2.5">
              <MonoText className="text-[9px] text-faint">SAMPLE MUTATED ROLLS (SEED 42)</MonoText>
              {mutation.sampleRolls.map((r, i) => (
                <MonoText key={i} className="text-[10px] text-ink/80">
                  #{i + 1} +{r.growthBonusPct}% growth on {r.boostedStats.join('+') || '—'}
                  {r.exclusivePassive ? ` · passive: ${passiveName(r.exclusivePassive)}` : ''}
                </MonoText>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </GlassCard>
  );
};

const PassivePicker: React.FC<{
  label: string;
  ids: string[];
  onChange: (ids: string[]) => void;
  accent: string;
}> = ({ label, ids, onChange, accent }) => {
  const toggle = (id: string) => {
    if (ids.includes(id)) {
      onChange(ids.filter((x) => x !== id));
    } else if (ids.length < 4) {
      onChange([...ids, id]);
    }
  };

  return (
    <View>
      <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>
        {label} ({ids.length}/4)
      </Text>
      <View className="flex-row flex-wrap gap-1.5">
        {PASSIVE_CHOICES.map((p) => {
          const active = ids.includes(p.id);
          return (
            <Pressable
              key={p.id}
              onPress={() => toggle(p.id)}
              className={`pda-btn rounded-full border px-2.5 py-1 ${active ? '' : 'border-slate-700'}`}
              style={active ? { borderColor: accent, backgroundColor: `${accent}22` } : undefined}
            >
              <Text className="text-[11px]" style={{ color: active ? accent : '#AEB9CC' }}>
                {p.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
