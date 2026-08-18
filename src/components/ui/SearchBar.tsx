import React from 'react';
import { TextInput, View, Pressable, Text } from 'react-native';

export const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}> = ({ value, onChange, placeholder = 'Search…', onClear }) => (
  <View className="flex-row items-center rounded-lg border border-slate-700 bg-well/80 px-3">
    <Text className="mr-2 text-paldium">⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#8A9BB4"
        className="h-10 flex-1 text-[14px] font-medium text-ink"
        style={{ outlineStyle: 'none' } as never}
      />
    {value.length > 0 ? (
      <Pressable onPress={() => (onClear ? onClear() : onChange(''))} hitSlop={8}>
        <Text className="text-muted font-medium">✕</Text>
      </Pressable>
    ) : null}
  </View>
);
