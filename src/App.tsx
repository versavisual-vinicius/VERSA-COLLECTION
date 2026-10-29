import { useCallback, useEffect, useState } from 'react';
import { GalleryPage } from './components/GalleryPage';
import { PhotographerHomePage } from './components/PhotographerHomePage';
import { AdminPanel } from './components/Admin/AdminPanel';

function resolveSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const pathMatch = pathname.match(/^\/g\/([^/?#]+)/);
  return pathMatch?.[1] || params.get('collection') || null;
}

export default function App() {
  const [currentCollection, setCurrentCollection] = useState<string | null>(() => resolveSlugFromUrl());
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentCollection(resolveSlugFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCollection = useCallback((slug: string) => {
    setCurrentCollection(slug);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      if (nextUrl.pathname.startsWith('/g/')) {
        nextUrl.pathname = `/g/${encodeURIComponent(slug)}`;
        nextUrl.searchParams.delete('collection');
      } else {
        nextUrl.searchParams.set('collection', slug);
      }
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentCollection(null);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/';
      nextUrl.searchParams.delete('collection');
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      nextUrl.searchParams.delete('mode');
      nextUrl.searchParams.delete('set');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  // Se nenhuma coleção especificada via URL (/g/:slug ou ?collection=), exibe a Homepage do Fotógrafo (paridade Pixieset)
  if (!currentCollection) {
    return (
      <>
        <PhotographerHomePage
          onSelectCollection={handleSelectCollection}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug="modec-dia-das-criancas-2026"
            onClose={() => setIsAdminOpen(false)}
            onSelectCollection={(slug) => {
              setIsAdminOpen(false);
              handleSelectCollection(slug);
            }}
          />
        )}
      </>
    );
  }

  return (
    <GalleryPage
      collectionSlug={currentCollection}
      onGoHome={handleGoHome}
      onSelectCollection={handleSelectCollection}
    />
  );
}
