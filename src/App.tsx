import { useCallback, useEffect, useState } from 'react';
import { GalleryPage } from './components/GalleryPage';
import { PhotographerHomePage } from './components/PhotographerHomePage';
import { AdminPanel } from './components/Admin/AdminPanel';
import { DashboardPage } from './components/Dashboard/DashboardPage';

function resolveViewFromUrl(): { isDashboard: boolean; slug: string | null } {
  if (typeof window === 'undefined') return { isDashboard: false, slug: null };
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const isDashboard = pathname === '/dashboard' || params.get('view') === 'dashboard';
  const pathMatch = pathname.match(/^\/g\/([^/?#]+)/);
  const slug = pathMatch?.[1] || params.get('collection') || null;
  return { isDashboard, slug };
}

export default function App() {
  const [{ isDashboard, slug: initialSlug }, setViewState] = useState(() => resolveViewFromUrl());
  const [currentCollection, setCurrentCollection] = useState<string | null>(initialSlug);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  useEffect(() => {
    const handlePopState = () => {
      const view = resolveViewFromUrl();
      setViewState(view);
      setCurrentCollection(view.slug);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCollection = useCallback((slug: string) => {
    setCurrentCollection(slug);
    setViewState({ isDashboard: false, slug });
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      if (nextUrl.pathname.startsWith('/g/')) {
        nextUrl.pathname = `/g/${encodeURIComponent(slug)}`;
        nextUrl.searchParams.delete('collection');
      } else {
        nextUrl.pathname = '/';
        nextUrl.searchParams.set('collection', slug);
      }
      nextUrl.searchParams.delete('view');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentCollection(null);
    setViewState({ isDashboard: false, slug: null });
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/';
      nextUrl.searchParams.delete('collection');
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      nextUrl.searchParams.delete('mode');
      nextUrl.searchParams.delete('set');
      nextUrl.searchParams.delete('view');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const handleOpenDashboard = useCallback(() => {
    setCurrentCollection(null);
    setViewState({ isDashboard: true, slug: null });
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/dashboard';
      nextUrl.searchParams.delete('collection');
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  // Se o usuário acessar a rota /dashboard, renderiza o Studio Hub central
  if (isDashboard) {
    return (
      <>
        <DashboardPage
          onNavigateHome={handleGoHome}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onCreateCollection={() => setIsAdminOpen(true)}
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

  // Se nenhuma coleção especificada via URL (/g/:slug ou ?collection=), exibe a Homepage do Fotógrafo (paridade Pixieset)
  if (!currentCollection) {
    return (
      <>
        <PhotographerHomePage
          onSelectCollection={handleSelectCollection}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenDashboard={handleOpenDashboard}
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
