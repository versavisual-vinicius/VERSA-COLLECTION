import type { GalleryPhoto } from '../../types/gallery';

interface PhotoActionsProps {
  photo: GalleryPhoto;
  isFavorite?: boolean;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
}

export function PhotoActions({
  photo,
  isFavorite = false,
  onToggleFavorite,
  onDownload,
  onShare,
}: PhotoActionsProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(photo.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(photo);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(photo);
  };

  return (
    <div
      className="photo-actions"
      role="toolbar"
      aria-label={`Ações da fotografia ${photo.position}`}
    >
      <button
        type="button"
        onClick={handleFavorite}
        aria-label={isFavorite ? `Remover fotografia ${photo.position} dos favoritos` : `Favoritar fotografia ${photo.position}`}
        aria-pressed={isFavorite}
        className={`photo-action-btn ${isFavorite ? 'favorite-active' : ''}`}
      >
        <span aria-hidden="true" style={{ color: isFavorite ? '#ef4444' : 'currentColor' }}>
          ♥
        </span>
      </button>

      <button
        type="button"
        onClick={handleDownload}
        aria-label={`Baixar fotografia ${photo.position}`}
        className="photo-action-btn"
      >
        <span aria-hidden="true">↓</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label={`Compartilhar fotografia ${photo.position}`}
        className="photo-action-btn"
      >
        <span aria-hidden="true">⇪</span>
      </button>
    </div>
  );
}
