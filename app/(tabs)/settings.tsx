import React from 'react';
import { StyleSheet, View, Switch, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useHolidayTheme } from '@/context/HolidayThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const groupedBackgroundColor = useThemeColor({}, 'cardBackground');
  
  const { holiday, toggleHoliday } = useHolidayTheme();
  const activeColor = '#007AFF';

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHoliday();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </View>

      <View style={styles.section}>
        <View style={[styles.row, { backgroundColor: groupedBackgroundColor }]}>
          <View style={styles.rowIcon}>
             <IconSymbol name={holiday === 'christmas' ? 'snowflake' : 'flame.fill'} size={24} color={activeColor} />
          </View>
          <View style={styles.rowContent}>
            <ThemedText type="defaultSemiBold">Festival Theme</ThemedText>
            <ThemedText type="caption" style={{ color: '#8E8E93' }}>
              {holiday === 'christmas' ? 'Christmas' : 'Lunar New Year'}
            </ThemedText>
          </View>
          <Switch 
            value={holiday === 'newyear'} 
            onValueChange={handleToggle}
            trackColor={{ false: '#767577', true: activeColor }}
          />
        </View>
      </View>
      
       <View style={styles.section}>
        <View style={[styles.row, { backgroundColor: groupedBackgroundColor }]}>
           <View style={styles.rowIcon}>
             <IconSymbol name="gear" size={24} color="#8E8E93" />
           </View>
           <View style={styles.rowContent}>
             <ThemedText type="defaultSemiBold">Version</ThemedText>
           </View>
           <ThemedText type="default" style={{ color: '#8E8E93' }}>1.0.0</ThemedText>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowIcon: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
  },
});
