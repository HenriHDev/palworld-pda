import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useStoredState } from '../hooks/useStorage';
import { BossGuides, LoreDatabase, QuestTracker } from '../components/quests/QuestPanels';
import { MonoText, Segmented } from '../components/ui/primitives';

type Tab = 'quests' | 'bosses' | 'lore';

export const QuestsScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('quests');
  const [steps, setSteps] = useStoredState<Record<string, boolean>>('questSteps', {});

  const toggleStep = (questId: string, stepId: string) => {
    const key = `${questId}:${stepId}`;
    setSteps((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <View className="flex-1">
      <View className="mb-3">
        <Text className="text-lg font-black text-ink">
          QUEST <Text className="text-ember">LOG</Text>
        </Text>
        <MonoText className="text-[13px] uppercase tracking-[0.25em] text-muted font-medium">Storyline · strategies · database lore</MonoText>
      </View>
      <Segmented
        accent="#EF4444"
        options={[
          { id: 'quests', label: 'QUESTS', icon: '⚑' },
          { id: 'bosses', label: 'BOSSES', icon: '⚔' },
          { id: 'lore', label: 'LORE', icon: '✎' }
        ]}
        value={tab}
        onChange={(id) => setTab(id as Tab)}
      />
      <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          {tab === 'quests' ? <QuestTracker steps={steps} onToggleStep={toggleStep} /> : null}
          {tab === 'bosses' ? <BossGuides /> : null}
          {tab === 'lore' ? <LoreDatabase /> : null}
        </View>
      </ScrollView>
    </View>
  );
};
