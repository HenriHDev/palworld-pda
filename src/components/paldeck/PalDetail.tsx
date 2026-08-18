import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Pal } from '../../types';
import { EGG_MAP, ELEMENT_MAP, REGION_META } from '../../data/elements';
import { ITEM_MAP } from '../../data/items';
import { SKILL_MAP } from '../../data/skills';
import { DECK_MAX } from '../../logic/filter';
import { EMPTY_IVS, IV_MAX, projectStats, type Ivs } from '../../logic/stats';
import { findAllParentPairs } from '../../logic/breeding';
import { Badge, GlassCard, MonoText, ProgressBar, SectionTitle, TypeChip } from '../ui/primitives';
import { PalPortrait } from './PalPortrait';

const STAT_ROWS: { key: keyof Ivs; label: string; color: string }[] = [
  { key: 'hp', label: 'HP', color: '#10B981' },
  { key: 'meleeAtk', label: 'MELEE ATK', color: '#EF4444' },
  { key: 'rangedAtk', label: 'RANGED ATK', color: '#F59E0B' },
  { key: 'def', label: 'DEFENSE', color: '#06B6D4' },
  { key: 'workSpeed', label: 'WORK SPEED', color: '#8B5CF6' }
];

/** STAT PANEL — base stats, deck percentile bars, IV sliders with live projection. */
export const StatPanel: React.FC<{ pal: Pal }> = ({ pal }) => {
  const [ivs, setIvs] = React.useState<Ivs>(EMPTY_IVS);
  const [level, setLevel] = React.useState(50);

  const projected = pal.stats ? projectStats(pal, level, ivs) : null;

  return (
    <GlassCard hover={false} className="p-5">
      <SectionTitle>Base Stats & Projection</SectionTitle>
      {!pal.stats ? (
        <Text className="text-xs text-muted font-medium">PDA scan incomplete — stat block not yet in the public datamine.</Text>
      ) : (
        <>
          <View className="gap-2.5">
            {STAT_ROWS.map(({ key, label, color }) => {
              const base = pal.stats![key];
              const pct = Math.round((base / Math.max(1, DECK_MAX[key])) * 100);
              const proj = projected ? projected[key] : 0;
              return (
                <View key={key}>
                  <View className="flex-row items-center justify-between">
                    <MonoText className="text-[13px] uppercase tracking-wider text-muted font-medium">{label}</MonoText>
                    <MonoText className="text-[13px] text-ink">
                      {base} <MonoText className="text-faint font-medium">→ Lv{level} {proj}</MonoText>
                    </MonoText>
                  </View>
                  <ProgressBar value={pct} color={color} height={6} />
                </View>
              );
            })}
          </View>

          <View className="mt-4 border-t border-slate-800 pt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[13px] uppercase tracking-wider text-muted font-medium">Projection level</Text>
              <View className="flex-row gap-1">
                {[1, 20, 35, 50, 60, 80].map((lv) => (
                  <PressableLevel key={lv} lv={lv} level={level} setLevel={setLevel} />
                ))}
              </View>
            </View>
            <Text className="mb-2 mt-3 text-[13px] uppercase tracking-wider text-muted font-medium">IVs (0–{IV_MAX} per stat)</Text>
            {STAT_ROWS.map(({ key, label, color }) => (
              <View key={key} className="mb-1.5">
                <View className="flex-row justify-between">
                  <MonoText className="text-[13px] text-faint font-medium">{label}</MonoText>
                  <MonoText className="text-[13px]" style={{ color }}>
                    {ivs[key]}/{IV_MAX}
                  </MonoText>
                </View>
                <View className="flex-row">
                  {Array.from({ length: IV_MAX + 1 }, (_, i) => (
                    <Text
                      key={i}
                      onPress={() => setIvs((s) => ({ ...s, [key]: i }))}
                      className="mr-[1px] mt-1 h-3 flex-1 rounded-[1px]"
                      style={{ backgroundColor: i <= ivs[key] ? color : '#334155' }}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </GlassCard>
  );
};

const PressableLevel: React.FC<{ lv: number; level: number; setLevel: (n: number) => void }> = ({ lv, level, setLevel }) => (
  <Text
    onPress={() => setLevel(lv)}
    className={`rounded px-1.5 py-0.5 text-[13px] ${level === lv ? 'bg-paldium/20 text-paldium' : 'text-muted'}`}
  >
    {lv}
  </Text>
);

/** WORK PANEL — v1.0 suitability levels (1–10). */
export const WorkPanel: React.FC<{ pal: Pal }> = ({ pal }) => (
  <GlassCard hover={false} className="p-5">
    <SectionTitle>Work Suitability</SectionTitle>
    {pal.works.length === 0 ? (
      <Text className="text-xs text-muted font-medium">No work suitabilities on record.</Text>
    ) : (
      <View className="gap-2.5">
        {[...pal.works]
          .sort((a, b) => b.level - a.level)
          .map((w) => (
            <View key={w.type} className="flex-row items-center gap-3">
              <Text className="w-44 text-xs text-ink">{w.type}</Text>
              <View className="flex-1">
                <ProgressBar value={(w.level / 10) * 100} color="#10B981" height={5} />
              </View>
              <MonoText className="w-10 text-right text-xs text-neon">Lv {w.level}</MonoText>
            </View>
          ))}
      </View>
    )}
  </GlassCard>
);

/** SKILL PANEL — partner skill + move progression tree. */
export const SkillPanel: React.FC<{ pal: Pal }> = ({ pal }) => (
  <GlassCard hover={false} className="p-5">
    <SectionTitle>Active Skills</SectionTitle>
    {pal.partnerSkill ? (
      <View className="mb-4 rounded-lg border border-gold/40 bg-gold/5 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold text-gold">{pal.partnerSkill.name} — PARTNER SKILL</Text>
          {pal.partnerSkill.cooldownSec > 0 ? (
            <MonoText className="text-[13px] text-muted font-medium">CD {pal.partnerSkill.cooldownSec}s</MonoText>
          ) : (
            <MonoText className="text-[13px] text-muted font-medium">PASSIVE</MonoText>
          )}
        </View>
        <Text className="mt-1 text-[13px] leading-4 text-ink/80">{pal.partnerSkill.description}</Text>
      </View>
    ) : null}

    {pal.activeSkills.length === 0 ? (
      <Text className="text-xs text-muted font-medium">No move data in PDA — awaiting datamine.</Text>
    ) : (
      <View>
        {[...pal.activeSkills]
          .sort((a, b) => a.levelLearned - b.levelLearned)
          .map((s) => {
            const def = SKILL_MAP[s.id];
            if (!def) return null;
            const el = ELEMENT_MAP[def.element];
            return (
              <View key={`${s.id}-${s.levelLearned}`} className="pda-row mb-1 flex-row items-center gap-2 rounded-md border border-transparent px-1.5 py-1">
                <MonoText className="w-10 text-right text-[13px] text-paldium">
                  {s.levelLearned === 0 ? '—' : `Lv${s.levelLearned}`}
                </MonoText>
                <View className="h-2 w-2 rounded-full" style={{ backgroundColor: el?.color ?? '#94A3B8' }} />
                <Text className="flex-1 text-xs text-ink">{def.name}</Text>
                <MonoText className="text-[13px] text-muted font-medium">
                  PWR {def.power} · CT {def.ct} · {def.cooldownSec}s
                </MonoText>
              </View>
            );
          })}
      </View>
    )}
  </GlassCard>
);

/** DROP PANEL — exact drop rates. */
export const DropPanel: React.FC<{ pal: Pal }> = ({ pal }) => (
  <GlassCard hover={false} className="p-5">
    <SectionTitle>Drops</SectionTitle>
    {pal.drops.length === 0 ? (
      <Text className="text-xs text-muted font-medium">No drop data in PDA.</Text>
    ) : (
      <View>
        {pal.drops.map((d) => {
          const item = ITEM_MAP[d.itemId];
          return (
            <View key={d.itemId} className="pda-row mb-1.5 flex-row items-center gap-3 rounded-md border border-transparent px-1.5 py-1">
              <Text className="flex-1 text-xs text-ink">{item?.name ?? d.itemId}</Text>
              <View className="w-40">
                <ProgressBar value={d.chance} color="#F59E0B" height={5} />
              </View>
              <MonoText className="w-12 text-right text-xs text-gold">{d.chance}%</MonoText>
            </View>
          );
        })}
      </View>
    )}
  </GlassCard>
);

/** SPAWN PANEL — day/night markers with coordinates. */
export const SpawnPanel: React.FC<{ pal: Pal }> = ({ pal }) => (
  <GlassCard hover={false} className="p-5">
    <SectionTitle>Spawn Locations</SectionTitle>
    {pal.spawns.length === 0 ? (
      <Text className="text-xs text-muted font-medium">No confirmed spawn data in PDA.</Text>
    ) : (
      <View className="gap-1.5">
        {pal.spawns.map((s, i) => (
          <View key={i} className="pda-row flex-row items-center gap-2 rounded-md border border-transparent px-1.5 py-1">
            <MonoText className="text-[13px] text-faint font-medium">{String(s.x).padStart(2, '0')},{String(s.y).padStart(2, '0')}</MonoText>
            <Text className="flex-1 text-xs text-ink">
              {s.label}
              {s.isAlpha ? ` — ALPHA Lv${s.alphaLevel ?? '?'}` : ''}
            </Text>
            <Badge
              label={s.phase === 'both' ? 'D/N' : s.phase.toUpperCase()}
              color={s.phase === 'night' ? '#8B5CF6' : s.phase === 'day' ? '#F59E0B' : '#10B981'}
            />
          </View>
        ))}
      </View>
    )}
    <View className="mt-3 flex-row flex-wrap gap-1">
      {[...new Set(pal.spawns.map((s) => s.region).filter((r): r is NonNullable<typeof r> => !!r))].map((r) => (
        <Badge key={r} label={REGION_META[r]?.name ?? r} color="#06B6D4" />
      ))}
    </View>
  </GlassCard>
);

/** EGG PANEL — breeding data + element matchups + your captured parent routes. */
export const EggPanel: React.FC<{
  pal: Pal;
  capturedIds: string[];
  onOpenLab: (a: Pal, b: Pal) => void;
}> = ({ pal, capturedIds, onOpenLab }) => {
  const egg = EGG_MAP[pal.egg];

  // All valid parent pairs for THIS pal, partitioned by capture status.
  const pairs = React.useMemo(() => findAllParentPairs(pal.id), [pal.id]);
  const have = React.useMemo(() => new Set(capturedIds), [capturedIds]);
  const readyNow = React.useMemo(() => pairs.filter((p) => have.has(p.a.id) && have.has(p.b.id)), [pairs, have]);
  const oneMissing = React.useMemo(
    () => pairs.filter((p) => (have.has(p.a.id) || have.has(p.b.id)) && !(have.has(p.a.id) && have.has(p.b.id))),
    [pairs, have]
  );
  const easiest = React.useMemo(() => pairs.filter((p) => !have.has(p.a.id) && !have.has(p.b.id)), [pairs, have]);

  return (
    <GlassCard hover={false} className="p-5">
      <SectionTitle>Egg & Breeding</SectionTitle>
      <View className="flex-row flex-wrap gap-2">
        <Badge label={`${pal.egg} EGG`} color={egg?.color ?? '#94A3B8'} />
        <Badge label={pal.eggSize.toUpperCase()} color="#F59E0B" />
        {egg ? <Badge label={`INCUBATE ${egg.incubationMinutes[pal.eggSize]}m`} color="#10B981" /> : null}
        {pal.breedingPower !== null ? (
          <Badge label={`BREEDING POWER ${pal.breedingPower}`} color="#06B6D4" />
        ) : (
          <Badge label="BP PENDING DATAMINE" color="#EF4444" />
        )}
      </View>

      {pal.elements.length > 0 ? (
        <View className="mt-3">
          <Text className="mb-1.5 text-[13px] uppercase tracking-wider text-muted font-medium">Element Matchups</Text>
          {pal.elements.map((e) => {
            const el = ELEMENT_MAP[e];
            return (
              <View key={e} className="mb-1.5 flex-row items-center gap-2">
                <TypeChip element={e} color={el?.color ?? '#94A3B8'} size="md" />
                <Text className="flex-1 text-[13px] leading-4 text-muted font-medium">
                  <Text className="text-neon">strong</Text> vs {el?.strongVs.join(', ') || '—'} ·{' '}
                  <Text className="text-ember">weak</Text> vs {el?.weakVs.join(', ') || '—'}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* breed from your captures */}
      <View className="mt-4 border-t border-slate-800 pt-3">
        <SectionTitle color="#F59E0B">Breed {pal.name} From Your Captures</SectionTitle>

        {readyNow.length > 0 ? (
          <>
            <MonoText className="text-[13px] text-neon">✓ {readyNow.length} PAIR(S) READY — BOTH PARENTS CAPTURED</MonoText>
            <View className="mt-2 gap-1.5">
              {readyNow.slice(0, 8).map((pair, i) => (
                <View key={`${pair.a.id}-${pair.b.id}`} className="pda-row flex-row items-center gap-2 rounded-lg border border-slate-800 bg-well/60 p-2">
                  <MonoText className="w-5 text-[13px] text-faint font-medium">#{i + 1}</MonoText>
                  <View className="flex-row items-center gap-1.5">
                    <PalPortrait pal={pair.a} size={26} showIndex={false} />
                    <MonoText className="text-paldium">+</MonoText>
                    <PalPortrait pal={pair.b} size={26} showIndex={false} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-[13px] font-bold text-ink">{pair.a.name} + {pair.b.name}</Text>
                    <MonoText className="text-[13px] text-faint font-medium">
                      {pair.special ? 'SPECIAL COMBO' : pair.sameSpecies ? 'SAME-SPECIES' : 'RANK FORMULA'} · ACC {pair.accessibility}
                    </MonoText>
                  </View>
                  <Pressable
                    onPress={() => onOpenLab(pair.a, pair.b)}
                    className="pda-btn rounded-lg border border-gold/60 bg-gold/10 px-2.5 py-1.5"
                  >
                    <Text className="text-[13px] font-bold text-gold">BREED ▸</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        ) : oneMissing.length > 0 ? (
          <>
            <MonoText className="text-[13px] text-gold">YOU HAVE ONE PARENT OF {oneMissing.length} PAIR(S) — CATCH THE OTHER:</MonoText>
            <View className="mt-2 gap-1.5">
              {oneMissing.slice(0, 8).map((pair, i) => {
                const missing = have.has(pair.a.id) ? pair.b : pair.a;
                const owned = have.has(pair.a.id) ? pair.a : pair.b;
                return (
                  <View key={`${pair.a.id}-${pair.b.id}`} className="pda-row flex-row items-center gap-2 rounded-lg border border-slate-800 bg-well/60 p-2">
                    <MonoText className="w-5 text-[13px] text-faint font-medium">#{i + 1}</MonoText>
                    <View className="flex-row items-center gap-1.5">
                      <PalPortrait pal={owned} size={26} showIndex={false} />
                      <MonoText className="text-paldium">+</MonoText>
                      <PalPortrait pal={missing} size={26} showIndex={false} />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text className="text-[13px] font-bold text-ink">
                        {owned.name} <MonoText className="text-neon">✓</MonoText> + {missing.name} <MonoText className="text-ember">MISSING</MonoText>
                      </Text>
                      <MonoText className="text-[13px] text-faint font-medium">
                        {pair.special ? 'SPECIAL COMBO' : pair.sameSpecies ? 'SAME-SPECIES' : 'RANK FORMULA'} · ACC {pair.accessibility}
                      </MonoText>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : pairs.length > 0 ? (
          <>
            <MonoText className="text-[13px] text-gold">NO PARENTS CAPTURED YET — EASIEST ROUTES ({pairs.length} TOTAL PAIRS):</MonoText>
            <View className="mt-2 gap-1.5">
              {easiest.slice(0, 6).map((pair, i) => (
                <View key={`${pair.a.id}-${pair.b.id}`} className="pda-row flex-row items-center gap-2 rounded-lg border border-slate-800 bg-well/60 p-2">
                  <MonoText className="w-5 text-[13px] text-faint font-medium">#{i + 1}</MonoText>
                  <View className="flex-row items-center gap-1.5">
                    <PalPortrait pal={pair.a} size={26} showIndex={false} />
                    <MonoText className="text-paldium">+</MonoText>
                    <PalPortrait pal={pair.b} size={26} showIndex={false} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-[13px] font-bold text-ink">{pair.a.name} + {pair.b.name}</Text>
                    <MonoText className="text-[13px] text-faint font-medium">
                      {pair.special ? 'SPECIAL COMBO' : pair.sameSpecies ? 'SAME-SPECIES' : 'RANK FORMULA'} · ACC {pair.accessibility}
                    </MonoText>
                  </View>
                  <Pressable
                    onPress={() => onOpenLab(pair.a, pair.b)}
                    className="pda-btn rounded-lg border border-gold/60 bg-gold/10 px-2.5 py-1.5"
                  >
                    <Text className="text-[13px] font-bold text-gold">USE ▸</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <Text className="mt-2 text-[13px] text-faint font-medium">
              Mark Pals as captured on their dossier or the Paldeck grid and this list updates to show what you can breed right now.
            </Text>
          </>
        ) : (
          <Text className="text-xs text-muted font-medium">No parent data resolvable for this species.</Text>
        )}
      </View>
    </GlassCard>
  );
};

const TABS = [
  { id: 'stats', label: 'STATS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'work', label: 'WORK' },
  { id: 'drops', label: 'DROPS' },
  { id: 'spawn', label: 'SPAWNS' },
  { id: 'egg', label: 'EGG & LORE' }
] as const;

type TabId = (typeof TABS)[number]['id'];

/** TABBED DETAIL — clean, navigable panels instead of one long scroll. */
export const PalDetailView: React.FC<{
  pal: Pal;
  accent: string;
  capturedIds: string[];
  onOpenLab: (a: Pal, b: Pal) => void;
}> = ({ pal, accent, capturedIds, onOpenLab }) => {
  const [tab, setTab] = React.useState<TabId>('stats');

  return (
    <View>
      {/* tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row gap-1.5">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Text
                key={t.id}
                onPress={() => setTab(t.id)}
                className={`pda-btn rounded-lg border px-4 py-2 text-[13px] font-bold tracking-widest ${
                  active ? '' : 'border-slate-800 bg-panel/70 text-muted'
                }`}
                style={active ? { color: accent, borderColor: `${accent}66`, backgroundColor: `${accent}14` } : undefined}
              >
                {t.label}
              </Text>
            );
          })}
        </View>
      </ScrollView>

      {tab === 'stats' ? <StatPanel pal={pal} /> : null}
      {tab === 'skills' ? <SkillPanel pal={pal} /> : null}
      {tab === 'work' ? <WorkPanel pal={pal} /> : null}
      {tab === 'drops' ? <DropPanel pal={pal} /> : null}
      {tab === 'spawn' ? <SpawnPanel pal={pal} /> : null}
      {tab === 'egg' ? (
        <View className="gap-3">
          <EggPanel pal={pal} capturedIds={capturedIds} onOpenLab={onOpenLab} />
          {pal.lore ? (
            <GlassCard hover={false} className="p-5">
              <SectionTitle>PDA Lore</SectionTitle>
              <Text className="text-xs leading-5 text-ink/80">{pal.lore}</Text>
            </GlassCard>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
