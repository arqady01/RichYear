import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface GameItem {
  id: string;
  title: string;
  description: string;
  icon: IconSymbolName;
  color: string;
  fullWidth?: boolean;
}

const GAMES: GameItem[] = [
  {
    id: 'kinship',
    title: '亲戚关系计算器',
    description: '拜年时不知道该叫“表舅”还是“堂叔”。输入关系直接算出称呼。',
    icon: 'person.2.fill',
    color: '#FF3B30', // Red
  },
  {
    id: 'redpacket',
    title: '电子“赛博”红包',
    description: '不是真钱，而是“兑换券”。例如“做三次家务”或“帮我想个代码bug”的券。',
    icon: 'gift.fill',
    color: '#FF9500', // Orange
  },
  {
    id: 'scoreboard',
    title: '聚会记分板',
    description: '打牌没带筹码？多人联机记分工具，实时显示分数。',
    icon: 'gamecontroller.fill',
    color: '#34C759', // Green
    fullWidth: true,
  }
];

export default function GamesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const { width } = useWindowDimensions();
  
  // Calculate card width
  const containerPadding = 16;
  const gap = 12;
  // available width = width - (2 * containerPadding)
  // card width = (available width - gap) / 2
  const cardWidth = (width - (containerPadding * 2) - gap) / 2;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title">Holiday Games</ThemedText>
        </View>

        <View style={[styles.grid, { gap }]}>
          {GAMES.map((game) => {
            const isFullWidth = game.fullWidth;
            
            return (
              <Pressable
                key={game.id}
                style={({ pressed }) => [
                  styles.card,
                  { 
                    backgroundColor: cardBackgroundColor,
                    width: isFullWidth ? '100%' : cardWidth,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                  }
                ]}
                onPress={() => {
                   if (Platform.OS !== 'web') {
                     Haptics.selectionAsync();
                   }
                   // Navigate to specific game screen
                   if (game.id === 'kinship') {
                     router.push('/games/kinship');
                   } else if (game.id === 'scoreboard') {
                     router.push('/games/scoreboard');
                   }
                }}
              >
                <View style={[styles.iconContainer, { backgroundColor: game.color }]}>
                    <IconSymbol name={game.icon} size={30} color="white" />
                </View>
                <ThemedText type="subtitle" style={styles.cardTitle}>{game.title}</ThemedText>
                <ThemedText style={styles.cardDesc} numberOfLines={3}>{game.description}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Platform.OS === 'ios' ? 100 : 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  }
});
