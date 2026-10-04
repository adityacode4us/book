import React from 'react';
import { AspectRatioType, LayoutCandidate, PageImage, ThemeType } from '../../types/book';
import { HeroSplitLayout } from './HeroSplitLayout';
import { EditorialTwoColumnLayout } from './EditorialTwoColumnLayout';
import { AsymmetricShowcaseLayout } from './AsymmetricShowcaseLayout';
import { CardGridLayout } from './CardGridLayout';
import { QuoteFocusLayout } from './QuoteFocusLayout';
import { GalleryNarrativeLayout } from './GalleryNarrativeLayout';

interface Props {
  candidate: LayoutCandidate;
  images: PageImage[];
  theme: ThemeType;
  pageNumber: number;
  aspectRatio?: AspectRatioType;
  isThumbnail?: boolean;
  className?: string;
}

export const PageRenderer: React.FC<Props> = ({
  candidate,
  images,
  theme,
  pageNumber,
  aspectRatio = 'a4-portrait',
  isThumbnail = false,
  className = '',
}) => {
  // Determine aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'a4-landscape':
        return 'aspect-[297/210]';
      case 'square':
        return 'aspect-square';
      case 'a4-portrait':
      default:
        return 'aspect-[210/297]'; // standard ISO A4 ratio 1:1.414
    }
  };

  const renderArchetype = () => {
    switch (candidate.archetype) {
      case 'editorial-two-column':
        return <EditorialTwoColumnLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
      case 'asymmetric-showcase':
        return <AsymmetricShowcaseLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
      case 'card-grid':
        return <CardGridLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
      case 'quote-focus':
        return <QuoteFocusLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
      case 'gallery-narrative':
        return <GalleryNarrativeLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
      case 'hero-split':
      default:
        return <HeroSplitLayout candidate={candidate} images={images} theme={theme} pageNumber={pageNumber} />;
    }
  };

  return (
    <div
      className={`print-page relative w-full overflow-hidden shadow-2xl transition-all duration-300 rounded-sm ${getAspectClass()} ${className}`}
      style={{
        boxShadow: isThumbnail ? '0 2px 8px rgba(0,0,0,0.1)' : '0 20px 40px -15px rgba(0,0,0,0.2)',
      }}
    >
      {renderArchetype()}
    </div>
  );
};
