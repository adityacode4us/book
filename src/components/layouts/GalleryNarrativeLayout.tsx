import React from 'react';
import { LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { getThemeClasses, getFontFamilyClass } from './LayoutThemeStyles';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
}

export const GalleryNarrativeLayout: React.FC<Props> = ({ candidate, images, theme, pageNumber }) => {
  const { parsedSections, visualConfig } = candidate;
  const themeStyle = getThemeClasses(theme, visualConfig.colorScheme);
  const fontClass = getFontFamilyClass(visualConfig.fontFamily);

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-8 md:p-12 ${themeStyle.bg} ${themeStyle.text} ${fontClass}`}>
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 text-xs uppercase tracking-widest opacity-60">
        <span className="flex items-center space-x-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Visual Anthology</span>
        </span>
        <span>Folio {pageNumber}</span>
      </div>

      <div className="my-auto space-y-6">
        {/* Title area */}
        <div className="space-y-1">
          {parsedSections.subheading && (
            <span className={`text-xs font-bold uppercase tracking-wider ${themeStyle.accent}`}>
              {parsedSections.subheading}
            </span>
          )}
          <h1 className={`text-2xl md:text-3xl font-extrabold ${themeStyle.headline}`}>
            {parsedSections.headline || 'Visual Study & Case Documentation'}
          </h1>
          {parsedSections.leadParagraph && (
            <p className={`text-xs md:text-sm ${themeStyle.textMuted} max-w-xl`}>
              {parsedSections.leadParagraph}
            </p>
          )}
        </div>

        {/* Gallery Image Strip (up to 3 images or fallbacks) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(images.length > 0 ? images.slice(0, 3) : [{ id: '1', name: 'Placeholder' } as PageImage]).map((img, i) => (
            <div key={i} className="flex flex-col space-y-1.5">
              <div className="h-36 rounded-lg overflow-hidden border border-black/10 shadow-sm bg-black/5 flex items-center justify-center">
                {img.dataUrl ? (
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-20" />
                )}
              </div>
              <p className="text-[10px] text-center italic opacity-70 truncate px-1">
                {img.caption || `Fig. 0${i + 1} — Specimen view`}
              </p>
            </div>
          ))}
        </div>

        {/* Narrative Columns below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {parsedSections.bodyParagraphs.map((para, i) => (
            <p key={i} className={`text-xs leading-relaxed ${themeStyle.textMuted}`}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-black/10 flex justify-between text-[10px] opacity-40">
        <span>Documentary Collection</span>
        <span>Page {pageNumber}</span>
      </div>
    </div>
  );
};
