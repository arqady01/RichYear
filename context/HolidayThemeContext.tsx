import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  primary: '#D42426', // Santa Red
  secondary: '#165B33', // Pine Green
  background: '#F8B229', // Gold-ish/Warm White (Actually let's go darker for immersion or stick to simple) -> Let's try a dark rich red/green mix or just specific colors. 
  // Let's stick to a safe palette that works in light/dark mode, but specific to the holiday.
  // Actually, let's just define the key brand colors.
  text: '#FFFFFF',
  accent: '#BB2528',
};

const NewYearColors = {
  primary: '#FF0000', // Bright Red
  secondary: '#FFD700', // Gold
  background: '#8B0000', // Dark Red
  text: '#FFD700', // Gold Text
  accent: '#FFA500',
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
