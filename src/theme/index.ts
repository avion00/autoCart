// ============================================
// AutoCart - Theme System
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from './colors';
import { spacing, borderRadius, iconSize, hitSlop } from './spacing';
import { typography, fontSize, fontWeight, lineHeight, fontFamily } from './typography';

// Theme interface
export interface Theme {
  colors: ColorScheme;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSize: typeof iconSize;
  hitSlop: typeof hitSlop;
  typography: typeof typography;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  fontFamily: typeof fontFamily;
  isDark: boolean;
}

// Create themes
const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  spacing,
  borderRadius,
  iconSize,
  hitSlop,
  typography,
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
  isDark,
});

export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

// Theme context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(!isDark);
  const setTheme = (dark: boolean) => setIsDark(dark);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, isDark, toggleTheme, setTheme } },
    children
  );
};

// Hook to use theme
export const useTheme = (): Theme => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

// Hook to use theme context
export const useThemeContext = (): ThemeContextType => {
  return useContext(ThemeContext);
};

// Re-export everything
export * from './colors';
export * from './spacing';
export * from './typography';
