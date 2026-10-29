import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GalleryPhoto, GalleryPageResponse, PageCursor } from '../types/gallery';
import { getCollectionData, getCollectionPage, availableCollections } from '../data/collectionsRegistry';
import { hasClientSession } from '../lib/collectionSettings';
import { AutoHideGalleryHeader } from './Header/AutoHideGalleryHeader';
import { GalleryHero } from './GalleryHero/GalleryHero';
import { GallerySetsNav } from './Navigation/GallerySetsNav';
import { InfiniteMasonryGrid } from './Masonry/InfiniteMasonryGrid';
import { useGalleryProgressivePhotos } from './Masonry/useGalleryProgressivePhotos';
import { PhotoLightbox } from './Lightbox/PhotoLightbox';
import { ShareDialog } from './Dialogs/ShareDialog';
import { DownloadDialog } from './Dialogs/DownloadDialog';
import { FavoritesDialog } from './Dialogs/FavoritesDialog';
import { ToastRegion } from './Feedback/ToastRegion';
import { BrandingFooter } from './Footer/BrandingFooter';
import { GalleryPasswordGate } from './Security/GalleryPasswordGate';
import { ExpiredCollectionScreen } from './Feedback/ExpiredCollectionScreen';
import { AdminPanel } from './Admin/AdminPanel';
import { useFavorites } from '../lib/useFavorites';
import { telemetry } from '../lib/telemetry';
import {
  BackendError,
  backendEnabled,
  fetchCollectionBundle,
  unlockCollection,
  type ProtectedCollectionError,
} from '../lib/backend';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface GalleryPageProps {
  isOwnerPreview?: boolean;
  collectionSlug?: string;
}

export function GalleryPage({ isOwnerPreview = false, collectionSlug: propSlug }: GalleryPageProps) {
  // Determina a coleção ativa: prop -> URL param -> fallback 'fixture'
  const activeSlug = useMemo(() => {
    if (propSlug) return propSlug;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSlug = params.get('collection');
      if (urlSlug && availableCollections[urlSlug]) return urlSlug;
    }
    return 'fixture';
  }, [propSlug]);

  const staticData = useMemo(() => {
    return getCollectionData(activeSlug);
  }, [activeSlug]);
  const [runtimeData, setRuntimeData] = useState(staticData);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'ready' | 'error'>(
    backendEnabled ? 'loading' : 'ready',
  );
  const [backendError, setBackendError] = useState<string | null>(null);
  const [requiresAccessEmail, setRequiresAccessEmail] = useState(false);
  const { collection, photos: allPhotos } = backendEnabled ? runtimeData : staticData;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (backendEnabled) return false;
    if (isOwnerPreview) return true;
    return !collection.passwordRequired || hasClientSession(collection.id);
  });

  const loadBackendCollection = useCallback(async () => {
    setBackendStatus('loading');
    setBackendError(null);
    try {
      const bundle = await fetchCollectionBundle(activeSlug);
      setRuntimeData(bundle);
      setIsUnlocked(true);
      setRequiresAccessEmail(false);
      setBackendStatus('ready');
    } catch (reason) {
      if (reason instanceof BackendError && reason.code === 'PASSWORD_REQUIRED') {
        const challenge = reason.details as ProtectedCollectionError;
        setRuntimeData({ collection: challenge.collection, photos: [] });
        setRequiresAccessEmail(challenge.requiresEmail);
        setIsUnlocked(false);
        setBackendStatus('ready');
        return;
      }
      setBackendError(reason instanceof Error ? reason.message : 'Coleção indisponível.');
      setBackendStatus('error');
    }
  }, [activeSlug]);

  // Controle do Painel Administrativo do Vini
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true';
    }
    return false;
  });

  // Controle de liberação de senha para o cliente
  useEffect(() => {
    if (backendEnabled) return;
    if (isOwnerPreview) {
      setIsUnlocked(true);
      return;
    }
    setIsUnlocked(!collection.passwordRequired || hasClientSession(collection.id));
  }, [collection.id, collection.passwordRequired, isOwnerPreview]);

  useEffect(() => {
    if (!backendEnabled) return;
    void loadBackendCollection();
  }, [loadBackendCollection]);

  // Atalho de teclado: Shift + A para abrir/fechar Painel do Vini
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        (e.key === 'A' || e.key === 'a') &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  }, []);

  // Sub-conjuntos e Sub-galerias (Paridade Pixieset #nav-galleries / sets)
  const [activeSetId, setActiveSetId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('set');
    }
    return null;
  });

  // Marcação de fotos particulares do cliente (Paridade Pixieset isMarkPrivateOn / #sv-lock-btn)
  const [privatePhotoIds, setPrivatePhotoIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`versa_private_${collection.id}`);
        if (raw) return new Set(JSON.parse(raw));
      } catch {
        // Armazenamento pode estar indisponível em modo privado.
      }
    }
    return new Set();
  });

  const togglePrivatePhoto = useCallback(
    (photoId: string) => {
      setPrivatePhotoIds((prev) => {
        const next = new Set(prev);
        if (next.has(photoId)) {
          next.delete(photoId);
          showToast('Foto desmarcada como particular');
        } else {
          next.add(photoId);
          showToast('Foto marcada como particular');
        }
        try {
          localStorage.setItem(`versa_private_${collection.id}`, JSON.stringify(Array.from(next)));
        } catch {
          // A marcação continua válida em memória.
        }
        return next;
      });
    },
    [collection.id, showToast],
  );

  // Registra se a sessão atual teve entrada direta por URL profunda (Seção 6)
  const isDeepLinkOriginRef = useRef<boolean>(false);
  const initialMountRef = useRef<boolean>(true);

  // Hook de favoritos com persistência local e otimismo reversível (RF-010 e Paridade Pixieset isNoteOn)
  const {
    favoriteIds,
    favoriteNotes,
    clientEmail,
    toggleFavorite: toggleFavAction,
    removeFavorite: removeFavAction,
    updateFavoriteNote,
    syncWithEmail,
  } = useFavorites(collection.id);

  // Fetcher progressivo determinístico baseado na coleção ativa
  const fetcher = useCallback(
    async (cursor: PageCursor | null, limit: number): Promise<GalleryPageResponse> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getCollectionPage(allPhotos, cursor, limit));
        }, 15);
      });
    },
    [allPhotos],
  );

  // Hook de fotos com carregamento progressivo determinístico (RF-006)
  const {
    photos: loadedPhotos,
    status: loadingStatus,
    hasMore,
    error: loadError,
    loadMore,
    retry,
  } = useGalleryProgressivePhotos({
    collectionId: collection.id,
    initialLimit: 16,
    batchLimit: 8,
    fetcher: activeSlug !== 'fixture' ? fetcher : undefined,
  });

  // Diálogos
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string }>({
    title: collection.title,
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadTargetPhoto, setDownloadTargetPhoto] = useState<GalleryPhoto | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Telemetria: registro de visualização inicial da galeria
  useEffect(() => {
    telemetry.track('gallery_viewed', {
      collectionId: collection.id,
      metadata: { totalItems: collection.totalItems },
    });
  }, [collection.id, collection.totalItems]);

  const selectedPhoto = useMemo(() => {
    if (!activePhotoId) return null;
    return (
      loadedPhotos.find((p) => p.id === activePhotoId) ??
      allPhotos.find((p) => p.id === activePhotoId) ??
      null
    );
  }, [activePhotoId, loadedPhotos, allPhotos]);

  const currentIndex = selectedPhoto
    ? allPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  // Seleção e sincronização de Sub-conjuntos/Sets (Pixieset #nav-galleries)
  const handleSelectSet = useCallback((setId: string | null) => {
    setActiveSetId(setId);
    const nextUrl = new URL(window.location.href);
    if (setId) {
      nextUrl.searchParams.set('set', setId);
    } else {
      nextUrl.searchParams.delete('set');
    }
    window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
  }, []);

  // Filtragem de fotos pelo conjunto ativo
  const filteredPhotosBySet = useMemo(() => {
    if (!activeSetId) return allPhotos;
    const currentSet = collection.sets?.find((s) => s.id === activeSetId || s.slug === activeSetId);
    return allPhotos.filter((p) => {
      if (currentSet?.photoIds && currentSet.photoIds.length > 0) {
        return currentSet.photoIds.includes(p.id);
      }
      return p.setId === activeSetId || (currentSet && p.setId === currentSet.id);
    });
  }, [allPhotos, activeSetId, collection.sets]);

  // Lista de fotos a exibir no grid: se houver set ativo exibe o set; caso contrário carregamento progressivo
  const displayedPhotos = useMemo(() => {
    if (activeSetId) return filteredPhotosBySet;
    return loadedPhotos;
  }, [activeSetId, filteredPhotosBySet, loadedPhotos]);

  // Sincronização estrita de URL e histórico (Seção 6 e Paridade Pixieset com suporte a ?photo= e ?pid=)
  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo') || params.get('pid');
    const mode = params.get('mode');

    if (initialMountRef.current) {
      initialMountRef.current = false;
      if (photoId) {
        isDeepLinkOriginRef.current = true;
      }
    }

    if (photoId && allPhotos.some((p) => p.id === photoId)) {
      setActivePhotoId(photoId);
      setIsSlideshowActive(mode === 'slideshow');
    } else {
      setActivePhotoId(null);
      setIsSlideshowActive(false);
    }
  }, [allPhotos]);

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
      nextUrl.searchParams.delete('pid'); // Higieniza mantendo padrão canônico photo
      if (isSlideshow) {
        nextUrl.searchParams.set('mode', 'slideshow');
      } else {
        nextUrl.searchParams.delete('mode');
      }
    } else {
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
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
        collectionId: collection.id,
        photoId,
      });
    },
    [collection.id, updateUrl],
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
      const current = allPhotos.findIndex((p) => p.id === selectedPhoto.id);
      // Slideshow opera em loop circular (paridade Pixieset circular: true); navegação manual usa clamp nas bordas
      const nextIndex = isSlideshowActive
        ? (current + direction + allPhotos.length) % allPhotos.length
        : clamp(current + direction, 0, allPhotos.length - 1);
      const targetPhoto = allPhotos[nextIndex];
      if (!targetPhoto) return;

      setActivePhotoId(targetPhoto.id);
      // Navegação entre fotos usa replaceState para evitar poluir o histórico (Seção 6)
      updateUrl(targetPhoto.id, 'replace', isSlideshowActive);

      telemetry.track('photo_navigated', {
        collectionId: collection.id,
        photoId: targetPhoto.id,
        metadata: { direction },
      });
    },
    [allPhotos, collection.id, isSlideshowActive, selectedPhoto, updateUrl],
  );

  const toggleFavorite = useCallback(
    (photoId: string) => {
      const added = toggleFavAction(photoId);
      if (added) {
        showToast('Fotografia adicionada aos favoritos');
        telemetry.track('photo_favorited', {
          collectionId: collection.id,
          photoId,
        });
      } else {
        showToast('Fotografia removida dos favoritos');
        telemetry.track('photo_unfavorited', {
          collectionId: collection.id,
          photoId,
        });
      }
    },
    [collection.id, showToast, toggleFavAction],
  );

  const handleSharePhoto = useCallback((photo: GalleryPhoto) => {
    setShareData({
      title: `${photo.alt} — ${collection.title}`,
      url: `${window.location.origin}${window.location.pathname}?photo=${photo.id}`,
    });
    setIsShareOpen(true);

    telemetry.track('share_opened', {
      collectionId: collection.id,
      photoId: photo.id,
    });
  }, [collection.id, collection.title]);

  const handleShareCollection = useCallback(() => {
    setShareData({
      title: `${collection.title} — ${collection.businessName}`,
      url: `${window.location.origin}${window.location.pathname}`,
    });
    setIsShareOpen(true);

    telemetry.track('share_opened', {
      collectionId: collection.id,
    });
  }, [collection.businessName, collection.id, collection.title]);

  const handleDownloadPhoto = useCallback((photo: GalleryPhoto) => {
    setDownloadTargetPhoto(photo);
    setIsDownloadOpen(true);

    telemetry.track('photo_download_started', {
      collectionId: collection.id,
      photoId: photo.id,
    });
  }, [collection.id]);

  const handleDownloadCollection = useCallback(() => {
    setDownloadTargetPhoto(null);
    setIsDownloadOpen(true);

    telemetry.track('collection_download_started', {
      collectionId: collection.id,
    });
  }, [collection.id]);

  const handleStartSlideshow = useCallback(() => {
    const firstPhoto = loadedPhotos[0] ?? allPhotos[0];
    if (firstPhoto) {
      setActivePhotoId(firstPhoto.id);
      setIsSlideshowActive(true);
      updateUrl(firstPhoto.id, 'push', true);

      telemetry.track('slideshow_started', {
        collectionId: collection.id,
        photoId: firstPhoto.id,
      });
    }
  }, [allPhotos, collection.id, loadedPhotos, updateUrl]);

  const favoritePhotosList = useMemo(
    () => allPhotos.filter((p) => favoriteIds.has(p.id)),
    [allPhotos, favoriteIds],
  );

  if (backendEnabled && backendStatus === 'loading') {
    return <div className="min-h-screen bg-[#050A0D] text-white grid place-items-center">Carregando galeria…</div>;
  }

  if (backendEnabled && backendStatus === 'error') {
    return <div role="alert" className="min-h-screen bg-[#050A0D] text-white grid place-items-center p-6 text-center">{backendError}</div>;
  }

  const isCollectionExpired = Boolean(
    collection.expiresAt && !isOwnerPreview && new Date(collection.expiresAt).getTime() < Date.now(),
  );

  if (isCollectionExpired) {
    return (
      <>
        <ExpiredCollectionScreen
          collection={collection}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug={activeSlug}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </>
    );
  }

  if (!isUnlocked) {
    return (
      <>
        <GalleryPasswordGate
          collection={collection}
          requiresEmail={requiresAccessEmail}
          onAuthenticate={backendEnabled ? (password, email) => unlockCollection(activeSlug, password, email) : undefined}
          onUnlocked={backendEnabled ? loadBackendCollection : () => setIsUnlocked(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug={activeSlug}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="gallery-app bg-[#0b0c0e] text-[#f5f5f4] min-h-screen">
      <AutoHideGalleryHeader
        collectionTitle={collection.title}
        favoriteCount={favoriteIds.size}
        downloadsEnabled={collection.downloads.enabled}
        isOwnerPreview={isOwnerPreview}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenDownload={handleDownloadCollection}
        onStartSlideshow={handleStartSlideshow}
        onShareCollection={handleShareCollection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        <GalleryHero
          collection={collection}
          isOwnerPreview={isOwnerPreview}
        />

        {collection.sets && collection.sets.length > 0 && (
          <div className="max-w-[1440px] mx-auto">
            <GallerySetsNav
              sets={collection.sets}
              activeSetId={activeSetId}
              totalPhotos={collection.totalItems}
              onSelectSet={handleSelectSet}
            />
          </div>
        )}

        <section id="gallery-grid" className="gallery-shell max-w-[1440px] mx-auto py-8 px-2 sm:px-4">
          <div className="gallery-meta flex justify-between items-center px-4 py-3 text-xs tracking-widest uppercase text-white/50 border-b border-white/5 mb-6">
            <span>
              {displayedPhotos.length} de {collection.totalItems} fotografias
              {activeSetId && ' (Filtrado por conjunto)'}
            </span>
            <span>Modo Editorial</span>
          </div>

          <InfiniteMasonryGrid
            photos={displayedPhotos}
            status={loadingStatus}
            hasMore={activeSetId ? false : hasMore}
            errorMessage={loadError}
            favoriteIds={favoriteIds}
            isSetFilter={Boolean(activeSetId)}
            onClearFilter={() => handleSelectSet(null)}
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
        businessName={collection.businessName}
        totalItems={collection.totalItems}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          currentIndex={currentIndex}
          totalPhotos={allPhotos.length}
          isFavorite={favoriteIds.has(selectedPhoto.id)}
          isSlideshowActive={isSlideshowActive}
          note={favoriteNotes[selectedPhoto.id] || ''}
          isPrivate={privatePhotoIds.has(selectedPhoto.id)}
          onClose={closePhoto}
          onPrevious={() => navigatePhoto(-1)}
          onNext={() => navigatePhoto(1)}
          onToggleFavorite={toggleFavorite}
          onDownload={handleDownloadPhoto}
          onShare={handleSharePhoto}
          onUpdateNote={updateFavoriteNote}
          onTogglePrivate={togglePrivatePhoto}
          onToggleSlideshow={() => {
            setIsSlideshowActive((prev) => {
              const next = !prev;
              telemetry.track(next ? 'slideshow_started' : 'slideshow_paused', {
                collectionId: collection.id,
                photoId: selectedPhoto.id,
              });
              return next;
            });
          }}
          onPauseSlideshow={() => {
            setIsSlideshowActive(false);
            telemetry.track('slideshow_paused', {
              collectionId: collection.id,
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
        collectionTitle={collection.title}
        collectionSlug={collection.slug}
        allowedSizes={collection.downloads.allowedSizes}
        requiresPin={collection.downloads.requiresPin}
        requiresEmail={collection.downloads.requiresEmail}
        directFolderUrl={collection.downloads.directFolderUrl}
        onClose={() => setIsDownloadOpen(false)}
        onShowToast={showToast}
      />

      <FavoritesDialog
        isOpen={isFavoritesOpen}
        favorites={favoritePhotosList}
        favoriteNotes={favoriteNotes}
        clientEmail={clientEmail}
        onSyncEmail={syncWithEmail}
        onClose={() => setIsFavoritesOpen(false)}
        onOpenPhoto={openPhoto}
        onRemoveFavorite={removeFavAction}
        onUpdateNote={updateFavoriteNote}
        onZipDownloaded={(count) => showToast(`Arquivo ZIP com ${count} foto(s) gerado com sucesso!`)}
        onDownloadFavorites={() => {
          setIsFavoritesOpen(false);
          setIsDownloadOpen(true);
        }}
      />

      <ToastRegion message={toastMessage} />

      {isAdminOpen && (
        <AdminPanel
          initialSlug={activeSlug}
          onClose={() => setIsAdminOpen(false)}
          onSelectCollection={(slug) => {
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('collection', slug);
            window.history.pushState({}, '', nextUrl.toString());
          }}
        />
      )}
    </div>
  );
}
