import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Moon, Sun, Copy, Check, Zap, Users, Clock } from 'lucide-react';
import { languages } from './constants/languages';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import StatsCard from './components/StatsCard';
import ShareButton from './components/ShareButton';
import ExpiryBadge from './components/ExpiryBadge';
import Header from './components/Header';
import Footer from './components/Footer';
import { getPasteById } from './utils/storage';

function App() {
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [pasteData, setPasteData] = useState<{ id: string; expiresAt: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaste = async () => {
      try {
        // Check if we're viewing a shared paste
        const match = window.location.pathname.match(/^\/paste\/([a-zA-Z0-9-_]+)$/);
        if (match) {
          console.log('Found paste ID in URL:', match[1]);
          const pasteId = match[1];
          const paste = await getPasteById(pasteId);
          console.log('Loaded paste:', paste);
          if (paste) {
            setCode(paste.content);
            setLanguage(paste.language);
            setPasteData({ id: paste.id, expiresAt: paste.expiresAt });
          }
        }
      } catch (error) {
        console.error('Error loading paste:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPaste();
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    console.log('Editor value:', value);
    setCode(value || '');
  }, []);

  const handleShare = useCallback(() => {
    console.log('Current code value:', code);
  }, [code]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center">
      <div className="text-gray-400">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="grid-pattern" />
      <Header />
      <main className="container mx-auto px-4 flex-1">
        <div className="glass-card p-4 rounded-lg">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mt-8 mb-4">
              Share Code Snippets With Atomic Precision
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Share your code snippets with powerful syntax highlighting. Our intelligent
              engine helps optimize your code blocks with detailed analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
              value="164"
              label="Snippets Created"
            />
            <StatsCard
              icon={<Users className="w-6 h-6 text-blue-400" />}
              value="13"
              label="Active Users"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-purple-400" />}
              value="24hr"
              label="Paste Lifetime"
            />
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <LanguageSelector
                  language={language}
                  setLanguage={setLanguage}
                  theme={theme}
                />
                {pasteData && (
                  <ExpiryBadge expiresAt={pasteData.expiresAt} />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <ShareButton code={code} language={language} onShare={handleShare} />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors duration-200"
                  aria-label="Copy code to clipboard"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <Editor
              height="70vh"
              defaultLanguage="javascript"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={(editor) => {
                console.log('Editor mounted, initial value:', editor.getValue());
                setCode(editor.getValue() || '');
              }}
              theme={theme}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: { top: 16, bottom: 16 },
                automaticLayout: true,
                renderWhitespace: 'selection',
                suggest: {
                  showWords: false
                },
                quickSuggestions: false,
                parameterHints: {
                  enabled: false
                },
                codeLens: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
              }}
              className="w-full"
              loading={<div className="p-4 text-gray-400">Loading editor...</div>}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;