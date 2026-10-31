import type { GalleryCollection } from '../../types/gallery';
import { ResponsiveCoverImage } from './ResponsiveCoverImage';
import { CoverOverlay } from './CoverOverlay';
import { CollectionTitle } from './CollectionTitle';
import { BusinessSignature } from './BusinessSignature';
import { EnterGalleryButton } from './EnterGalleryButton';

interface GalleryHeroProps {
  collection: GalleryCollection;
  isOwnerPreview?: boolean;
  onEnterGallery?: () => void;
}

export function GalleryHero({
  collection,
  isOwnerPreview: _isOwnerPreview = false,
  onEnterGallery,
}: GalleryHeroProps) {
  const heroHeightStyle = { minHeight: '100dvh' };
  const overlayOpacity = collection.theme?.coverOverlayOpacity ?? 0.65;
  const hasCoverImage = Boolean(collection.cover?.sources?.length);
  const useLightText = hasCoverImage || overlayOpacity >= 0.3;

  return (
    <section
      className="gallery-cover relative flex items-end justify-center overflow-hidden w-full select-none bg-[#0D1115]"
      style={heroHeightStyle}
      data-testid="gallery-hero"
    >
      <ResponsiveCoverImage
        cover={collection.cover}
        focalPoint={collection.coverFocalPoint}
      />

      <CoverOverlay opacity={overlayOpacity} />

      <div className="cover-content relative z-10 w-full max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16 text-center flex flex-col items-center">
        <p
          className="eyebrow text-[10px] tracking-[0.22em] uppercase mb-3 sm:mb-4 font-sans font-semibold"
          style={{
            color: useLightText ? 'rgba(255, 255, 255, 0.78)' : '#5E7F8C',
            textShadow: useLightText ? '0 1px 8px rgba(0, 0, 0, 0.4)' : 'none',
          }}
        >
          Coleção editorial
        </p>

        <CollectionTitle
          title={collection.title}
          headingFont={collection.theme.headingFont}
          lightText={useLightText}
        />

        <BusinessSignature
          businessName={collection.businessName}
          businessUrl={collection.businessUrl}
          lightText={useLightText}
        />

        <EnterGalleryButton onEnter={onEnterGallery} />
      </div>
    </section>
  );
}
