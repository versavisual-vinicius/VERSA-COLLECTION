import { useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from '../../types/gallery';
import { useMasonryLayout, type MasonryLayoutOptions } from './useMasonryLayout';
import { GalleryPhotoCard } from './GalleryPhotoCard';
import type { LoadingStatus } from './useGalleryProgressivePhotos';
import { EmptyGalleryState } from '../Feedback/EmptyGalleryState';

interface InfiniteMasonryGridProps {
  photos: GalleryPhoto[];
  status?: LoadingStatus;
  hasMore?: boolean;
  errorMessage?: string | null;
  favoriteIds?: Set<string>;
  options?: MasonryLayoutOptions;
  isSetFilter?: boolean;
  onClearFilter?: () => void;
  onOpenPhoto: (photoId: string) => void;
  onLoadMore?: () => void;
  onRetry?: () => void;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
}

export function InfiniteMasonryGrid({
  photos,
  status = 'ready',
  hasMore = false,
  errorMessage,
  favoriteIds = new Set(),
  options,
  isSetFilter = false,
  onClearFilter,
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

  if (photos.length === 0 && status !== 'loading' && status !== 'loading-more') {
    return (
      <EmptyGalleryState
        isSetFilter={isSetFilter}
        onClearFilter={onClearFilter}
        onRefresh={onRetry}
      />
    );
  }

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

      {hasMore && status !== 'partial-error' && (
        <div
          ref={sentinelRef}
          className="h-10 w-full pointer-events-none opacity-0"
          aria-hidden="true"
          data-testid="prefetch-sentinel"
        />
      )}

      {status === 'loading-more' && (
        <div
          className="py-8 flex items-center justify-center gap-2 text-[#5A6872] text-xs tracking-wider uppercase"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-[#5E7F8C] animate-ping" />
          <span>Carregando mais fotografias...</span>
        </div>
      )}

      {status === 'partial-error' && onRetry && (
        <div
          className="my-8 p-6 rounded-none bg-red-50 border border-red-200 text-center flex flex-col items-center justify-center gap-3"
          role="alert"
        >
          <p className="text-xs text-red-700">
            {errorMessage ?? 'Ocorreu uma instabilidade momentânea ao carregar novas fotografias.'}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-[#050A0D] hover:bg-[#11161B] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Tentar carregar novamente
          </button>
        </div>
      )}

      {!hasMore && photos.length > 0 && status !== 'loading' && (
        <div className="py-12 text-center text-xs tracking-widest uppercase text-[#5A6872]/70 border-t border-[#5E7F8C]/15 mt-8">
          Todos os registros da coleção carregados ({photos.length})
        </div>
      )}
    </div>
  );
}
