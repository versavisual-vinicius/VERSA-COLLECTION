import { useEffect, useState } from 'react';
import { availableCollections } from '../data/collectionsRegistry';
import { BrandingFooter } from './Footer/BrandingFooter';
import { PhotographerEmptyState } from './Feedback/PhotographerEmptyState';
import { backendEnabled, fetchPublicCollections, type PublicCollectionCard } from '../lib/backend';

interface PhotographerHomePageProps {
  onSelectCollection: (slug: string) => void;
  onOpenAdmin: () => void;
  onOpenDashboard?: () => void;
  collectionsOverride?: Array<PublicCollectionCard & { businessName?: string }>;
}

export function PhotographerHomePage({
  onSelectCollection,
  onOpenAdmin,
  onOpenDashboard: _onOpenDashboard,
  collectionsOverride,
}: PhotographerHomePageProps) {
  const realCollections = Object.entries(availableCollections).filter(
    ([slug, data]) => slug !== 'fixture' && data.collection.visibility !== 'hidden',
  );
  const staticCollections = (realCollections.length > 0 ? realCollections : Object.entries(availableCollections)).map(
    ([slug, data]) => ({
      ...data.collection,
      slug: data.collection.slug || slug,
    }),
  );
  const [collectionsList, setCollectionsList] = useState<Array<PublicCollectionCard & { businessName?: string }>>(
    collectionsOverride ?? (backendEnabled ? [] : staticCollections),
  );
  const [isLoading, setIsLoading] = useState(backendEnabled && !collectionsOverride);

  useEffect(() => {
    if (collectionsOverride) {
      setCollectionsList(collectionsOverride);
      setIsLoading(false);
      return;
    }
    if (!backendEnabled) return;
    setIsLoading(true);
    void fetchPublicCollections()
      .then(setCollectionsList)
      .catch(() => setCollectionsList([]))
      .finally(() => setIsLoading(false));
  }, [collectionsOverride]);

  const totalDeliveredPhotos = collectionsList.reduce((acc, col) => acc + (col.totalItems || 0), 0);

  return (
    <div className="min-h-screen bg-[#F6F8F9] text-[#11161B] flex flex-col font-['DM_Sans']">
      {/* Header Institucional */}
      <header className="border-b border-[#5E7F8C]/15 bg-[#F6F8F9]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#5E7F8C] uppercase block mb-0.5">
              VERSA VISUAL
            </span>
            <h1 className="text-lg font-bold font-['Outfit'] tracking-wide text-[#11161B]">
              Vinicius Cunha Fotografia
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-xs font-semibold uppercase tracking-wider text-[#11161B] transition-colors shadow-xs"
            >
              Acesso Fotógrafo
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Apresentação Editorial */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-12 md:py-16">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold text-[#5E7F8C] uppercase tracking-wider block mb-2">
            Catálogo Oficial de Clientes
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight mb-4 leading-tight text-[#11161B]">
            Coleções Digitais Exclusivas
          </h2>
          <p className="text-sm md:text-base text-[#5A6872] leading-relaxed">
            Selecione a sua galeria para reviver cada momento em alta resolução, selecionar seus favoritos e realizar downloads autorizados.
          </p>
        </div>

        {/* Grade de Coleções ou Estado Vazio */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white/80 border border-[#5E7F8C]/15 h-80 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : collectionsList.length === 0 ? (
          <PhotographerEmptyState onOpenAdmin={onOpenAdmin} />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionsList.map((col) => {
            const coverUrl =
              col.cover?.sources?.[col.cover.sources.length - 1]?.url ||
              col.cover?.sources?.[0]?.url ||
              (col as { coverUrl?: string }).coverUrl;

            return (
              <article
                key={col.slug}
                onClick={() => onSelectCollection(col.slug)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#5E7F8C]/15 hover:border-[#5E7F8C] transition-all duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Imagem de Capa com Proporção Editorial & Fallback Resiliente */}
                <CollectionCoverThumbnail coverUrl={coverUrl} title={col.title} />

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-[#5E7F8C] uppercase block mb-1">
                      {col.businessName || 'Versa Visual'}
                    </span>
                    <h3 className="text-xl font-bold font-['Outfit'] text-[#11161B] group-hover:text-[#5E7F8C] transition-colors mb-2">
                      {col.title}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#5E7F8C]/15 flex items-center justify-between text-xs text-[#5A6872]">
                    <span>{col.totalItems} fotografias</span>
                    <span className="font-semibold text-[#11161B] group-hover:text-[#5E7F8C] group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                      Acessar galeria →
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </main>

      <BrandingFooter
        businessName="Vinicius Cunha Fotografia"
        totalItems={totalDeliveredPhotos}
        onOpenAdmin={onOpenAdmin}
      />
    </div>
  );
}

function CollectionCoverThumbnail({ coverUrl, title }: { coverUrl?: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="aspect-[16/10] overflow-hidden bg-[#EEF1F3] relative select-none">
      {coverUrl && !hasError ? (
        <img
          src={coverUrl}
          alt={title}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#050A0D] to-[#121A20] text-white p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-[#5E7F8C]/20 border border-[#5E7F8C]/40 flex items-center justify-center mb-2 shadow-xs">
            <span className="font-['Outfit'] font-bold text-xs tracking-wider text-[#5E7F8C]">
              {title.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-white/75 tracking-wide font-['DM_Sans']">
            Galeria Digital Versa
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
