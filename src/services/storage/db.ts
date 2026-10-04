import Dexie, { Table } from 'dexie';
import { BookMetadata, BookPage, PageImage } from '../../types/book';

export interface StoredAsset {
  id: string;
  name: string;
  mimeType: string;
  blob: Blob;
  createdAt: number;
}

export class PageCraftDatabase extends Dexie {
  books!: Table<BookMetadata, string>;
  pages!: Table<BookPage, string>;
  assets!: Table<StoredAsset, string>;

  constructor() {
    super('PageCraftDB');
    this.version(1).stores({
      books: 'id, title, updatedAt',
      pages: 'id, bookId, pageNumber, status',
      assets: 'id, createdAt',
    });
  }
}

export const db = new PageCraftDatabase();

// In-memory cache for Object URLs to prevent memory bloat and recreate URLs cleanly
const blobUrlCache = new Map<string, string>();

export async function storeImageFile(file: File): Promise<PageImage> {
  const assetId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const storedAsset: StoredAsset = {
    id: assetId,
    name: file.name,
    mimeType: file.type,
    blob: file,
    createdAt: Date.now(),
  };

  await db.assets.put(storedAsset);

  const objectUrl = URL.createObjectURL(file);
  blobUrlCache.set(assetId, objectUrl);

  return {
    id: assetId,
    name: file.name,
    dataUrl: objectUrl,
  };
}

export async function resolvePageImageUrl(image: PageImage): Promise<string> {
  if (image.dataUrl && !image.dataUrl.startsWith('blob:')) {
    return image.dataUrl; // base64 or external url
  }

  // Check cache
  if (blobUrlCache.has(image.id)) {
    return blobUrlCache.get(image.id)!;
  }

  // Query DB
  const asset = await db.assets.get(image.id);
  if (asset) {
    const url = URL.createObjectURL(asset.blob);
    blobUrlCache.set(image.id, url);
    return url;
  }

  return image.dataUrl || '';
}

export async function saveBookToDB(book: BookMetadata): Promise<void> {
  await db.books.put(book);
}

export async function loadBookFromDB(bookId: string): Promise<BookMetadata | undefined> {
  return await db.books.get(bookId);
}

export async function loadPagesFromDB(bookId: string): Promise<BookPage[]> {
  const pages = await db.pages.where('bookId').equals(bookId).sortBy('pageNumber');
  // Re-hydrate image URLs
  for (const page of pages) {
    for (const img of page.images) {
      img.dataUrl = await resolvePageImageUrl(img);
    }
  }
  return pages;
}

export async function savePageToDB(page: BookPage): Promise<void> {
  await db.pages.put(page);
}

export async function deletePageFromDB(pageId: string): Promise<void> {
  await db.pages.delete(pageId);
}

export async function exportBookAsJSON(bookId: string): Promise<string> {
  const book = await db.books.get(bookId);
  const pages = await db.pages.where('bookId').equals(bookId).sortBy('pageNumber');

  // Convert image assets to base64 for portable single-file export
  const exportPages = await Promise.all(
    pages.map(async page => {
      const exportImages = await Promise.all(
        page.images.map(async img => {
          const asset = await db.assets.get(img.id);
          if (asset) {
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(asset.blob);
            });
            return { ...img, dataUrl: base64 };
          }
          return img;
        })
      );
      return { ...page, images: exportImages };
    })
  );

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    book,
    pages: exportPages,
  };

  return JSON.stringify(payload, null, 2);
}

export async function importBookFromJSON(jsonString: string): Promise<{ book: BookMetadata; pages: BookPage[] }> {
  const payload = JSON.parse(jsonString);
  if (!payload.book || !payload.pages || !Array.isArray(payload.pages)) {
    throw new Error('Invalid PageCraft book draft file format');
  }

  const importedBook: BookMetadata = {
    ...payload.book,
    id: `book-${Date.now()}`,
    updatedAt: Date.now(),
  };
  await db.books.put(importedBook);

  const importedPages: BookPage[] = [];
  for (const page of payload.pages) {
    const updatedPage: BookPage = {
      ...page,
      id: `page-${Date.now()}-${page.pageNumber}`,
      bookId: importedBook.id,
      images: page.images || [],
    };
    await db.pages.put(updatedPage);
    importedPages.push(updatedPage);
  }

  return { book: importedBook, pages: importedPages };
}
