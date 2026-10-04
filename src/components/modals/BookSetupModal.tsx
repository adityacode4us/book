import React, { useState } from 'react';
import { BookMetadata, ThemeType, AspectRatioType } from '../../types/book';
import { BookOpen, Sparkles, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  book: BookMetadata;
  onSave: (updated: BookMetadata) => void;
}

export const BookSetupModal: React.FC<Props> = ({ isOpen, onClose, book, onSave }) => {
  const [title, setTitle] = useState(book.title);
  const [subtitle, setSubtitle] = useState(book.subtitle || '');
  const [objective, setObjective] = useState(book.objective || '');
  const [theme, setTheme] = useState<ThemeType>(book.theme);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(book.aspectRatio);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...book,
      title: title.trim() || 'Untitled Publication',
      subtitle: subtitle.trim(),
      objective: objective.trim(),
      theme,
      aspectRatio,
      updatedAt: Date.now(),
    });
    onClose();
  };

  const themes: { id: ThemeType; label: string; desc: string; sample: string }[] = [
    { id: 'modern', label: 'Modern Digital', desc: 'Crisp sans-serif, cool slate, indigo accents', sample: 'bg-indigo-600' },
    { id: 'editorial', label: 'Editorial Magazine', desc: 'Classic Newsreader serif, warm cream, amber warmth', sample: 'bg-amber-700' },
    { id: 'corporate', label: 'Enterprise Report', desc: 'Structured navy, high legibility, clean borders', sample: 'bg-blue-800' },
    { id: 'vibrant', label: 'Vibrant Creative', desc: 'Dynamic gradients, bold violet highlights', sample: 'bg-violet-600' },
    { id: 'minimal', label: 'Monochrome Minimal', desc: 'Strict black & white, ample whitespace, high contrast', sample: 'bg-zinc-900' },
    { id: 'classic', label: 'Classic Literary', desc: 'Timeless roman type with elegant drop caps', sample: 'bg-rose-900' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Book Context & Art Direction</h2>
              <p className="text-xs text-slate-400">Establish the global narrative tone and typographic aesthetics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Strategic Horizons Playbook"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Subtitle / Tagline (Optional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. A Blueprint for Autonomous Enterprise Operations"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Objective / Target Audience</label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. High-impact visual briefing for C-suite executives and marketing leaders"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Art Direction & Visual Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                    theme === t.id
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-md'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${t.sample}`} />
                  <div>
                    <p className="text-xs font-bold text-white">{t.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300">Page Dimension & Orientation</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('a4-portrait')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition ${
                  aspectRatio === 'a4-portrait'
                    ? 'border-indigo-500 bg-indigo-950/50 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                A4 Portrait (Standard)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('a4-landscape')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition ${
                  aspectRatio === 'a4-landscape'
                    ? 'border-indigo-500 bg-indigo-950/50 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                A4 Landscape (Keynote)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition ${
                  aspectRatio === 'square'
                    ? 'border-indigo-500 bg-indigo-950/50 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                Square (Lookbook)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <Check className="w-4 h-4" />
              <span>Apply Book Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
