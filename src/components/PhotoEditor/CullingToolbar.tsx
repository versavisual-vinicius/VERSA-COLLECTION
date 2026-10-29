export type CullingFilterType = 'all' | 'picks' | 'unrejected' | 'rated';

interface CullingToolbarProps {
  collectionTitle: string;
  collectionsList?: Array<{ slug: string; title: string }>;
  currentSlug?: string;
  onSelectCollection?: (slug: string) => void;
  activeFilter: CullingFilterType;
  onChangeFilter: (filter: CullingFilterType) => void;
  totalCount: number;
  filteredCount: number;
  picksCount: number;
  rejectsCount: number;
  isStylesOpen: boolean;
  onToggleStyles: () => void;
  onExportReport: () => void;
  onBackToHub: () => void;
}

export function CullingToolbar({
  collectionTitle,
  collectionsList = [],
  currentSlug,
  onSelectCollection,
  activeFilter,
  onChangeFilter,
  totalCount,
  filteredCount,
  picksCount,
  rejectsCount,
  isStylesOpen,
  onToggleStyles,
  onExportReport,
  onBackToHub,
}: CullingToolbarProps) {
  return (
    <header
      className="h-16 bg-[#050A0D] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20"
      data-testid="culling-toolbar"
    >
      {/* Lado Esquerdo: Identidade & Coleção */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToHub}
          data-testid="btn-back-hub"
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Voltar ao Studio Hub"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-outfit text-sm font-bold tracking-wider text-white uppercase">
              Versa Editor
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5E7F8C]/30 text-[#8cb2bf] font-mono">
              Culling ({filteredCount}/{totalCount})
            </span>
          </div>
          {collectionsList.length > 1 && onSelectCollection ? (
            <select
              value={currentSlug}
              onChange={(e) => onSelectCollection(e.target.value)}
              className="mt-0.5 text-[11px] bg-transparent text-white/70 border-b border-white/20 focus:outline-none focus:border-[#5E7F8C]"
            >
              {collectionsList.map((col) => (
                <option key={col.slug} value={col.slug} className="bg-[#050A0D] text-white">
                  {col.title}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-[11px] text-white/50 font-dm-sans truncate max-w-[200px] sm:max-w-xs">
              {collectionTitle}
            </p>
          )}
        </div>
      </div>

      {/* Centro: Filtros Rápidos de Culling */}
      <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 font-dm-sans text-xs">
        <button
          type="button"
          onClick={() => onChangeFilter('all')}
          data-testid="filter-culling-all"
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeFilter === 'all'
              ? 'bg-[#5E7F8C] text-white font-semibold shadow'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Todas ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => onChangeFilter('picks')}
          data-testid="filter-culling-picks"
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeFilter === 'picks'
              ? 'bg-emerald-600 text-white font-semibold shadow'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Picks ({picksCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeFilter('unrejected')}
          data-testid="filter-culling-unrejected"
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeFilter === 'unrejected'
              ? 'bg-[#5E7F8C] text-white font-semibold shadow'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Não Rejeitadas ({totalCount - rejectsCount})
        </button>

        <button
          type="button"
          onClick={() => onChangeFilter('rated')}
          data-testid="filter-culling-rated"
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            activeFilter === 'rated'
              ? 'bg-[#5E7F8C] text-white font-semibold shadow'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-amber-400">★</span>
          <span>Avaliadas</span>
        </button>
      </div>

      {/* Lado Direito: Estilos & Exportação */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleStyles}
          data-testid="btn-toggle-styles"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-dm-sans flex items-center gap-1.5 transition-all ${
            isStylesOpen
              ? 'bg-white/20 text-white ring-1 ring-white/30'
              : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#5E7F8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="hidden sm:inline">Estilos Editoriais</span>
        </button>

        <button
          type="button"
          onClick={onExportReport}
          data-testid="btn-export-culling"
          className="px-3.5 py-1.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6c8f9d] text-white text-xs font-semibold font-dm-sans flex items-center gap-1.5 shadow-md transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Exportar ({picksCount})</span>
        </button>
      </div>
    </header>
  );
}
