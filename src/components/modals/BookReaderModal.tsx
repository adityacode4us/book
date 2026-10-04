import React, { useState } from 'react';
import { BookMetadata, BookPage } from '../../types/book';
import { PageRenderer } from '../layouts/PageRenderer';
import { Printer, X, ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  book: BookMetadata;
  pages: BookPage[];
}

export const BookReaderModal: React.FC<Props> = ({ isOpen, onClose, book, pages }) => {
  const [viewMode, setViewMode] = useState<'continuous' | 'single'>('continuous');
  const [activePageIndex, setActivePageIndex] = useState(0);

  if (!isOpen) return null;

  const validPages = pages.filter((p) => p.candidateLayouts.length > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Reader Controls Bar */}
      <div className="no-print h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide text-white">{book.title}</span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400 font-mono">
            {validPages.length} Pages Compiled
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('continuous')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'continuous' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Continuous
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Page
            </button>
          </div>

          {/* Print PDF Trigger */}
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print to PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Reader Stage */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center bg-slate-950">
        {validPages.length === 0 ? (
          <div className="my-auto text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Draft Pages Compiled Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Input content and select layout options for your pages in the studio to preview the assembled book draft.
            </p>
          </div>
        ) : viewMode === 'continuous' ? (
          /* Continuous Scroll Document View */
          <div className="w-full max-w-3xl space-y-12 pb-16">
            {validPages.map((page, idx) => {
              const selectedLayout =
                page.candidateLayouts.find((c) => c.id === page.selectedLayoutId) ||
                page.candidateLayouts[0];

              return (
                <div key={page.id} className="relative group">
                  <div className="no-print absolute -top-4 right-0 text-[11px] font-mono text-slate-400">
                    Page {idx + 1} ({selectedLayout.archetype})
                  </div>
                  <PageRenderer
                    candidate={selectedLayout}
                    images={page.images}
                    theme={book.theme}
                    pageNumber={idx + 1}
                    aspectRatio={book.aspectRatio}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Page Presentation View */
          <div className="w-full max-w-2xl my-auto flex flex-col items-center space-y-6">
            {(() => {
              const currentPage = validPages[activePageIndex];
              const selectedLayout =
                currentPage.candidateLayouts.find((c) => c.id === currentPage.selectedLayoutId) ||
                currentPage.candidateLayouts[0];

              return (
                <>
                  <div className="w-full">
                    <PageRenderer
                      candidate={selectedLayout}
                      images={currentPage.images}
                      theme={book.theme}
                      pageNumber={activePageIndex + 1}
                      aspectRatio={book.aspectRatio}
                    />
                  </div>

                  <div className="no-print flex items-center justify-between w-full max-w-sm pt-4">
                    <button
                      disabled={activePageIndex === 0}
                      onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <span className="text-xs font-mono text-slate-400">
                      {activePageIndex + 1} / {validPages.length}
                    </span>

                    <button
                      disabled={activePageIndex === validPages.length - 1}
                      onClick={() => setActivePageIndex((prev) => Math.min(validPages.length - 1, prev + 1))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
