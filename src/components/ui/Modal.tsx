import React from 'react';
import { Modal as RNModal, Pressable, ScrollView, Text, View } from 'react-native';
import { MONO_FONT } from './primitives';

export const SheetModal: React.FC<{
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, title, onClose, children }) => (
  <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/70">
      <Pressable className="flex-1" onPress={onClose} />
      <View className="max-h-[80%] rounded-t-2xl border-t border-x border-paldium/30 bg-panel">
        <View className="flex-row items-center justify-between border-b border-slate-700 px-4 py-3">
          <Text className="text-sm font-bold uppercase tracking-widest text-paldium">{title}</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={{ fontFamily: MONO_FONT }} className="text-base text-muted font-medium">✕</Text>
          </Pressable>
        </View>
        <ScrollView className="max-h-[70vh] px-4 py-3" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </View>
  </RNModal>
);
