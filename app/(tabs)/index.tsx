import { Image } from 'expo-image';
import { StyleSheet, View, Pressable, Vibration, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import { HolidayParticles } from '@/components/HolidayParticles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useEffect, useState } from 'react';

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
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
    return timeLeft as { days: number; hours: number; minutes: number; seconds: number };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View style={styles.countdownContainer}>
      {Object.keys(timeLeft).length > 0 ? (
        <View style={styles.timerRow}>
           <TimeBox value={timeLeft.days} label="Days" />
           <TimeBox value={timeLeft.hours} label="Hrs" />
           <TimeBox value={timeLeft.minutes} label="Mins" />
           <TimeBox value={timeLeft.seconds} label="Secs" />
        </View>
      ) : (
        <ThemedText type="title">It's Here!</ThemedText>
      )}
    </View>
  );
};

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.timeBox}>
    <ThemedText type="title" style={{ fontSize: 24 }}>{value.toString().padStart(2, '0')}</ThemedText>
    <ThemedText style={{ fontSize: 10 }}>{label}</ThemedText>
  </View>
);

export default function HomeScreen() {
  const { holiday, toggleHoliday, themeColors } = useHolidayTheme();
  
  // Target dates (just mock for next year if passed)
  const currentYear = new Date().getFullYear();
  const targetDate = holiday === 'christmas' 
    ? new Date(currentYear, 11, 25) 
    : new Date(currentYear + 1, 0, 29); // Approximate CNY

    if (new Date() > targetDate) {
        // Adjust for next year logic if needed, but for demo we assume upcoming
    }

  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    toggleHoliday();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <HolidayParticles />
      <ParallaxScrollView
        headerBackgroundColor={{ light: themeColors.primary, dark: themeColors.primary }}
        headerImage={
          <IconSymbol
            size={200}
            name={holiday === 'christmas' ? 'snowflake' : 'flame.fill'}
            color="white"
            style={styles.headerIcon}
          />
        }>
        
        <ThemedView style={[styles.titleContainer, { backgroundColor: 'transparent' }]}>
          <ThemedText type="title" style={{ color: themeColors.text }}>
            {holiday === 'christmas' ? 'Merry Christmas!' : 'Happy New Year!'}
          </ThemedText>
          <HelloWave />
        </ThemedView>

        <View style={styles.card}>
           <ThemedText type="subtitle" style={{textAlign: 'center', marginBottom: 10}}>Time Remaining</ThemedText>
           <Countdown targetDate={targetDate} />
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Daily Surprise</ThemedText>
          <View style={{ padding: 20, alignItems: 'center' }}>
             <IconSymbol name="gift.fill" size={60} color={themeColors.accent} />
             <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
               Tap to reveal your daily blessing!
             </ThemedText>
          </View>
        </View>

        <Pressable onPress={handlePress} style={styles.switchButton}>
            <Animated.View style={[styles.switchContent, animatedStyle, { backgroundColor: themeColors.secondary }]}>
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
                    Switch to {holiday === 'christmas' ? 'Lunar New Year' : 'Christmas'}
                </ThemedText>
            </Animated.View>
        </Pressable>

      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerIcon: {
    bottom: -30,
    left: -20,
    position: 'absolute',
    opacity: 0.8
  },
  countdownContainer: {
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
