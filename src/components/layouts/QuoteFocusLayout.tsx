import React from 'react';
import { LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { getThemeClasses, getFontFamilyClass } from './LayoutThemeStyles';
import { Quote } from 'lucide-react';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
}

export const QuoteFocusLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);
  const mainImage = images[0];

  const displayQuote = parsedSections.pullQuote || parsedSections.headline || 'Design is the silent ambassador of your brand.';

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-14 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Top running marker */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 text-xs uppercase tracking-widest opacity-60">
        <span>Thesis & Principle</span>
        <span>Page {pageNumber}</span>
      </div>

      {/* Hero Quote Block */}
      <div className="my-auto max-w-3xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeStyle.accentBg}`}>
            <Quote className={`w-6 h-6 ${themeStyle.accent}`} />
          </div>
        </div>

        <blockquote className={`text-2xl md:text-4xl font-serif font-medium leading-relaxed tracking-tight ${themeStyle.headline}`}>
          "{displayQuote}"
        </blockquote>

        {parsedSections.subheading && (
          <p className={`text-xs uppercase tracking-widest font-bold ${themeStyle.accent}`}>
            — {parsedSections.subheading}
          </p>
        )}

        {/* Narrative Context & Image */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
          {mainImage && (
            <div className="md:col-span-4 flex justify-center">
              <img
                src={mainImage.dataUrl}
                alt={mainImage.name}
                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full shadow-md border-2 border-white"
              />
            </div>
          )}

          <div className={`${mainImage ? 'md:col-span-8' : 'md:col-span-12'} space-y-2`}>
            {parsedSections.leadParagraph && (
              <p className={`text-xs md:text-sm font-medium ${themeStyle.text} leading-relaxed`}>
                {parsedSections.leadParagraph}
              </p>
            )}
            {parsedSections.bodyParagraphs.map((para, i) => (
              <p key={i} className={`text-xs ${themeStyle.textMuted} leading-relaxed`}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-black/10 flex justify-between text-[10px] opacity-40">
        <span>Keynote Anchor</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};
