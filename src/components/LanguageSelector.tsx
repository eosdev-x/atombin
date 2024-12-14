import React from 'react';
import { languages } from '../constants/languages';

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
  theme: 'vs-dark' | 'light';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="language-select"
        className="font-medium text-gray-300"
      >
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
          outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;