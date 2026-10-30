import { useState } from 'react';

interface OverflowMenuProps {
  onStartSlideshow?: () => void;
  onShareCollection?: () => void;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

export function OverflowMenu({ onStartSlideshow, onShareCollection, onGoHome, onOpenAdmin }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="header-action-btn flex items-center justify-center w-8 h-8 rounded-full border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] transition-colors shadow-xs"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Mais opções da galeria"
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#5E7F8C]/20 shadow-xl py-1 z-50 text-xs font-sans text-[#11161B]"
          role="menu"
          aria-orientation="vertical"
        >
          {onGoHome && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-[#5E7F8C]/10 transition-colors text-[#11161B] border-b border-[#5E7F8C]/10"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onGoHome();
              }}
            >
              ← Catálogo de Galerias
            </button>
          )}

          {onStartSlideshow && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-[#5E7F8C]/10 transition-colors text-[#11161B]"
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
              className="w-full text-left px-4 py-2 hover:bg-[#5E7F8C]/10 transition-colors text-[#11161B]"
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
              className="w-full text-left px-4 py-2 hover:bg-[#5E7F8C]/10 transition-colors text-[#5E7F8C] font-medium border-t border-[#5E7F8C]/10"
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
