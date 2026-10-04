import React, { useState, useRef } from 'react';
import { BookMetadata, BookPage, PageImage, AISettings } from '../types/book';
import { PageRenderer } from './layouts/PageRenderer';
import { generatePageLayouts } from '../services/ai/layoutService';
import { storeImageFile } from '../services/storage/db';
import { Sparkles, Upload, Image as ImageIcon, X, Check, ArrowRight, Wand2, RefreshCw, AlertCircle, FileText } from 'lucide-react';

interface Props {
  page: BookPage;
  book: BookMetadata;
  aiSettings: AISettings;
  onPageUpdate: (updatedPage: BookPage) => void;
  onNextPage: () => void;
  onAddPage: () => void;
  totalPageCount: number;
}

export const PageStudio: React.FC<Props> = ({
  page,
  book,
  aiSettings,
  onPageUpdate,
  onNextPage,
  onAddPage,
  totalPageCount,
}) => {
  const [text, setText] = useState(page.rawText || '');
  const [images, setImages] = useState<PageImage[]>(page.images || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if active page changes
  React.useEffect(() => {
    setText(page.rawText || '');
    setImages(page.images || []);
    setNotification(null);
  }, [page.id]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: PageImage[] = [...images];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const storedImage = await storeImageFile(file);
        newImages.push(storedImage);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }
    setImages(newImages);
    onPageUpdate({
      ...page,
      images: newImages,
      updatedAt: Date.now(),
    });
  };

  const handleRemoveImage = (imgId: string) => {
    const updated = images.filter((img) => img.id !== imgId);
    setImages(updated);
    onPageUpdate({
      ...page,
      images: updated,
      updatedAt: Date.now(),
    });
  };

  // Generate 2 Layout Candidates
  const handleGenerateLayouts = async () => {
    if (!text.trim() && images.length === 0) {
      setNotification('Please enter text or upload an image for this page.');
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const result = await generatePageLayouts(
        page.pageNumber,
        { text, images },
        book,
        aiSettings
      );

      const [candidateA, candidateB] = result.layouts;
      const updatedPage: BookPage = {
        ...page,
        rawText: text,
        images,
        candidateLayouts: [candidateA, candidateB],
        selectedLayoutId: candidateA.id, // default to A until user selects
        status: 'layouts_generated',
        updatedAt: Date.now(),
      };

      onPageUpdate(updatedPage);

      if (result.fallbackMessage) {
        setNotification(result.fallbackMessage);
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setNotification(`Generation issue: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectLayout = (layoutId: string) => {
    const updatedPage: BookPage = {
      ...page,
      selectedLayoutId: layoutId,
      status: 'completed',
      updatedAt: Date.now(),
    };
    onPageUpdate(updatedPage);
  };

  const candidateA = page.candidateLayouts[0];
  const candidateB = page.candidateLayouts[1];

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT: Content Input Studio */}
      <div className="w-full lg:w-96 xl:w-[420px] bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                Studio Workspace
              </span>
              <h2 className="text-base font-bold text-white">Page {page.pageNumber} of {totalPageCount}</h2>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                page.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : page.status === 'layouts_generated'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {page.status === 'completed' ? 'Typeset Confirmed' : page.status === 'layouts_generated' ? 'Select Option' : 'Drafting'}
            </span>
          </div>

          {/* Text Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Page Text Content</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {text.trim() ? `${text.trim().split(/\s+/).length} words` : 'Empty'}
              </span>
            </div>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                onPageUpdate({ ...page, rawText: e.target.value, updatedAt: Date.now() });
              }}
              placeholder={`# Your Page Headline\n\nEnter the narrative copy for this page. The AI will automatically structure headlines, subheadings, pull quotes, and body paragraphs according to editorial design rules.`}
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition leading-relaxed resize-none font-mono"
            />
          </div>

          {/* Image Uploader */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Visual Assets & Photos</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">{images.length} added</span>
            </div>

            {/* Dropzone trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950 p-4 rounded-xl text-center cursor-pointer transition group"
            >
              <Upload className="w-6 h-6 mx-auto mb-1 text-slate-500 group-hover:text-indigo-400 transition" />
              <p className="text-xs font-medium text-slate-300">Click to upload photos or charts</p>
              <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG, WebP supported</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded image badges */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-800 h-16 bg-slate-950">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(img.id);
                      }}
                      className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notification && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {/* Generate / Action Button */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur space-y-3">
          <button
            onClick={handleGenerateLayouts}
            disabled={isGenerating}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Art Director AI Synthesizing Layouts...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  {page.candidateLayouts.length > 0 ? 'Regenerate 2 Layout Options' : 'Generate 2 Layout Options'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Side-by-Side Layout Comparison Canvas */}
      <div className="flex-1 bg-slate-950 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
        {page.candidateLayouts.length === 0 ? (
          /* Empty / Un-generated State */
          <div className="my-auto max-w-lg mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Typesetting Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your copy and optional photos in the left panel, then trigger the AI engine to generate 
              <strong> 2 bespoke layout choices</strong> customized for this content.
            </p>
            <button
              onClick={handleGenerateLayouts}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
            >
              Generate Layout Options for Page {page.pageNumber}
            </button>
          </div>
        ) : (
          /* Two Layout Candidates Comparison */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Layout Evaluation
                </span>
                <h3 className="text-base font-bold text-white">Compare Layout Options for Page {page.pageNumber}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {page.selectedLayoutId && (
                  <button
                    onClick={onNextPage}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition"
                  >
                    <span>Proceed to Next Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Side by Side Option A & Option B */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              {/* Candidate A Card */}
              {candidateA && (
                <div
                  className={`rounded-2xl border p-5 space-y-4 transition flex flex-col justify-between ${
                    page.selectedLayoutId === candidateA.id
                      ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                        {candidateA.name}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{candidateA.rationale}</p>
                    </div>
                    <button
                      onClick={() => handleSelectLayout(candidateA.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                        page.selectedLayoutId === candidateA.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {page.selectedLayoutId === candidateA.id && <Check className="w-3.5 h-3.5" />}
                      <span>{page.selectedLayoutId === candidateA.id ? 'Selected' : 'Select Option A'}</span>
                    </button>
                  </div>

                  {/* Rendered Live Page Preview */}
                  <div className="w-full bg-slate-950 p-2 rounded-xl flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <PageRenderer
                        candidate={candidateA}
                        images={images}
                        theme={book.theme}
                        pageNumber={page.pageNumber}
                        aspectRatio={book.aspectRatio}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Candidate B Card */}
              {candidateB && (
                <div
                  className={`rounded-2xl border p-5 space-y-4 transition flex flex-col justify-between ${
                    page.selectedLayoutId === candidateB.id
                      ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                        {candidateB.name}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{candidateB.rationale}</p>
                    </div>
                    <button
                      onClick={() => handleSelectLayout(candidateB.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                        page.selectedLayoutId === candidateB.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {page.selectedLayoutId === candidateB.id && <Check className="w-3.5 h-3.5" />}
                      <span>{page.selectedLayoutId === candidateB.id ? 'Selected' : 'Select Option B'}</span>
                    </button>
                  </div>

                  {/* Rendered Live Page Preview */}
                  <div className="w-full bg-slate-950 p-2 rounded-xl flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <PageRenderer
                        candidate={candidateB}
                        images={images}
                        theme={book.theme}
                        pageNumber={page.pageNumber}
                        aspectRatio={book.aspectRatio}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
