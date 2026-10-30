import { useState } from 'react';
import type { ResponsiveImage } from '../../types/gallery';

interface ResponsiveCoverImageProps {
  cover: ResponsiveImage;
  focalPoint?: { x: number; y: number };
}

export function ResponsiveCoverImage({ cover, focalPoint = { x: 50, y: 50 } }: ResponsiveCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const primarySource = cover.sources[0];
  const src = primarySource?.url ?? '';

  const srcSet =
    cover.sources.length > 1
      ? cover.sources.map((s) => `${s.url} ${s.width}w`).join(', ')
      : undefined;

  if (hasError || !src) {
    return (
      <div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#050A0D] to-[#121A20]"
        style={{ backgroundColor: cover.dominantColor ?? '#050A0D' }}
      >
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#5E7F8C] uppercase block mb-1">
          VERSA VISUAL
        </span>
        <p className="text-sm font-['Outfit'] font-medium text-white/60">
          {cover.alt || 'Galeria Fotográfica'}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="100vw"
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading="eager"
      decoding="sync"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
        backgroundColor: cover.dominantColor ?? '#0b0c0e',
      }}
    />
  );
}
