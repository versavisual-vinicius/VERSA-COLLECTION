import { useEffect, useRef } from 'react';
import type { GalleryPhoto } from '../../types/gallery';
import type { CullingStateMap } from '../../types/culling';

interface FilmstripBarProps {
  photos: GalleryPhoto[];
  activeIndex: number;
  cullingState: CullingStateMap;
  onSelectIndex: (index: number) => void;
}

export function FilmstripBar({
  photos,
  activeIndex,
  cullingState,
  onSelectIndex,
}: FilmstripBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll para centralizar a miniatura da foto ativa
  useEffect(() => {
    if (
      activeThumbnailRef.current &&
      typeof activeThumbnailRef.current.scrollIntoView === 'function'
    ) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  if (photos.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="h-20 bg-[#0a1117] border-t border-white/10 px-4 flex items-center gap-2 overflow-x-auto select-none no-scrollbar shrink-0"
      data-testid="filmstrip-bar"
    >
      {photos.map((photo, index) => {
        const isActive = index === activeIndex;
        const record = cullingState[photo.id];
        const flag = record?.flag || 'none';
        const rating = record?.rating || 0;
        const thumbnailSrc = photo.sources?.[photo.sources.length - 1]?.url || photo.shareUrl;

        return (
          <button
            type="button"
            key={photo.id}
            ref={isActive ? activeThumbnailRef : null}
            onClick={() => onSelectIndex(index)}
            data-testid={`filmstrip-thumb-${index}`}
            className={`relative shrink-0 h-14 aspect-square rounded-md overflow-hidden border transition-all ${
              isActive
                ? 'border-[#5E7F8C] ring-2 ring-[#5E7F8C] shadow-lg scale-105 z-10'
                : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
            }`}
            title={`${photo.fileName} (#${index + 1})`}
          >
            <img
              src={thumbnailSrc}
              alt={photo.fileName}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Selo indicador de Flag */}
            {flag === 'pick' && (
              <span
                data-testid={`thumb-pick-${index}`}
                className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-black shadow"
              />
            )}
            {flag === 'reject' && (
              <span
                data-testid={`thumb-reject-${index}`}
                className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-1 ring-black shadow"
              />
            )}

            {/* Selo indicador de Estrelas */}
            {rating > 0 && (
              <span
                data-testid={`thumb-rating-${index}`}
                className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold flex items-center gap-0.5"
              >
                ★{rating}
              </span>
            )}

            {/* Número do índice */}
            <span className="absolute top-1 right-1 text-[9px] font-mono text-white/50 px-0.5 bg-black/60 rounded">
              {index + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
