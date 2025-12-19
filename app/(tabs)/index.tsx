import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { H1, H2, H4, Paragraph, Card as TamaguiCard, Text, XStack, YStack } from 'tamagui';

import { HolidayParticles } from '@/components/HolidayParticles';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useHolidayTheme } from '@/context/HolidayThemeContext';

const { width } = Dimensions.get('window');

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | {}>({});
  const { themeColors } = useHolidayTheme();

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

  if (!hasTime) {
    return (
      <YStack ai="center" jc="center" p="$4">
        <H2 color={themeColors.primary} fontFamily="Chewy">The Day is Here!</H2>
      </YStack>
    )
  }

  return (
    <XStack jc="space-between" w="100%" px="$2" py="$4">
      <TimeBlock value={time.days} label="DAYS" />
      <Separator />
      <TimeBlock value={time.hours} label="HRS" />
      <Separator />
      <TimeBlock value={time.minutes} label="MIN" />
      <Separator />
      <TimeBlock value={time.seconds} label="SEC" />
    </XStack>
  );
};

const TimeBlock = ({ value, label }: { value: number; label: string }) => {
  const { themeColors } = useHolidayTheme();
  return (
    <YStack ai="center">
      <H2 color={themeColors.primary} fontWeight="800" fontSize={36}>{value.toString().padStart(2, '0')}</H2>
      <Text color={themeColors.secondary} fontSize={10} fontWeight="600" letterSpacing={1}>{label}</Text>
    </YStack>
  )
}

const Separator = () => {
  const { themeColors } = useHolidayTheme();
  return <Text color={themeColors.primary} fontSize={28} fontWeight="800" mt={-4} opacity={0.5}>:</Text>;
}


const PremiumCard = ({ children, onPress }: { children: React.ReactNode, onPress?: () => void }) => {
  return (
    <TamaguiCard
      elevate
      size="$4"
      bordered
      borderColor="$colorTransparent"
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.975 }}
      onPress={onPress}
      backgroundColor="white" // Ensure opaque background for clear reading
      borderRadius="$6"
      shadowColor="$shadowColor"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      marginBottom="$4"
      padding="$5"
    >
      {children}
    </TamaguiCard>
  )
}

export default function HomeScreen() {
  const { holiday, themeColors } = useHolidayTheme();

  const currentYear = new Date().getFullYear();
  const targetDate = holiday === 'christmas'
    ? new Date(currentYear, 11, 25)
    : new Date(currentYear + 1, 0, 29);

  const handleDailySurprise = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Navigate or show modal
  };

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />
      <HolidayParticles />

      <ParallaxScrollView
        headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
        headerImage={
          <YStack f={1} jc="center" ai="center" pb="$5">
            <IconSymbol
              size={100}
              name={holiday === 'christmas' ? 'snowflake' : 'flame.fill'}
              color="white"
              style={{ shadowColor: themeColors.primary, shadowRadius: 20, shadowOpacity: 0.5 }}
            />
          </YStack>
        }>

        <YStack px="$4" gap="$5" pb="$10">
          <YStack ai="center" mb="$2">
            <H1 color={themeColors.primary} fontWeight="900" textAlign="center" letterSpacing={-1}>
              {holiday === 'christmas' ? 'Merry Christmas' : 'Happy New Year'}
            </H1>
            <Paragraph color={themeColors.secondary} fontSize={16} fontWeight="500">
              {holiday === 'christmas' ? 'Magic is in the air' : 'Prosperity awaits'}
            </Paragraph>
          </YStack>

          <PremiumCard>
            <YStack gap="$2">
              <XStack jc="space-between" ai="center">
                <H4 color={themeColors.secondary}>Countdown</H4>
                <IconSymbol name="clock.fill" size={20} color={themeColors.secondary} />
              </XStack>
              <Countdown targetDate={targetDate} />
            </YStack>
          </PremiumCard>

          <PremiumCard onPress={handleDailySurprise}>
            <XStack gap="$4" ai="center">
              <View style={{
                width: 60, height: 60, borderRadius: 18,
                backgroundColor: themeColors.primary,
                justifyContent: 'center', alignItems: 'center',
                shadowColor: themeColors.primary, shadowRadius: 8, shadowOpacity: 0.3
              }}>
                <IconSymbol name="gift.fill" size={32} color="white" />
              </View>
              <YStack f={1}>
                <H4 color={themeColors.text}>Daily Surprise</H4>
                <Paragraph color="$gray10" fontSize={13}>Tap to reveal your blessing</Paragraph>
              </YStack>
              <IconSymbol name="chevron.right" size={20} color="$gray8" />
            </XStack>
          </PremiumCard>

          {/* Placeholder for more content to make it scrollable/full */}
          <PremiumCard>
            <XStack gap="$4" ai="center">
              <View style={{
                width: 60, height: 60, borderRadius: 18,
                backgroundColor: themeColors.accent,
                justifyContent: 'center', alignItems: 'center',
              }}>
                <IconSymbol name="star.fill" size={32} color="white" />
              </View>
              <YStack f={1}>
                <H4 color={themeColors.text}>Wishlist</H4>
                <Paragraph color="$gray10" fontSize={13}>Manage your holiday wishes</Paragraph>
              </YStack>
              <IconSymbol name="chevron.right" size={20} color="$gray8" />
            </XStack>
          </PremiumCard>

        </YStack>

      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
