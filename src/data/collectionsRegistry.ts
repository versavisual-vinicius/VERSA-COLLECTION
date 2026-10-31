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
    const validPhotos: GalleryPhoto[] = [];
    const resourceForkPhotos: GalleryPhoto[] = [];
    for (const photo of data.photos) {
      if (photo.fileName?.startsWith('._') || photo.fileName?.startsWith('.')) {
        resourceForkPhotos.push(photo);
      } else {
        validPhotos.push(photo);
      }
    }
    const orderedPhotos =
      resourceForkPhotos.length > 0 && validPhotos.length > 0
        ? [...validPhotos, ...resourceForkPhotos].map((p, idx) => ({
            ...p,
            position: idx + 1,
          }))
        : data.photos;

    availableCollections[data.collection.slug] = {
      collection: data.collection,
      photos: orderedPhotos,
    };
  }
}

export function getActiveCollectionEntries(): Array<[string, CollectionData]> {
  return Object.entries(availableCollections).filter(
    ([slug, data]) =>
      slug !== 'fixture' &&
      data.collection.visibility !== 'hidden' &&
      (data.photos?.length ?? data.collection.totalItems ?? 0) > 0,
  );
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
