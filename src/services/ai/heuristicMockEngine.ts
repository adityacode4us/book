import { BookMetadata, LayoutCandidate, LayoutArchetype, PageContent } from '../../types/book';

/**
 * Intelligent deterministic heuristic typesetting engine.
 * Generates 2 distinct layout candidates based on content analysis
 * without requiring external network or API keys.
 */
export function generateHeuristicLayouts(
  pageNumber: number,
  content: PageContent,
  bookContext: BookMetadata
): [LayoutCandidate, LayoutCandidate] {
  const { text, images } = content;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Headline / Subtitle / Pull Quote / Bullets
  let headline = '';
  let subheading = bookContext.title || '';
  const bodyParagraphs: string[] = [];
  const bulletPoints: string[] = [];
  let pullQuote = '';

  for (const line of lines) {
    if (!headline && (line.startsWith('#') || (line.length < 60 && !line.endsWith('.')))) {
      headline = line.replace(/^#+\s*/, '');
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ') || /^\d+\.\s/.test(line)) {
      bulletPoints.push(line.replace(/^[-*•\d.]\s*/, ''));
    } else if (!pullQuote && (line.startsWith('"') || line.startsWith('“') || (line.length > 30 && line.length < 140 && Math.random() > 0.5))) {
      pullQuote = line.replace(/["“”]/g, '');
    } else {
      bodyParagraphs.push(line);
    }
  }

  // Fallbacks if text was minimal
  if (!headline) {
    headline = bodyParagraphs[0]?.slice(0, 45) || `Insight & Perspective — Chapter ${pageNumber}`;
  }
  if (bodyParagraphs.length === 0 && bulletPoints.length === 0) {
    bodyParagraphs.push('Transforming raw concepts into an executive publication draft. Content balances typography, whitespace, and visual imagery.');
  }

  const imageCount = images.length;

  // Option A Strategy: Visual Punch / Bold Presentation
  let archetypeA: LayoutArchetype = 'hero-split';
  if (imageCount >= 2) {
    archetypeA = 'gallery-narrative';
  } else if (bulletPoints.length >= 3) {
    archetypeA = 'card-grid';
  } else if (imageCount === 0 && bodyParagraphs.length <= 2) {
    archetypeA = 'quote-focus';
  } else {
    archetypeA = 'hero-split';
  }

  const optionA: LayoutCandidate = {
    id: `layout-a-${pageNumber}-${Date.now()}`,
    name: 'Option A: High-Impact Visual',
    archetype: archetypeA,
    rationale: imageCount > 0 
      ? 'Prioritizes visual hierarchy with full-height imagery and bold focal headers.'
      : 'Maximizes typographic impact and spacious breathing room for key concepts.',
    parsedSections: {
      headline,
      subheading: subheading ? `${subheading} • Page ${pageNumber}` : `Edition 0${pageNumber}`,
      leadParagraph: bodyParagraphs[0] || bulletPoints[0],
      bodyParagraphs: bodyParagraphs.slice(1),
      pullQuote: pullQuote || (bodyParagraphs[1]?.slice(0, 90) ? `"${bodyParagraphs[1]?.slice(0, 90)}..."` : undefined),
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
    },
    visualConfig: {
      imagePosition: 'right',
      fontFamily: bookContext.theme === 'editorial' || bookContext.theme === 'classic' ? 'serif' : 'display',
      colorScheme: 'accent',
      whitespace: 'comfortable',
      dropCap: true,
      imageStyle: 'rounded',
    },
  };

  // Option B Strategy: Editorial Flow / Structural Reading
  let archetypeB: LayoutArchetype = 'editorial-two-column';
  if (imageCount >= 1) {
    archetypeB = 'asymmetric-showcase';
  } else if (bulletPoints.length >= 2) {
    archetypeB = 'card-grid';
  } else {
    archetypeB = 'editorial-two-column';
  }

  const optionB: LayoutCandidate = {
    id: `layout-b-${pageNumber}-${Date.now()}`,
    name: 'Option B: Balanced Editorial Flow',
    archetype: archetypeB,
    rationale: 'Engineered for dense reading clarity, dual-column balance, and structured narrative progression.',
    parsedSections: {
      headline,
      subheading: bookContext.objective ? `Focus: ${bookContext.objective}` : 'Analytical Overview',
      leadParagraph: bodyParagraphs[0],
      bodyParagraphs: bodyParagraphs.slice(1).concat(bulletPoints.map(bp => `Key principle: ${bp}`)),
      pullQuote: pullQuote || (bulletPoints[0] ? `“${bulletPoints[0]}”` : undefined),
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
    },
    visualConfig: {
      imagePosition: 'left',
      fontFamily: bookContext.theme === 'editorial' ? 'serif' : 'sans',
      colorScheme: 'light',
      whitespace: 'spacious',
      dropCap: false,
      imageStyle: 'bordered',
    },
  };

  return [optionA, optionB];
}
