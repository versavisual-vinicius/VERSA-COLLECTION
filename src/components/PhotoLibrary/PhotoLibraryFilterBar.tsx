import React from 'react';

export interface PhotoLibraryFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCollection: string;
  onCollectionChange: (collectionSlug: string) => void;
  selectedOrientation: 'all' | 'portrait' | 'landscape';
  onOrientationChange: (orientation: 'all' | 'portrait' | 'landscape') => void;
  collections: Array<{ slug: string; title: string; count: number }>;
  totalCount: number;
  isLoading?: boolean;
}

export const PhotoLibraryFilterBar: React.FC<PhotoLibraryFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCollection,
  onCollectionChange,
  selectedOrientation,
  onOrientationChange,
  collections,
  totalCount,
  isLoading = false,
}) => {
  return (
    <div
      className="w-full bg-[#050A0D]/90 backdrop-blur-md border-b border-[#1b252f] sticky top-0 z-30 py-4 px-4 sm:px-8 transition-colors"
      data-testid="photo-library-filter-bar"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Barra de Busca Semântica */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <svg
              className={`w-4 h-4 transition-transform ${isLoading ? 'animate-spin text-[#5E7F8C]' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isLoading ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              )}
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquise por nome, evento ou detalhes..."
            aria-label="Campo de busca de fotos"
            data-testid="input-photo-search"
            className="w-full pl-10 pr-10 py-2.5 bg-[#0a1117] border border-[#1b252f] rounded-lg text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all font-sans"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpar busca"
              data-testid="btn-clear-search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filtros de Coleção e Orientação */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Coleção */}
          <div className="relative">
            <select
              value={selectedCollection}
              onChange={(e) => onCollectionChange(e.target.value)}
              aria-label="Filtrar por coleção"
              data-testid="select-collection-filter"
              className="appearance-none bg-[#0a1117] border border-[#1b252f] text-stone-300 text-xs sm:text-sm rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:border-[#5E7F8C] transition-colors cursor-pointer font-sans"
            >
              <option value="">Todas as Coleções ({totalCount})</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title} ({c.count})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-stone-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Toggle de Orientação */}
          <div
            className="inline-flex rounded-lg border border-[#1b252f] bg-[#0a1117] p-0.5 text-xs font-sans"
            role="group"
            aria-label="Filtro de orientação"
          >
            <button
              type="button"
              onClick={() => onOrientationChange('all')}
              data-testid="filter-orientation-all"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedOrientation === 'all'
                  ? 'bg-[#5E7F8C] text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => onOrientationChange('portrait')}
              data-testid="filter-orientation-portrait"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedOrientation === 'portrait'
                  ? 'bg-[#5E7F8C] text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Retrato
            </button>
            <button
              type="button"
              onClick={() => onOrientationChange('landscape')}
              data-testid="filter-orientation-landscape"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedOrientation === 'landscape'
                  ? 'bg-[#5E7F8C] text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Paisagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
