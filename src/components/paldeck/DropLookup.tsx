import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from '../../navigation/router';
import { findDroppers, itemsWithDrops } from '../../logic/drops';
import { getPal } from '../../data/pals';
import { PalPortrait } from './PalPortrait';
import { MonoText, ProgressBar, SectionTitle } from '../ui/primitives';
import { SearchBar } from '../ui/SearchBar';

/**
 * DROP LOOKUP — reverse drop table. Type an item (Leather, Pal Fluids,
 * Flame Organ…) and see every Pal that drops it when killed, ranked by rate.
 */
export const DropLookup: React.FC = () => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = itemsWithDrops();
    return q ? all.filter((i) => i.name.toLowerCase().includes(q)) : all;
  }, [query]);

  const droppers = useMemo(() => (selected ? findDroppers(selected) : []), [selected]);

  const selectedName = selected
    ? itemsWithDrops().find((i) => i.itemId === selected)?.name ?? selected
    : null;

  return (
    <View>
      <View className="mb-3 rounded-xl border border-slate-800 bg-panel/80 p-4 shadow-card">
        <Text className="text-sm font-black text-ink">
          DROP <Text className="text-gold">LOOKUP</Text>
        </Text>
        <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">
          Ask for a drop → see which Pals drop it when killed
        </MonoText>
        <View className="mt-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Type a drop — Leather, Pal Fluids, Flame Organ…" />
        </View>
        <View className="mt-2.5 flex-row flex-wrap gap-1.5">
          {items.slice(0, 16).map((item) => {
            const active = selected === item.itemId;
            return (
              <Pressable
                key={item.itemId}
                onPress={() => setSelected(active ? null : item.itemId)}
                className={`pda-btn rounded-full border px-2.5 py-1 ${active ? 'border-gold bg-gold/15' : 'border-slate-800 bg-well/70'}`}
              >
                <Text className={`text-[13px] font-bold ${active ? 'text-gold' : 'text-muted'}`}>
                  {item.name}
                  <MonoText className={`text-[13px] ${active ? 'text-gold' : 'text-faint'}`}> ×{item.dropperCount}</MonoText>
                </Text>
              </Pressable>
            );
          })}
          {items.length > 16 ? (
            <Text className="self-center text-[13px] text-faint font-medium">+{items.length - 16} more — keep typing</Text>
          ) : null}
        </View>
      </View>

      {selected ? (
        <View>
          <SectionTitle color="#F59E0B">
            {selectedName} — {droppers.length} DROPPER{droppers.length === 1 ? '' : 'S'}
          </SectionTitle>
          {droppers.length === 0 ? (
            <Text className="text-xs text-muted font-medium">No Pals drop this item in the current drop tables.</Text>
          ) : (
            <View className="gap-1.5 pb-6">
              {droppers.map((d, i) => {
                const pal = getPal(d.palId);
                if (!pal) return null;
                return (
                  <Pressable
                    key={d.palId}
                    onPress={() => navigate({ name: 'pal', palId: pal.id })}
                    className="pda-card flex-row items-center gap-3 rounded-xl border border-slate-800 bg-panel/90 p-2.5 shadow-card"
                  >
                    <MonoText className="w-7 text-center text-[13px] text-faint font-medium">#{i + 1}</MonoText>
                    <PalPortrait pal={pal} size={44} showIndex={false} />
                    <View className="min-w-0 flex-1">
                      <Text className="text-xs font-bold text-ink">{pal.name}</Text>
                      <View className="mt-1 flex-row items-center gap-2">
                        <View className="flex-1">
                          <ProgressBar value={d.chance} color="#F59E0B" height={5} />
                        </View>
                        <MonoText className="w-12 text-right text-xs text-gold">{d.chance}%</MonoText>
                      </View>
                    </View>
                    <Text className="text-[13px] font-bold text-paldium">DOSSIER ▸</Text>
                  </Pressable>
                );
              })}
              <MonoText className="mt-1 text-[13px] text-faint font-medium">
                RATES ARE KILL-LOOT DROP CHANCES FROM THE PAL DROP TABLES · SORTED BEST FIRST
              </MonoText>
            </View>
          )}
        </View>
      ) : (
        <Text className="rounded-lg border border-dashed border-slate-700 p-4 text-center text-[13px] text-muted font-medium">
          PICK AN ITEM ABOVE TO SEE ITS DROPPERS
        </Text>
      )}
    </View>
  );
};
