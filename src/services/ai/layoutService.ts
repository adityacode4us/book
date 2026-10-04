import { AISettings, BookMetadata, LayoutCandidate, PageContent } from '../../types/book';
import { generateGeminiLayouts } from './geminiService';
import { generateOpenAILayouts } from './openaiService';
import { generateHeuristicLayouts } from './heuristicMockEngine';

export interface GenerationResult {
  layouts: [LayoutCandidate, LayoutCandidate];
  providerUsed: 'gemini' | 'openai' | 'mock';
  fallbackMessage?: string;
}

export async function generatePageLayouts(
  pageNumber: number,
  content: PageContent,
  bookContext: BookMetadata,
  settings: AISettings
): Promise<GenerationResult> {
  // If provider is mock or no API key, use heuristic immediately
  if (settings.provider === 'mock' || !settings.apiKey) {
    const layouts = generateHeuristicLayouts(pageNumber, content, bookContext);
    return {
      layouts,
      providerUsed: 'mock',
    };
  }

  // Attempt real AI call
  try {
    if (settings.provider === 'gemini') {
      const layouts = await generateGeminiLayouts(
        pageNumber,
        content,
        bookContext,
        settings.apiKey,
        settings.model
      );
      return {
        layouts,
        providerUsed: 'gemini',
      };
    } else if (settings.provider === 'openai') {
      const layouts = await generateOpenAILayouts(
        pageNumber,
        content,
        bookContext,
        settings.apiKey,
        settings.model
      );
      return {
        layouts,
        providerUsed: 'openai',
      };
    }
  } catch (err: any) {
    console.warn('AI API call failed, falling back to heuristic engine:', err);
    const layouts = generateHeuristicLayouts(pageNumber, content, bookContext);
    return {
      layouts,
      providerUsed: 'mock',
      fallbackMessage: `API error (${err.message || 'Network failure'}). Used built-in heuristic typesetting engine.`,
    };
  }

  // Fallback
  const layouts = generateHeuristicLayouts(pageNumber, content, bookContext);
  return {
    layouts,
    providerUsed: 'mock',
  };
}
