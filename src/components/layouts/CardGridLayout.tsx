import React from 'react';
import { LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { getThemeClasses, getFontFamilyClass } from './LayoutThemeStyles';
import { Layers } from 'lucide-react';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
}

export const CardGridLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);

  // Group paragraphs or points into cards
  const cardsData = parsedSections.bulletPoints && parsedSections.bulletPoints.length > 0
    ? parsedSections.bulletPoints.map((bp, idx) => ({ title: `Point 0${idx + 1}`, content: bp }))
    : parsedSections.bodyParagraphs.map((para, idx) => ({ title: `Module 0${idx + 1}`, content: para }));

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-12 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Header section */}
      <div className="space-y-2 pb-4 border-b border-black/10">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase opacity-60">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Matrix</span>
          </span>
          <span>P. {pageNumber}</span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold ${themeStyle.headline}`}>
          {parsedSections.headline || 'Core Architectural Pillars'}
        </h1>
        {parsedSections.leadParagraph && (
          <p className={`text-xs md:text-sm font-medium ${themeStyle.textMuted} max-w-2xl`}>
            {parsedSections.leadParagraph}
          </p>
        )}
      </div>

      {/* Grid of Cards + Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4">
        {images.length > 0 && (
          <div className="md:col-span-3 mb-2 rounded-xl overflow-hidden h-36 relative border border-black/10 shadow-sm">
            <img
              src={images[0].dataUrl}
              alt={images[0].name}
              className="w-full h-full object-cover"
            />
            {images[0].caption && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                {images[0].caption}
              </div>
            )}
          </div>
        )}

        {cardsData.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border flex flex-col justify-between ${themeStyle.cardBg} ${themeStyle.border} shadow-sm hover:shadow-md transition`}
          >
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-2 ${themeStyle.accent}`}>
                {item.title}
              </span>
              <p className={`text-xs leading-relaxed ${themeStyle.text}`}>
                {item.content}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-black/5 flex justify-end">
              <span className="text-[10px] opacity-40 font-mono">0{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-black/10 flex justify-between text-[10px] opacity-40">
        <span>Executive Brief Format</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};
