import { useState } from 'react';
import type { GalleryPhoto } from '../../types/gallery';

interface ResponsivePhotoProps {
  photo: GalleryPhoto;
  priority?: boolean;
}

export function ResponsivePhoto({ photo, priority = false }: ResponsivePhotoProps) {
  const [hasError, setHasError] = useState(false);
  const primarySource = photo.sources[0];
  const src = primarySource?.url ?? '';

  // Constrói srcset caso existam múltiplas fontes
  const srcSet =
    photo.sources.length > 1
      ? photo.sources.map((s) => `${s.url} ${s.width}w`).join(', ')
      : undefined;

  const sizes = '(min-width: 900px) 25vw, (min-width: 600px) 33vw, 50vw';

  const focalStyle: React.CSSProperties = photo.focalPoint
    ? { objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%` }
    : {};

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#15191E] text-white/50"
        style={{
          aspectRatio: `${photo.width} / ${photo.height}`,
          backgroundColor: photo.dominantColor ?? '#15191E',
        }}
      >
        <span className="text-[10px] uppercase font-semibold text-[#5E7F8C] tracking-wider mb-1">
          Versa
        </span>
        <span className="text-[11px] text-white/40 font-mono truncate max-w-[120px]">
          {photo.fileName || photo.alt || 'Foto'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
      style={{
        ...focalStyle,
        backgroundColor: photo.dominantColor ?? '#1a1f26',
      }}
    />
  );
}
