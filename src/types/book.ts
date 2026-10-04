export type ThemeType = 'modern' | 'editorial' | 'minimal' | 'vibrant' | 'corporate' | 'classic';
export type AspectRatioType = 'a4-portrait' | 'a4-landscape' | 'square';

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  objective?: string;
  theme: ThemeType;
  aspectRatio: AspectRatioType;
  createdAt: number;
  updatedAt: number;
}

export interface PageImage {
  id: string;
  name: string;
  dataUrl?: string; // base64 or blob URL for rendering
  caption?: string;
  aspectRatio?: number;
}

export interface PageContent {
  text: string;
  images: PageImage[];
}

export type LayoutArchetype = 
  | 'hero-split'
  | 'editorial-two-column'
  | 'asymmetric-showcase'
  | 'card-grid'
  | 'quote-focus'
  | 'gallery-narrative';

export interface ParsedSections {
  headline?: string;
  subheading?: string;
  leadParagraph?: string;
  bodyParagraphs: string[];
  pullQuote?: string;
  bulletPoints?: string[];
}

export interface VisualConfig {
  imagePosition: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'inset';
  fontFamily: 'sans' | 'serif' | 'display' | 'classic';
  colorScheme: 'light' | 'dark' | 'accent' | 'warm';
  whitespace: 'compact' | 'comfortable' | 'spacious';
  dropCap?: boolean;
  imageStyle: 'rounded' | 'sharp' | 'bordered' | 'shadow';
}

export interface LayoutCandidate {
  id: string;
  name: string;
  archetype: LayoutArchetype;
  rationale: string;
  parsedSections: ParsedSections;
  visualConfig: VisualConfig;
}

export type PageStatus = 'draft' | 'generating' | 'layouts_generated' | 'completed';

export interface BookPage {
  id: string;
  bookId: string;
  pageNumber: number;
  rawText: string;
  images: PageImage[];
  candidateLayouts: LayoutCandidate[];
  selectedLayoutId?: string;
  status: PageStatus;
  updatedAt: number;
}

export interface AISettings {
  provider: 'mock' | 'gemini' | 'openai';
  apiKey?: string;
  model?: string;
}
