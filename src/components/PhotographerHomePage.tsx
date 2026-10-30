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

  const featuredCollection = collectionsList[0];
  const featuredCoverUrl = featuredCollection
    ? featuredCollection.cover?.sources?.[featuredCollection.cover.sources.length - 1]?.url ||
      featuredCollection.cover?.sources?.[0]?.url ||
      (featuredCollection as { coverUrl?: string }).coverUrl
    : undefined;

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#050A0D] font-['DM_Sans'] selection:bg-[#5E7F8C] selection:text-white">
      <header className="relative z-30 bg-[#F4F4F0]">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-['Outfit'] text-lg font-extrabold tracking-[-0.04em]">
            VERSA
          </button>
          <nav aria-label="Navegação principal" className="hidden items-center gap-10 text-sm text-[#050A0D]/55 md:flex">
            <a href="#colecoes" className="transition-colors hover:text-[#050A0D]">Coleções</a>
            <a href="#manifesto" className="transition-colors hover:text-[#050A0D]">Olhar</a>
            <a href="#sobre" className="transition-colors hover:text-[#050A0D]">Sobre</a>
          </nav>
          <button type="button" onClick={onOpenAdmin} className="rounded-full bg-[#050A0D] px-5 py-2.5 text-xs font-medium text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7F8C] focus-visible:ring-offset-2">
            Acesso Fotógrafo
          </button>
        </div>
      </header>

      <main>
        <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden" aria-labelledby="hero-title">
          <h1 id="hero-title" className="pointer-events-none absolute left-1/2 top-[-2vw] z-0 -translate-x-1/2 whitespace-nowrap font-['Outfit'] text-[30vw] font-black uppercase leading-[0.78] tracking-[-0.095em] text-[#050A0D] sm:text-[27vw] lg:text-[23vw]">
            Versa
          </h1>
          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1500px] items-end justify-center px-0 pt-[19vw] sm:px-8 lg:px-12 lg:pt-[15vw]">
            <div className="relative h-[72svh] min-h-[540px] w-full overflow-hidden bg-[#121C21] sm:h-[68svh] sm:max-w-[1050px]">
              {featuredCoverUrl ? (
                <img src={featuredCoverUrl} alt={featuredCollection?.title || 'Coleção em destaque'} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#253540]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050A0D]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-7 text-white sm:p-10 md:flex-row md:items-end md:justify-between lg:p-14">
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A4B8BF]">Fotografia editorial · Macaé, RJ</p>
                  <h2 className="max-w-2xl font-['Outfit'] text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                    Histórias verdadeiras,<br />preservadas para sempre.
                  </h2>
                </div>
                {featuredCollection ? (
                  <button type="button" onClick={() => onSelectCollection(featuredCollection.slug)} className="w-fit rounded-full border border-white/35 bg-white/10 px-5 py-3 text-xs font-medium backdrop-blur-md transition-colors hover:bg-white hover:text-[#050A0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    Ver coleção em destaque
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section id="manifesto" className="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1.3fr_0.7fr] lg:px-12 lg:py-36">
          <div className="font-['Outfit'] text-[clamp(2.4rem,6vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.055em]">
            <p>Naturalidade.</p>
            <p className="text-[#5E7F8C]">Presença.</p>
            <p>Verdade.</p>
          </div>
          <p className="max-w-md self-end text-lg leading-relaxed text-[#050A0D]/65">
            Mais do que técnica, relacionamento. Fotografamos decisões, gestos e afetos com direção leve e um olhar atento ao que acontece de verdade.
          </p>
        </section>

        <section id="colecoes" className="bg-[#050A0D] px-5 py-24 text-[#F2F2F2] sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-14 flex items-end justify-between gap-6 border-b border-white/15 pb-7">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A4B8BF]">Arquivo de clientes</p>
                <h2 className="font-['Outfit'] text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">Coleções</h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-relaxed text-white/50 sm:block">Cada galeria é uma experiência privada para rever, selecionar e guardar fotografias.</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Carregando coleções">
                {[1, 2, 3].map((item) => <div key={item} className="aspect-[4/5] animate-pulse bg-white/5" />)}
              </div>
            ) : collectionsList.length === 0 ? (
              <PhotographerEmptyState onOpenAdmin={onOpenAdmin} />
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {collectionsList.map((col, index) => {
                  const coverUrl = col.cover?.sources?.[col.cover.sources.length - 1]?.url || col.cover?.sources?.[0]?.url || (col as { coverUrl?: string }).coverUrl;
                  return (
                    <article key={col.slug} className={`group ${index % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
                      <button type="button" onClick={() => onSelectCollection(col.slug)} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7F8C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050A0D]">
                        <CollectionCoverThumbnail coverUrl={coverUrl} title={col.title} />
                        <div className="flex items-start justify-between gap-5 border-t border-white/15 pt-4">
                          <div>
                            <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-[#A4B8BF]">{col.businessName || 'Versa Visual'}</p>
                            <h3 className="font-['Outfit'] text-2xl font-medium tracking-[-0.03em]">{col.title}</h3>
                          </div>
                          <span className="mt-1 text-xs text-white/45">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                          <span>{col.totalItems} fotografias</span>
                          <span className="text-white transition-transform group-hover:translate-x-1">Abrir coleção →</span>
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <div id="sobre">
        <BrandingFooter businessName="Vinicius Cunha Fotografia" totalItems={totalDeliveredPhotos} onOpenAdmin={onOpenAdmin} />
      </div>
    </div>
  );
}

function CollectionCoverThumbnail({ coverUrl, title }: { coverUrl?: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative mb-5 aspect-[4/5] select-none overflow-hidden bg-[#121C21]">
      {coverUrl && !hasError ? (
        <img
          src={coverUrl}
          alt={title}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#121C21] p-4 text-center text-white">
          <span className="font-['Outfit'] text-7xl font-black tracking-[-0.08em] text-[#5E7F8C]">
            {title.slice(0, 2).toUpperCase()}
          </span>
          <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/55">Galeria Digital Versa</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}
