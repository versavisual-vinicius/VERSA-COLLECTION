import { useState } from 'react';

interface OverflowMenuProps {
  onStartSlideshow?: () => void;
  onShareCollection?: () => void;
  onOpenAdmin?: () => void;
}

export function OverflowMenu({ onStartSlideshow, onShareCollection, onOpenAdmin }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="header-action-btn flex items-center justify-center w-8 h-8 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Mais opções da galeria"
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111418] border border-white/10 shadow-soft py-1 z-50 text-xs"
          role="menu"
          aria-orientation="vertical"
        >
          {onStartSlideshow && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white/90"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onStartSlideshow();
              }}
            >
              ▶ Iniciar apresentação
            </button>
          )}

          {onShareCollection && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white/90"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onShareCollection();
              }}
            >
              ⇪ Compartilhar coleção
            </button>
          )}

          {onOpenAdmin && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-[#5E7F8C] hover:text-[#85aab8] border-t border-white/5"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onOpenAdmin();
              }}
            >
              ⚙ Painel do Fotógrafo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
