import { Stack } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function GamesLayout() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor },
        headerTintColor: textColor,
        headerBackTitle: '返回',
      }}
    />
  );
}
