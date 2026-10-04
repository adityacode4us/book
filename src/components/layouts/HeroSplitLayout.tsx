import React from 'react';
import { LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { getThemeClasses, getFontFamilyClass } from './LayoutThemeStyles';
import { Sparkles } from 'lucide-react';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
}

export const HeroSplitLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);
  const isImageRight = visualConfig.imagePosition === 'right';
  const mainImage = images[0];

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-12 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Header bar / running folio */}
      <div className="flex items-center justify-between pb-4 border-b border-opacity-30 text-xs font-medium tracking-widest uppercase opacity-60">
        <span>Visual Edition</span>
        <span>Page {pageNumber}</span>
      </div>

      {/* Main Split Body */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 my-auto items-center ${isImageRight ? '' : 'md:flex-row-reverse'}`}>
        {/* Text Column */}
        <div className={`flex flex-col justify-center space-y-4 ${isImageRight ? 'order-1' : 'order-2'}`}>
          {parsedSections.subheading && (
            <span className={`text-xs uppercase tracking-widest font-semibold ${themeStyle.accent}`}>
              {parsedSections.subheading}
            </span>
          )}

          <h2 className={`text-2xl md:text-3xl font-extrabold leading-tight ${themeStyle.headline}`}>
            {parsedSections.headline || 'Untitled Feature'}
          </h2>

          {parsedSections.leadParagraph && (
            <p className={`text-sm md:text-base font-medium leading-relaxed ${themeStyle.text} opacity-90`}>
              {parsedSections.leadParagraph}
            </p>
          )}

          {parsedSections.bodyParagraphs.map((para, i) => (
            <p key={i} className={`text-xs md:text-sm leading-relaxed ${themeStyle.textMuted}`}>
              {para}
            </p>
          ))}

          {parsedSections.pullQuote && (
            <div className={`pl-4 border-l-2 ${themeStyle.quoteBorder} my-3 italic text-xs md:text-sm font-serif ${themeStyle.accent}`}>
              "{parsedSections.pullQuote}"
            </div>
          )}
        </div>

        {/* Hero Visual Column */}
        <div className={`flex flex-col items-center justify-center ${isImageRight ? 'order-2' : 'order-1'}`}>
          {mainImage ? (
            <div className="w-full relative group">
              <img
                src={mainImage.dataUrl}
                alt={mainImage.name}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg border border-black/5"
              />
              {mainImage.caption && (
                <p className="mt-2 text-[11px] text-center italic opacity-70">
                  {mainImage.caption}
                </p>
              )}
            </div>
          ) : (
            <div className={`w-full h-64 md:h-80 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center ${themeStyle.border} ${themeStyle.cardBg}`}>
              <Sparkles className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-xs font-medium opacity-60">Visual Focal Space</p>
              <p className="text-[11px] opacity-40 mt-1">Upload an image to illuminate this hero layout</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Running Marker */}
      <div className="pt-4 border-t border-opacity-30 text-[10px] opacity-40 flex justify-between items-center">
        <span>Draft Typeset</span>
        <span>•</span>
      </div>
    </div>
  );
};
