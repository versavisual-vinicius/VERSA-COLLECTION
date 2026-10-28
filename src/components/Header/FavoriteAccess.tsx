
interface FavoriteAccessProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
}

export function FavoriteAccess({ favoriteCount, onOpenFavorites }: FavoriteAccessProps) {
  return (
    <button
      type="button"
      className="header-action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
      onClick={onOpenFavorites}
      aria-label={`Ver favoritos (${favoriteCount} itens selecionados)`}
    >
      <span aria-hidden="true" style={{ color: favoriteCount > 0 ? '#ef4444' : 'currentColor' }}>
        ♥
      </span>
      <span className="text-xs font-medium">{favoriteCount}</span>
    </button>
  );
}
