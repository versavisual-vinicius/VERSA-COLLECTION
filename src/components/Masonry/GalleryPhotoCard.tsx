import React from 'react';
import type { GalleryPhoto } from '../../types/gallery';
import type { MasonryLayoutItem } from './useMasonryLayout';
import { ResponsivePhoto } from './ResponsivePhoto';
import { PhotoActions } from './PhotoActions';

interface GalleryPhotoCardProps {
  layoutItem: MasonryLayoutItem;
  priority?: boolean;
  isFavorite?: boolean;
  onOpenPhoto: (photoId: string) => void;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
}

export function GalleryPhotoCard({
  layoutItem,
  priority = false,
  isFavorite = false,
  onOpenPhoto,
  onToggleFavorite,
  onDownload,
  onShare,
}: GalleryPhotoCardProps) {
  const { photo, left, top, width, height } = layoutItem;

  return (
    <article
      id={`photo-card-${photo.id}`}
      className="masonry-card group"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <button
        type="button"
        className="photo-card"
        style={{ width: '100%', height: '100%' }}
        onClick={() => onOpenPhoto(photo.id)}
        aria-label={`Abrir fotografia ${photo.position} da coleção em tamanho ampliado`}
      >
        <ResponsivePhoto photo={photo} priority={priority} />
        <span className="photo-gradient" aria-hidden="true" />
      </button>

      <PhotoActions
        photo={photo}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onDownload={onDownload}
        onShare={onShare}
      />
    </article>
  );
}
