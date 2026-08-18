import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pal } from '../types';
import { usePersistence } from '../hooks/usePersistence';
import { useRouter } from '../navigation/router';
import { ALL_PALS, getPal } from '../data/pals';
import { ELEMENT_MAP } from '../data/elements';
import { PalDetailView } from '../components/paldeck/PalDetail';
import { PalPortrait } from '../components/paldeck/PalPortrait';
import { ActionButton, MonoText, TypeChip } from '../components/ui/primitives';

export const PalDetailScreen: React.FC<{ palId: string }> = ({ palId }) => {
  const pal: Pal | undefined = getPal(palId);
  const { back, navigate } = useRouter();
  const { checklist, toggleCaptured } = usePersistence();

  const ordered = React.useMemo(() => [...ALL_PALS].sort((a, b) => a.dexNo - b.dexNo), []);
  const idx = ordered.findIndex((p) => p.id === palId);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  if (!pal) {
    return (
      <View className="items-center py-16">
        <Text className="text-sm text-ember">PAL RECORD NOT FOUND</Text>
        <Text className="mt-2 text-xs text-paldium" onPress={back}>
          ← BACK
        </Text>
      </View>
    );
  }

  const captured = !!checklist.captured[pal.id];
  const accent = ELEMENT_MAP[pal.elements[0]]?.color ?? '#06B6D4';

  return (
    <View className="flex-1">
      {/* breadcrumb row */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={back} className="pda-btn flex-row items-center gap-1.5 rounded-lg border border-slate-700 bg-panel px-2.5 py-1.5">
            <Text className="text-paldium">←</Text>
            <Text className="text-[13px] font-bold text-muted">PALDECK</Text>
          </Pressable>
          <MonoText className="text-[13px] text-faint font-medium">{pal.id.toUpperCase()}</MonoText>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Pressable
            onPress={() => prev && navigate({ name: 'pal', palId: prev.id })}
            className={`pda-btn rounded-lg border px-2.5 py-1.5 ${prev ? 'border-slate-700 bg-panel' : 'border-slate-800 bg-panel/40'}`}
            disabled={!prev}
          >
            <Text className={`text-[13px] font-bold ${prev ? 'text-paldium' : 'text-faint'}`}>◂ PREV</Text>
          </Pressable>
          <Pressable
            onPress={() => next && navigate({ name: 'pal', palId: next.id })}
            className={`pda-btn rounded-lg border px-2.5 py-1.5 ${next ? 'border-slate-700 bg-panel' : 'border-slate-800 bg-panel/40'}`}
            disabled={!next}
          >
            <Text className={`text-[13px] font-bold ${next ? 'text-paldium' : 'text-faint'}`}>NEXT ▸</Text>
          </Pressable>
        </View>
      </View>

      {/* hero */}
      <View className="pda-gridbg mb-4 flex-row flex-wrap items-center gap-5 rounded-xl border border-slate-800 bg-panel/90 p-5 shadow-card">
        <PalPortrait pal={pal} size={116} />
        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <MonoText className="text-[13px] text-paldium">#{String(pal.dexNo).padStart(3, '0')} · OFFICIAL</MonoText>
            {pal.isAlphaBoss ? <MonoText className="rounded border border-ember/50 bg-ember/10 px-1.5 py-0.5 text-[13px] font-bold text-ember">ALPHA</MonoText> : null}
            {pal.isRaidBoss ? <MonoText className="rounded border border-ember/50 bg-ember/10 px-1.5 py-0.5 text-[13px] font-bold text-ember">RAID</MonoText> : null}
            <MonoText
              className={`rounded border px-1.5 py-0.5 text-[13px] ${
                pal.quality === 'complete'
                  ? 'border-neon/50 text-neon'
                  : pal.quality === 'core'
                    ? 'border-gold/50 text-gold'
                    : 'border-slate-600 text-muted'
              }`}
            >
              {pal.quality === 'complete' ? 'FULL DATA' : pal.quality === 'core' ? 'CORE DATA' : 'SCAN ONLY'}
            </MonoText>
          </View>
          <Text className="mt-1 text-2xl font-black tracking-tight text-ink">{pal.name}</Text>
          <Text className="text-xs text-muted font-medium">{pal.title || 'No title on record'}</Text>
          <View className="mt-2 flex-row flex-wrap gap-1.5">
            {pal.elements.map((e) => (
              <TypeChip key={e} element={e} color={ELEMENT_MAP[e]?.color ?? '#94A3B8'} size="md" />
            ))}
          </View>
        </View>
        <ActionButton
          label={captured ? 'CAPTURED' : 'MARK CAPTURED'}
          icon={captured ? '✓' : '◯'}
          color={captured ? '#10B981' : '#06B6D4'}
          outlined={!captured}
          onPress={() => toggleCaptured(pal.id)}
        />
      </View>

      <PalDetailView
        pal={pal}
        accent={accent}
        capturedIds={Object.keys(checklist.captured).filter((id) => checklist.captured[id])}
        onOpenLab={(a, b) => navigate({ name: 'breeding', parents: { a: a.id, b: b.id } })}
      />
    </View>
  );
};
