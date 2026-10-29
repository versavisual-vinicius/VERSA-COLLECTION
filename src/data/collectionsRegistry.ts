import type { GalleryCollection, GalleryPhoto } from '../types/gallery';
import { collectionFixture, galleryPhotos as fixturePhotos } from './fixtures';
import { applyCollectionSettings } from '../lib/collectionSettings';

export interface CollectionData {
  collection: GalleryCollection;
  photos: GalleryPhoto[];
}

const rawModules = import.meta.glob<Record<string, unknown>>('./collections/*.json', {
  eager: true,
  import: 'default',
});

export const availableCollections: Record<string, CollectionData> = {
  fixture: {
    collection: collectionFixture,
    photos: fixturePhotos,
  },
};

for (const [filePath, mod] of Object.entries(rawModules)) {
  if (filePath.endsWith('index.json')) continue;
  const data = mod as unknown as { collection?: GalleryCollection; photos?: GalleryPhoto[] };
  if (data?.collection?.slug && Array.isArray(data?.photos)) {
    availableCollections[data.collection.slug] = {
      collection: data.collection,
      photos: data.photos,
    };
  }
}

export const defaultCollectionSlug = 'modec-dia-das-criancas-2026';

export function getCollectionData(slug?: string | null): CollectionData {
  const base = !slug
    ? (availableCollections[defaultCollectionSlug] ?? availableCollections.fixture)
    : (availableCollections[slug] ?? availableCollections.fixture);

  return {
    ...base,
    collection: applyCollectionSettings(base.collection),
  };
}

export function getCollectionPage(
  photos: GalleryPhoto[],
  cursor: string | null,
  limit: number,
) {
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const nextSlice = photos.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  const nextCursor = nextIndex < photos.length ? String(nextIndex) : null;

  return {
    items: nextSlice,
    nextCursor,
    totalItems: photos.length,
  };
}
