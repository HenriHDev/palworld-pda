import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from '../navigation/router';
import { ALL_PALS, getPal } from '../data/pals';
import { BASE_PRESETS, PRIME_LOCATIONS, type BasePreset } from '../data/bases';
import { PalPortrait } from '../components/paldeck/PalPortrait';
import { Badge, GlassCard, MonoText, ProgressBar, SectionTitle } from '../components/ui/primitives';

const TIER_COLOR: Record<BasePreset['tier'], string> = {
  early: '#10B981',
  mid: '#F59E0B',
  endgame: '#EF4444'
};

const WORK_TYPES = [
  'Kindling',
  'Handiwork',
  'Mining',
  'Watering',
  'Planting',
  'Gathering',
  'Lumbering',
  'Cooling',
  'Transporting',
  'Generating Electricity',
  'Medicine Production',
  'Farming'
] as const;

/** LIVE TOP-WORKERS TABLE — computed from the official datamine works table. */
const TopWorkersPanel: React.FC = () => {
  const rows = useMemo(
    () =>
      WORK_TYPES.map((t) => {
        const best = ALL_PALS.filter((p) => p.works.some((w) => w.type === t))
          .map((p) => ({ id: p.id, name: p.name, lv: p.works.find((w) => w.type === t)!.level }))
          .sort((a, b) => b.lv - a.lv)
          .slice(0, 3);
        return { type: t, best };
      }),
    []
  );

  return (
    <GlassCard glow="green" hover={false} className="p-4">
      <SectionTitle color="#10B981">Top Base Workers (official 1.0 works table)</SectionTitle>
      <View className="gap-2">
        {rows.map((row) => (
          <View key={row.type} className="pda-row flex-row items-center gap-2 rounded-md border border-transparent px-1.5 py-1">
            <Text className="w-44 text-xs text-ink">{row.type}</Text>
            <View className="flex-1 flex-row items-center gap-1.5">
              {row.best.map((p) => (
                <View key={p.id} className="flex-row items-center gap-1.5 rounded-full border border-slate-700 bg-well/70 py-0.5 pl-0.5 pr-2">
                  <PalPortrait pal={getPal(p.id)!} size={20} showIndex={false} noFrame />
                  <Text className="text-[13px] font-bold text-ink">{p.name}</Text>
                  <MonoText className="text-[13px] text-neon">Lv{p.lv}</MonoText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const PresetCard: React.FC<{ preset: BasePreset }> = ({ preset }) => {
  const { navigate } = useRouter();
  const color = TIER_COLOR[preset.tier];

  return (
    <GlassCard glow="cyan" hover className="p-4" style={{ flexBasis: '47%', flexGrow: 1, minWidth: 340 }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-black text-ink">{preset.name}</Text>
          <Text className="text-[13px] uppercase tracking-widest text-muted font-medium">{preset.purpose}</Text>
        </View>
        <Badge label={preset.tier.toUpperCase()} color={color} />
      </View>

      {/* location */}
      <Pressable
        onPress={() => navigate({ name: 'map' })}
        className="pda-btn mt-2.5 flex-row items-center gap-2 rounded-lg border border-slate-700 bg-well/70 p-2.5"
      >
        <Text className="text-[#38BDF8]">◫</Text>
        <View className="flex-1">
          <Text className="text-[13px] font-bold text-ink">{preset.location.name}</Text>
          <MonoText className="text-[13px] text-faint font-medium">
            {preset.location.mapId.toUpperCase()} · {preset.location.x},{preset.location.y}
          </MonoText>
        </View>
        <Text className="text-[13px] font-bold text-paldium">MAP ▸</Text>
      </Pressable>
      <Text className="mt-1.5 text-[13px] leading-3.5 text-muted font-medium">{preset.location.why}</Text>

      {/* layout */}
      <View className="mt-3">
        <MonoText className="text-[13px] uppercase tracking-widest text-faint font-medium">Layout</MonoText>
        <View className="mt-1 gap-1">
          {preset.layout.map((l, i) => (
            <View key={i} className="flex-row gap-1.5">
              <MonoText className="text-[13px] text-paldium">{String(i + 1).padStart(2, '0')}</MonoText>
              <Text className="flex-1 text-[13px] leading-3.5 text-ink/85">{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* core pals */}
      <View className="mt-3">
        <MonoText className="text-[13px] uppercase tracking-widest text-faint font-medium">Core Pals</MonoText>
        <View className="mt-1.5 flex-row flex-wrap gap-2">
          {preset.corePals.map((cp) => {
            const pal = getPal(cp.palId);
            if (!pal) return null;
            return (
              <Pressable
                key={cp.palId}
                onPress={() => navigate({ name: 'pal', palId: pal.id })}
                className="pda-card w-[104px] rounded-lg border border-slate-800 bg-well/70 p-2"
              >
                <View className="items-center">
                  <PalPortrait pal={pal} size={44} showIndex={false} />
                  <Text className="mt-1 text-[13px] font-bold text-ink" numberOfLines={1}>
                    {pal.name}
                  </Text>
                  <Text className="text-[13px] leading-3 text-muted font-medium" numberOfLines={2}>
                    {cp.role}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* tips */}
      <View className="mt-3 gap-1">
        {preset.tips.map((t, i) => (
          <Text key={i} className="text-[13px] leading-3.5 text-gold">
            ▸ {t}
          </Text>
        ))}
      </View>
    </GlassCard>
  );
};

export const BasesScreen: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pb-10">
        {/* header */}
        <View className="pda-gridbg mb-4 flex-row items-center justify-between rounded-xl border border-slate-800 bg-panel/80 p-4 shadow-card">
          <View>
            <Text className="text-lg font-black text-ink">
              BASE <Text className="text-[#8B5CF6]">PLANNER</Text>
            </Text>
            <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">
              Blueprints · top workers · tested locations
            </MonoText>
          </View>
          <View className="items-end">
            <MonoText className="text-[13px] text-neon">{BASE_PRESETS.length} BLUEPRINTS</MonoText>
            <MonoText className="text-[13px] text-faint font-medium">worker data = official works table</MonoText>
          </View>
        </View>

        {/* blueprints */}
        <SectionTitle color="#8B5CF6">Base Blueprints</SectionTitle>
        <View className="mb-5 flex-row flex-wrap gap-2.5">
          {BASE_PRESETS.map((p) => (
            <PresetCard key={p.id} preset={p} />
          ))}
        </View>

        {/* top workers */}
        <View className="mb-5">
          <TopWorkersPanel />
        </View>

        {/* prime locations */}
        <SectionTitle color="#38BDF8">Prime Base Locations</SectionTitle>
        <View className="flex-row flex-wrap gap-2.5">
          {PRIME_LOCATIONS.map((loc, i) => (
            <Pressable
              key={i}
              onPress={() => navigate({ name: 'map' })}
              className="pda-card rounded-xl border border-slate-800 bg-panel/90 p-3.5 shadow-card"
              style={{ flexBasis: '30%', flexGrow: 1, minWidth: 220 }}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-[#38BDF8]">◫</Text>
                <Text className="flex-1 text-xs font-bold text-ink">{loc.name}</Text>
              </View>
              <Text className="mt-1.5 text-[13px] leading-3.5 text-muted font-medium">{loc.why}</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <MonoText className="text-[13px] text-faint font-medium">
                  {loc.mapId.toUpperCase()} · {loc.x},{loc.y}
                </MonoText>
                <Text className="text-[13px] font-bold text-paldium">VIEW ▸</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
