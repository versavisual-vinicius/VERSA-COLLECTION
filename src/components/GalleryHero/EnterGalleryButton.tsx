
interface EnterGalleryButtonProps {
  targetId?: string;
  onEnter?: () => void;
}

export function EnterGalleryButton({ targetId = 'gallery-grid', onEnter }: EnterGalleryButtonProps) {
  const handleClick = () => {
    if (onEnter) {
      onEnter();
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      type="button"
      className="cover-cta group inline-flex items-center gap-3 transition-all duration-300"
      onClick={handleClick}
      aria-label="Entrar na galeria e ver as fotografias"
    >
      <span
        className="h-3.5 w-0.5 rounded-full bg-[#5E7F8C] transition-all duration-300 group-hover:h-5 group-hover:bg-[#11161B]"
        aria-hidden="true"
      />
      <span>Entrar na galeria</span>
    </button>
  );
}
