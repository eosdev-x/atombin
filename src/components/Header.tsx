import React from 'react';
import { Code2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass-card sticky top-0 z-50 px-4 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            AtomBin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
