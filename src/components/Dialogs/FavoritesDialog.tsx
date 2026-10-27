import React, { useEffect, useRef } from 'react';
import type { GalleryPhoto } from '../../types/gallery';

interface FavoritesDialogProps {
  isOpen: boolean;
  favorites: GalleryPhoto[];
  onClose: () => void;
  onOpenPhoto: (photoId: string) => void;
  onRemoveFavorite: (photoId: string) => void;
  onDownloadFavorites?: () => void;
}

export function FavoritesDialog({
  isOpen,
  favorites,
  onClose,
  onOpenPhoto,
  onRemoveFavorite,
  onDownloadFavorites,
}: FavoritesDialogProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-dialog-title"
    >
      <div
        ref={modalRef}
        className="dialog-panel w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#111418] border border-white/10 p-6 shadow-2xl text-white"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 id="favorites-dialog-title" className="text-lg font-semibold">
              Meus Favoritos
            </h2>
            <p className="text-xs text-white/60">
              {favorites.length} {favorites.length === 1 ? 'fotografia selecionada' : 'fotografias selecionadas'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm"
            aria-label="Fechar diálogo de favoritos"
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-sm">
            Nenhuma fotografia favoritada ainda. Clique no coração em qualquer foto para guardá-la aqui.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1 mb-4">
              {favorites.map((photo) => (
                <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPhoto(photo.id);
                    }}
                    className="w-full h-full block"
                    aria-label={`Ver foto ${photo.position}`}
                  >
                    <img
                      src={photo.sources[0]?.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(photo.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover foto ${photo.position} dos favoritos`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {onDownloadFavorites && (
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={onDownloadFavorites}
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Baixar Selecionadas ({favorites.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
