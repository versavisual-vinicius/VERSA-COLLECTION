import { useState } from 'react';
import { GalleryPage } from './components/GalleryPage';
import { PhotographerHomePage } from './components/PhotographerHomePage';
import { AdminPanel } from './components/Admin/AdminPanel';

export default function App() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Suporte a rotas /g/:slug ou query string ?collection=:slug
  const pathMatch = pathname.match(/^\/g\/([^/?#]+)/);
  const initialSlug = pathMatch?.[1] || params?.get('collection') || null;

  const [currentCollection, setCurrentCollection] = useState<string | null>(initialSlug);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleSelectCollection = (slug: string) => {
    setCurrentCollection(slug);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('collection', slug);
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  };

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

  return <GalleryPage collectionSlug={currentCollection} />;
}
