import React, { useState, useEffect } from 'react';
import { BookMetadata, BookPage, AISettings } from './types/book';
import {
  db,
  saveBookToDB,
  loadBookFromDB,
  loadPagesFromDB,
  savePageToDB,
  deletePageFromDB,
  exportBookAsJSON,
  importBookFromJSON,
} from './services/storage/db';
import { createDefaultBook, INITIAL_SAMPLE_TEXTS, SAMPLE_IMAGES } from './utils/sampleData';
import { generateHeuristicLayouts } from './services/ai/heuristicMockEngine';
import { Navbar } from './components/Navbar';
import { PageStudio } from './components/PageStudio';
import { Filmstrip } from './components/Filmstrip';
import { BookSetupModal } from './components/modals/BookSetupModal';
import { AISettingsModal } from './components/modals/AISettingsModal';
import { BulkGeneratorModal } from './components/modals/BulkGeneratorModal';
import { BookReaderModal } from './components/modals/BookReaderModal';

export default function App() {
  const [book, setBook] = useState<BookMetadata>(createDefaultBook());
  const [pages, setPages] = useState<BookPage[]>([]);
  const [activePageId, setActivePageId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isBookSetupOpen, setIsBookSetupOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // AI Settings state (stored in localStorage)
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('pagecraft_ai_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      provider: 'mock',
      apiKey: '',
      model: 'gemini-2.0-flash',
    };
  });

  // Initial Load from IndexedDB
  useEffect(() => {
    async function initialize() {
      try {
        const storedBooks = await db.books.toArray();
        let currentBook: BookMetadata;

        if (storedBooks.length > 0) {
          currentBook = storedBooks[0];
        } else {
          currentBook = createDefaultBook();
          await saveBookToDB(currentBook);
        }
        setBook(currentBook);

        const storedPages = await loadPagesFromDB(currentBook.id);
        if (storedPages.length > 0) {
          setPages(storedPages);
          setActivePageId(storedPages[0].id);
        } else {
          // Create initial starter page
          const initialPage: BookPage = {
            id: `page-${Date.now()}-1`,
            bookId: currentBook.id,
            pageNumber: 1,
            rawText: INITIAL_SAMPLE_TEXTS[0],
            images: [SAMPLE_IMAGES[0]],
            candidateLayouts: [],
            status: 'draft',
            updatedAt: Date.now(),
          };
          await savePageToDB(initialPage);
          setPages([initialPage]);
          setActivePageId(initialPage.id);
        }
      } catch (err) {
        console.error('Failed to initialize database:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  // Save AI Settings
  const handleSaveAISettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    localStorage.setItem('pagecraft_ai_settings', JSON.stringify(newSettings));
  };

  // Save Book Settings
  const handleSaveBookSettings = async (updatedBook: BookMetadata) => {
    setBook(updatedBook);
    await saveBookToDB(updatedBook);
  };

  // Update Page
  const handlePageUpdate = async (updatedPage: BookPage) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
    await savePageToDB(updatedPage);
  };

  // Add Page
  const handleAddPage = async () => {
    const newPageNum = pages.length + 1;
    const newPage: BookPage = {
      id: `page-${Date.now()}-${newPageNum}`,
      bookId: book.id,
      pageNumber: newPageNum,
      rawText: '',
      images: [],
      candidateLayouts: [],
      status: 'draft',
      updatedAt: Date.now(),
    };
    await savePageToDB(newPage);
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  // Delete Page
  const handleDeletePage = async (pageId: string) => {
    if (pages.length <= 1) return;
    await deletePageFromDB(pageId);
    const updated = pages.filter((p) => p.id !== pageId);
    // Re-index page numbers
    const reindexed = updated.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    for (const p of reindexed) {
      await savePageToDB(p);
    }
    setPages(reindexed);
    if (activePageId === pageId) {
      setActivePageId(reindexed[0].id);
    }
  };

  // Next Page Handler
  const handleNextPage = async () => {
    const currentIndex = pages.findIndex((p) => p.id === activePageId);
    if (currentIndex >= 0 && currentIndex < pages.length - 1) {
      setActivePageId(pages[currentIndex + 1].id);
    } else {
      await handleAddPage();
    }
  };

  // Load 3 Sample Pages
  const handleLoadSample = async () => {
    const samplePages: BookPage[] = [];
    for (let i = 0; i < 3; i++) {
      const pageNum = i + 1;
      const text = INITIAL_SAMPLE_TEXTS[i % INITIAL_SAMPLE_TEXTS.length];
      const images = [SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]];
      const [optA, optB] = generateHeuristicLayouts(pageNum, { text, images }, book);

      const p: BookPage = {
        id: `sample-page-${i}-${Date.now()}`,
        bookId: book.id,
        pageNumber: pageNum,
        rawText: text,
        images,
        candidateLayouts: [optA, optB],
        selectedLayoutId: optA.id,
        status: 'completed',
        updatedAt: Date.now(),
      };
      await savePageToDB(p);
      samplePages.push(p);
    }
    setPages(samplePages);
    setActivePageId(samplePages[0].id);
  };

  // Export JSON
  const handleExportJSON = async () => {
    const jsonStr = await exportBookAsJSON(book.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.toLowerCase().replace(/\s+/g, '-')}-draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = async (file: File) => {
    try {
      const text = await file.text();
      const result = await importBookFromJSON(text);
      setBook(result.book);
      setPages(result.pages);
      if (result.pages.length > 0) {
        setActivePageId(result.pages[0].id);
      }
    } catch (err: any) {
      alert(`Failed to import book draft: ${err.message || 'Invalid JSON file'}`);
    }
  };

  // Active page instance
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const completedPageCount = pages.filter((p) => p.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-sm">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>Mounting IndexedDB Publication Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        book={book}
        aiSettings={aiSettings}
        pageCount={pages.length}
        completedPageCount={completedPageCount}
        onOpenBookSetup={() => setIsBookSetupOpen(true)}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onLoadSample={handleLoadSample}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Main Studio View */}
      {activePage && (
        <PageStudio
          page={activePage}
          book={book}
          aiSettings={aiSettings}
          onPageUpdate={handlePageUpdate}
          onNextPage={handleNextPage}
          onAddPage={handleAddPage}
          totalPageCount={pages.length}
        />
      )}

      {/* Bottom Filmstrip Navigation */}
      <Filmstrip
        pages={pages}
        activePageId={activePageId}
        onSelectPage={(id) => setActivePageId(id)}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
      />

      {/* Modals */}
      <BookSetupModal
        isOpen={isBookSetupOpen}
        onClose={() => setIsBookSetupOpen(false)}
        book={book}
        onSave={handleSaveBookSettings}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        settings={aiSettings}
        onSave={handleSaveAISettings}
      />

      <BulkGeneratorModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        book={book}
        currentPageCount={pages.length}
        onBulkComplete={(newPages) => {
          setPages((prev) => [...prev, ...newPages]);
        }}
      />

      <BookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={book}
        pages={pages}
      />
    </div>
  );
}
