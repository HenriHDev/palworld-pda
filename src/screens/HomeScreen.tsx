import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from '../navigation/router';
import { usePersistence } from '../hooks/usePersistence';
import { getPal, ALL_PALS } from '../data/pals';
import { BASE_PRESETS } from '../data/bases';
import { MAP_POINTS } from '../data/locations';
import { QUESTS } from '../data/quests';
import { captureProgress } from '../logic/filter';
import { GlassCard, IconTile, MonoText, ProgressBar, SectionTitle } from '../components/ui/primitives';
import { PalPortrait } from '../components/paldeck/PalPortrait';

const MODULES: { id: string; glyph: string; title: string; desc: string; accent: string; route: 'paldeck' | 'breeding' | 'bases' | 'map' | 'quests'; meta: string }[] = [
  { id: 'deck', glyph: '◈', title: 'PALDECK', desc: 'Search, filter and inspect every species — stats, moves, drops, spawns.', accent: '#10B981', route: 'paldeck', meta: `${ALL_PALS.length} RECORDS` },
  { id: 'breed', glyph: '⚭', title: 'BREEDING LAB', desc: 'CombiRank offspring solver, parent chains, passives & mutation sim.', accent: '#F59E0B', route: 'breeding', meta: 'LIVE ENGINE' },
  { id: 'base', glyph: '⌂', title: 'BASE PLANNER', desc: 'Blueprints, top workers and tested locations for every base type.', accent: '#8B5CF6', route: 'bases', meta: `${BASE_PRESETS.length} BLUEPRINTS` },
  { id: 'map', glyph: '◫', title: 'WORLD MAP', desc: 'Alphas, towers, effigies, dungeons, Soralite & Paloxite nodes.', accent: '#38BDF8', route: 'map', meta: '1300+ POINTS' },
  { id: 'quest', glyph: '⚑', title: 'QUEST LOG', desc: 'Campaign tracker, boss strategies, lore and hidden secrets.', accent: '#EF4444', route: 'quests', meta: `${QUESTS.length} NODES` }
];

const FEATURED = ['jetragon', 'frostallion', 'anubis', 'shaolong', 'astralym', 'relaxaurus', 'bellanoir', 'dandilord'];

export const HomeScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { checklist } = usePersistence();
  const progress = captureProgress(checklist.captured);
  const foundCount = Object.values(checklist.found).filter(Boolean).length;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pb-10">
        {/* HERO */}
        <View className="pda-gridbg mb-5 overflow-hidden rounded-xl border border-paldium/40 bg-panel/90 p-5 shadow-glow">
          <View className="flex-row items-start justify-between">
            <View className="max-w-xl">
              <MonoText className="text-[13px] uppercase tracking-[0.35em] text-paldium">Palpagos Islands · Unified Link</MonoText>
              <Text className="mt-1.5 text-3xl font-black tracking-tight text-ink">
                HC LABS ULTIMATE <Text className="text-paldium">PALWORLD PDA</Text>
              </Text>
              <Text className="mt-2 text-xs leading-5 text-muted font-medium">
                The full Palworld v1.0 field terminal — {ALL_PALS.length}-species registry, datamined CombiRank breeding engine, Sunreach
                & World Tree protocols, and a v1.0 mutation simulator. All data runs locally; your captures and plans persist.
              </Text>
            </View>
            <View className="hidden items-center lg:flex">
              <PalPortrait pal={getPal('astralym')!} size={96} />
            </View>
          </View>

          <View className="mt-4 flex-row gap-2.5">
            <StatCell label="PALS CAPTURED" value={`${progress.caught}/${progress.total}`} color="#10B981" />
            <StatCell label="MAP POINTS FOUND" value={`${foundCount}/${MAP_POINTS.length}`} color="#06B6D4" />
            <StatCell label="COLLECTION" value={`${progress.pct}%`} color="#F59E0B" />
          </View>
          <View className="mt-3">
            <ProgressBar value={progress.pct} color="#10B981" height={5} />
          </View>
        </View>

        {/* MODULES */}
        <SectionTitle color="#06B6D4">Modules</SectionTitle>
        <View className="mb-5 flex-row flex-wrap gap-2.5">
          {MODULES.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => navigate({ name: m.route })}
              className="pda-card rounded-xl border border-slate-800 bg-panel/90 p-4 shadow-card"
              style={{ flexBasis: '47%', flexGrow: 1, minWidth: 260 }}
            >
              <View className="flex-row items-start justify-between">
                <IconTile glyph={m.glyph} color={m.accent} size={40} />
                <MonoText className="text-[13px] uppercase tracking-widest text-faint font-medium">{m.meta}</MonoText>
              </View>
              <Text className="mt-2.5 text-sm font-black tracking-wide" style={{ color: m.accent }}>
                {m.title}
              </Text>
              <Text className="mt-1 text-[13px] leading-4 text-muted font-medium">{m.desc}</Text>
              <Text className="mt-2.5 text-[13px] font-bold text-paldium">OPEN MODULE ▸</Text>
            </Pressable>
          ))}
        </View>

        {/* FEATURED PALS */}
        <View className="mb-2 flex-row items-center justify-between">
          <SectionTitle color="#10B981">Featured Pals</SectionTitle>
          <Text className="text-[13px] font-bold text-paldium" onPress={() => navigate({ name: 'paldeck' })}>
            FULL INDEX ▸
          </Text>
        </View>
        <View className="mb-5 flex-row flex-wrap gap-2.5">
          {FEATURED.map((id) => {
            const pal = getPal(id);
            if (!pal) return null;
            return (
              <Pressable
                key={id}
                onPress={() => navigate({ name: 'pal', palId: id })}
                className="pda-card items-center rounded-xl border border-slate-800 bg-panel/90 px-3 py-3 shadow-card"
                style={{ flexBasis: '11%', flexGrow: 1, minWidth: 118 }}
              >
                <PalPortrait pal={pal} size={62} showIndex={false} />
                <Text className="mt-1.5 text-[13px] font-bold text-ink" numberOfLines={1}>
                  {pal.name}
                </Text>
                <MonoText className="text-[13px] text-faint font-medium">#{String(pal.dexNo).padStart(3, '0')}</MonoText>
              </Pressable>
            );
          })}
        </View>

        {/* REGISTRY STATUS */}
        <GlassCard glow="green" hover={false} className="p-4">
          <SectionTitle color="#10B981">Registry Status</SectionTitle>
          <View className="gap-1.5">
            <MonoText className="text-[13px] text-neon">● REGISTRY ONLINE — {ALL_PALS.length} species indexed (official 1.0 datamine)</MonoText>
            <Text className="text-[13px] leading-4 text-muted font-medium">
              CombiRank breeding powers, official Paldeck numbers, stats and elements come from the Palworld 1.0
              game files (pal-atlas datamine). The 257 official special breeding pairs and formula eligibility
              rules are baked into the Breeding Lab.
            </Text>
            <MonoText className="mt-1 text-[13px] text-faint font-medium">
              ENGINE: floor((BP_A + BP_B + 1) / 2) → nearest eligible rank · 257 special combos · seeded Monte-Carlo sims
            </MonoText>
          </View>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const StatCell: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <View className="flex-1 rounded-lg border border-slate-700 bg-well/80 px-3 py-2.5">
    <MonoText className="text-base" style={{ color }}>
      {value}
    </MonoText>
    <Text className="text-[13px] uppercase tracking-widest text-muted font-medium">{label}</Text>
  </View>
);
