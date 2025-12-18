import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHolidayTheme } from '@/context/HolidayThemeContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { themeColors } = useHolidayTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
            backgroundColor: themeColors.background === '#8B0000' ? '#500000' : '#ffffff', // dynamic tab bar color
            borderTopWidth: 0,
            elevation: 0,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Celebration',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wishes"
        options={{
          title: 'Wishes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="envelope.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="diy"
        options={{
          title: 'Decorate',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paintpalette.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide the original explore tab
        }}
      />
    </Tabs>
  );
}
