import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const migrated = localStorage.getItem('dcs_theme_day_default_v1');
    if (!migrated) {
      localStorage.setItem('dcs_theme_day_default_v1', 'true');
      localStorage.setItem('dcs_blog_theme', 'light');
      return 'light';
    }
    return localStorage.getItem('dcs_blog_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dcs_blog_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
