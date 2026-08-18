import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Pal, SortState } from '../types';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { usePersistence } from '../hooks/usePersistence';
import { useRouter } from '../navigation/router';
import { ALL_PALS } from '../data/pals';
import { filterPals, sortPals } from '../logic/filter';
import { PalCard } from '../components/paldeck/PalCard';
import { DEFAULT_FILTER, FilterPanel } from '../components/paldeck/FilterPanel';
import { DropLookup } from '../components/paldeck/DropLookup';
import { MonoText, Segmented } from '../components/ui/primitives';
import { SearchBar } from '../components/ui/SearchBar';

type DeckMode = 'pals' | 'drops';

export const PalDeckScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { checklist, toggleCaptured } = usePersistence();
  const bp = useBreakpoint();
  const [mode, setMode] = useState<DeckMode>('pals');
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [sort, setSort] = useState<SortState>({ key: 'dex', dir: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(
    () => sortPals(filterPals(ALL_PALS, filter, checklist.captured), sort),
    [filter, sort, checklist.captured]
  );

  const activeFilters =
    filter.elements.length +
    (filter.workType ? 1 : 0) +
    (filter.eggType ? 1 : 0) +
    (filter.region ? 1 : 0) +
    (filter.onlyCaptured ? 1 : 0);

  return (
    <View className="flex-1 flex-row gap-3">
      {/* desktop filter rail (pals mode only) */}
      {bp.isDesktop && mode === 'pals' ? (
        <ScrollView className="w-[280px] shrink-0 self-start" showsVerticalScrollIndicator={false} style={{ maxHeight: '100%' }}>
          <FilterPanel filter={filter} onChange={setFilter} sort={sort} onSort={setSort} />
        </ScrollView>
      ) : null}

      {/* main column */}
      <ScrollView className="min-w-0 flex-1" showsVerticalScrollIndicator={false}>
        {/* toolbar */}
        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <View style={{ minWidth: 200 }}>
            <Segmented
              accent="#10B981"
              options={[
                { id: 'pals', label: '◈ PALS', icon: '' },
                { id: 'drops', label: '⬇ DROPS' }
              ]}
              value={mode}
              onChange={(id) => setMode(id as DeckMode)}
            />
          </View>
          {mode === 'pals' ? (
            <>
              <View className="min-w-0 flex-1">
                <SearchBar value={filter.query} onChange={(query) => setFilter({ ...filter, query })} placeholder={`Search ${ALL_PALS.length} records — name, #dex, title…`} />
              </View>
              {!bp.isDesktop ? (
                <Pressable
                  onPress={() => setShowFilters((s) => !s)}
                  className={`pda-btn rounded-lg border px-3 py-2.5 ${showFilters ? 'border-paldium/60 bg-paldium/15' : 'border-slate-700 bg-panel'}`}
                >
                  <Text className={`text-[13px] font-bold ${showFilters ? 'text-paldium' : 'text-muted'}`}>
                    ⚙ FILTERS{activeFilters > 0 ? ` (${activeFilters})` : ''}
                  </Text>
                </Pressable>
              ) : null}
              <View className="rounded-lg border border-slate-700 bg-panel px-3 py-2.5">
                <MonoText className="text-[13px] text-neon">
                  {results.length}<MonoText className="text-faint font-medium">/{ALL_PALS.length}</MonoText>
                </MonoText>
              </View>
            </>
          ) : null}
        </View>

        {mode === 'drops' ? (
          <DropLookup />
        ) : (
          <>
            {!bp.isDesktop && showFilters ? (
              <View className="mb-3">
                <FilterPanel filter={filter} onChange={setFilter} sort={sort} onSort={setSort} />
              </View>
            ) : null}

            {/* quick element strip */}
            <View className="mb-3 flex-row flex-wrap items-center gap-1.5">
              <MonoText className="mr-1 text-[13px] uppercase tracking-widest text-faint font-medium">Quick:</MonoText>
              {Object.entries(
                ALL_PALS.reduce<Record<string, number>>((acc, p) => {
                  for (const e of p.elements) acc[e] = (acc[e] ?? 0) + 1;
                  return acc;
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .map(([el]) => {
                  const color = ({ Neutral: '#94A3B8', Fire: '#EF4444', Water: '#38BDF8', Electric: '#FACC15', Grass: '#4ADE80', Ice: '#67E8F9', Ground: '#D6A35C', Dark: '#8B5CF6', Dragon: '#C084FC' } as Record<string, string>)[el];
                  const active = filter.elements.includes(el as never);
                  return (
                    <Pressable
                      key={el}
                      onPress={() =>
                        setFilter({
                          ...filter,
                          elements: active ? filter.elements.filter((x) => x !== el) : [...filter.elements, el as never]
                        })
                      }
                      className={`pda-btn rounded-full border px-2.5 py-1 ${active ? '' : 'border-slate-800 bg-panel/60'}`}
                      style={active ? { borderColor: color, backgroundColor: `${color}22` } : undefined}
                    >
                      <Text className="text-[13px] font-bold" style={{ color: active ? color : '#94A3B8' }}>
                        {el}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>

            {/* grid */}
            <View className="flex-row flex-wrap gap-2.5 pb-6">
              {results.map((pal: Pal) => (
                <View key={pal.id} style={bp.isDesktop ? { flexBasis: '23%', flexGrow: 1, minWidth: 168 } : { flexBasis: '47%', flexGrow: 1, minWidth: 140 }}>
                  <PalCard
                    pal={pal}
                    onPress={() => navigate({ name: 'pal', palId: pal.id })}
                    captured={!!checklist.captured[pal.id]}
                    onToggleCaptured={() => toggleCaptured(pal.id)}
                  />
                </View>
              ))}
            </View>
            {results.length === 0 ? (
              <View className="items-center py-16">
                <Text className="text-3xl">◌</Text>
                <Text className="mt-2 text-sm font-bold text-ink">NO PALS MATCH</Text>
                <Text className="mt-1 text-xs text-muted font-medium">Loosen the filters or clear the search.</Text>
                <Text className="mt-3 text-xs font-bold text-paldium" onPress={() => setFilter(DEFAULT_FILTER)}>
                  RESET ALL FILTERS ▸
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
};
