import React from 'react';

export interface PhotoLibraryEmptyStateProps {
  isSearchEmpty: boolean;
  searchTerm?: string;
  onClearSearch?: () => void;
  onCreateCollection?: () => void;
}

export const PhotoLibraryEmptyState: React.FC<PhotoLibraryEmptyStateProps> = ({
  isSearchEmpty,
  searchTerm,
  onClearSearch,
  onCreateCollection,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-lg mx-auto"
      data-testid="photo-library-empty-state"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#0a1117] border border-[#1b252f] flex items-center justify-center mb-6 text-[#5E7F8C] shadow-inner">
        {isSearchEmpty ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-100 mb-2">
        {isSearchEmpty
          ? `Nenhuma foto encontrada${searchTerm ? ` para "${searchTerm}"` : ''}`
          : 'Você ainda não tem fotos no acervo?'}
      </h2>

      <p className="text-stone-400 text-sm leading-relaxed mb-6 font-sans">
        {isSearchEmpty
          ? 'Tente pesquisar com termos mais gerais ou redefina os filtros de coleção e orientação para localizar as imagens.'
          : 'Todas as fotos adicionadas às suas coleções aparecerão aqui centralizadas no seu acervo global. Comece criando uma coleção.'}
      </p>

      {isSearchEmpty ? (
        <button
          type="button"
          onClick={onClearSearch}
          data-testid="btn-empty-clear-search"
          className="px-5 py-2.5 bg-[#5E7F8C] hover:bg-[#4d6d7a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
        >
          Limpar Filtros de Busca
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreateCollection}
          data-testid="btn-empty-create-collection"
          className="px-5 py-2.5 bg-[#5E7F8C] hover:bg-[#4d6d7a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
        >
          Nova Coleção
        </button>
      )}
    </div>
  );
};
