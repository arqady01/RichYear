import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StickerData {
  id: string;
  icon: IconSymbolName;
  color: string;
}

const STICKER_OPTIONS: { icon: IconSymbolName; color: string }[] = [
  { icon: 'star.fill', color: '#FFD700' },
  { icon: 'heart.fill', color: '#FF3B30' },
  { icon: 'bell.fill', color: '#FF9500' },
  { icon: 'gift.fill', color: '#34C759' },
  { icon: 'moon.fill', color: '#AF52DE' },
  { icon: 'snowflake', color: '#5AC8FA' },
  { icon: 'flame.fill', color: '#FF9500' },
];

const DraggableSticker = ({ icon, color }: { icon: IconSymbolName; color: string }) => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      isPressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      zIndex: isPressed.value ? 100 : 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.sticker, animatedStyles]}>
        <IconSymbol name={icon} size={60} color={color} />
      </Animated.View>
    </GestureDetector>
  );
};

export default function DIYScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  
  const [stickers, setStickers] = useState<StickerData[]>([]);

  const addSticker = (icon: IconSymbolName, color: string) => {
    setStickers([...stickers, { id: Math.random().toString(), icon, color }]);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title">Decorate</ThemedText>
        <ThemedText style={{ color: '#8E8E93', marginTop: 4 }}>Create your festive scene</ThemedText>
      </View>

      <View style={[styles.canvas, { backgroundColor: cardBackground }]}>
        <View style={styles.placeholderContainer}>
             <IconSymbol name="house.fill" size={80} color="#E5E5EA" />
             <ThemedText style={{ color: '#C7C7CC', marginTop: 10 }}>Drag stickers here</ThemedText>
        </View>
        {stickers.map((s) => (
          <DraggableSticker key={s.id} icon={s.icon} color={s.color} />
        ))}
      </View>

      <View style={[styles.palette, { backgroundColor: cardBackground }]}>
        <FlatList
          data={STICKER_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addSticker(item.icon, item.color)} style={styles.paletteItem}>
              <IconSymbol name={item.icon} size={32} color={item.color} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.icon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  canvas: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  palette: {
    height: 100,
    paddingBottom: 20, // Bottom safe area compensation if needed, usually handled by SafeAreaView but here manually slightly
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
  },
  paletteItem: {
    width: 56,
    height: 56,
    backgroundColor: '#F2F2F7', // Use grouped background for contrast against card background
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sticker: {
    position: 'absolute',
  },
});
