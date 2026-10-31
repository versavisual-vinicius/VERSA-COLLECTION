import { useEffect, useState } from 'react';
import { availableCollections, getActiveCollectionEntries } from '../data/collectionsRegistry';
import { BrandingFooter } from './Footer/BrandingFooter';
import { PhotographerEmptyState } from './Feedback/PhotographerEmptyState';
import {
  backendEnabled,
  fetchPublicCollections,
  hasActiveAdminSession,
  type PublicCollectionCard,
} from '../lib/backend';

interface PhotographerHomePageProps {
  onSelectCollection: (slug: string) => void;
  onOpenAdmin: () => void;
  onOpenDashboard?: () => void;
  collectionsOverride?: Array<PublicCollectionCard & { businessName?: string }>;
}

/**
 * Seleciona a fonte ideal para card de vitrine (w=640 ou w=1024),
 * evitando carregar o original =s0 de 15MB–22MB nas miniaturas da home.
 */
function pickOptimalCoverUrl(
  col: PublicCollectionCard & { coverUrl?: string },
  fallbackFirstPhotoUrl?: string,
): string | undefined {
  const sources = col.cover?.sources ?? [];
  if (sources.length > 0) {
    const mediumSource =
      sources.find((s) => s.width >= 600 && s.width <= 1280 && !s.url.endsWith('=s0')) ??
      sources.find((s) => !s.url.endsWith('=s0')) ??
      sources[0];
    if (mediumSource?.url) return mediumSource.url;
  }
  return col.coverUrl || fallbackFirstPhotoUrl;
}

function extractDriveFileId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function PhotographerHomePage({
  onSelectCollection,
  onOpenAdmin,
  onOpenDashboard,
  collectionsOverride,
}: PhotographerHomePageProps) {
  // Oculta automaticamente coleções com 0 fotografias ou visibilidade 'hidden' (Auditoria 3.3.2)
  const realCollections = getActiveCollectionEntries();
  const staticCollections = (
    realCollections.length > 0 ? realCollections : Object.entries(availableCollections)
  ).map(([slug, data]) => ({
    ...data.collection,
    slug: data.collection.slug || slug,
    totalItems: data.photos?.length || data.collection.totalItems,
  }));

  const [collectionsList, setCollectionsList] = useState<
    Array<PublicCollectionCard & { businessName?: string }>
  >(collectionsOverride ?? (backendEnabled ? [] : staticCollections));
  const [isLoading, setIsLoading] = useState(backendEnabled && !collectionsOverride);
  const isLogged = hasActiveAdminSession();

  useEffect(() => {
    if (collectionsOverride) {
      setCollectionsList(collectionsOverride);
      setIsLoading(false);
      return;
    }
    if (!backendEnabled) return;
    setIsLoading(true);
    void fetchPublicCollections()
      .then((items) => {
        const nonEmpty = items.filter((item) => (item.totalItems ?? 0) > 0);
        setCollectionsList(nonEmpty.length > 0 ? nonEmpty : staticCollections);
      })
      .catch(() => setCollectionsList(staticCollections))
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
            {isLogged && onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3.5 py-1.5 rounded-lg bg-[#050A0D] hover:bg-[#11161B] text-xs font-semibold uppercase tracking-wider text-white transition-colors shadow-xs"
              >
                Studio Hub
              </button>
            )}
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
                className="rounded-none overflow-hidden bg-white/80 border border-[#5E7F8C]/15 h-80 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : collectionsList.length === 0 ? (
          <PhotographerEmptyState onOpenAdmin={onOpenAdmin} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsList.map((col, idx) => {
              const fallbackFirstPhoto =
                availableCollections[col.slug]?.photos?.[0]?.sources?.[0]?.url;
              const coverUrl = pickOptimalCoverUrl(
                col as PublicCollectionCard & { coverUrl?: string },
                fallbackFirstPhoto,
              );

              return (
                <article
                  key={col.slug}
                  onClick={() => onSelectCollection(col.slug)}
                  className="group relative rounded-none overflow-hidden bg-white border border-[#5E7F8C]/15 hover:border-[#5E7F8C] transition-all duration-300 cursor-pointer flex flex-col shadow-xs hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Imagem de Capa com Fallback Resiliente + Shimmer Editorial */}
                  <CollectionCoverThumbnail
                    coverUrl={coverUrl}
                    fallbackPhotoUrl={fallbackFirstPhoto}
                    title={col.title}
                    priority={idx < 6}
                  />

                  {/* Conteúdo do Card com Capitalização Padronizada (Auditoria 3.3.1) */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-[#5E7F8C] uppercase block mb-1.5">
                        {col.businessName || 'Versa Visual'}
                      </span>
                      <h3 className="text-base font-bold font-['Outfit'] uppercase tracking-[0.06em] text-[#11161B] group-hover:text-[#5E7F8C] transition-colors mb-2">
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

function CollectionCoverThumbnail({
  coverUrl,
  fallbackPhotoUrl,
  title,
  priority = false,
}: {
  coverUrl?: string;
  fallbackPhotoUrl?: string;
  title: string;
  priority?: boolean;
}) {
  const [stage, setStage] = useState<'primary' | 'drive-thumb' | 'fallback-first' | 'failed'>('primary');
  const [isLoaded, setIsLoaded] = useState(false);

  const fileId = extractDriveFileId(coverUrl) || extractDriveFileId(fallbackPhotoUrl);
  const driveThumbUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : undefined;

  let activeSrc: string | undefined = coverUrl;
  if (stage === 'drive-thumb') {
    activeSrc = driveThumbUrl || fallbackPhotoUrl;
  } else if (stage === 'fallback-first') {
    activeSrc = fallbackPhotoUrl;
  } else if (stage === 'failed') {
    activeSrc = undefined;
  }

  const handleImageError = () => {
    if (stage === 'primary' && driveThumbUrl && driveThumbUrl !== coverUrl) {
      setStage('drive-thumb');
    } else if (stage !== 'fallback-first' && fallbackPhotoUrl && fallbackPhotoUrl !== activeSrc) {
      setStage('fallback-first');
    } else {
      setStage('failed');
    }
  };

  return (
    <div className="aspect-[16/10] overflow-hidden bg-[#11161B] relative select-none">
      {!isLoaded && activeSrc && stage !== 'failed' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#121A20] via-[#1C2830] to-[#121A20]"
        />
      )}

      {activeSrc && stage !== 'failed' ? (
        <img
          src={activeSrc}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Placeholder Institucional Escuro com Monograma V (Auditoria 3.3.2) */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#050A0D] to-[#121A20] text-white p-4 text-center">
          <div className="w-11 h-11 rounded-full bg-[#5E7F8C]/15 border border-[#5E7F8C]/40 flex items-center justify-center mb-2.5 shadow-xs">
            <span className="font-['Outfit'] font-bold text-sm tracking-[0.2em] text-[#5E7F8C]">
              V
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold text-white/70 tracking-[0.2em] font-['DM_Sans']">
            Versa Collection
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
