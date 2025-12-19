import React, { createContext, ReactNode, useContext, useState } from 'react';

export type HolidayType = 'christmas' | 'newyear';

interface HolidayThemeContextType {
  holiday: HolidayType;
  toggleHoliday: () => void;
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

const HolidayThemeContext = createContext<HolidayThemeContextType | undefined>(undefined);

const ChristmasColors = {
  primary: '#D42426', // Classic Red
  secondary: '#165B33', // Deep Green
  background: '#FDF6F0', // Soft warm cream (Light Mode) or Dark Green (Dark Mode) - handled via hook usually, but here is static
  text: '#1C1C1E',
  accent: '#D4AF37', // Gold
  cardBackground: '#FFFFFF',
};

const NewYearColors = {
  primary: '#E60012', // Vibrant Red
  secondary: '#FFD700', // Gold
  background: '#FFF8F0', // Very light cream
  text: '#8B0000', // Deep red text
  accent: '#FFA500',
  cardBackground: '#FFFFFF',
};

export const HolidayThemeProvider = ({ children }: { children: ReactNode }) => {
  const [holiday, setHoliday] = useState<HolidayType>('christmas');

  const toggleHoliday = () => {
    setHoliday((prev) => (prev === 'christmas' ? 'newyear' : 'christmas'));
  };

  const themeColors = holiday === 'christmas' ? ChristmasColors : NewYearColors;

  return (
    <HolidayThemeContext.Provider value={{ holiday, toggleHoliday, themeColors }}>
      {children}
    </HolidayThemeContext.Provider>
  );
};

export const useHolidayTheme = () => {
  const context = useContext(HolidayThemeContext);
  if (!context) {
    throw new Error('useHolidayTheme must be used within a HolidayThemeProvider');
  }
  return context;
};
