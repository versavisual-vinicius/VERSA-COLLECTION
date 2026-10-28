import { GalleryPage } from './components/GalleryPage';

export default function App() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const collectionSlug = params?.get('collection') ?? 'modec-dia-das-criancas-2026';

  return <GalleryPage collectionSlug={collectionSlug} />;
}
