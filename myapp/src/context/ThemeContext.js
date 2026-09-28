import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightPalette = {
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1A1A',
  subText: '#666666',
  primary: '#FF6B6B',
  border: '#E0E0E0',
};

const darkPalette = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subText: '#AAAAAA',
  primary: '#FF8787',
  border: '#2C2C2C',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);
  const theme = isDark ? darkPalette : lightPalette;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};