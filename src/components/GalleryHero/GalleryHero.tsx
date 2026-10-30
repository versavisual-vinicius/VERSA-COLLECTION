import type { GalleryCollection } from '../../types/gallery';
import { ResponsiveCoverImage } from './ResponsiveCoverImage';
import { CoverOverlay } from './CoverOverlay';
import { CollectionTitle } from './CollectionTitle';
import { BusinessSignature } from './BusinessSignature';
import { EnterGalleryButton } from './EnterGalleryButton';
import { PreviewBanner } from './PreviewBanner';

interface GalleryHeroProps {
  collection: GalleryCollection;
  isOwnerPreview?: boolean;
  onEnterGallery?: () => void;
}

/**
 * GalleryHero conforme RF-002 e Diretrizes Editoriais Versa Visual:
 * - Ocupa 100dvh (ou 100dvh - 22px caso a barra do proprietário esteja ativa).
 * - Imagem com focalPoint dinâmico.
 * - Overlay de gradiente orgânico com transição para #050A0D.
 * - Título com Outfit ExtraBold e escala editorial.
 * - Assinatura com portal vertical interativo #5E7F8C.
 */
export function GalleryHero({
  collection,
  isOwnerPreview = false,
  onEnterGallery,
}: GalleryHeroProps) {
  const heroHeightStyle = isOwnerPreview
    ? { minHeight: 'calc(100dvh - 22px)', marginTop: '22px' }
    : { minHeight: '100dvh' };

  return (
    <>
      <PreviewBanner isVisible={isOwnerPreview} />

      <section
        className="gallery-cover relative flex items-end justify-center overflow-hidden w-full select-none bg-[#F6F8F9]"
        style={heroHeightStyle}
        data-testid="gallery-hero"
      >
        <ResponsiveCoverImage
          cover={collection.cover}
          focalPoint={collection.coverFocalPoint}
        />

        <CoverOverlay opacity={collection.theme.coverOverlayOpacity} />

        <div className="cover-content relative z-10 w-full max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16 text-center flex flex-col items-center">
          <p className="eyebrow text-[10px] tracking-[0.45em] uppercase text-[#5E7F8C] mb-3 sm:mb-4 font-sans font-semibold">
            Coleção editorial
          </p>

          <CollectionTitle
            title={collection.title}
            headingFont={collection.theme.headingFont}
          />

          <BusinessSignature
            businessName={collection.businessName}
            businessUrl={collection.businessUrl}
          />

          <EnterGalleryButton onEnter={onEnterGallery} />
        </div>
      </section>
    </>
  );
}
