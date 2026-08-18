import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouterProvider, useRouter } from '../../navigation/router';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePersistence } from '../../hooks/usePersistence';
import { captureProgress } from '../../logic/filter';
import { ALL_PALS } from '../../data/pals';
import { HomeScreen } from '../../screens/HomeScreen';
import { PalDeckScreen } from '../../screens/PalDeckScreen';
import { PalDetailScreen } from '../../screens/PalDetailScreen';
import { BreedingScreen } from '../../screens/BreedingScreen';
import { BasesScreen } from '../../screens/BasesScreen';
import { MapScreen } from '../../screens/MapScreen';
import { QuestsScreen } from '../../screens/QuestsScreen';
import { MonoText, ProgressBar } from '../ui/primitives';

const TABS: { id: 'home' | 'paldeck' | 'breeding' | 'bases' | 'map' | 'quests'; glyph: string; label: string; desc: string; color: string }[] = [
  { id: 'home', glyph: '◉', label: 'COMMAND', desc: 'Dashboard', color: '#06B6D4' },
  { id: 'paldeck', glyph: '◈', label: 'PALDECK', desc: '299-species registry', color: '#10B981' },
  { id: 'breeding', glyph: '⚭', label: 'BREEDING', desc: 'CombiRank & mutation', color: '#F59E0B' },
  { id: 'bases', glyph: '⌂', label: 'BASE', desc: 'Builds & workers', color: '#8B5CF6' },
  { id: 'map', glyph: '◫', label: 'MAP', desc: 'Bosses & resources', color: '#38BDF8' },
  { id: 'quests', glyph: '⚑', label: 'QUESTS', desc: 'Story & strategies', color: '#EF4444' }
];

const CURRENT_TITLE: Record<string, string> = {
  home: 'Command Center',
  paldeck: 'Paldeck Index',
  pal: 'Pal Dossier',
  breeding: 'Breeding Lab',
  bases: 'Base Planner',
  map: 'World Map',
  quests: 'Quest Log & Lore'
};

/** DESKTOP SIDE DOCK */
const SideDock: React.FC = () => {
  const { route, navigate } = useRouter();
  const { checklist } = usePersistence();
  const progress = captureProgress(checklist.captured);

  return (
    <View className="w-[236px] shrink-0 self-stretch rounded-xl border border-slate-800 bg-panel/70 p-3 shadow-card" style={{ maxHeight: '100%' }}>
      {/* brand */}
      <View className="mb-3 border-b border-slate-800 pb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-paldium/50 bg-paldium/10 shadow-glow">
            <Text className="text-lg leading-5 text-paldium">◈</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[13px] font-black leading-4 tracking-wide text-ink" numberOfLines={1}>
              HC LABS
            </Text>
            <Text className="text-[13px] font-black leading-4 tracking-wide text-paldium" numberOfLines={1}>
              PALWORLD PDA
            </Text>
            <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium" numberOfLines={1}>
              Companion v1.0
            </MonoText>
          </View>
        </View>
      </View>

      {/* nav */}
      <View className="gap-1">
        <MonoText className="mb-1 px-2 text-[13px] uppercase tracking-[0.3em] text-faint font-medium">Modules</MonoText>
        {TABS.map((t) => {
          const active = route.name === t.id || (t.id === 'paldeck' && route.name === 'pal');
          return (
            <Pressable
              key={t.id}
              onPress={() => navigate({ name: t.id })}
              className={`pda-navitem flex-row items-center gap-2.5 rounded-lg border px-2 py-2 ${
                active ? 'border-paldium/50 bg-paldium/10 shadow-glow' : 'border-transparent'
              }`}
            >
              <View className="h-7 w-7 items-center justify-center rounded-md border" style={{ borderColor: `${t.color}55`, backgroundColor: `${t.color}1A` }}>
                <Text style={{ color: t.color, fontSize: 13 }}>{t.glyph}</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-[13px] font-bold tracking-wider ${active ? 'text-paldium' : 'text-ink'}`}>{t.label}</Text>
                <Text className="text-[13px] text-faint font-medium">{t.desc}</Text>
              </View>
              {active ? <View className="h-5 w-1 rounded-full bg-paldium" /> : null}
            </Pressable>
          );
        })}
      </View>

      {/* capture widget */}
      <View className="mt-auto border-t border-slate-800 pt-3">
        <View className="flex-row items-center justify-between">
          <MonoText className="text-[13px] uppercase tracking-[0.25em] text-faint font-medium">Capture log</MonoText>
          <MonoText className="text-[13px] text-neon">{progress.pct}%</MonoText>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={progress.pct} color="#10B981" height={4} />
        </View>
        <MonoText className="mt-1 text-[13px] text-muted font-medium">
          {progress.caught}/{progress.total} PALS
        </MonoText>
        <MonoText className="mt-2 text-[13px] leading-3 text-faint font-medium">
          CombiRank engine · mutation sim · {ALL_PALS.length} records indexed
        </MonoText>
      </View>
    </View>
  );
};

/** MOBILE BOTTOM NAV */
const BottomNav: React.FC = () => {
  const { route, navigate } = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row border-t border-slate-800 bg-panel/95" style={{ paddingBottom: Math.max(insets.bottom, 6) }}>
      {TABS.map((t) => {
        const active = route.name === t.id || (t.id === 'paldeck' && route.name === 'pal');
        return (
          <Pressable key={t.id} onPress={() => navigate({ name: t.id })} className="flex-1 items-center py-2">
            <View className={`h-6 w-9 items-center justify-center rounded-md ${active ? 'bg-paldium/15' : ''}`}>
              <Text style={{ color: active ? '#06B6D4' : '#475569', fontSize: 12 }}>{t.glyph}</Text>
            </View>
            <Text className={`mt-0.5 text-[13px] font-bold ${active ? 'text-paldium' : 'text-faint'}`}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

/**
 * SCREEN OUTLET — tab screens stay mounted (display:none) so state survives
 * navigation; the Pal dossier renders as a push-overlay on top.
 */
const TabPane: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <View style={{ flex: 1, display: active ? 'flex' : 'none' }}>{children}</View>
);

const ScreenOutlet: React.FC = () => {
  const { route } = useRouter();
  return (
    <View className="min-w-0 flex-1">
      <TabPane active={route.name === 'home'}>
        <HomeScreen />
      </TabPane>
      <TabPane active={route.name === 'paldeck'}>
        <PalDeckScreen />
      </TabPane>
      <TabPane active={route.name === 'breeding'}>
        <BreedingScreen />
      </TabPane>
      <TabPane active={route.name === 'bases'}>
        <BasesScreen />
      </TabPane>
      <TabPane active={route.name === 'map'}>
        <MapScreen />
      </TabPane>
      <TabPane active={route.name === 'quests'}>
        <QuestsScreen />
      </TabPane>
      {route.name === 'pal' ? <PalDetailScreen palId={route.palId} /> : null}
    </View>
  );
};

const ShellInner: React.FC = () => {
  const bp = useBreakpoint();
  const { route } = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-well">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {/* top bar */}
        <View className="flex-row items-center justify-between border-b border-slate-800/80 bg-panel/60 px-4" style={{ height: 44 }}>
          <View className="flex-row items-center gap-2.5">
            <View className="pda-pulse h-2 w-2 rounded-full bg-paldium" />
            <MonoText className="text-[13px] uppercase leading-4 tracking-[0.3em] text-paldium">{CURRENT_TITLE[route.name]}</MonoText>
          </View>
          {bp.isDesktop ? (
            <View className="flex-row items-center gap-2">
              <MonoText className="rounded border border-slate-700 bg-well px-2 py-0.5 text-[13px] uppercase tracking-wider text-muted font-medium">
                {ALL_PALS.length} RECORDS
              </MonoText>
              <MonoText className="rounded border border-slate-700 bg-well px-2 py-0.5 text-[13px] uppercase tracking-wider text-muted font-medium">
                {Platform.OS === 'web' ? 'WEB LINK' : `${Platform.OS.toUpperCase()} BUILD`}
              </MonoText>
            </View>
          ) : null}
        </View>

        {/* body */}
        <View className="flex-1 flex-row gap-3 p-3" style={{ paddingTop: Math.max(insets.top, 8) }}>
          {bp.isDesktop ? <SideDock /> : null}
          <View className="min-w-0 flex-1">
            <View style={{ flex: 1, width: '100%', maxWidth: 1400, alignSelf: 'center' }}>
              <ScreenOutlet />
            </View>
          </View>
        </View>
        {!bp.isDesktop ? <BottomNav /> : null}
      </SafeAreaView>
    </View>
  );
};

export const AppShell: React.FC = () => (
  <SafeAreaProvider>
    <RouterProvider>
      <ShellInner />
    </RouterProvider>
  </SafeAreaProvider>
);
