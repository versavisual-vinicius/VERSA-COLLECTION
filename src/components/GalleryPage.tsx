import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collectionFixture, galleryPhotos } from '../data/fixtures';
import type { GalleryPhoto } from '../types/gallery';
import { AutoHideGalleryHeader } from './Header/AutoHideGalleryHeader';
import { GalleryHero } from './GalleryHero/GalleryHero';
import { InfiniteMasonryGrid } from './Masonry/InfiniteMasonryGrid';
import { useGalleryProgressivePhotos } from './Masonry/useGalleryProgressivePhotos';
import { PhotoLightbox } from './Lightbox/PhotoLightbox';
import { ShareDialog } from './Dialogs/ShareDialog';
import { DownloadDialog } from './Dialogs/DownloadDialog';
import { FavoritesDialog } from './Dialogs/FavoritesDialog';
import { ToastRegion } from './Feedback/ToastRegion';
import { BrandingFooter } from './Footer/BrandingFooter';
import { useFavorites } from '../lib/useFavorites';
import { telemetry } from '../lib/telemetry';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface GalleryPageProps {
  isOwnerPreview?: boolean;
}

export function GalleryPage({ isOwnerPreview = false }: GalleryPageProps) {
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Registra se a sessão atual teve entrada direta por URL profunda (Seção 6)
  const isDeepLinkOriginRef = useRef<boolean>(false);
  const initialMountRef = useRef<boolean>(true);

  // Hook de favoritos com persistência local e otimismo reversível (RF-010)
  const {
    favoriteIds,
    toggleFavorite: toggleFavAction,
    removeFavorite: removeFavAction,
  } = useFavorites(collectionFixture.id);

  // Hook de fotos com carregamento progressivo determinístico (RF-006)
  const {
    photos: loadedPhotos,
    status: loadingStatus,
    hasMore,
    error: loadError,
    loadMore,
    retry,
  } = useGalleryProgressivePhotos({
    collectionId: collectionFixture.id,
    initialLimit: 16,
    batchLimit: 8,
  });

  // Diálogos
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string }>({
    title: collectionFixture.title,
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadTargetPhoto, setDownloadTargetPhoto] = useState<GalleryPhoto | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Telemetria: registro de visualização inicial da galeria
  useEffect(() => {
    telemetry.track('gallery_viewed', {
      collectionId: collectionFixture.id,
      metadata: { totalItems: collectionFixture.totalItems },
    });
  }, []);

  const selectedPhoto = useMemo(() => {
    if (!activePhotoId) return null;
    return (
      loadedPhotos.find((p) => p.id === activePhotoId) ??
      galleryPhotos.find((p) => p.id === activePhotoId) ??
      null
    );
  }, [activePhotoId, loadedPhotos]);

  const currentIndex = selectedPhoto
    ? galleryPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  }, []);

  // Sincronização estrita de URL e histórico (Seção 6)
  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo');
    const mode = params.get('mode');

    if (initialMountRef.current) {
      initialMountRef.current = false;
      if (photoId) {
        isDeepLinkOriginRef.current = true;
      }
    }

    if (photoId && galleryPhotos.some((p) => p.id === photoId)) {
      setActivePhotoId(photoId);
      setIsSlideshowActive(mode === 'slideshow');
    } else {
      setActivePhotoId(null);
      setIsSlideshowActive(false);
    }
  }, []);

  useEffect(() => {
    syncFromUrl();
    const handlePopState = () => syncFromUrl();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncFromUrl]);

  const updateUrl = useCallback((photoId: string | null, mode: 'push' | 'replace', isSlideshow = false) => {
    const nextUrl = new URL(window.location.href);

    if (photoId) {
      nextUrl.searchParams.set('photo', photoId);
      if (isSlideshow) {
        nextUrl.searchParams.set('mode', 'slideshow');
      } else {
        nextUrl.searchParams.delete('mode');
      }
    } else {
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('mode');
    }

    if (mode === 'push') {
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    } else {
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const openPhoto = useCallback(
    (photoId: string) => {
      setActivePhotoId(photoId);
      setIsSlideshowActive(false);
      updateUrl(photoId, 'push', false);

      telemetry.track('photo_opened', {
        collectionId: collectionFixture.id,
        photoId,
      });
    },
    [updateUrl],
  );

  const closePhoto = useCallback(() => {
    const closedPhotoId = activePhotoId;
    setActivePhotoId(null);
    setIsSlideshowActive(false);

    // Se a sessão iniciou por deep link direto, fecha removendo o parâmetro com replaceState (Seção 6)
    if (isDeepLinkOriginRef.current) {
      updateUrl(null, 'replace', false);
    } else {
      updateUrl(null, 'replace', false);
    }

    // Restaura foco acessível no elemento de origem
    if (closedPhotoId) {
      const cardEl = document.getElementById(`photo-card-${closedPhotoId}`);
      cardEl?.focus();
    }
  }, [activePhotoId, updateUrl]);

  const navigatePhoto = useCallback(
    (direction: number) => {
      if (!selectedPhoto) return;
      const current = galleryPhotos.findIndex((p) => p.id === selectedPhoto.id);
      const nextIndex = clamp(current + direction, 0, galleryPhotos.length - 1);
      const targetPhoto = galleryPhotos[nextIndex];
      if (!targetPhoto) return;

      setActivePhotoId(targetPhoto.id);
      // Navegação entre fotos usa replaceState para evitar poluir o histórico (Seção 6)
      updateUrl(targetPhoto.id, 'replace', isSlideshowActive);

      telemetry.track('photo_navigated', {
        collectionId: collectionFixture.id,
        photoId: targetPhoto.id,
        metadata: { direction },
      });
    },
    [isSlideshowActive, selectedPhoto, updateUrl],
  );

  const toggleFavorite = useCallback(
    (photoId: string) => {
      const added = toggleFavAction(photoId);
      if (added) {
        showToast('Fotografia adicionada aos favoritos');
        telemetry.track('photo_favorited', {
          collectionId: collectionFixture.id,
          photoId,
        });
      } else {
        showToast('Fotografia removida dos favoritos');
        telemetry.track('photo_unfavorited', {
          collectionId: collectionFixture.id,
          photoId,
        });
      }
    },
    [showToast, toggleFavAction],
  );

  const handleSharePhoto = useCallback((photo: GalleryPhoto) => {
    setShareData({
      title: `${photo.alt} — ${collectionFixture.title}`,
      url: `${window.location.origin}${window.location.pathname}?photo=${photo.id}`,
    });
    setIsShareOpen(true);

    telemetry.track('share_opened', {
      collectionId: collectionFixture.id,
      photoId: photo.id,
    });
  }, []);

  const handleShareCollection = useCallback(() => {
    setShareData({
      title: `${collectionFixture.title} — ${collectionFixture.businessName}`,
      url: `${window.location.origin}${window.location.pathname}`,
    });
    setIsShareOpen(true);

    telemetry.track('share_opened', {
      collectionId: collectionFixture.id,
    });
  }, []);

  const handleDownloadPhoto = useCallback((photo: GalleryPhoto) => {
    setDownloadTargetPhoto(photo);
    setIsDownloadOpen(true);

    telemetry.track('photo_download_started', {
      collectionId: collectionFixture.id,
      photoId: photo.id,
    });
  }, []);

  const handleDownloadCollection = useCallback(() => {
    setDownloadTargetPhoto(null);
    setIsDownloadOpen(true);

    telemetry.track('collection_download_started', {
      collectionId: collectionFixture.id,
    });
  }, []);

  const handleStartSlideshow = useCallback(() => {
    const firstPhoto = loadedPhotos[0] ?? galleryPhotos[0];
    if (firstPhoto) {
      setActivePhotoId(firstPhoto.id);
      setIsSlideshowActive(true);
      updateUrl(firstPhoto.id, 'push', true);

      telemetry.track('slideshow_started', {
        collectionId: collectionFixture.id,
        photoId: firstPhoto.id,
      });
    }
  }, [loadedPhotos, updateUrl]);

  const favoritePhotosList = useMemo(
    () => galleryPhotos.filter((p) => favoriteIds.has(p.id)),
    [favoriteIds],
  );

  return (
    <div className="gallery-app bg-[#0b0c0e] text-[#f5f5f4] min-h-screen">
      <AutoHideGalleryHeader
        collectionTitle={collectionFixture.title}
        favoriteCount={favoriteIds.size}
        downloadsEnabled={collectionFixture.downloads.enabled}
        isOwnerPreview={isOwnerPreview}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenDownload={handleDownloadCollection}
        onStartSlideshow={handleStartSlideshow}
        onShareCollection={handleShareCollection}
      />

      <main>
        <GalleryHero
          collection={collectionFixture}
          isOwnerPreview={isOwnerPreview}
        />

        <section id="gallery-grid" className="gallery-shell max-w-[1440px] mx-auto py-8 px-2 sm:px-4">
          <div className="gallery-meta flex justify-between items-center px-4 py-3 text-xs tracking-widest uppercase text-white/50 border-b border-white/5 mb-6">
            <span>
              {loadedPhotos.length} de {collectionFixture.totalItems} fotografias
            </span>
            <span>Modo Editorial</span>
          </div>

          <InfiniteMasonryGrid
            photos={loadedPhotos}
            status={loadingStatus}
            hasMore={hasMore}
            errorMessage={loadError}
            favoriteIds={favoriteIds}
            onOpenPhoto={openPhoto}
            onLoadMore={loadMore}
            onRetry={retry}
            onToggleFavorite={toggleFavorite}
            onDownload={handleDownloadPhoto}
            onShare={handleSharePhoto}
          />
        </section>
      </main>

      <BrandingFooter
        businessName={collectionFixture.businessName}
        totalItems={collectionFixture.totalItems}
      />

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          currentIndex={currentIndex}
          totalPhotos={galleryPhotos.length}
          isFavorite={favoriteIds.has(selectedPhoto.id)}
          isSlideshowActive={isSlideshowActive}
          onClose={closePhoto}
          onPrevious={() => navigatePhoto(-1)}
          onNext={() => navigatePhoto(1)}
          onToggleFavorite={toggleFavorite}
          onDownload={handleDownloadPhoto}
          onShare={handleSharePhoto}
          onToggleSlideshow={() => {
            setIsSlideshowActive((prev) => {
              const next = !prev;
              telemetry.track(next ? 'slideshow_started' : 'slideshow_paused', {
                collectionId: collectionFixture.id,
                photoId: selectedPhoto.id,
              });
              return next;
            });
          }}
          onPauseSlideshow={() => {
            setIsSlideshowActive(false);
            telemetry.track('slideshow_paused', {
              collectionId: collectionFixture.id,
              photoId: selectedPhoto.id,
            });
          }}
        />
      )}

      <ShareDialog
        isOpen={isShareOpen}
        title={shareData.title}
        url={shareData.url}
        onClose={() => setIsShareOpen(false)}
        onShowToast={showToast}
      />

      <DownloadDialog
        isOpen={isDownloadOpen}
        photo={downloadTargetPhoto}
        collectionTitle={collectionFixture.title}
        allowedSizes={collectionFixture.downloads.allowedSizes}
        requiresPin={collectionFixture.downloads.requiresPin}
        requiresEmail={collectionFixture.downloads.requiresEmail}
        onClose={() => setIsDownloadOpen(false)}
        onShowToast={showToast}
      />

      <FavoritesDialog
        isOpen={isFavoritesOpen}
        favorites={favoritePhotosList}
        onClose={() => setIsFavoritesOpen(false)}
        onOpenPhoto={openPhoto}
        onRemoveFavorite={removeFavAction}
        onDownloadFavorites={() => {
          setIsFavoritesOpen(false);
          setIsDownloadOpen(true);
        }}
      />

      <ToastRegion message={toastMessage} />
    </div>
  );
}
