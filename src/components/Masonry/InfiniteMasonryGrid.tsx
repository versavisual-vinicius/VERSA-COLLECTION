import React, { useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from '../../types/gallery';
import { useMasonryLayout, type MasonryLayoutOptions } from './useMasonryLayout';
import { GalleryPhotoCard } from './GalleryPhotoCard';
import type { LoadingStatus } from './useGalleryProgressivePhotos';

interface InfiniteMasonryGridProps {
  photos: GalleryPhoto[];
  status?: LoadingStatus;
  hasMore?: boolean;
  errorMessage?: string | null;
  favoriteIds?: Set<string>;
  options?: MasonryLayoutOptions;
  onOpenPhoto: (photoId: string) => void;
  onLoadMore?: () => void;
  onRetry?: () => void;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
}

/**
 * Grade Masonry Infinita e Calculada (RF-005 e RF-006):
 * - Medição responsiva da largura do container.
 * - Posicionamento determinístico por menor altura acumulada.
 * - Sentinela com IntersectionObserver (rootMargin: '150% 0px') para prefetch antecipado.
 * - Tratamento de estados: loading-more, partial-error com retry sem duplicações.
 */
export function InfiniteMasonryGrid({
  photos,
  status = 'ready',
  hasMore = false,
  errorMessage,
  favoriteIds = new Set(),
  options,
  onOpenPhoto,
  onLoadMore,
  onRetry,
  onToggleFavorite,
  onDownload,
  onShare,
}: InfiniteMasonryGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(window.innerWidth, 1440) : 1154,
  );

  // Monitora alterações de largura do container
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const updateWidth = () => {
      const clientWidth = element.clientWidth;
      if (clientWidth > 0) {
        setContainerWidth(clientWidth);
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            setContainerWidth(width);
          }
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // IntersectionObserver com rootMargin: '150% 0px' para prefetch antecipado (RF-006)
  useEffect(() => {
    if (!hasMore || !onLoadMore || status === 'loading-more' || status === 'loading' || status === 'partial-error') {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: '150% 0px',
        threshold: 0.01,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, onLoadMore, status]);

  const { layoutItems, totalHeight, columnCount } = useMasonryLayout(photos, containerWidth, options);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="calculated-masonry-container relative w-full"
        style={{
          height: `${totalHeight}px`,
          minHeight: '200px',
        }}
        data-testid="infinite-masonry-grid"
        data-columns={columnCount}
      >
        {layoutItems.map((item, index) => (
          <GalleryPhotoCard
            key={item.photo.id}
            layoutItem={item}
            priority={index < 4}
            isFavorite={favoriteIds.has(item.photo.id)}
            onOpenPhoto={onOpenPhoto}
            onToggleFavorite={onToggleFavorite}
            onDownload={onDownload}
            onShare={onShare}
          />
        ))}
      </div>

      {/* Sentinela invisível para disparar o prefetch do próximo lote */}
      {hasMore && status !== 'partial-error' && (
        <div
          ref={sentinelRef}
          className="h-10 w-full pointer-events-none opacity-0"
          aria-hidden="true"
          data-testid="prefetch-sentinel"
        />
      )}

      {/* Estado: Carregando mais itens */}
      {status === 'loading-more' && (
        <div
          className="py-8 flex items-center justify-center gap-2 text-white/50 text-xs tracking-wider uppercase"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-white/40 animate-ping" />
          <span>Carregando mais fotografias...</span>
        </div>
      )}

      {/* Estado: Erro parcial com botão de retry sem remover fotos já exibidas */}
      {status === 'partial-error' && onRetry && (
        <div
          className="my-8 p-6 rounded-2xl bg-red-950/30 border border-red-500/20 text-center flex flex-col items-center justify-center gap-3"
          role="alert"
        >
          <p className="text-xs text-red-200">
            {errorMessage ?? 'Ocorreu uma instabilidade momentânea ao carregar novas fotografias.'}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
          >
            Tentar carregar novamente
          </button>
        </div>
      )}

      {/* Indicador de finalização da galeria */}
      {!hasMore && photos.length > 0 && status !== 'loading' && (
        <div className="py-12 text-center text-xs tracking-widest uppercase text-white/30 border-t border-white/5 mt-8">
          Todos os registros da coleção carregados ({photos.length})
        </div>
      )}
    </div>
  );
}
