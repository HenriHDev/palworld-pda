import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { DataQuality, ElementType, EggType, PalFilterState, RegionId, SortKey, SortState, WorkType } from '../../types';
import { EGGS, ELEMENT_MAP, REGION_META, WORK_TYPES } from '../../data/elements';
import { Chip, SectionTitle, Segmented, Toggle } from '../ui/primitives';
import { SearchBar } from '../ui/SearchBar';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'dex', label: 'Dex #' },
  { id: 'name', label: 'Name' },
  { id: 'hp', label: 'HP' },
  { id: 'meleeAtk', label: 'Melee' },
  { id: 'rangedAtk', label: 'Ranged' },
  { id: 'def', label: 'DEF' },
  { id: 'workSpeed', label: 'Work' },
  { id: 'breedingPower', label: 'BP' }
];

export const DEFAULT_FILTER: PalFilterState = {
  query: '',
  elements: [],
  workType: null,
  workMinLevel: 1,
  eggType: null,
  region: null,
  onlyCaptured: false,
  quality: null
};

const FilterGroup: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <View className="mb-3">
    <View className="mb-1.5 flex-row items-center gap-1.5">
      <View className="h-2.5 w-0.5 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[13px] font-bold uppercase tracking-[0.2em] text-muted">{title}</Text>
    </View>
    {children}
  </View>
);

export const FilterPanel: React.FC<{
  filter: PalFilterState;
  onChange: (f: PalFilterState) => void;
  sort: SortState;
  onSort: (s: SortState) => void;
}> = ({ filter, onChange, sort, onSort }) => {
  const set = (patch: Partial<PalFilterState>) => onChange({ ...filter, ...patch });
  const toggleElement = (e: ElementType) => {
    const has = filter.elements.includes(e);
    set({ elements: has ? filter.elements.filter((x) => x !== e) : [...filter.elements, e] });
  };
  const activeCount =
    filter.elements.length +
    (filter.workType ? 1 : 0) +
    (filter.eggType ? 1 : 0) +
    (filter.region ? 1 : 0) +
    (filter.onlyCaptured ? 1 : 0) +
    (filter.quality ? 1 : 0);

  return (
    <View className="rounded-xl border border-slate-800 bg-panel/70 p-3.5 shadow-card">
      <SearchBar value={filter.query} onChange={(query) => set({ query })} placeholder="Search name, #dex…" />
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-[13px] uppercase tracking-[0.2em] text-faint font-medium">
          {activeCount} FILTER{activeCount === 1 ? '' : 'S'} ACTIVE
        </Text>
        {activeCount > 0 || filter.query ? (
          <Text className="text-[13px] font-bold text-ember" onPress={() => onChange({ ...DEFAULT_FILTER })}>
            ✕ RESET
          </Text>
        ) : null}
      </View>

      <View className="mt-3 border-t border-slate-800 pt-3">
        <FilterGroup title="Elements" color="#06B6D4">
          <View className="flex-row flex-wrap gap-1.5">
            {Object.keys(ELEMENT_MAP).map((e) => {
              const el = ELEMENT_MAP[e];
              return (
                <Chip key={e} label={el.id} active={filter.elements.includes(el.id)} onPress={() => toggleElement(el.id)} color={el.color} />
              );
            })}
          </View>
        </FilterGroup>

        <FilterGroup title="Work Suitability" color="#10B981">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
            <View className="flex-row gap-1.5 pb-1">
              {WORK_TYPES.map((w: WorkType) => (
                <Chip
                  key={w}
                  label={w}
                  active={filter.workType === w}
                  onPress={() => set({ workType: filter.workType === w ? null : w })}
                  color="#10B981"
                />
              ))}
            </View>
          </ScrollView>
          {filter.workType ? (
            <View className="mt-2 flex-row flex-wrap items-center gap-1">
              <Text className="mr-1 text-[13px] uppercase tracking-wider text-muted font-medium">Min Lv</Text>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lv) => (
                <Chip key={lv} label={String(lv)} active={filter.workMinLevel === lv} onPress={() => set({ workMinLevel: lv })} color="#10B981" />
              ))}
            </View>
          ) : null}
        </FilterGroup>

        <FilterGroup title="Egg Type" color="#F59E0B">
          <View className="flex-row flex-wrap gap-1.5">
            {EGGS.map((egg) => (
              <Chip
                key={egg.id}
                label={egg.id}
                active={filter.eggType === (egg.id as EggType)}
                onPress={() => set({ eggType: filter.eggType === (egg.id as EggType) ? null : (egg.id as EggType) })}
                color={egg.color}
              />
            ))}
          </View>
        </FilterGroup>

        <FilterGroup title="Region" color="#C084FC">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
            <View className="flex-row gap-1.5 pb-1">
              {Object.entries(REGION_META).map(([id, meta]) => (
                <Chip
                  key={id}
                  label={meta.name}
                  active={filter.region === (id as RegionId)}
                  onPress={() => set({ region: filter.region === (id as RegionId) ? null : (id as RegionId) })}
                  color={meta.v10 ? '#C084FC' : '#06B6D4'}
                />
              ))}
            </View>
          </ScrollView>
        </FilterGroup>

        <FilterGroup title="Data & Collection" color="#64748B">
          <Toggle value={filter.onlyCaptured} onChange={(onlyCaptured) => set({ onlyCaptured })} label="Captured only" />
          <View className="mt-2">
            <Segmented
              options={[
                { id: 'all', label: 'ALL' },
                { id: 'complete', label: 'FULL' },
                { id: 'core', label: 'CORE' },
                { id: 'minimal', label: 'SCAN' }
              ]}
              value={filter.quality ?? 'all'}
              onChange={(id) => set({ quality: (id === 'all' ? null : id) as DataQuality | null })}
              accent="#64748B"
            />
          </View>
        </FilterGroup>

        <View className="border-t border-slate-800 pt-3">
          <SectionTitle color="#F59E0B">Sort by</SectionTitle>
          <View className="flex-row flex-wrap gap-1.5">
            {SORT_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                label={`${o.label} ${sort.key === o.id ? (sort.dir === 'asc' ? '▲' : '▼') : ''}`}
                active={sort.key === o.id}
                onPress={() =>
                  onSort(sort.key === o.id ? { ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: o.id, dir: 'desc' })
                }
                color="#F59E0B"
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
