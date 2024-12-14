import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'vs-dark' | 'light';
  setTheme: (theme: 'vs-dark' | 'light') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  return (
    <button
      onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 
        transition-colors duration-200"
      aria-label={`Switch to ${theme === 'vs-dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'vs-dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;