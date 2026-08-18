import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { BossGuide, LoreEntry, QuestCategory, QuestNode } from '../../types';
import { BOSS_GUIDES, LORE, QUESTS } from '../../data/quests';
import { REGION_META } from '../../data/elements';
import { ELEMENT_MAP } from '../../data/elements';
import { GlassCard, MonoText, ProgressBar, SectionTitle, TypeChip } from '../ui/primitives';
import { SearchBar } from '../ui/SearchBar';

/** QUEST TRACKER — searchable campaign progression with step toggles. */
export const QuestTracker: React.FC<{
  steps: Record<string, boolean>;
  onToggleStep: (questId: string, stepId: string) => void;
}> = ({ steps, onToggleStep }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<QuestCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUESTS.filter((n) => {
      if (cat !== 'all' && n.category !== cat) return false;
      if (!q) return true;
      const hay = `${n.title} ${n.summary} ${n.region} ${n.steps.map((s) => s.title).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, cat]);

  const progress = (n: QuestNode) => {
    const total = n.steps.length;
    const done = n.steps.filter((s) => steps[`${n.id}:${s.id}`]).length;
    return { total, done };
  };

  return (
    <View>
      <SearchBar value={query} onChange={setQuery} placeholder="Search quests, steps, regions…" />
      <View className="mt-2 flex-row flex-wrap gap-1.5">
        {(['all', 'main', 'side', 'raid', 'collection'] as const).map((c) => (
          <Pressable
            key={c}
            onPress={() => setCat(c)}
            className={`pda-btn rounded-full border px-3 py-1 ${cat === c ? 'border-paldium bg-paldium/10' : 'border-slate-800 bg-panel/70'}`}
          >
            <Text className={`text-[13px] font-bold uppercase ${cat === c ? 'text-paldium' : 'text-muted'}`}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-3 gap-3">
        {filtered.map((node) => {
          const { total, done } = progress(node);
          const complete = total > 0 && done === total;
          const region = REGION_META[node.region];
          const catColor: Record<QuestCategory, string> = { main: '#06B6D4', side: '#F59E0B', raid: '#EF4444', collection: '#10B981' };
          return (
            <GlassCard key={node.id} glow={complete ? 'green' : 'cyan'} hover={false} className="p-5">
              <View className="flex-row items-start gap-3">
                <View className="items-center rounded-lg border border-slate-700 bg-well/80 px-2.5 py-2">
                  <MonoText className="text-[13px] uppercase text-faint font-medium">CH</MonoText>
                  <MonoText className="text-sm text-paldium">{String(node.chapter).padStart(2, '0')}</MonoText>
                </View>
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-center gap-2">
                    <MonoText className="text-[13px] font-bold uppercase" style={{ color: catColor[node.category] }}>
                      {node.category}
                    </MonoText>
                    {complete ? <MonoText className="text-[13px] text-neon">✓ COMPLETE</MonoText> : null}
                  </View>
                  <Text className="mt-0.5 text-sm font-bold text-ink">{node.title}</Text>
                  <Text className="mt-0.5 text-[13px] leading-4 text-muted font-medium">{node.summary}</Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <View className="flex-1">
                      <ProgressBar value={total ? (done / total) * 100 : 0} color={complete ? '#10B981' : '#06B6D4'} height={4} />
                    </View>
                    <MonoText className="text-[13px] text-muted font-medium">
                      {done}/{total}
                    </MonoText>
                  </View>
                  <Text className="mt-1.5 text-[13px] uppercase tracking-wider text-faint font-medium">
                    {region?.name ?? node.region} · {node.unlock}
                  </Text>
                </View>
              </View>

              <View className="mt-3 gap-1 border-t border-slate-800 pt-2.5">
                {node.steps.map((s) => {
                  const key = `${node.id}:${s.id}`;
                  const isDone = !!steps[key];
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => onToggleStep(node.id, s.id)}
                      className={`pda-row flex-row items-start gap-2.5 rounded-lg border p-3 ${isDone ? 'border-neon/40 bg-neon/5' : 'border-slate-800 bg-well/50'}`}
                    >
                      <Text className={`text-[13px] ${isDone ? 'text-neon' : 'text-muted'}`}>{isDone ? '☑' : '☐'}</Text>
                      <View className="flex-1">
                        <Text className={`text-[13px] font-semibold ${isDone ? 'text-muted line-through' : 'text-ink'}`}>{s.title}</Text>
                        <Text className="mt-0.5 text-[12px] leading-4 text-faint font-medium">{s.detail}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {node.rewards.length > 0 ? (
                <Text className="mt-2 text-[13px] text-gold">▸ {node.rewards.join(' · ')}</Text>
              ) : null}
            </GlassCard>
          );
        })}
        {filtered.length === 0 ? <Text className="py-6 text-center text-xs text-muted font-medium">No quests match.</Text> : null}
      </View>
    </View>
  );
};

/** BOSS GUIDE — tower & raid strategies with weakness readout. */
export const BossGuides: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(BOSS_GUIDES[0]?.id ?? null);
  return (
    <View className="gap-3.5">
      {BOSS_GUIDES.map((b) => {
        const open = openId === b.id;
        return (
          <GlassCard key={b.id} glow={b.kind === 'raid' ? 'red' : 'gold'} hover={false} className="p-5">
            <Pressable onPress={() => setOpenId(open ? null : b.id)} className="flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <MonoText className="rounded border border-gold/50 bg-well/70 px-2 py-0.5 text-[11px] font-semibold text-gold">
                    {b.kind === 'raid' ? '⚔ RAID BOSS' : '▲ TOWER BOSS'}
                  </MonoText>
                  <MonoText className="text-[12px] font-semibold text-gold">LV{b.level}</MonoText>
                </View>
                <Text className="mt-2 text-base font-black text-ink">{b.name}</Text>
                <Text className="mt-1 text-[12px] leading-4 text-muted font-medium">{b.location}</Text>
              </View>
              <View className="rounded-lg border border-slate-700 bg-well/70 px-2.5 py-1.5">
                <Text className="text-sm text-paldium">{open ? '▴' : '▾'}</Text>
              </View>
            </Pressable>
            {open ? (
              <View className="mt-4 border-t border-slate-800 pt-4">
                <View className="flex-row flex-wrap items-center gap-2">
                  <MonoText className="text-[11px] uppercase tracking-wider text-faint font-medium">Weak to</MonoText>
                  {b.weaknesses.map((w) => (
                    <TypeChip key={w} element={w} color={ELEMENT_MAP[w]?.color ?? '#94A3B8'} size="md" />
                  ))}
                </View>
                <View className="mt-4 gap-2.5">
                  {b.strategy.map((s, i) => (
                    <View key={i} className="flex-row items-start gap-3 rounded-lg border border-slate-800 bg-well/50 p-3">
                      <MonoText className="text-[11px] font-semibold text-paldium">{String(i + 1).padStart(2, '0')}</MonoText>
                      <Text className="flex-1 text-[12px] leading-5 text-ink/90">{s}</Text>
                    </View>
                  ))}
                </View>
                <View className="mt-4 rounded-lg border border-neon/40 bg-neon/5 p-3">
                  <Text className="text-[12px] font-bold text-neon">▸ REWARD: {b.reward}</Text>
                </View>
              </View>
            ) : null}
          </GlassCard>
        );
      })}
    </View>
  );
};

/** LORE DATABASE — diaries, secrets, ancient ruins hints. */
export const LoreDatabase: React.FC = () => {
  const [query, setQuery] = useState('');
  const filtered: LoreEntry[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LORE.filter((l) => !q || `${l.title} ${l.text} ${l.region} ${l.kind}`.toLowerCase().includes(q));
  }, [query]);

  const kindColor: Record<LoreEntry['kind'], string> = {
    diary: '#F59E0B',
    lore: '#06B6D4',
    secret: '#EF4444',
    ancient: '#10B981'
  };

  return (
    <View>
      <SearchBar value={query} onChange={setQuery} placeholder="Search lore, diaries, secrets…" />
      <View className="mt-3 gap-2.5">
        {filtered.map((l) => {
          const region = REGION_META[l.region];
          return (
            <GlassCard key={l.id} glow="none" hover={false} className="p-5">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="text-base font-black text-ink">{l.title}</Text>
                <MonoText className="rounded border border-slate-700 bg-well/70 px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ color: kindColor[l.kind] }}>
                  {l.kind}
                </MonoText>
              </View>
              <Text className="mt-2 text-[11px] uppercase tracking-wider text-faint font-medium">{region?.name ?? l.region}</Text>
              <Text className="mt-3 text-[13px] leading-6 text-ink/85">{l.text}</Text>
            </GlassCard>
          );
        })}
        {filtered.length === 0 ? <Text className="py-6 text-center text-xs text-muted font-medium">No entries match.</Text> : null}
      </View>
    </View>
  );
};

export { SectionTitle };
