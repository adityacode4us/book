import React, { useState } from 'react';
import { BookPage, LayoutCandidate } from '../types/book';
import { Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Props {
  pages: BookPage[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
}

export const Filmstrip: React.FC<Props> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
}) => {
  const [jumpPage, setJumpPage] = useState<string>('');
  const stripRef = React.useRef<HTMLDivElement>(null);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpPage, 10);
    if (!isNaN(num) && num >= 1 && num <= pages.length) {
      onSelectPage(pages[num - 1].id);
      setJumpPage('');
    }
  };

  const scrollStrip = (direction: 'left' | 'right') => {
    if (stripRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      stripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-28 bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center shrink-0 space-x-3 select-none">
      {/* Controls cluster: Add Page + Jump */}
      <div className="flex items-center space-x-2 shrink-0 border-r border-slate-800 pr-3">
        <button
          onClick={onAddPage}
          className="h-20 w-16 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-indigo-400 flex flex-col items-center justify-center space-y-1 transition group"
          title="Append new blank page"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition" />
          <span className="text-[9px] font-bold">Add Page</span>
        </button>

        {pages.length > 8 && (
          <form onSubmit={handleJump} className="flex flex-col space-y-1">
            <span className="text-[9px] font-mono text-slate-400">Jump ({pages.length})</span>
            <input
              type="number"
              min={1}
              max={pages.length}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Pg #"
              className="w-16 px-1.5 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </form>
        )}
      </div>

      {/* Scroll Left Button */}
      {pages.length > 5 && (
        <button
          onClick={() => scrollStrip('left')}
          className="p-1.5 text-slate-500 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg shrink-0 transition"
          title="Scroll Left"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}

      {/* Pages Horizontal Strip */}
      <div
        ref={stripRef}
        className="flex-1 flex items-center overflow-x-auto space-x-3 h-full scroll-smooth py-1"
      >
        {pages.map((p, idx) => {
          const isActive = p.id === activePageId;
          const isCompleted = p.status === 'completed';
          const isGenerated = p.status === 'layouts_generated';
          const selectedCandidate = p.candidateLayouts.find((c: LayoutCandidate) => c.id === p.selectedLayoutId);

          return (
            <div
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              className={`h-20 w-28 rounded-xl p-2 cursor-pointer shrink-0 border transition flex flex-col justify-between relative group ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              {/* Top row: Page number & Status */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  P.{idx + 1}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isGenerated ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Middle: Content summary or archetype */}
              <div className="my-auto">
                <p className="text-[9px] font-medium text-slate-400 truncate">
                  {selectedCandidate ? selectedCandidate.archetype : p.rawText.slice(0, 18) || 'Empty Page'}
                </p>
                {p.images.length > 0 && (
                  <span className="text-[8px] text-indigo-400 font-mono">
                    {p.images.length} {p.images.length === 1 ? 'image' : 'images'}
                  </span>
                )}
              </div>

              {/* Bottom: status tag */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    isCompleted
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : isGenerated
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? 'Typeset' : isGenerated ? '2 Choices' : 'Draft'}
                </span>

                {/* Delete button (only show on hover if more than 1 page exists) */}
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(p.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition"
                    title="Delete page"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {pages.length > 5 && (
        <button
          onClick={() => scrollStrip('right')}
          className="p-1.5 text-slate-500 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg shrink-0 transition"
          title="Scroll Right"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
