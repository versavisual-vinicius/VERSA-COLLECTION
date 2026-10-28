import type { GalleryCollection, GalleryPhoto } from '../types/gallery';
import { collectionFixture, galleryPhotos as fixturePhotos } from './fixtures';
import modecData from './collections/modec-dia-das-criancas-2026.json';
import { applyCollectionSettings } from '../lib/collectionSettings';

export interface CollectionData {
  collection: GalleryCollection;
  photos: GalleryPhoto[];
}

export const availableCollections: Record<string, CollectionData> = {
  'modec-dia-das-criancas-2026': {
    collection: modecData.collection as unknown as GalleryCollection,
    photos: modecData.photos as unknown as GalleryPhoto[],
  },
  fixture: {
    collection: collectionFixture,
    photos: fixturePhotos,
  },
};

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
