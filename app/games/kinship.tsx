import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  RELATION_CATEGORIES,
  calculateKinship,
  getRelationChainText,
  getRelationChainShort,
} from '@/constants/kinship-data';

export default function KinshipCalculatorScreen() {
  const [relationChain, setRelationChain] = useState<string[]>([]);
  
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const separatorColor = useThemeColor({}, 'separator');
  const redColor = useThemeColor({}, 'red');
  
  // Animation for result
  const resultScale = useSharedValue(1);
  
  const animatedResultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

  const handleAddRelation = useCallback((relationId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setRelationChain((prev) => [...prev, relationId]);
    
    // Animate result
    resultScale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
  }, [resultScale]);

  const handleRemoveLast = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setRelationChain((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setRelationChain([]);
  }, []);

  const result = calculateKinship(relationChain);
  const chainText = getRelationChainText(relationChain);
  const chainShort = getRelationChainShort(relationChain);
  const hasRelations = relationChain.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: '亲戚关系计算器',
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
          headerBackTitle: '返回',
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Card */}
        <View style={[styles.resultCard, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText style={[styles.resultLabel, { color: secondaryTextColor }]}>
            计算结果
          </ThemedText>
          
          <Animated.View style={animatedResultStyle}>
            <ThemedText
              style={[
                styles.resultText,
                { color: hasRelations ? redColor : secondaryTextColor },
              ]}
            >
              {result}
            </ThemedText>
          </Animated.View>
          
          {hasRelations && chainShort && (
            <View style={[styles.chainBadge, { backgroundColor: `${tintColor}15` }]}>
              <ThemedText style={[styles.chainBadgeText, { color: tintColor }]}>
                {chainShort}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Relation Chain Display */}
        <View style={[styles.chainCard, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.chainHeader}>
            <ThemedText style={[styles.chainLabel, { color: secondaryTextColor }]}>
              关系链
            </ThemedText>
            {hasRelations && (
              <Pressable onPress={handleRemoveLast} hitSlop={8}>
                <ThemedText style={[styles.undoText, { color: tintColor }]}>
                  撤销
                </ThemedText>
              </Pressable>
            )}
          </View>
          
          <ThemedText
            style={[
              styles.chainText,
              !hasRelations && { color: secondaryTextColor },
            ]}
            numberOfLines={3}
          >
            {chainText}
          </ThemedText>
        </View>

        {/* Relation Buttons */}
        <View style={styles.buttonsSection}>
          {RELATION_CATEGORIES.map((category, catIndex) => (
            <View key={category.title} style={styles.categorySection}>
              <ThemedText style={[styles.categoryTitle, { color: secondaryTextColor }]}>
                {category.title}
              </ThemedText>
              
              <View style={styles.buttonRow}>
                {category.relations.map((relation) => (
                  <Pressable
                    key={relation.id}
                    style={({ pressed }) => [
                      styles.relationButton,
                      {
                        backgroundColor: cardBackgroundColor,
                        borderColor: separatorColor,
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                      },
                    ]}
                    onPress={() => handleAddRelation(relation.id)}
                  >
                    <ThemedText style={styles.relationButtonText}>
                      {relation.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
              
              {catIndex < RELATION_CATEGORIES.length - 1 && (
                <View style={[styles.categorySeparator, { backgroundColor: separatorColor }]} />
              )}
            </View>
          ))}
        </View>

        {/* Clear Button */}
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            {
              backgroundColor: hasRelations ? redColor : separatorColor,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleClear}
          disabled={!hasRelations}
        >
          <IconSymbol name="arrow.counterclockwise" size={18} color="white" />
          <ThemedText style={styles.clearButtonText}>清空重来</ThemedText>
        </Pressable>

        {/* Instructions */}
        <View style={styles.instructions}>
          <ThemedText style={[styles.instructionTitle, { color: secondaryTextColor }]}>
            使用说明
          </ThemedText>
          <ThemedText style={[styles.instructionText, { color: secondaryTextColor }]}>
            {'1. 从"我"的角度出发，依次选择关系\n'}
            {'2. 例如：想知道"爸爸的妈妈"怎么称呼\n'}
            {'3. 依次点击"爸爸"→"妈妈"，得到"奶奶"\n'}
            {'4. 点击"撤销"可删除最后一个关系'}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
  },
  chainBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chainBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chainCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chainLabel: {
    fontSize: 14,
  },
  undoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chainText: {
    fontSize: 17,
    lineHeight: 24,
  },
  buttonsSection: {
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  relationButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  relationButtonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  categorySeparator: {
    height: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  instructions: {
    paddingTop: 16,
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
