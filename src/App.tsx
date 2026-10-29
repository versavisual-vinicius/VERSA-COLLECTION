import { useCallback, useEffect, useState } from 'react';
import { GalleryPage } from './components/GalleryPage';
import { PhotographerHomePage } from './components/PhotographerHomePage';
import { AdminPanel } from './components/Admin/AdminPanel';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { PhotoLibraryPage } from './components/PhotoLibrary/PhotoLibraryPage';

type AppView = 'home' | 'gallery' | 'dashboard' | 'photos';

function resolveViewFromUrl(): { view: AppView; slug: string | null } {
  if (typeof window === 'undefined') return { view: 'home', slug: null };
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');

  if (pathname === '/photos' || viewParam === 'photos') {
    return { view: 'photos', slug: null };
  }
  if (pathname === '/dashboard' || viewParam === 'dashboard') {
    return { view: 'dashboard', slug: null };
  }
  const pathMatch = pathname.match(/^\/g\/([^/?#]+)/);
  const slug = pathMatch?.[1] || params.get('collection') || null;
  if (slug) {
    return { view: 'gallery', slug };
  }
  return { view: 'home', slug: null };
}

export default function App() {
  const [viewState, setViewState] = useState(() => resolveViewFromUrl());
  const [currentCollection, setCurrentCollection] = useState<string | null>(viewState.slug);
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
    setViewState({ view: 'gallery', slug });
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
    setViewState({ view: 'home', slug: null });
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
    setViewState({ view: 'dashboard', slug: null });
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/dashboard';
      nextUrl.searchParams.delete('collection');
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      nextUrl.searchParams.delete('view');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const handleOpenPhotos = useCallback(() => {
    setCurrentCollection(null);
    setViewState({ view: 'photos', slug: null });
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/photos';
      nextUrl.searchParams.delete('collection');
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      nextUrl.searchParams.delete('view');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  // Se o usuário acessar a rota /photos, renderiza a Biblioteca Central de Fotos
  if (viewState.view === 'photos') {
    return (
      <>
        <PhotoLibraryPage
          onNavigateHome={handleGoHome}
          onNavigateDashboard={handleOpenDashboard}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onCreateCollection={() => setIsAdminOpen(true)}
          onSelectCollection={handleSelectCollection}
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

  // Se o usuário acessar a rota /dashboard, renderiza o Studio Hub central
  if (viewState.view === 'dashboard') {
    return (
      <>
        <DashboardPage
          onNavigateHome={handleGoHome}
          onNavigatePhotos={handleOpenPhotos}
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
  if (viewState.view === 'home' || !currentCollection) {
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
