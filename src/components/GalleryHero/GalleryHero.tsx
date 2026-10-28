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
 * GalleryHero conforme RF-002 e Seção 16:
 * - Ocupa 100dvh (ou 100dvh - 22px caso a barra do proprietário esteja ativa).
 * - Imagem com focalPoint dinâmico.
 * - Overlay de gradiente conforme RF-003.
 * - Título com paridade 52px (desktop) / 39px (mobile).
 * - Botão de entrada com foco acessível e scroll suave.
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
        className="gallery-cover relative flex items-end justify-center overflow-hidden w-full select-none"
        style={heroHeightStyle}
        data-testid="gallery-hero"
      >
        <ResponsiveCoverImage
          cover={collection.cover}
          focalPoint={collection.coverFocalPoint}
        />

        <CoverOverlay opacity={collection.theme.coverOverlayOpacity} />

        <div className="cover-content relative z-10 w-full max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16 text-center flex flex-col items-center">
          <p className="eyebrow text-[10px] tracking-[0.5em] uppercase text-white/80 mb-3 sm:mb-4">
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
