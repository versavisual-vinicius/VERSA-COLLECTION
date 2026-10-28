import { GalleryPage } from './components/GalleryPage';

export default function App() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Suporte a rotas /g/:slug ou query string ?collection=:slug
  const pathMatch = pathname.match(/^\/g\/([^/?#]+)/);
  const collectionSlug = pathMatch?.[1] || params?.get('collection') || 'modec-dia-das-criancas-2026';

  return <GalleryPage collectionSlug={collectionSlug} />;
}
