import React from 'react';
import { LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { getThemeClasses, getFontFamilyClass } from './LayoutThemeStyles';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
}

export const AsymmetricShowcaseLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);
  const mainImage = images[0];

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-12 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Top Meta */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 text-xs font-mono tracking-wider opacity-60">
        <span>[ 70/30 PROPORTIONAL FOCUS ]</span>
        <span>SECTION {pageNumber}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto py-4">
        {/* Dominant 7-column section */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-4">
          {mainImage ? (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-black/10">
              <img
                src={mainImage.dataUrl}
                alt={mainImage.name}
                className="w-full h-64 md:h-84 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Featured Visual</p>
                <p className="text-sm font-medium">{mainImage.caption || parsedSections.headline}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className={`text-3xl md:text-5xl font-black leading-tight tracking-tight ${themeStyle.headline}`}>
                {parsedSections.headline || 'Impact Statement'}
              </h1>
              {parsedSections.leadParagraph && (
                <p className={`text-base md:text-lg leading-relaxed font-medium ${themeStyle.text}`}>
                  {parsedSections.leadParagraph}
                </p>
              )}
            </div>
          )}

          {mainImage && (
            <div className="pt-2">
              <h2 className={`text-xl md:text-2xl font-bold ${themeStyle.headline}`}>
                {parsedSections.headline}
              </h2>
              {parsedSections.leadParagraph && (
                <p className={`text-xs md:text-sm mt-1 leading-relaxed ${themeStyle.textMuted}`}>
                  {parsedSections.leadParagraph}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Supporting 4-column sidebar */}
        <div className={`md:col-span-4 flex flex-col justify-between p-6 rounded-2xl ${themeStyle.cardBg} border ${themeStyle.border}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${themeStyle.badge}`}>
                Key Insights
              </span>
              <ArrowUpRight className="w-4 h-4 opacity-50" />
            </div>

            {parsedSections.subheading && (
              <h3 className={`text-sm font-bold ${themeStyle.accent}`}>
                {parsedSections.subheading}
              </h3>
            )}

            <div className="space-y-3">
              {parsedSections.bodyParagraphs.map((para, i) => (
                <p key={i} className={`text-xs leading-relaxed ${themeStyle.textMuted}`}>
                  {para}
                </p>
              ))}
            </div>

            {parsedSections.bulletPoints && parsedSections.bulletPoints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-black/10">
                {parsedSections.bulletPoints.map((bp, i) => (
                  <div key={i} className="text-xs flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {parsedSections.pullQuote && (
            <div className="pt-4 mt-4 border-t border-black/10 text-xs italic font-serif opacity-80">
              "{parsedSections.pullQuote}"
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-black/10 flex justify-between text-[10px] opacity-40">
        <span>Asymmetric Layout Flow</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};
