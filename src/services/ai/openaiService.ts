import { BookMetadata, LayoutCandidate, PageContent } from '../../types/book';
import { buildLayoutGenerationPrompt } from './promptBuilder';

export async function generateOpenAILayouts(
  pageNumber: number,
  content: PageContent,
  bookContext: BookMetadata,
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<[LayoutCandidate, LayoutCandidate]> {
  const prompt = buildLayoutGenerationPrompt(pageNumber, content, bookContext);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an editorial art director. Always respond in valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const rawJson = data.choices?.[0]?.message?.content;
  if (!rawJson) {
    throw new Error('No content returned from OpenAI model');
  }

  const parsed = JSON.parse(rawJson);
  if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length < 2) {
    throw new Error('OpenAI response did not contain 2 layout options');
  }

  return [parsed.options[0], parsed.options[1]];
}
