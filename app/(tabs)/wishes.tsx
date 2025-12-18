import { StyleSheet, View, Dimensions, FlatList, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedScrollHandler, interpolate, Extrapolation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { HolidayParticles } from '@/components/HolidayParticles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2;

const DATA: { id: string; title: string; icon: IconSymbolName; message: string }[] = [
  { id: '1', title: 'Joy & Peace', icon: 'star.fill', message: 'Wishing you a season filled with warmth and comfort.' },
  { id: '2', title: 'Prosperity', icon: 'sun.max.fill', message: 'May the new year bring you wealth and success.' },
  { id: '3', title: 'Health', icon: 'heart.fill', message: 'Good health and happiness to you and your family.' },
  { id: '4', title: 'Love', icon: 'gift.fill', message: 'Sending you all my love this holiday season.' },
];

const Card = ({ item, index, scrollX }: { item: typeof DATA[0], index: number, scrollX: Animated.SharedValue<number> }) => {
  const { themeColors } = useHolidayTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert(`Sent wish: ${item.title}!`);
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable 
        onPress={handlePress}
        style={[styles.card, { backgroundColor: themeColors.primary }]}
      >
        <IconSymbol name={item.icon} size={80} color="white" />
        <ThemedText type="title" style={{ color: 'white', marginTop: 20 }}>{item.title}</ThemedText>
        <ThemedText style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>{item.message}</ThemedText>
        <View style={styles.button}>
            <ThemedText style={{color: themeColors.primary, fontWeight: 'bold'}}>Tap to Send</ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function WishesScreen() {
  const { themeColors } = useHolidayTheme();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <HolidayParticles />
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.text }}>Send a Wish</ThemedText>
        <ThemedText style={{ color: themeColors.text }}>Swipe and tap to share</ThemedText>
      </View>
      
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACER_WIDTH }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => <Card item={item} index={index} scrollX={scrollX} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 500, // Fixed height for simplicity
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  button: {
      marginTop: 30,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
  }
});
