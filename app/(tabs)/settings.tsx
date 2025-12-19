import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

const SettingItem = ({
  icon,
  color,
  label,
  value,
  onToggle,
  isSwitch,
  isLast
}: {
  icon: IconSymbolName,
  color: string,
  label: string,
  value?: string | boolean,
  onToggle?: (val: boolean) => void,
  isSwitch?: boolean,
  isLast?: boolean
}) => {
  const { themeColors } = useHolidayTheme();
  return (
    <View style={[
      styles.settingItem,
      !isLast && styles.settingItemBorder
    ]}>
      <View style={styles.settingLeft}>
        <IconSymbol name={icon} size={22} color={color} />
        <Text style={[styles.labelText, { color: themeColors.text }]}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value as boolean}
          onValueChange={onToggle}
          trackColor={{ false: '#E9E9EA', true: themeColors.primary }}
          thumbColor="#FFF"
        />
      ) : (
        <View style={styles.settingRight}>
          <Text style={styles.valueText}>{value}</Text>
          <IconSymbol name="chevron.right" size={16} color="#8E8E93" />
        </View>
      )}
    </View>
  )
}

export default function SettingsScreen() {
  const { holiday, toggleHoliday, themeColors } = useHolidayTheme();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHoliday();
  };

  return (
    <View style={styles.container}>
      <GradientBackground />
      <ScrollView 
        style={[styles.scrollView, { zIndex: 1 }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.primary }]}>Settings</Text>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.secondary }]}>
            PREFERENCES
          </Text>
          <View style={styles.group}>
            <SettingItem
              icon={holiday === 'christmas' ? 'snowflake' : 'flame.fill'}
              color={themeColors.primary}
              label="Festival Theme"
              value={holiday === 'newyear'}
              isSwitch
              onToggle={handleToggle}
              isLast
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.secondary }]}>
            ABOUT
          </Text>
          <View style={styles.group}>
            <SettingItem
              icon="star.fill"
              color="#007AFF"
              label="Version"
              value="1.0.0"
            />
            <SettingItem
              icon="envelope.fill"
              color="#8E8E93"
              label="Terms of Service"
              value=""
              isLast
            />
          </View>
        </View>

        <Text style={styles.footer}>Made with ❤️ for the Holidays</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
    marginBottom: 8,
  },
  group: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  settingItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    color: '#8E8E93',
    fontSize: 12,
  },
});
