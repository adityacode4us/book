import React, { useRef } from 'react';
import { BookMetadata, AISettings } from '../types/book';
import { BookOpen, Settings, Sliders, Eye, Gauge, Sparkles, FolderDown, FolderUp } from 'lucide-react';

interface Props {
  book: BookMetadata;
  aiSettings: AISettings;
  pageCount: number;
  completedPageCount: number;
  onOpenBookSetup: () => void;
  onOpenAISettings: () => void;
  onOpenBulkModal: () => void;
  onOpenReader: () => void;
  onLoadSample: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

export const Navbar: React.FC<Props> = ({
  book,
  aiSettings,
  pageCount,
  completedPageCount,
  onOpenBookSetup,
  onOpenAISettings,
  onOpenBulkModal,
  onOpenReader,
  onLoadSample,
  onExportJSON,
  onImportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  return (
    <header className="no-print h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between shrink-0 select-none">
      {/* Brand & Active Book Info */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">PageCraft</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                AI MVP
              </span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Book Title with Click-to-Edit */}
        <div
          onClick={onOpenBookSetup}
          className="cursor-pointer group flex items-center space-x-2 hover:bg-slate-800/60 px-3 py-1.5 rounded-xl transition"
          title="Click to edit book context and theme"
        >
          <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                {book.title}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {book.theme}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate max-w-xs">
              {completedPageCount} of {pageCount} pages compiled
            </p>
          </div>
          <Sliders className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition ml-1" />
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center space-x-2.5">
        {/* AI Provider Indicator */}
        <button
          onClick={onOpenAISettings}
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition"
          title="Configure AI engine and API keys"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              aiSettings.provider === 'mock'
                ? 'bg-amber-400'
                : aiSettings.apiKey
                ? 'bg-emerald-400'
                : 'bg-rose-400'
            }`}
          />
          <span className="capitalize">{aiSettings.provider} Engine</span>
          <Settings className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Quick Sample / Bulk Actions */}
        <button
          onClick={onLoadSample}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs font-medium text-slate-300 hover:text-white transition"
          title="Load 3 sample pages with images"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Load Sample</span>
        </button>

        <button
          onClick={onOpenBulkModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition"
          title="Stress test handling up to 500 pages"
        >
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">500-Page Test</span>
        </button>

        {/* Import JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Import Book Draft (.json)"
        >
          <FolderUp className="w-4 h-4" />
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportJSON}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Export Book Draft (.json)"
        >
          <FolderDown className="w-4 h-4" />
        </button>

        {/* Preview Complete Book Draft */}
        <button
          onClick={onOpenReader}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Book Draft</span>
        </button>
      </div>
    </header>
  );
};
