import type { GalleryPhoto } from '../../types/gallery';

interface LightboxToolbarProps {
  photo: GalleryPhoto;
  isFavorite?: boolean;
  isSlideshowActive?: boolean;
  isPrivate?: boolean;
  hasNote?: boolean;
  onClose: () => void;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
  onToggleSlideshow?: () => void;
  onTogglePrivate?: (photoId: string) => void;
  onOpenNoteEditor?: () => void;
}

export function LightboxToolbar({
  photo,
  isFavorite = false,
  isSlideshowActive = false,
  isPrivate = false,
  hasNote = false,
  onClose,
  onToggleFavorite,
  onDownload,
  onShare,
  onToggleSlideshow,
  onTogglePrivate,
  onOpenNoteEditor,
}: LightboxToolbarProps) {
  return (
    <div className="lightbox-toolbar absolute top-4 right-4 z-20 flex items-center gap-2">
      {onToggleSlideshow && (
        <button
          type="button"
          onClick={onToggleSlideshow}
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors text-xs"
          aria-label={isSlideshowActive ? 'Pausar apresentação' : 'Iniciar apresentação automática'}
          aria-pressed={isSlideshowActive}
        >
          {isSlideshowActive ? '⏸' : '▶'}
        </button>
      )}

      {/* Botão de Anotação do Cliente (paridade Pixieset isNoteOn / #sv-note-btn) */}
      {onOpenNoteEditor && (
        <button
          id="sv-note-btn"
          type="button"
          onClick={onOpenNoteEditor}
          className={`w-10 h-10 rounded-full border border-white/20 hover:bg-black/60 flex items-center justify-center transition-colors text-sm ${
            hasNote ? 'bg-[#5E7F8C] text-white border-[#5E7F8C]' : 'bg-black/40 text-white'
          }`}
          aria-label={hasNote ? 'Editar nota da fotografia' : 'Adicionar nota à fotografia'}
          title="Adicionar ou editar observação"
        >
          <span aria-hidden="true">💬</span>
        </button>
      )}

      {/* Botão de Foto Particular / Oculta (paridade Pixieset isMarkPrivateOn / #sv-lock-btn) */}
      {onTogglePrivate && (
        <button
          id="sv-lock-btn"
          type="button"
          onClick={() => onTogglePrivate(photo.id)}
          className={`w-10 h-10 rounded-full border border-white/20 hover:bg-black/60 flex items-center justify-center transition-colors text-sm ${
            isPrivate ? 'bg-amber-600/80 text-white border-amber-500' : 'bg-black/40 text-white'
          }`}
          aria-label={isPrivate ? 'Foto marcada como particular (visível apenas para você)' : 'Marcar foto como particular'}
          aria-pressed={isPrivate}
          title={isPrivate ? 'Foto particular' : 'Tornar foto particular'}
        >
          <span aria-hidden="true">{isPrivate ? '🔒' : '🔓'}</span>
        </button>
      )}

      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(photo.id)}
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={isFavorite}
        >
          <span aria-hidden="true" style={{ color: isFavorite ? '#ef4444' : 'currentColor' }}>
            ♥
          </span>
        </button>
      )}

      {onDownload && (
        <button
          type="button"
          onClick={() => onDownload(photo)}
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          aria-label="Baixar fotografia"
        >
          <span aria-hidden="true">↓</span>
        </button>
      )}

      {onShare && (
        <button
          type="button"
          onClick={() => onShare(photo)}
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          aria-label="Compartilhar fotografia"
        >
          <span aria-hidden="true">⇪</span>
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        className="px-4 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white text-xs font-medium tracking-wider uppercase transition-colors"
        aria-label="Fechar visualização ampliada"
      >
        Fechar
      </button>
    </div>
  );
}
