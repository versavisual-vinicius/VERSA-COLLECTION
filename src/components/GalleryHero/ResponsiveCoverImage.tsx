import { useEffect, useState } from 'react';
import type { ResponsiveImage } from '../../types/gallery';

interface ResponsiveCoverImageProps {
  cover: ResponsiveImage;
  focalPoint?: { x: number; y: number };
}

function extractDriveFileId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function ResponsiveCoverImage({
  cover,
  focalPoint = { x: 50, y: 50 },
}: ResponsiveCoverImageProps) {
  const [stage, setStage] = useState<'primary' | 'drive-thumb' | 'failed'>('primary');

  // Seleciona fonte otimizada para Hero (w=1024 ou w=2048), evitando =s0 de 20MB que trava o 1º carregamento
  const usableSources = (cover.sources ?? []).filter((s) => !s.url.endsWith('=s0'));
  const preferredSource =
    usableSources.find((s) => s.width >= 1024 && s.width <= 2048) ??
    usableSources[0] ??
    cover.sources?.[0];
  const primarySrc = preferredSource?.url ?? '';

  const fileId = extractDriveFileId(primarySrc);
  const fallbackThumbUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
    : '';

  useEffect(() => {
    setStage('primary');
  }, [primarySrc]);

  const srcSet =
    stage === 'primary' && usableSources.length > 1
      ? usableSources
          .filter((s) => s.width <= 2400)
          .map((s) => `${s.url} ${s.width}w`)
          .join(', ')
      : undefined;

  const activeSrc = stage === 'primary' ? primarySrc : fallbackThumbUrl;

  if (stage === 'failed' || !activeSrc) {
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
      src={activeSrc}
      srcSet={srcSet}
      sizes="100vw"
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading="eager"
      decoding="sync"
      referrerPolicy="no-referrer"
      onError={() => {
        if (stage === 'primary' && fallbackThumbUrl && fallbackThumbUrl !== primarySrc) {
          setStage('drive-thumb');
        } else {
          setStage('failed');
        }
      }}
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
        backgroundColor: cover.dominantColor ?? '#0b0c0e',
      }}
    />
  );
}
