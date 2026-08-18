import React from 'react';
import { Platform, Pressable, Text, View, type TextProps, type ViewProps } from 'react-native';

/**
 * UI PRIMITIVES — PDA design system: glassmorphic cards with hover lift,
 * accent icon tiles, mono stat readouts, section headers, bars, segmented
 * controls, toggles, chips.
 */

export const MONO_FONT = Platform.select({ web: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', default: 'monospace' });

export const MonoText: React.FC<TextProps> = ({ style, ...rest }) => (
  <Text {...rest} style={[{ fontFamily: MONO_FONT, fontWeight: '600' }, style]} />
);

const GLOW_STYLES: Record<string, string> = {
  cyan: 'border-paldium/30 shadow-glow',
  gold: 'border-gold/30 shadow-goldglow',
  green: 'border-neon/30 shadow-neonglow',
  red: 'border-ember/30 shadow-emberglow',
  none: 'border-slate-800'
};

export const GlassCard: React.FC<ViewProps & { glow?: 'cyan' | 'gold' | 'green' | 'red' | 'none'; hover?: boolean }> = ({
  glow = 'cyan',
  hover = true,
  style,
  ...rest
}) => (
  <View
    {...rest}
    className={`rounded-xl border bg-panel/90 shadow-card ${GLOW_STYLES[glow]} ${hover ? 'pda-card' : ''}`}
    style={[Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as never) : null, style]}
  />
);

/** Colored square tile holding a glyph — nav & module identity. */
export const IconTile: React.FC<{ glyph: string; color: string; size?: number }> = ({ glyph, color, size = 34 }) => (
  <View
    className="items-center justify-center rounded-lg border"
    style={{ width: size, height: size, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
  >
    <Text style={{ color, fontSize: size * 0.5, lineHeight: size * 0.62 }}>{glyph}</Text>
  </View>
);

export const Badge: React.FC<{ label: string; color?: string; className?: string }> = ({
  label,
  color = '#06B6D4',
  className = ''
}) => (
  <View className={`self-start rounded px-2 py-0.5 border ${className}`} style={{ borderColor: `${color}66`, backgroundColor: `${color}14` }}>
    <MonoText className="text-[13px] uppercase tracking-wider" style={{ color }}>
      {label}
    </MonoText>
  </View>
);

export const TypeChip: React.FC<{ element: string; color: string; size?: 'sm' | 'md' }> = ({
  element,
  color,
  size = 'sm'
}) => (
  <View
    className={`rounded-full border ${size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'}`}
    style={{ borderColor: `${color}66`, backgroundColor: `${color}1A` }}
  >
    <Text className={`${size === 'sm' ? 'text-[13px]' : 'text-[13px]'} font-bold uppercase tracking-wide`} style={{ color }}>
      {element}
    </Text>
  </View>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode; color?: string }> = ({
  children,
  right,
  color = '#06B6D4'
}) => (
  <View className="mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">
      <View className="h-3.5 w-1 rounded-full" style={{ backgroundColor: color, shadowColor: color, shadowOpacity: 0.7, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } }} />
      <Text className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink">{children}</Text>
    </View>
    {right}
  </View>
);

export const ProgressBar: React.FC<{ value: number; color?: string; height?: number; track?: string }> = ({
  value,
  color = '#06B6D4',
  height = 6,
  track = 'rgba(51,65,85,0.6)'
}) => {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <View className="w-full overflow-hidden rounded-full" style={{ height, backgroundColor: track }}>
      <View
        className="rounded-full"
        style={{
          width: `${pct}%`,
          height,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.7,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 }
        }}
      />
    </View>
  );
};

export const Segmented: React.FC<{
  options: { id: string; label: string; icon?: string }[];
  value: string;
  onChange: (id: string) => void;
  accent?: string;
}> = ({ options, value, onChange, accent = '#06B6D4' }) => (
  <View className="flex-row rounded-lg border border-slate-700 bg-well/90 p-1">
    {options.map((o) => {
      const active = o.id === value;
      return (
        <Pressable
          key={o.id}
          onPress={() => onChange(o.id)}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-md px-2 py-2 ${active ? '' : 'pda-btn'}`}
          style={active ? { backgroundColor: `${accent}22`, borderColor: `${accent}55`, borderWidth: 1 } : undefined}
        >
          {o.icon ? <Text style={{ color: active ? accent : '#475569', fontSize: 11 }}>{o.icon}</Text> : null}
          <Text className={`text-[13px] font-bold tracking-wider ${active ? '' : 'text-muted'}`} style={active ? { color: accent } : undefined}>
            {o.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; label?: string }> = ({
  value,
  onChange,
  label
}) => (
  <Pressable className="flex-row items-center gap-2" onPress={() => onChange(!value)}>
    <View className={`h-5 w-9 rounded-full p-0.5 ${value ? 'bg-neon/80' : 'bg-slate-600'}`}>
      <View className={`h-4 w-4 rounded-full bg-white ${value ? 'self-end' : 'self-start'}`} />
    </View>
    {label ? <Text className="text-xs text-ink">{label}</Text> : null}
  </Pressable>
);

export const Chip: React.FC<{ label: string; active: boolean; onPress: () => void; color?: string; icon?: string }> = ({
  label,
  active,
  onPress,
  color = '#06B6D4',
  icon
}) => (
  <Pressable
    onPress={onPress}
    className={`pda-btn rounded-full border px-2.5 py-1 ${active ? '' : 'border-slate-700'}`}
    style={active ? { borderColor: color, backgroundColor: `${color}22` } : undefined}
  >
    <Text className="text-[13px] font-semibold" style={{ color: active ? color : '#AEB9CC' }}>
      {icon ? `${icon} ` : ''}
      {label}
    </Text>
  </Pressable>
);

/** Solid action button. */
export const ActionButton: React.FC<{
  label: string;
  onPress: () => void;
  color?: string;
  icon?: string;
  outlined?: boolean;
}> = ({ label, onPress, color = '#06B6D4', icon, outlined = false }) => (
  <Pressable
    onPress={onPress}
    className={`pda-btn rounded-lg border px-3.5 py-2 ${outlined ? '' : ''}`}
    style={
      outlined
        ? { borderColor: `${color}66` }
        : { backgroundColor: `${color}1E`, borderColor: `${color}77`, shadowColor: color, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }
    }
  >
    <Text className="text-[13px] font-bold tracking-wider" style={{ color }}>
      {icon ? `${icon}  ` : ''}
      {label}
    </Text>
  </Pressable>
);

export const EmptyState: React.FC<{ icon: string; title: string; detail?: string }> = ({ icon, title, detail }) => (
  <View className="items-center py-14">
    <Text className="text-3xl">{icon}</Text>
    <Text className="mt-2 text-sm font-bold text-ink">{title}</Text>
    {detail ? <Text className="mt-1 max-w-sm text-center text-xs text-muted font-medium">{detail}</Text> : null}
  </View>
);
