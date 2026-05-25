import { useState, useEffect } from 'react';

/**
 * Shared theme hook — reads from / writes to localStorage.
 * Sets data-theme attribute on <html> so all CSS vars react automatically.
 */
export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('darvo-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('darvo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
