import { BookMetadata, PageContent } from '../../types/book';

export function buildLayoutGenerationPrompt(
  pageNumber: number,
  content: PageContent,
  bookContext: BookMetadata
): string {
  return `You are an expert editorial art director and publication typesetter for top-tier magazines (like Wired, Harvard Business Review, and Monocle).

Your mission is to analyze raw content (text and images) for Page ${pageNumber} of a book and synthesize TWO DISTINCT, PROFESSIONAL TYPESETTING OPTIONS (Option A and Option B).

BOOK CONTEXT:
- Title: "${bookContext.title || 'Untitled Publication'}"
- Objective/Theme: "${bookContext.objective || 'Inform and inspire'}"
- Visual Style: ${bookContext.theme}

CURRENT PAGE INPUT:
- Page Number: ${pageNumber}
- Raw Text:
"""
${content.text}
"""
- Number of Images Available: ${content.images.length}
${content.images.map((img, i) => `  * Image ${i + 1}: "${img.name}" ${img.caption ? `(caption: ${img.caption})` : ''}`).join('\n')}

INSTRUCTIONS:
1. Generate TWO contrasting layout plans for this page:
   - OPTION A ("Visual Punch / Dynamic"): Emphasize visual impact, hero photography, bold headlines, and expressive typography.
   - OPTION B ("Editorial Depth / Structured Flow"): Emphasize long-form reading comfort, balanced columns, structured hierarchy, and subtle framing.
2. Select the most fitting archetype for each option from:
   - 'hero-split' (50/50 balance of hero image and article copy)
   - 'editorial-two-column' (traditional 2-column magazine spread with pull quote)
   - 'asymmetric-showcase' (70/30 dynamic split prioritizing visual or key takeaway)
   - 'card-grid' (modular cards for bullet points, takeaways, or steps)
   - 'quote-focus' (keynote pull-quote hero with supporting copy)
   - 'gallery-narrative' (multi-image photo spread with article below)
3. Parse and structure the raw text into:
   - headline: punchy title (3-8 words)
   - subheading: category or kicker
   - leadParagraph: compelling intro
   - bodyParagraphs: array of clean text paragraphs
   - pullQuote: a standout memorable phrase
   - bulletPoints: array of concise takeaways (if applicable)

OUTPUT FORMAT:
Respond with ONLY valid JSON strictly matching this schema:
{
  "options": [
    {
      "id": "option-a",
      "name": "Option A: Visual Impact",
      "archetype": "hero-split",
      "rationale": "Why this layout serves the content...",
      "parsedSections": {
        "headline": "...",
        "subheading": "...",
        "leadParagraph": "...",
        "bodyParagraphs": ["..."],
        "pullQuote": "...",
        "bulletPoints": ["..."]
      },
      "visualConfig": {
        "imagePosition": "right",
        "fontFamily": "display",
        "colorScheme": "accent",
        "whitespace": "comfortable",
        "dropCap": true,
        "imageStyle": "rounded"
      }
    },
    {
      "id": "option-b",
      "name": "Option B: Editorial Flow",
      "archetype": "editorial-two-column",
      "rationale": "Why this alternative layout serves the reader...",
      "parsedSections": {
        "headline": "...",
        "subheading": "...",
        "leadParagraph": "...",
        "bodyParagraphs": ["..."],
        "pullQuote": "...",
        "bulletPoints": ["..."]
      },
      "visualConfig": {
        "imagePosition": "left",
        "fontFamily": "serif",
        "colorScheme": "light",
        "whitespace": "spacious",
        "dropCap": false,
        "imageStyle": "bordered"
      }
    }
  ]
}`;
}
