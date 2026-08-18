import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLG, Path, Stop } from 'react-native-svg';
import type { Pal } from '../../types';
import { ELEMENT_MAP } from '../../data/elements';
import { PAL_IMAGES } from '../../data/pals/palImages';
import { MONO_FONT } from '../ui/primitives';

/**
 * PAL PORTRAIT — official Palpedia artwork when bundled (local asset via
 * Metro, works offline on every platform); procedural element-gradient hex
 * avatar as fallback for un-scraped species.
 */
export const PalPortrait: React.FC<{ pal: Pal; size?: number; showIndex?: boolean; noFrame?: boolean }> = ({
  pal,
  size = 64,
  showIndex = true,
  noFrame = false
}) => {
  const colors = useMemo(() => {
    const c = pal.elements.map((e) => ELEMENT_MAP[e]?.color ?? '#94A3B8');
    return { from: c[0], to: c[1] ?? c[0] };
  }, [pal.elements]);

  const qualityColor = pal.quality === 'complete' ? '#10B981' : pal.quality === 'core' ? '#F59E0B' : '#475569';
  const gid = `pg-${pal.id}`;
  const image = PAL_IMAGES[pal.id];

  return (
    <View style={{ width: size, height: size }}>
      {image ? (
        <View
          className="items-center justify-center overflow-hidden rounded-lg border"
          style={{
            width: size,
            height: size,
            borderColor: `${colors.from}44`,
            backgroundColor: '#0B1120',
            shadowColor: colors.from,
            shadowOpacity: 0.35,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 }
          }}
        >
          <Image
            source={image}
            style={{ width: size * 0.86, height: size * 0.86 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <Svg width={size} height={size} viewBox="0 0 64 64">
          <Defs>
            <SvgLG id={gid} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.from} stopOpacity="0.9" />
              <Stop offset="1" stopColor={colors.to} stopOpacity="0.55" />
            </SvgLG>
          </Defs>
          {!noFrame ? (
            <Path
              d="M32 2 L57 17 V47 L32 62 L7 47 V17 Z"
              fill="#0B1120"
              stroke={colors.from}
              strokeWidth="1.5"
              strokeOpacity="0.9"
            />
          ) : null}
          <Path
            d="M32 7 L52 19 V45 L32 57 L12 45 V19 Z"
            fill={`url(#${gid})`}
            stroke="#1E293B"
            strokeWidth="1"
          />
          <Circle cx="32" cy="32" r="9" fill="#0F172A" stroke={colors.to} strokeWidth="2" />
          <Circle cx="32" cy="32" r="3.5" fill={colors.from} />
          {pal.elements.length > 1 ? (
            <Circle cx="42" cy="22" r="3" fill={colors.to} opacity={0.85} />
          ) : (
            <Path d="M20 22 L26 28 L20 34" stroke={colors.to} strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
        </Svg>
      )}
      {showIndex ? (
        <View className="absolute -bottom-1 -right-1 rounded border border-slate-700 bg-well px-1">
          <Text style={{ fontFamily: MONO_FONT }} className="text-[13px] text-muted font-medium">
            {String(pal.dexNo).padStart(3, '0')}
          </Text>
        </View>
      ) : null}
      <View
        className="absolute -top-0.5 -left-0.5 h-2 w-2 rounded-full border border-well"
        style={{ backgroundColor: qualityColor }}
      />
    </View>
  );
};
