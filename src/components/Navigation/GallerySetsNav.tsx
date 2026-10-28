import type { GallerySet } from '../../types/gallery';

interface GallerySetsNavProps {
  sets: GallerySet[];
  activeSetId: string | null;
  totalPhotos: number;
  onSelectSet: (setId: string | null) => void;
}

export function GallerySetsNav({
  sets,
  activeSetId,
  totalPhotos,
  onSelectSet,
}: GallerySetsNavProps) {
  if (!sets || sets.length === 0) return null;

  return (
    <nav
      id="nav-galleries"
      className="gallery-sets-nav w-full py-4 px-2 sm:px-4 border-b border-white/10 mb-6"
      aria-label="Conjuntos e sub-galerias da coleção"
    >
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-start md:justify-center"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSetId === null}
          onClick={() => onSelectSet(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase font-medium tracking-wider transition-all whitespace-nowrap ${
            activeSetId === null
              ? 'bg-[#5E7F8C] text-white shadow-md'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          <span>Todas as Fotos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
            {totalPhotos}
          </span>
        </button>

        {sets.map((set) => {
          const isSelected = activeSetId === set.id;
          return (
            <button
              key={set.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectSet(set.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase font-medium tracking-wider transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#5E7F8C] text-white shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span>{set.title}</span>
              {set.photoCount !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {set.photoCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
