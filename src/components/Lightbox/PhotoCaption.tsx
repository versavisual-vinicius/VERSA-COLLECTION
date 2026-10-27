import React from 'react';
import type { GalleryPhoto } from '../../types/gallery';

interface PhotoCaptionProps {
  photo: GalleryPhoto;
  currentIndex: number;
  totalPhotos: number;
}

export function PhotoCaption({ photo, currentIndex, totalPhotos }: PhotoCaptionProps) {
  return (
    <div className="lightbox-footer absolute bottom-4 inset-x-0 z-20 flex flex-col sm:flex-row items-center justify-between px-6 pointer-events-none text-white/80 text-xs">
      <div className="caption-text pointer-events-auto">
        {photo.caption && <span className="bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">{photo.caption}</span>}
      </div>

      <div className="photo-counter pointer-events-auto bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm tracking-wider font-mono text-[11px] mt-2 sm:mt-0">
        <span>{currentIndex + 1}</span>
        <span className="mx-1 text-white/40">/</span>
        <span>{totalPhotos}</span>
      </div>
    </div>
  );
}
