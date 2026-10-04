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

export const EditorialTwoColumnLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);
  const mainImage = images[0];

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-12 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Editorial Header */}
      <div className="space-y-2 pb-6 border-b border-black/10">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest opacity-60">
          <span>Editorial Dispatch</span>
          <span>No. {pageNumber}</span>
        </div>
        {parsedSections.subheading && (
          <p className={`text-xs uppercase font-bold tracking-widest ${themeStyle.accent}`}>
            {parsedSections.subheading}
          </p>
        )}
        <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${themeStyle.headline}`}>
          {parsedSections.headline || 'Editorial Perspective'}
        </h1>
        {parsedSections.leadParagraph && (
          <p className="text-sm md:text-base font-serif italic text-opacity-80 pt-1 leading-relaxed max-w-2xl">
            {parsedSections.leadParagraph}
          </p>
        )}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto pt-6">
        {/* Left Column */}
        <div className="space-y-4">
          {parsedSections.bodyParagraphs.slice(0, Math.ceil(parsedSections.bodyParagraphs.length / 2)).map((p, i) => (
            <p key={i} className={`text-xs md:text-sm leading-relaxed ${themeStyle.textMuted} ${i === 0 && visualConfig.dropCap ? 'first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none' : ''}`}>
              {p}
            </p>
          ))}

          {/* Callout Pull Quote */}
          {parsedSections.pullQuote && (
            <div className={`p-4 rounded-lg my-4 relative ${themeStyle.accentBg} border`}>
              <Quote className="w-5 h-5 opacity-40 mb-1" />
              <p className={`text-xs md:text-sm font-serif italic font-medium ${themeStyle.accent}`}>
                "{parsedSections.pullQuote}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4 flex flex-col justify-between">
          {mainImage && (
            <div className="rounded-lg overflow-hidden border border-black/5 shadow-sm">
              <img
                src={mainImage.dataUrl}
                alt={mainImage.name}
                className="w-full h-44 object-cover"
              />
              {mainImage.caption && (
                <p className="p-2 text-[10px] text-center italic bg-black/5 opacity-80">
                  {mainImage.caption}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {parsedSections.bodyParagraphs.slice(Math.ceil(parsedSections.bodyParagraphs.length / 2)).map((p, i) => (
              <p key={i} className={`text-xs md:text-sm leading-relaxed ${themeStyle.textMuted}`}>
                {p}
              </p>
            ))}

            {parsedSections.bulletPoints && parsedSections.bulletPoints.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {parsedSections.bulletPoints.map((bp, i) => (
                  <li key={i} className="text-xs flex items-start space-x-2">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${themeStyle.accent}`}>•</span>
                    <span className="opacity-90">{bp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-black/10 flex justify-between text-[10px] opacity-40">
        <span>Curated Layout</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};
