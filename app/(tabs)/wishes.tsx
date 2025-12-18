import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolation, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { HolidayParticles } from '@/components/HolidayParticles';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACER_WIDTH = (width - CARD_WIDTH) / 2;

const DATA: { id: string; title: string; icon: IconSymbolName; message: string; color: string }[] = [
  { id: '1', title: 'Joy & Peace', icon: 'star.fill', message: 'Wishing you a season filled with warmth and comfort.', color: '#FFD700' },
  { id: '2', title: 'Prosperity', icon: 'sun.max.fill', message: 'May the new year bring you wealth and success.', color: '#FF9500' },
  { id: '3', title: 'Health', icon: 'heart.fill', message: 'Good health and happiness to you and your family.', color: '#FF3B30' },
  { id: '4', title: 'Love', icon: 'gift.fill', message: 'Sending you all my love this holiday season.', color: '#FF2D55' },
];

const Card = ({ item, index, scrollX }: { item: typeof DATA[0], index: number, scrollX: SharedValue<number> }) => {
  const backgroundColor = useThemeColor({}, 'cardBackground');

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

    return {
      transform: [{ scale }],
    };
  });

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, this would share the wish
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable 
        onPress={handlePress}
        style={[styles.card, { backgroundColor }]}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <IconSymbol name={item.icon} size={60} color="white" />
        </View>
        <ThemedText type="title" style={{ marginTop: 24, textAlign: 'center' }}>{item.title}</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 12, color: '#8E8E93' }}>{item.message}</ThemedText>
        
        <View style={styles.actionRow}>
            <ThemedText style={{ color: '#007AFF', fontWeight: '600', fontSize: 17 }}>Tap to Send</ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function WishesScreen() {
  const scrollX = useSharedValue(0);
  const backgroundColor = useThemeColor({}, 'background');

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <HolidayParticles />
      <View style={styles.header}>
        <ThemedText type="title">Send a Wish</ThemedText>
      </View>
      
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACER_WIDTH, paddingBottom: 20 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => <Card item={item} index={index} scrollX={scrollX} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionRow: {
      marginTop: 'auto',
  }
});
