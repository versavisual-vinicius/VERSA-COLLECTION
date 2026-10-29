interface EmptyGalleryStateProps {
  isSetFilter?: boolean;
  onClearFilter?: () => void;
  onRefresh?: () => void;
}

/**
 * EmptyGalleryState
 * Exibido quando uma coleção ou conjunto selecionado não possui fotografias para exibir.
 * Design editorial alinhado aos tokens oficiais Versa Visual.
 */
export function EmptyGalleryState({
  isSetFilter = false,
  onClearFilter,
  onRefresh,
}: EmptyGalleryStateProps) {
  return (
    <div
      className="w-full py-20 px-6 flex flex-col items-center justify-center text-center select-none"
      role="status"
      data-testid="empty-gallery-state"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg
          className="w-7 h-7 text-[#5E7F8C]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-white/50 mb-2">
        {isSetFilter ? 'Conjunto sem registros' : 'Acervo em preparação'}
      </p>

      <h3 className="font-['Outfit'] text-xl sm:text-2xl text-white font-semibold mb-3">
        {isSetFilter
          ? 'Nenhuma fotografia encontrada neste conjunto'
          : 'Esta coleção ainda não possui fotografias disponíveis'}
      </h3>

      <p className="font-['DM_Sans'] text-xs sm:text-sm text-white/60 max-w-md mb-8">
        {isSetFilter
          ? 'Não há registros vinculados a esta seção no momento. Você pode retornar à visualização completa da galeria.'
          : 'Os registros fotográficos desta entrega estão sendo organizados e serão publicados em breve pelo fotógrafo.'}
      </p>

      {isSetFilter && onClearFilter ? (
        <button
          type="button"
          onClick={onClearFilter}
          className="px-6 py-2.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6f94a3] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-[#5E7F8C]/20"
        >
          Ver todas as fotografias
        </button>
      ) : onRefresh ? (
        <button
          type="button"
          onClick={onRefresh}
          className="px-6 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Atualizar galeria
        </button>
      ) : null}
    </div>
  );
}

