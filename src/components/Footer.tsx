import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-card mt-12 px-4 pt-6 pb-3 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1 mb-2">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>by</span>
          <a
            href="https://github.com/eosdev-x"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            eosdev
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <a
            href="/terms"
            className="hover:text-gray-300 transition-colors"
          >
            Terms
          </a>
          <a
            href="/privacy"
            className="hover:text-gray-300 transition-colors"
          >
            Privacy
          </a>
          <span> {new Date().getFullYear()} Atomlaunch</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
