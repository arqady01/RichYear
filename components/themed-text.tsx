import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'callout';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? { ...styles.link, color: linkColor } : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'callout' ? styles.callout : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  defaultSemiBold: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  link: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8E8E93',
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
});
