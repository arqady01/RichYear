import { StyleSheet, View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEffect, useState, useCallback } from 'react';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import { HolidayParticles } from '@/components/HolidayParticles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | {}>({});
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');

  const calculateTimeLeft = useCallback(() => {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Type guard or cast
  const time = timeLeft as { days: number; hours: number; minutes: number; seconds: number };
  const hasTime = Object.keys(timeLeft).length > 0;

  return (
    <View style={styles.countdownContainer}>
      {hasTime ? (
        <View style={styles.timerRow}>
           <TimeBox value={time.days} label="DAYS" color={textColor} labelColor={secondaryTextColor} />
           <Separator color={secondaryTextColor} />
           <TimeBox value={time.hours} label="HRS" color={textColor} labelColor={secondaryTextColor} />
           <Separator color={secondaryTextColor} />
           <TimeBox value={time.minutes} label="MIN" color={textColor} labelColor={secondaryTextColor} />
           <Separator color={secondaryTextColor} />
           <TimeBox value={time.seconds} label="SEC" color={textColor} labelColor={secondaryTextColor} />
        </View>
      ) : (
        <ThemedText type="title">It&apos;s Here!</ThemedText>
      )}
    </View>
  );
};

const TimeBox = ({ value, label, color, labelColor }: { value: number; label: string, color: string, labelColor: string }) => (
  <View style={styles.timeBox}>
    <ThemedText type="title" style={{ fontSize: 28, fontVariant: ['tabular-nums'], color }}>
      {value.toString().padStart(2, '0')}
    </ThemedText>
    <ThemedText style={{ fontSize: 11, fontWeight: '600', color: labelColor, marginTop: 4 }}>{label}</ThemedText>
  </View>
);

const Separator = ({ color }: { color: string }) => (
  <ThemedText style={{ fontSize: 24, color, marginBottom: 18 }}>:</ThemedText>
);

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const { holiday, toggleHoliday } = useHolidayTheme();
  const theme = useThemeColor({}, 'background'); // hack to just use theme hook if needed, but actually I need to access Colors for explicit colors
  // Wait, I need Colors for specific logic?
  // In previous code: const colors = Colors[theme]; 
  // But theme was from useColorScheme.
  
  // I will use useThemeColor for dynamic values, or just Colors.light/dark if I need specific palette access.
  // Actually I only used `colors.orange`, `colors.grey3`, `colors.blue` etc.
  // I should probably use `useThemeColor` to get these if I mapped them, or just hardcode/use Colors with useColorScheme.
  
  // Let's bring back useColorScheme correctly if I need to access Colors[scheme]
  // But strictly speaking, I should use useThemeColor or similar.
  // However, for simplicity and fixing errors, I'll just use mapped colors or hardcoded hexes from my Palette if I don't want to overcomplicate.
  
  // But to be clean:
  const colors = Colors.light; // Just for the palette references like orange/blue which are usually constant or semantic.
  // Actually, my Colors object has light/dark.
  // I'll use semantic colors.
  
  const orange = '#FF9500';
  const grey3 = '#C7C7CC';
  const blue = '#007AFF';

  const currentYear = new Date().getFullYear();
  const targetDate = holiday === 'christmas' 
    ? new Date(currentYear, 11, 25) 
    : new Date(currentYear + 1, 0, 29); 

  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(1.05), withSpring(1));
    toggleHoliday();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <HolidayParticles />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A0B0C0', dark: '#1C1C1E' }}
        headerImage={
          <View style={styles.headerImageContainer}>
             <IconSymbol
                size={120}
                name={holiday === 'christmas' ? 'snowflake' : 'flame.fill'}
                color="white"
              />
          </View>
        }>
        
        <View style={styles.headerTitleContainer}>
          <ThemedText type="title">
            {holiday === 'christmas' ? 'Christmas' : 'Lunar New Year'}
          </ThemedText>
          <HelloWave />
        </View>

        <Card>
           <ThemedText type="defaultSemiBold" style={{ marginBottom: 16 }}>Time Remaining</ThemedText>
           <Countdown targetDate={targetDate} />
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
             <View style={[styles.iconContainer, { backgroundColor: orange }]}>
                <IconSymbol name="gift.fill" size={32} color="white" />
             </View>
             <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">Daily Surprise</ThemedText>
                <ThemedText type="caption" style={{ marginTop: 2 }}>Tap to reveal your blessing</ThemedText>
             </View>
             <IconSymbol name="chevron.right" size={20} color={grey3} />
          </View>
        </Card>

        <Pressable onPress={handlePress} style={styles.switchButton}>
            <Animated.View style={[
                styles.switchContent, 
                animatedStyle, 
                { backgroundColor: blue }
            ]}>
                <ThemedText style={{ color: 'white', fontWeight: '600', fontSize: 17 }}>
                    Switch Theme
                </ThemedText>
            </Animated.View>
        </Pressable>

      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 50,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  switchButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  switchContent: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
