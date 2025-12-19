import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Group, H2, ScrollView, Text, XStack, YStack } from 'tamagui';

const SettingItem = ({
  icon,
  color,
  label,
  value,
  onToggle,
  isSwitch,
  isLast
}: {
  icon: string,
  color: string,
  label: string,
  value?: string | boolean,
  onToggle?: (val: boolean) => void,
  isSwitch?: boolean,
  isLast?: boolean
}) => {
  const { themeColors } = useHolidayTheme();
  return (
    <XStack 
      ai="center" 
      jc="space-between" 
      px="$4" 
      py="$3"
      backgroundColor="rgba(255,255,255,0.8)"
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor="rgba(0,0,0,0.05)"
    >
      <XStack ai="center" gap="$3" height={28}>
        <IconSymbol name={icon} size={22} color={color} />
        <Text fontSize={16} fontWeight="600" color={themeColors.text}>{label}</Text>
      </XStack>
      {isSwitch ? (
        <XStack ai="center" height={28}>
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            trackColor={{ false: '#E9E9EA', true: themeColors.primary }}
            thumbColor="#FFF"
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          />
        </XStack>
      ) : (
        <XStack ai="center" gap="$2" height={28}>
          <Text fontSize={16} color="$gray10">{value}</Text>
          <IconSymbol name="chevron.right" size={16} color="$gray8" />
        </XStack>
      )}
    </XStack>
  )
}

export default function SettingsScreen() {
  const { holiday, toggleHoliday, themeColors } = useHolidayTheme();

  const handleToggle = (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHoliday();
  };

  return (
    <YStack f={1}>
      <GradientBackground />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <H2 color={themeColors.primary} fontWeight="900" mb="$6">Settings</H2>

        <YStack gap="$4">
          {/* Preferences Section */}
          <YStack>
            <Text ml="$3" mb="$2" fontSize={13} color={themeColors.secondary} fontWeight="700" textTransform="uppercase">Preferences</Text>
            <Group orientation="vertical" borderRadius="$4" overflow="hidden">
              <SettingItem
                icon={holiday === 'christmas' ? 'snowflake' : 'flame.fill'}
                color={themeColors.primary}
                label="Festival Theme"
                value={holiday === 'newyear'}
                isSwitch
                onToggle={handleToggle}
                isLast
              />
            </Group>
          </YStack>

          {/* About Section */}
          <YStack>
            <Text ml="$3" mb="$2" fontSize={13} color={themeColors.secondary} fontWeight="700" textTransform="uppercase">About</Text>
            <Group orientation="vertical" borderRadius="$4" overflow="hidden">
              <SettingItem
                icon="info.circle.fill"
                color="#007AFF"
                label="Version"
                value="1.0.0"
              />
              <SettingItem
                icon="doc.text.fill"
                color="#8E8E93"
                label="Terms of Service"
                value=""
                isLast
              />
            </Group>
          </YStack>

          <Text textAlign="center" mt="$8" color="$gray9" fontSize={12}>Made with ❤️ for the Holidays</Text>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({});
