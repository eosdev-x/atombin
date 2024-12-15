import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-card mt-auto px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-1 mb-2 sm:mb-0">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>by</span>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Your Name
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
          <span>© {new Date().getFullYear()} AtomBin</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
