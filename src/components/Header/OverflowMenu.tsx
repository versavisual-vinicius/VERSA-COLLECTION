import { useEffect, useRef, useState } from 'react';

interface OverflowMenuProps {
  onStartSlideshow?: () => void;
  onShareCollection?: () => void;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

export function OverflowMenu({
  onStartSlideshow,
  onShareCollection,
  onGoHome,
  onOpenAdmin,
}: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        className="header-action-btn flex items-center justify-center w-8 h-8 rounded-full border border-[#5E7F8C]/25 hover:border-[#5E7F8C]/50 bg-white/90 hover:bg-white text-[#11161B] transition-colors shadow-xs"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Mais opções da galeria"
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-lg bg-white border border-black/10 shadow-[0_12px_32px_rgba(0,0,0,0.18)] ring-1 ring-black/5 py-1.5 z-50 text-xs font-sans text-[#11161B]"
          role="menu"
          aria-orientation="vertical"
        >
          {onGoHome && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-[#F6F8F9] transition-colors text-[#11161B] font-medium border-b border-black/5"
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
              className="w-full text-left px-4 py-2 hover:bg-[#F6F8F9] transition-colors text-[#11161B]"
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
              className="w-full text-left px-4 py-2 hover:bg-[#F6F8F9] transition-colors text-[#11161B]"
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
            <>
              <hr className="my-1.5 border-black/10" />
              <button
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-[#F6F8F9] transition-colors text-[#5E7F8C] font-semibold"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onOpenAdmin();
                }}
              >
                ⚙ Painel do Fotógrafo
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
