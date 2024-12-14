import React, { useState, useCallback } from 'react';
import { Share2, Check, AlertCircle } from 'lucide-react';
import { createPaste } from '../utils/storage';

interface ShareButtonProps {
  code: string | undefined;
  language: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ code, language }) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleShare = useCallback(async () => {
    if (!code || !code.trim()) {
      setStatus('error');
      return;
    }

    try {
      const paste = await createPaste(code, language);
      const shareUrl = `${window.location.origin}/paste/${paste.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Error sharing paste:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }, [code, language]);

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        status === 'error'
          ? 'bg-red-500/20 text-red-300'
          : status === 'success'
          ? 'bg-green-500/20 text-green-300'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
      }`}
      aria-label="Share code snippet"
    >
      {status === 'success' ? (
        <>
          <Check size={18} />
          Link Copied!
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle size={18} />
          Empty Code
        </>
      ) : (
        <>
          <Share2 size={18} />
          Share
        </>
      )}
    </button>
  );
};

export default ShareButton;