import React, { useRef } from 'react';
import type { GalleryPhoto } from '../../types/gallery';

interface MediaStageProps {
  photo: GalleryPhoto;
  onPrevious?: () => void;
  onNext?: () => void;
}

/**
 * MediaStage (RF-008):
 * - Imagem com contenção total (sem corte).
 * - Suporte a gestos touch/swipe horizontal (limiar de 50px).
 * - Clique lateral para navegação rápida.
 */
export function MediaStage({ photo, onPrevious, onNext }: MediaStageProps) {
  const primarySource = photo.sources[0];
  const src = primarySource?.url ?? '';

  const touchStartCoordsRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartCoordsRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoordsRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartCoordsRef.current.x;
    const deltaY = touch.clientY - touchStartCoordsRef.current.y;
    touchStartCoordsRef.current = null;

    // Apenas considera gesto horizontal se deltaX > 50px e for dominante em relação a Y
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        onPrevious?.();
      } else {
        onNext?.();
      }
    }
  };

  return (
    <div
      className="lightbox-media-wrap relative flex-1 w-full h-full flex items-center justify-center p-4 sm:p-8 select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Se clicar no terço esquerdo ou direito da viewport, navega
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width * 0.3) {
          onPrevious?.();
        } else if (clickX > rect.width * 0.7) {
          onNext?.();
        }
      }}
    >
      <img
        src={src}
        alt={photo.alt}
        referrerPolicy="no-referrer"
        className="max-h-[85vh] max-w-[92vw] w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-200 pointer-events-none"
        style={{
          backgroundColor: photo.dominantColor ?? '#0b0c0e',
        }}
      />
    </div>
  );
}
