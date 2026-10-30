import { useCallback, useEffect, useState } from 'react';
import { GalleryPage } from './components/GalleryPage';
import { PhotographerHomePage } from './components/PhotographerHomePage';
import { AdminPanel } from './components/Admin/AdminPanel';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { PhotoLibraryPage } from './components/PhotoLibrary/PhotoLibraryPage';
import { CollectionCreateWizard } from './components/CollectionWizard/CollectionCreateWizard';
import { PhotoEditorPage } from './components/PhotoEditor/PhotoEditorPage';
import { LoginPage } from './components/Auth/LoginPage';
import type { CreateCollectionResponse } from './types/gallery';

type AppView = 'home' | 'gallery' | 'dashboard' | 'photos' | 'create-collection' | 'editor' | 'login';

function resolveViewFromUrl(): { view: AppView; slug: string | null } {
  if (typeof window === 'undefined') return { view: 'home', slug: null };
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');

  if (pathname === '/login' || viewParam === 'login') {
    return { view: 'login', slug: null };
  }
  if (
    pathname === '/editor' ||
    pathname.startsWith('/projects') ||
    viewParam === 'editor'
  ) {
    return { view: 'editor', slug: params.get('collection') || null };
  }
  if (
    pathname === '/collections/create' ||
    pathname === '/collections/new' ||
    viewParam === 'create-collection'
  ) {
    return { view: 'create-collection', slug: null };
  }
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
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState<boolean>(
    () => viewState.view === 'create-collection',
  );
  const [isOwnerPreview, setIsOwnerPreview] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('preview') === 'true' ||
      params.get('mode') === 'preview' ||
      params.get('admin') === 'true'
    );
  });

  useEffect(() => {
    const handlePopState = () => {
      const view = resolveViewFromUrl();
      setViewState(view);
      setCurrentCollection(view.slug);
      setIsCreateWizardOpen(view.view === 'create-collection');
      const params = new URLSearchParams(window.location.search);
      setIsOwnerPreview(
        params.get('preview') === 'true' ||
        params.get('mode') === 'preview' ||
        params.get('admin') === 'true',
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCollection = useCallback((slug: string, isPreview = false) => {
    setCurrentCollection(slug);
    setViewState({ view: 'gallery', slug });
    setIsCreateWizardOpen(false);
    setIsOwnerPreview(isPreview);
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
    setIsCreateWizardOpen(false);
    setIsOwnerPreview(false);
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

  const handleOpenLogin = useCallback(() => {
    setCurrentCollection(null);
    setViewState({ view: 'login', slug: null });
    setIsCreateWizardOpen(false);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/login');
    }
  }, []);

  const handleOpenDashboard = useCallback(() => {
    setCurrentCollection(null);
    setViewState({ view: 'dashboard', slug: null });
    setIsCreateWizardOpen(false);
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
    setIsCreateWizardOpen(false);
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

  const handleOpenEditor = useCallback(() => {
    setViewState({ view: 'editor', slug: currentCollection });
    setIsCreateWizardOpen(false);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = '/editor';
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('pid');
      nextUrl.searchParams.delete('view');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, [currentCollection]);

  const handleOpenCreateWizard = useCallback(() => {
    setIsCreateWizardOpen(true);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('view', 'create-collection');
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const handleCloseCreateWizard = useCallback(() => {
    setIsCreateWizardOpen(false);
    if (viewState.view === 'create-collection') {
      setViewState({ view: 'dashboard', slug: null });
    }
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      const isDedicatedCreateRoute =
        nextUrl.pathname === '/collections/create' || nextUrl.pathname === '/collections/new';
      nextUrl.searchParams.delete('view');
      if (isDedicatedCreateRoute) {
        nextUrl.pathname = '/dashboard';
      }
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, [viewState.view]);

  const handleCreateSuccess = useCallback(
    (newCol: CreateCollectionResponse['collection']) => {
      setIsCreateWizardOpen(false);
      handleSelectCollection(newCol.slug);
    },
    [handleSelectCollection],
  );

  if (viewState.view === 'login') {
    return <LoginPage onNavigateHome={handleGoHome} onLoginSuccess={handleOpenDashboard} />;
  }

  // Se o usuário acessar a rota /editor, renderiza o Photo Editor & Culling
  if (viewState.view === 'editor') {
    return (
      <PhotoEditorPage
        initialSlug={viewState.slug || undefined}
        onNavigateHome={handleGoHome}
        onNavigateDashboard={handleOpenDashboard}
      />
    );
  }

  // Se o usuário acessar a rota /photos, renderiza a Biblioteca Central de Fotos
  if (viewState.view === 'photos') {
    return (
      <>
        <PhotoLibraryPage
          onNavigateHome={handleGoHome}
          onNavigateDashboard={handleOpenDashboard}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onCreateCollection={handleOpenCreateWizard}
          onSelectCollection={handleSelectCollection}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug="modec-dia-das-criancas-2026"
            onClose={() => setIsAdminOpen(false)}
            onSelectCollection={(slug) => {
              setIsAdminOpen(false);
              handleSelectCollection(slug, true);
            }}
          />
        )}
        <CollectionCreateWizard
          isOpen={isCreateWizardOpen}
          onClose={handleCloseCreateWizard}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  // Se o usuário acessar a rota /dashboard ou view create-collection
  if (viewState.view === 'dashboard' || viewState.view === 'create-collection') {
    return (
      <>
        <DashboardPage
          onNavigateHome={handleGoHome}
          onNavigatePhotos={handleOpenPhotos}
          onNavigateEditor={handleOpenEditor}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onCreateCollection={handleOpenCreateWizard}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug="modec-dia-das-criancas-2026"
            onClose={() => setIsAdminOpen(false)}
            onSelectCollection={(slug) => {
              setIsAdminOpen(false);
              handleSelectCollection(slug, true);
            }}
          />
        )}
        <CollectionCreateWizard
          isOpen={isCreateWizardOpen}
          onClose={handleCloseCreateWizard}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  // Se nenhuma coleção especificada via URL (/g/:slug ou ?collection=), exibe a Homepage do Fotógrafo (paridade Pixieset)
  if (viewState.view === 'home' || !currentCollection) {
    return (
      <>
        <PhotographerHomePage
          onSelectCollection={handleSelectCollection}
          onOpenAdmin={handleOpenLogin}
          onOpenDashboard={handleOpenDashboard}
        />
        {isAdminOpen && (
          <AdminPanel
            initialSlug="modec-dia-das-criancas-2026"
            onClose={() => setIsAdminOpen(false)}
            onSelectCollection={(slug) => {
              setIsAdminOpen(false);
              handleSelectCollection(slug, true);
            }}
          />
        )}
        <CollectionCreateWizard
          isOpen={isCreateWizardOpen}
          onClose={handleCloseCreateWizard}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
      <GalleryPage
        collectionSlug={currentCollection}
        isOwnerPreview={isOwnerPreview}
        onGoHome={handleGoHome}
        onSelectCollection={handleSelectCollection}
      />
      <CollectionCreateWizard
        isOpen={isCreateWizardOpen}
        onClose={handleCloseCreateWizard}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
