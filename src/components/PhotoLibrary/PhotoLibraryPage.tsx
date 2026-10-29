import React, { useCallback, useEffect, useState } from 'react';
import type { LibraryPhotoItem } from '../../types/gallery';
import { fetchPhotoLibrary } from '../../lib/backend';
import { useAbortRequest } from '../../hooks/useAbortRequest';
import { PhotoLibraryFilterBar } from './PhotoLibraryFilterBar';
import { PhotoLibraryEmptyState } from './PhotoLibraryEmptyState';
import { PhotoLightbox } from '../Lightbox/PhotoLightbox';

export interface PhotoLibraryPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onOpenAdmin: () => void;
  onCreateCollection?: () => void;
  onSelectCollection?: (slug: string) => void;
}

export const PhotoLibraryPage: React.FC<PhotoLibraryPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onOpenAdmin,
  onCreateCollection,
  onSelectCollection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedOrientation, setSelectedOrientation] = useState<'all' | 'portrait' | 'landscape'>('all');
  const [photos, setPhotos] = useState<LibraryPhotoItem[]>([]);
  const [collections, setCollections] = useState<Array<{ slug: string; title: string; count: number }>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const { wrapAsync } = useAbortRequest();

  // Carregamento de dados com cancelamento automático de requisições pendentes
  const loadPhotos = useCallback(
    async (term: string, col: string, orient: 'all' | 'portrait' | 'landscape') => {
      setIsLoading(true);
      const res = await wrapAsync((signal) =>
        fetchPhotoLibrary(
          {
            q: term,
            collection: col,
            orientation: orient,
            limit: 60,
          },
          signal,
        ),
      );

      if (res) {
        setPhotos(res.items);
        setTotalCount(res.totalCount);
        if (res.collections.length > 0) {
          setCollections(res.collections);
        }
        setIsLoading(false);
      }
    },
    [wrapAsync],
  );

  useEffect(() => {
    // Debounce leve de 250ms na digitação para evitar rajadas HTTP
    const timer = setTimeout(() => {
      loadPhotos(searchTerm, selectedCollection, selectedOrientation);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCollection, selectedOrientation, loadPhotos]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCollection('');
    setSelectedOrientation('all');
  }, []);

  const activePhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#050A0D] text-stone-100 flex flex-col font-sans" data-testid="photo-library-page">
      {/* Cabeçalho do Estúdio */}
      <header className="border-b border-[#1b252f] bg-[#050A0D] px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateDashboard}
              aria-label="Voltar para o Studio Hub"
              data-testid="btn-back-dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-stone-100 px-3 py-1.5 rounded-lg border border-[#1b252f] bg-[#0a1117] hover:border-[#5E7F8C] transition-all"
            >
              <svg className="w-4 h-4 text-[#5E7F8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Studio Hub</span>
            </button>

            <div className="h-5 w-px bg-[#1b252f] hidden sm:block" />

            <div>
              <button
                type="button"
                onClick={onNavigateHome}
                data-testid="btn-brand-home"
                className="text-left group"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#5E7F8C] font-semibold block transition-colors group-hover:text-stone-300">
                  Versa Visual
                </span>
                <h1 className="text-sm sm:text-base font-bold font-serif tracking-wide text-stone-100 group-hover:text-white transition-colors">
                  Biblioteca Central de Fotos
                </h1>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-stone-400 font-sans">
              <strong className="text-stone-200 font-semibold">{totalCount}</strong> fotografias catalogadas
            </span>
            <button
              type="button"
              onClick={onCreateCollection || onOpenAdmin}
              data-testid="btn-header-new-collection"
              className="inline-flex items-center gap-2 bg-[#5E7F8C] hover:bg-[#4d6d7a] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nova Coleção</span>
            </button>
          </div>
        </div>
      </header>

      {/* Barra de Busca e Filtros */}
      <PhotoLibraryFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCollection={selectedCollection}
        onCollectionChange={setSelectedCollection}
        selectedOrientation={selectedOrientation}
        onOrientationChange={setSelectedOrientation}
        collections={collections}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {photos.length === 0 && !isLoading ? (
          <PhotoLibraryEmptyState
            isSearchEmpty={Boolean(searchTerm || selectedCollection || selectedOrientation !== 'all')}
            searchTerm={searchTerm}
            onClearSearch={handleClearFilters}
            onCreateCollection={onCreateCollection || onOpenAdmin}
          />
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            data-testid="photo-library-grid"
          >
            {photos.map((photo, index) => {
              const previewUrl =
                photo.sources?.[1]?.url ||
                photo.sources?.[0]?.url ||
                photo.downloadUrl ||
                '';
              const isPortrait = photo.height > photo.width;

              return (
                <div
                  key={`${photo.collectionSlug}-${photo.id}`}
                  onClick={() => setActivePhotoIndex(index)}
                  data-testid={`library-photo-card-${photo.id}`}
                  className="group relative rounded-lg overflow-hidden bg-[#0a1117] border border-[#1b252f] hover:border-[#5E7F8C] transition-all cursor-pointer shadow-sm"
                  style={{
                    aspectRatio: isPortrait ? '2 / 3' : '3 / 2',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt={photo.alt || photo.fileName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay ao Hover com Metadados */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-stone-300 border border-white/10 font-mono">
                        {photo.width}×{photo.height}
                      </span>
                    </div>

                    <div>
                      <span
                        onClick={(e) => {
                          if (onSelectCollection) {
                            e.stopPropagation();
                            onSelectCollection(photo.collectionSlug);
                          }
                        }}
                        className="text-[10px] text-[#5E7F8C] font-semibold uppercase tracking-wider block truncate hover:underline"
                        title={photo.collectionTitle}
                      >
                        {photo.collectionTitle}
                      </span>
                      <p className="text-xs text-stone-200 truncate font-medium">
                        {photo.fileName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lightbox de Inspeção em Tela Cheia */}
      {activePhoto && (
        <PhotoLightbox
          photo={activePhoto}
          currentIndex={activePhotoIndex ?? 0}
          totalPhotos={photos.length}
          isFavorite={false}
          isSlideshowActive={false}
          note=""
          isPrivate={false}
          onClose={() => setActivePhotoIndex(null)}
          onPrevious={() =>
            setActivePhotoIndex((prev) =>
              prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null,
            )
          }
          onNext={() =>
            setActivePhotoIndex((prev) =>
              prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null,
            )
          }
          onToggleFavorite={() => {}}
          onDownload={() => {}}
          onShare={() => {}}
          onUpdateNote={() => {}}
          onTogglePrivate={() => {}}
          onToggleSlideshow={() => {}}
        />
      )}

      {/* Rodapé Editorial */}
      <footer className="border-t border-[#1b252f] py-6 px-4 text-center bg-[#050A0D]">
        <p className="text-xs text-stone-500 font-sans tracking-wide">
          Versa Visual — Acervo Autoral <span className="text-[#5E7F8C]">@v1ncsc</span>
        </p>
      </footer>
    </div>
  );
};
