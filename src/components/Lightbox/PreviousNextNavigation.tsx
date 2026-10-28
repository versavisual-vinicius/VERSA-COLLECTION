
interface PreviousNextNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PreviousNextNavigation({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PreviousNextNavigationProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="lightbox-nav left absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 disabled:opacity-30 disabled:pointer-events-none text-white text-2xl flex items-center justify-center transition-colors"
        aria-label="Fotografia anterior"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="lightbox-nav right absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 disabled:opacity-30 disabled:pointer-events-none text-white text-2xl flex items-center justify-center transition-colors"
        aria-label="Próxima fotografia"
      >
        ›
      </button>
    </>
  );
}
