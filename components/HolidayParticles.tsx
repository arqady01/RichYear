import React, { useEffect, useMemo } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Canvas, Circle, Group, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue, cancelAnimation } from 'react-native-reanimated';
import { useHolidayTheme } from '@/context/HolidayThemeContext';

const { width, height } = Dimensions.get('window');
const NUM_PARTICLES = 30;

const Particle = ({ index, type }: { index: number; type: 'snow' | 'lantern' }) => {
  const x = useSharedValue(Math.random() * width);
  const y = useSharedValue(Math.random() * height);
  const size = useSharedValue(Math.random() * (type === 'snow' ? 4 : 8) + 2);
  const opacity = useSharedValue(Math.random() * 0.5 + 0.3);

  useEffect(() => {
    const duration = Math.random() * 5000 + 3000;
    
    if (type === 'snow') {
      // Fall down
      y.value = withRepeat(
        withTiming(height + 10, { duration, easing: Easing.linear }),
        -1,
        false
      );
      // Drift slightly
      x.value = withRepeat(
         withTiming(x.value + (Math.random() - 0.5) * 50, { duration: duration / 2, easing: Easing.sin }),
         -1,
         true
      );
    } else {
      // Rise up (Lanterns)
      y.value = withRepeat(
        withTiming(-50, { duration, easing: Easing.linear }),
        -1,
        false
      );
       x.value = withRepeat(
         withTiming(x.value + (Math.random() - 0.5) * 30, { duration: duration / 2, easing: Easing.sin }),
         -1,
         true
      );
    }
    
    return () => {
      cancelAnimation(y);
      cancelAnimation(x);
    };
  }, [type]);

  const color = type === 'snow' ? 'white' : (index % 2 === 0 ? '#FFD700' : '#FF0000'); // Gold or Red

  return <Circle cx={x} cy={y} r={size} color={color} opacity={opacity} />;
};

export const HolidayParticles = () => {
  const { holiday } = useHolidayTheme();
  
  // Reset particles when holiday changes effectively by remounting via key or just logic? 
  // Remounting is easier to reset positions.
  
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={{ flex: 1 }}>
        <Group>
          {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
            <Particle key={`${holiday}-${i}`} index={i} type={holiday === 'christmas' ? 'snow' : 'lantern'} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
};
