
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
      className="cover-cta"
      onClick={handleClick}
      aria-label="Entrar na galeria e ver as fotografias"
    >
      Entrar na galeria
    </button>
  );
}
