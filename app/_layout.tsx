import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';

import { HolidayThemeProvider } from '@/context/HolidayThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import config from '../tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme={colorScheme!}>
        <HolidayThemeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="games" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </HolidayThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
