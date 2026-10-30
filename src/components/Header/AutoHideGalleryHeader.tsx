import { useEffect, useState } from 'react';
import { CollectionIdentity } from './CollectionIdentity';
import { FavoriteAccess } from './FavoriteAccess';
import { CollectionDownload } from './CollectionDownload';
import { OverflowMenu } from './OverflowMenu';

interface AutoHideGalleryHeaderProps {
  collectionTitle: string;
  favoriteCount: number;
  downloadsEnabled?: boolean;
  isOwnerPreview?: boolean;
  onOpenFavorites: () => void;
  onOpenDownload: () => void;
  onStartSlideshow?: () => void;
  onShareCollection?: () => void;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

/**
 * Cabeçalho contextual com recolhimento inteligente (RF-004):
 * - Altura desktop: 78px; compacta mobile.
 * - Transição: 200ms ease-in-out.
 * - Oculta após 24px acumulados de descida.
 * - Reexibe após 12px acumulados de subida.
 * - Ignora oscilações < 4px para evitar jitter.
 * - Fixado no topo, com suporte a deslocamento caso haja barra de proprietário (22px).
 */
export function AutoHideGalleryHeader({
  collectionTitle,
  favoriteCount,
  downloadsEnabled = true,
  isOwnerPreview = false,
  onOpenFavorites,
  onOpenDownload,
  onStartSlideshow,
  onShareCollection,
  onGoHome,
  onOpenAdmin,
}: AutoHideGalleryHeaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDown = 0;
    let accumulatedUp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // 1. Ignorar oscilações menores que 4px para evitar tremulação
      if (Math.abs(delta) < 4) return;

      // 2. No topo da página (< 24px), sempre visível
      if (currentScrollY < 24) {
        setVisible(true);
        accumulatedDown = 0;
        accumulatedUp = 0;
        lastScrollY = currentScrollY;
        return;
      }

      if (delta > 0) {
        // Rolando para baixo: reseta acumulador de subida e soma descida
        accumulatedUp = 0;
        accumulatedDown += delta;

        // Ocultar após 24px acumulados de scroll descendente
        if (accumulatedDown >= 24) {
          setVisible(false);
        }
      } else {
        // Rolando para cima: reseta acumulador de descida e soma subida
        accumulatedDown = 0;
        accumulatedUp += Math.abs(delta);

        // Reexibir após 12px acumulados de scroll ascendente
        if (accumulatedUp >= 12) {
          setVisible(true);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topOffsetClass = isOwnerPreview ? 'top-[22px]' : 'top-0';

  return (
    <header
      className={`gallery-header fixed inset-x-0 ${topOffsetClass} z-40 h-[64px] sm:h-[78px] transition-transform duration-200 ease-in-out border-b border-[#5E7F8C]/15 bg-[#F6F8F9]/90 text-[#11161B] backdrop-blur-md ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="banner"
      data-testid="auto-hide-header"
      data-visible={visible}
    >
      <div className="header-inner max-w-[1440px] h-full mx-auto px-4 flex items-center justify-between">
        <CollectionIdentity
          collectionTitle={collectionTitle}
          onClickBrand={scrollToTop}
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <FavoriteAccess
            favoriteCount={favoriteCount}
            onOpenFavorites={onOpenFavorites}
          />

          <CollectionDownload
            enabled={downloadsEnabled}
            onOpenDownload={onOpenDownload}
          />

          {/* Botões diretos de ação rápida na navbar desktop (paridade Pixieset navbar-extra) */}
          {onStartSlideshow && (
            <button
              type="button"
              onClick={onStartSlideshow}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6872] hover:text-[#11161B] rounded-lg hover:bg-black/5 transition-colors"
              title="Apresentação de slides"
              aria-label="Iniciar apresentação de slides"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Slideshow</span>
            </button>
          )}

          {onShareCollection && (
            <button
              type="button"
              onClick={onShareCollection}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6872] hover:text-[#11161B] rounded-lg hover:bg-black/5 transition-colors"
              title="Compartilhar coleção"
              aria-label="Compartilhar coleção"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>Compartilhar</span>
            </button>
          )}

          <OverflowMenu
            onStartSlideshow={onStartSlideshow}
            onShareCollection={onShareCollection}
            onGoHome={onGoHome}
            onOpenAdmin={onOpenAdmin}
          />
        </div>
      </div>
    </header>
  );
}
