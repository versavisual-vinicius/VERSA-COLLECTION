import type { ResponsiveImage } from '../../types/gallery';

interface ResponsiveCoverImageProps {
  cover: ResponsiveImage;
  focalPoint?: { x: number; y: number };
}

export function ResponsiveCoverImage({ cover, focalPoint = { x: 50, y: 50 } }: ResponsiveCoverImageProps) {
  const primarySource = cover.sources[0];
  const src = primarySource?.url ?? '';

  const srcSet =
    cover.sources.length > 1
      ? cover.sources.map((s) => `${s.url} ${s.width}w`).join(', ')
      : undefined;

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
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
        backgroundColor: cover.dominantColor ?? '#0b0c0e',
      }}
    />
  );
}
