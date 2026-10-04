import React, { useState } from 'react';
import { BookMetadata, BookPage, PageImage } from '../../types/book';
import { generateHeuristicLayouts } from '../../services/ai/heuristicMockEngine';
import { savePageToDB } from '../../services/storage/db';
import { SAMPLE_IMAGES } from '../../utils/sampleData';
import { Gauge, Zap, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  book: BookMetadata;
  currentPageCount: number;
  onBulkComplete: (newPages: BookPage[]) => void;
}

export const BulkGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  book,
  currentPageCount,
  onBulkComplete,
}) => {
  const [targetCount, setTargetCount] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartBulk = async () => {
    setIsGenerating(true);
    setProgress(0);

    const generated: BookPage[] = [];
    const sampleTopics = [
      'Digital Transformation and Enterprise Efficiency',
      'Autonomous Systems in Modern Infrastructure',
      'Quantitative Marketing Metrics and Growth Velocity',
      'Cognitive Computing in Creative Operations',
      'Scalable Publication Systems for Content Teams',
      'Sustainable Architecture and Urban Typologies',
    ];

    const startTime = performance.now();

    for (let i = 0; i < targetCount; i++) {
      const pageNum = currentPageCount + i + 1;
      const topic = sampleTopics[i % sampleTopics.length];
      const text = `# ${topic} — Chapter ${pageNum}
Strategic execution demands alignment across multidisciplinary teams. In this volume, we examine foundational principles shaping the modern enterprise landscape.

- High performance computational pipelines reduce operational friction by 64%.
- Cross-functional synthesis bridges narrative strategy with visual publication design.
- Continuous delivery workflows empower marketing departments to publish at scale.

"Automation is not the replacement of creativity; it is the amplification of editorial expression."`;

      // Select image conditionally
      const images: PageImage[] = (i % 2 === 0) ? [SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]] : [];

      const [optA, optB] = generateHeuristicLayouts(
        pageNum,
        { text, images },
        book
      );

      const newPage: BookPage = {
        id: `bulk-page-${Date.now()}-${pageNum}`,
        bookId: book.id,
        pageNumber: pageNum,
        rawText: text,
        images,
        candidateLayouts: [optA, optB],
        selectedLayoutId: (i % 2 === 0) ? optA.id : optB.id,
        status: 'completed',
        updatedAt: Date.now(),
      };

      await savePageToDB(newPage);
      generated.push(newPage);

      // Yield event loop every 20 pages so UI stays responsive
      if (i % 20 === 0 || i === targetCount - 1) {
        setProgress(Math.round(((i + 1) / targetCount) * 100));
        await new Promise((res) => setTimeout(res, 10));
      }
    }

    const elapsed = Math.round(performance.now() - startTime);
    console.log(`Generated and indexed ${targetCount} pages in ${elapsed}ms`);

    setIsGenerating(false);
    onBulkComplete(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">500-Page Scale Generator</h2>
              <p className="text-xs text-slate-400">Stress test IndexedDB & virtualized rendering</p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            The PRD requires handling large, content-heavy marketing documents up to <strong>500 pages</strong>. 
            Use this tool to synthesize realistic pages with layout options and images stored in IndexedDB.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Batch Volume to Generate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setTargetCount(num)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    targetCount === num
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  +{num} Pages
                </button>
              ))}
            </div>
          </div>

          {isGenerating ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2 text-indigo-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing & indexing pages...</span>
                </span>
                <span className="font-mono text-slate-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-500 h-2 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center space-x-3 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Pages are processed in $O(1)$ memory chunks and safely committed to client-side IndexedDB.
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleStartBulk}
            className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-amber-600/20 transition disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Generate {targetCount} Pages</span>
          </button>
        </div>
      </div>
    </div>
  );
};
