import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      console.log('ThemeProvider: Loaded saved theme:', saved);
      return saved ? JSON.parse(saved) : true;
    } catch (err) {
      console.error('ThemeProvider: Error loading theme:', err);
      return true;
    }
  });

  useEffect(() => {
    console.log('ThemeProvider: Theme changed to:', isDark);
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => {
    console.log('ThemeProvider: Toggling theme');
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme: Must be used within ThemeProvider');
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
