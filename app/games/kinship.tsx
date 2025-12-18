import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring
} from 'react-native-reanimated';

import {
  calculateKinship,
  getRelationChainShort,
  getRelationChainText,
} from '@/constants/kinship-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_MARGIN = 12;
const BUTTONS_PER_ROW = 4;
const BUTTON_SIZE = Math.floor((SCREEN_WIDTH - 40 - BUTTON_MARGIN * (BUTTONS_PER_ROW - 1)) / BUTTONS_PER_ROW);

// 计算器配色 - iPhone风格
const COLORS = {
  background: '#000000',
  displayText: '#FFFFFF',
  operatorButton: '#FF9500',
  functionButton: '#A5A5A5',
  functionText: '#000000',
  numberButton: '#333333',
  numberText: '#FFFFFF',
  clearButton: '#FF3B30',
  successGreen: '#34C759',
  chainText: '#8E8E93',
};

// 按钮类型
type ButtonType = 'relation' | 'operator' | 'function' | 'clear';

interface CalcButton {
  id: string;
  label: string;
  type: ButtonType;
}

// 计算器风格按钮布局
const CALC_BUTTONS: CalcButton[][] = [
  [
    { id: 'clear', label: 'AC', type: 'clear' },
    { id: 'undo', label: '⌫', type: 'function' },
    { id: 'h', label: '夫', type: 'function' },
    { id: 'w', label: '妻', type: 'operator' },
  ],
  [
    { id: 'f', label: '父', type: 'relation' },
    { id: 'm', label: '母', type: 'relation' },
    { id: 'ob', label: '兄', type: 'relation' },
    { id: 'os', label: '姐', type: 'operator' },
  ],
  [
    { id: 's', label: '子', type: 'relation' },
    { id: 'd', label: '女', type: 'relation' },
    { id: 'lb', label: '弟', type: 'relation' },
    { id: 'ls', label: '妹', type: 'operator' },
  ],
];

// 按钮组件
function CalcButtonItem({ 
  button, 
  onPress 
}: { 
  button: CalcButton; 
  onPress: () => void;
}) {
  const getBackgroundColor = () => {
    switch (button.type) {
      case 'operator': return COLORS.operatorButton;
      case 'function': return COLORS.functionButton;
      case 'clear': return COLORS.clearButton;
      default: return COLORS.numberButton;
    }
  };

  const getTextColor = () => {
    return button.type === 'function' ? COLORS.functionText : COLORS.numberText;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, { color: getTextColor() }]}>
        {button.label}
      </Text>
    </Pressable>
  );
}

export default function KinshipCalculatorScreen() {
  const [relationChain, setRelationChain] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  const resultScale = useSharedValue(1);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'success' | 'error') => {
    if (Platform.OS === 'web') return;
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }, []);

  const handleAddRelation = useCallback((relationId: string) => {
    triggerHaptic('light');
    
    setRelationChain((prev) => {
      const newChain = [...prev, relationId];
      const newResult = calculateKinship(newChain);
      if (newResult !== '关系较复杂，请简化' && newResult !== '请选择关系') {
        setStreak((s) => s + 1);
        triggerHaptic('success');
      }
      return newChain;
    });

    resultScale.value = withSequence(
      withSpring(1.1, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
  }, [triggerHaptic, resultScale]);

  const handleUndo = useCallback(() => {
    if (relationChain.length === 0) return;
    triggerHaptic('medium');
    setRelationChain((prev) => prev.slice(0, -1));
  }, [relationChain.length, triggerHaptic]);

  const handleClear = useCallback(() => {
    triggerHaptic('error');
    setRelationChain([]);
    setStreak(0);
  }, [triggerHaptic]);

  const handleButtonPress = useCallback((button: CalcButton) => {
    if (button.id === 'clear') {
      handleClear();
    } else if (button.id === 'undo') {
      handleUndo();
    } else {
      handleAddRelation(button.id);
    }
  }, [handleClear, handleUndo, handleAddRelation]);

  const result = calculateKinship(relationChain);
  const chainText = getRelationChainText(relationChain);
  const chainShort = getRelationChainShort(relationChain);
  const hasRelations = relationChain.length > 0;
  const isValidResult = result !== '关系较复杂，请简化' && result !== '请选择关系';

  const animatedResultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

  const getResultColor = () => {
    if (!hasRelations) return COLORS.displayText;
    if (isValidResult) return COLORS.successGreen;
    return COLORS.clearButton;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.displayText,
          headerBackTitle: '返回',
          headerShadowVisible: false,
        }}
      />

      {/* 显示区域 */}
      <View style={styles.displayContainer}>
        {/* 连击计数 */}
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>
              {streak >= 10 ? '🏆' : streak >= 5 ? '⭐' : '🔥'} {streak} 连击
            </Text>
          </View>
        )}

        {/* 关系链显示 */}
        <Text style={styles.chainLabel}>
          {hasRelations ? `我 → ${chainShort}` : '亲戚关系计算器'}
        </Text>

        {/* 结果 */}
        <Animated.View style={[styles.resultContainer, animatedResultStyle]}>
          <Text style={[styles.resultText, { color: getResultColor() }]}>
            {result}
          </Text>
        </Animated.View>

        {/* 完整描述 */}
        {hasRelations && (
          <Text style={styles.fullChainText} numberOfLines={2}>
            {chainText}
          </Text>
        )}

        {/* 成功提示 */}
        {isValidResult && hasRelations && (
          <Text style={styles.successHint}>✓ 找到了！</Text>
        )}
      </View>

      {/* 按钮区域 */}
      <View style={styles.buttonsContainer}>
        {CALC_BUTTONS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((button) => (
              <CalcButtonItem
                key={button.id}
                button={button}
                onPress={() => handleButtonPress(button)}
              />
            ))}
          </View>
        ))}
      </View>

      {/* 底部提示 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>依次点击关系，计算称呼</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  streakBadge: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    color: COLORS.operatorButton,
    fontSize: 16,
    fontWeight: '600',
  },
  chainLabel: {
    color: COLORS.chainText,
    fontSize: 18,
    marginBottom: 8,
  },
  resultContainer: {
    alignItems: 'flex-end',
    minHeight: 80,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 64,
    fontWeight: '300',
  },
  fullChainText: {
    color: COLORS.chainText,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
  successHint: {
    color: COLORS.successGreen,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BUTTON_MARGIN,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.chainText,
    fontSize: 13,
  },
});
