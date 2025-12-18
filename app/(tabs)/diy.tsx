import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useHolidayTheme } from '@/context/HolidayThemeContext';

interface StickerData {
  id: string;
  icon: IconSymbolName;
  color: string;
}

const STICKER_OPTIONS: { icon: IconSymbolName; color: string }[] = [
  { icon: 'star.fill', color: '#FFD700' },
  { icon: 'heart.fill', color: '#FF0000' },
  { icon: 'bell.fill', color: '#FFA500' },
  { icon: 'gift.fill', color: '#32CD32' },
  { icon: 'moon.fill', color: '#C0C0C0' },
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
  const { themeColors } = useHolidayTheme();
  const [stickers, setStickers] = useState<StickerData[]>([]);

  const addSticker = (icon: IconSymbolName, color: string) => {
    setStickers([...stickers, { id: Math.random().toString(), icon, color }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.text }}>Decorate</ThemedText>
        <ThemedText style={{ color: themeColors.text }}>Create your festive scene</ThemedText>
      </View>

      <View style={styles.canvas}>
        <View style={[styles.treePlaceholder, { borderColor: themeColors.text }]}>
             <IconSymbol name="house.fill" size={100} color={themeColors.secondary} style={{opacity: 0.5}} />
        </View>
        {stickers.map((s) => (
          <DraggableSticker key={s.id} icon={s.icon} color={s.color} />
        ))}
      </View>

      <View style={styles.palette}>
        <ThemedText style={{ color: themeColors.text, marginBottom: 10 }}>Pick a sticker:</ThemedText>
        <FlatList
          data={STICKER_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addSticker(item.icon, item.color)} style={styles.paletteItem}>
              <IconSymbol name={item.icon} size={40} color={item.color} />
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  canvas: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden', // Keep stickers inside visually? actually overflow visible is better for dragging out
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed'
  },
  treePlaceholder: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
  },
  palette: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  paletteItem: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sticker: {
    position: 'absolute', // Initial position
  },
});
