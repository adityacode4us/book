import React, { useState } from 'react';
import { AISettings } from '../../types/book';
import { Bot, Key, Check, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onSave }) => {
  const [provider, setProvider] = useState<AISettings['provider']>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || (provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Typesetting Engine Settings</h2>
              <p className="text-xs text-slate-400">Configure real LLM providers or use the offline heuristic engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Engine Provider
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setProvider('mock')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                provider === 'mock'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Cpu className="w-5 h-5 mb-2 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-slate-100">Built-in Mock</p>
                <p className="text-[10px] text-slate-400">Deterministic / Offline</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                provider === 'gemini'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Bot className="w-5 h-5 mb-2 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-slate-100">Google Gemini</p>
                <p className="text-[10px] text-slate-400">Flash 2.0 / 1.5</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                provider === 'openai'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Bot className="w-5 h-5 mb-2 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-100">OpenAI</p>
                <p className="text-[10px] text-slate-400">GPT-4o mini</p>
              </div>
            </button>
          </div>
        </div>

        {/* API Key Input if Gemini / OpenAI */}
        {provider !== 'mock' ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}</span>
                </span>
                <span className="text-[10px] text-slate-500">Stored locally in your browser</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Model Name (Optional)</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini'}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Zero Configuration Required</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The Built-in Heuristic Engine analyzes text density, headlines, and images deterministically to output two divergent layout options instantly without any external network dependency.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
