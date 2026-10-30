
interface FavoriteAccessProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
}

export function FavoriteAccess({ favoriteCount, onOpenFavorites }: FavoriteAccessProps) {
  return (
    <button
      type="button"
      className="header-action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] transition-colors shadow-xs"
      onClick={onOpenFavorites}
      aria-label={`Ver favoritos (${favoriteCount} itens selecionados)`}
    >
      <span aria-hidden="true" style={{ color: favoriteCount > 0 ? '#dc2626' : '#5E7F8C' }}>
        ♥
      </span>
      <span className="text-xs font-medium">{favoriteCount}</span>
    </button>
  );
}
