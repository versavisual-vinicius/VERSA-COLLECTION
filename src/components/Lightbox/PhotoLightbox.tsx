import { useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from '../../types/gallery';
import { MediaStage } from './MediaStage';
import { LightboxToolbar } from './LightboxToolbar';
import { PreviousNextNavigation } from './PreviousNextNavigation';
import { PhotoCaption } from './PhotoCaption';
import { SlideshowController } from './SlideshowController';

interface PhotoLightboxProps {
  photo: GalleryPhoto | null;
  currentIndex: number;
  totalPhotos: number;
  isFavorite?: boolean;
  isSlideshowActive?: boolean;
  note?: string;
  isPrivate?: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFavorite?: (photoId: string) => void;
  onDownload?: (photo: GalleryPhoto) => void;
  onShare?: (photo: GalleryPhoto) => void;
  onToggleSlideshow?: () => void;
  onPauseSlideshow?: () => void;
  onUpdateNote?: (photoId: string, note: string) => void;
  onTogglePrivate?: (photoId: string) => void;
}

/**
 * PhotoLightbox (RF-008 e RF-009):
 * - Lock de scroll no body (`overflow: hidden`).
 * - Navegação por teclado: Escape, ArrowLeft, ArrowRight, Espaço (slideshow pause/play), Tab (trap de foco).
 * - Restauração de foco no elemento de origem ao fechar.
 * - Auto-hide dos controles após 2 segundos de inatividade durante apresentação.
 */
export function PhotoLightbox({
  photo,
  currentIndex,
  totalPhotos,
  isFavorite = false,
  isSlideshowActive = false,
  note = '',
  isPrivate = false,
  onClose,
  onPrevious,
  onNext,
  onToggleFavorite,
  onDownload,
  onShare,
  onToggleSlideshow,
  onPauseSlideshow,
  onUpdateNote,
  onTogglePrivate,
}: PhotoLightboxProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const inactivityTimerRef = useRef<number | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);

  useEffect(() => {
    setNoteDraft(note);
    setIsNoteEditorOpen(false);
  }, [photo?.id, note]);

  // Focus lock e restore
  useEffect(() => {
    if (!photo) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [photo]);

  // Auto-hide dos controles após 2 segundos de inatividade durante slideshow (RF-009)
  const resetInactivityTimer = () => {
    setControlsVisible(true);
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }

    if (isSlideshowActive) {
      inactivityTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (isSlideshowActive) {
      resetInactivityTimer();
    } else {
      setControlsVisible(true);
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
    }

    return () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isSlideshowActive]);

  useEffect(() => {
    if (!photo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      resetInactivityTimer();

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevious();
      }

      if (e.key === ' ' && onToggleSlideshow) {
        e.preventDefault();
        onToggleSlideshow();
      }

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [photo, onClose, onNext, onPrevious, onToggleSlideshow]);

  if (!photo) return null;

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/98 transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada da fotografia ${photo.position}`}
      data-testid="photo-lightbox"
      onMouseMove={resetInactivityTimer}
      onTouchStart={resetInactivityTimer}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="lightbox-panel relative w-full h-full flex flex-col items-center justify-center outline-none"
      >
        <div
          className={`transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <LightboxToolbar
            photo={photo}
            isFavorite={isFavorite}
            isSlideshowActive={isSlideshowActive}
            isPrivate={isPrivate}
            hasNote={Boolean(note && note.trim().length > 0)}
            onClose={onClose}
            onToggleFavorite={onToggleFavorite}
            onDownload={onDownload}
            onShare={onShare}
            onToggleSlideshow={onToggleSlideshow}
            onTogglePrivate={onTogglePrivate}
            onOpenNoteEditor={() => setIsNoteEditorOpen((prev) => !prev)}
          />

          {/* Popover Inline de Anotação (Pixieset isNoteOn) */}
          {isNoteEditorOpen && onUpdateNote && (
            <div
              className="absolute top-16 right-4 z-30 w-80 p-4 rounded-xl bg-[#111418]/95 border border-white/20 shadow-2xl backdrop-blur-md"
              role="dialog"
              aria-label="Editor de anotação da fotografia"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                  Anotação do Cliente
                </span>
                <button
                  type="button"
                  onClick={() => setIsNoteEditorOpen(false)}
                  className="text-xs text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Ex: Gostei dessa para o porta-retrato / clarear sombras..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#5E7F8C] outline-none resize-none mb-3"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNote(photo.id, '');
                    setNoteDraft('');
                    setIsNoteEditorOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNote(photo.id, noteDraft);
                    if (!isFavorite && onToggleFavorite) {
                      onToggleFavorite(photo.id);
                    }
                    setIsNoteEditorOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-semibold"
                >
                  Salvar Nota
                </button>
              </div>
            </div>
          )}

          <PreviousNextNavigation
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < totalPhotos - 1}
            onPrevious={onPrevious}
            onNext={onNext}
          />

          <PhotoCaption
            photo={photo}
            currentIndex={currentIndex}
            totalPhotos={totalPhotos}
          />
        </div>

        <MediaStage
          photo={photo}
          onPrevious={onPrevious}
          onNext={onNext}
        />

        {isSlideshowActive && onPauseSlideshow && (
          <SlideshowController
            isActive={isSlideshowActive}
            onNext={onNext}
            onPause={onPauseSlideshow}
          />
        )}
      </div>
    </div>
  );
}
