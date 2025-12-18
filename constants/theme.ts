/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Based on Apple's Human Interface Guidelines.
 */

import { Platform } from 'react-native';

const tintColorLight = '#007AFF'; // iOS System Blue
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#000000',
    secondaryText: '#8E8E93',
    tertiaryText: '#C7C7CC',
    background: '#F2F2F7', // iOS Grouped Background Light
    cardBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    separator: '#C6C6C8',
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#34C759',
    teal: '#5AC8FA',
    blue: '#007AFF',
    indigo: '#5856D6',
    purple: '#AF52DE',
    pink: '#FF2D55',
    grey: '#8E8E93',
    grey2: '#AEAEB2',
    grey3: '#C7C7CC',
    grey4: '#D1D1D6',
    grey5: '#E5E5EA',
    grey6: '#F2F2F7',
  },
  dark: {
    text: '#FFFFFF',
    secondaryText: '#8E8E93',
    tertiaryText: '#48484A',
    background: '#000000', // iOS Grouped Background Dark
    cardBackground: '#1C1C1E',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    separator: '#38383A',
    red: '#FF453A',
    orange: '#FF9F0A',
    yellow: '#FFD60A',
    green: '#32D74B',
    teal: '#64D2FF',
    blue: '#0A84FF',
    indigo: '#5E5CE6',
    purple: '#BF5AF2',
    pink: '#FF375F',
    grey: '#8E8E93',
    grey2: '#636366',
    grey3: '#48484A',
    grey4: '#3A3A3C',
    grey5: '#2C2C2E',
    grey6: '#1C1C1E',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Times New Roman',
    rounded: 'System', 
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
