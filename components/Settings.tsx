import React, { useState, useEffect } from 'react';
import { X, Key, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface SettingsProps {
  language: Language;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ language, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasEnvFallback, setHasEnvFallback] = useState(false);

  useEffect(() => {
    // Load existing API key from localStorage
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) {
      setApiKey(storedKey);
    }

    // Check if there's an env fallback
    const envKey = (process.env as any).API_KEY || (process.env as any).GEMINI_API_KEY;
    setHasEnvFallback(!!envKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
  };

  const t = language === 'ZH' ? {
    title: '设置',
    apiKeyLabel: 'Gemini API 密钥',
    apiKeyPlaceholder: '输入您的 Gemini API 密钥',
    apiKeyHelp: '您的 API 密钥仅存储在浏览器本地，不会上传到任何服务器。',
    apiKeyHelpWithFallback: '您的 API 密钥将覆盖默认密钥。留空则使用默认密钥。',
    getApiKey: '获取 API 密钥',
    getApiKeyUrl: 'https://aistudio.google.com/apikey',
    save: '保存',
    clear: '清除',
    saved: '已保存！',
    close: '关闭',
    usingFallback: '当前使用默认 API 密钥'
  } : {
    title: 'Settings',
    apiKeyLabel: 'Gemini API Key',
    apiKeyPlaceholder: 'Enter your Gemini API key',
    apiKeyHelp: 'Your API key is stored locally in your browser and never sent to any server.',
    apiKeyHelpWithFallback: 'Your API key will override the default key. Leave empty to use the default.',
    getApiKey: 'Get API Key',
    getApiKeyUrl: 'https://aistudio.google.com/apikey',
    save: 'Save',
    clear: 'Clear',
    saved: 'Saved!',
    close: 'Close',
    usingFallback: 'Currently using default API key'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Key size={24} className="text-blue-600" />
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.apiKeyLabel}
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {hasEnvFallback ? t.apiKeyHelpWithFallback : t.apiKeyHelp}
            </p>
            {hasEnvFallback && !apiKey && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                ✓ {t.usingFallback}
              </p>
            )}
            <a
              href={t.getApiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={14} />
              {t.getApiKey}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <Save size={18} />
              {saved ? t.saved : t.save}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-colors"
            >
              {t.clear}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
