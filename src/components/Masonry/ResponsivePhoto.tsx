import { useEffect, useState } from 'react';
import type { GalleryPhoto } from '../../types/gallery';

interface ResponsivePhotoProps {
  photo: GalleryPhoto;
  priority?: boolean;
}

function extractDriveFileId(url?: string, shareUrl?: string): string | null {
  if (shareUrl && /^[a-zA-Z0-9_-]{20,}$/.test(shareUrl)) return shareUrl;
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function ResponsivePhoto({ photo, priority = false }: ResponsivePhotoProps) {
  const [stage, setStage] = useState<'primary' | 'drive-thumb' | 'retry' | 'failed'>('primary');
  const [isLoaded, setIsLoaded] = useState(false);

  // Limita fontes da grade a w <= 1280 para evitar download simultâneo de arquivos de 15MB–22MB (=s0 / =w3600)
  const gridSources = (photo.sources ?? []).filter(
    (s) => !s.url.endsWith('=s0') && s.width <= 1280,
  );
  const primarySource = gridSources[0] ?? photo.sources?.[0];
  const primarySrc = primarySource?.url ?? '';

  const fileId = extractDriveFileId(primarySrc, photo.shareUrl);
  const driveThumbUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    : '';

  useEffect(() => {
    setStage('primary');
    setIsLoaded(false);
  }, [primarySrc]);

  const srcSet =
    stage === 'primary' && gridSources.length > 1
      ? gridSources.map((s) => `${s.url} ${s.width}w`).join(', ')
      : undefined;

  const sizes = '(min-width: 900px) 25vw, (min-width: 600px) 33vw, 50vw';

  const focalStyle: React.CSSProperties = photo.focalPoint
    ? { objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%` }
    : {};

  let activeSrc = primarySrc;
  if (stage === 'drive-thumb') {
    activeSrc = driveThumbUrl || primarySrc;
  } else if (stage === 'retry') {
    const base = driveThumbUrl || primarySrc;
    activeSrc = `${base}${base.includes('?') ? '&' : '?'}retry=1`;
  }

  const handleError = () => {
    if (stage === 'primary' && driveThumbUrl && driveThumbUrl !== primarySrc) {
      setStage('drive-thumb');
    } else if (stage === 'primary' || stage === 'drive-thumb') {
      setStage('retry');
    } else {
      setStage('failed');
    }
  };

  const cleanFileName = (photo.fileName || photo.alt || 'Foto').replace(/^\._/, '');

  if (stage === 'failed' || !activeSrc) {
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
          {cleanFileName}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#E5E9EC]">
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#E2E6EA] via-[#EEF1F4] to-[#E2E6EA]"
        />
      )}
      <img
        src={activeSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.015] group-focus-visible:scale-[1.015]"
        style={{
          ...focalStyle,
          backgroundColor: photo.dominantColor ?? '#E5E9EC',
        }}
      />
    </div>
  );
}
