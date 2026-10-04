import { BookMetadata, LayoutCandidate, PageContent } from '../../types/book';
import { buildLayoutGenerationPrompt } from './promptBuilder';

export async function generateGeminiLayouts(
  pageNumber: number,
  content: PageContent,
  bookContext: BookMetadata,
  apiKey: string,
  model = 'gemini-2.0-flash'
): Promise<[LayoutCandidate, LayoutCandidate]> {
  const prompt = buildLayoutGenerationPrompt(pageNumber, content, bookContext);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJsonText) {
    throw new Error('No content returned from Gemini model');
  }

  const parsed = JSON.parse(rawJsonText);
  if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length < 2) {
    throw new Error('Gemini response did not contain 2 layout options');
  }

  return [parsed.options[0], parsed.options[1]];
}
