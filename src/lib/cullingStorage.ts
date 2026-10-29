import type { CullingRecord, CullingStateMap, CullingFlag } from '../types/culling';
import type { GalleryPhoto } from '../types/gallery';

const STORAGE_PREFIX = 'versa_culling_v1_';

export function loadCullingState(collectionSlug: string): CullingStateMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${collectionSlug}`);
    if (!raw) return {};
    return JSON.parse(raw) as CullingStateMap;
  } catch (err) {
    console.warn('Falha ao carregar estado de triagem do localStorage:', err);
    return {};
  }
}

export function saveCullingState(collectionSlug: string, state: CullingStateMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${collectionSlug}`, JSON.stringify(state));
  } catch (err) {
    console.warn('Falha ao gravar estado de triagem no localStorage:', err);
  }
}

export function updatePhotoCulling(
  collectionSlug: string,
  currentState: CullingStateMap,
  photoId: string,
  update: Partial<CullingRecord>,
): CullingStateMap {
  const currentRecord: CullingRecord = currentState[photoId] || {
    flag: 'none',
    rating: 0,
    updatedAt: new Date().toISOString(),
  };

  const updatedRecord: CullingRecord = {
    ...currentRecord,
    ...update,
    updatedAt: new Date().toISOString(),
  };

  const nextState: CullingStateMap = {
    ...currentState,
    [photoId]: updatedRecord,
  };

  saveCullingState(collectionSlug, nextState);
  return nextState;
}

export interface CullingSummaryReport {
  total: number;
  picks: GalleryPhoto[];
  rejects: GalleryPhoto[];
  unflagged: GalleryPhoto[];
  ratedPhotos: Array<{ photo: GalleryPhoto; rating: number }>;
  generatedAt: string;
}

export function generateCullingReport(
  photos: GalleryPhoto[],
  state: CullingStateMap,
): CullingSummaryReport {
  const picks: GalleryPhoto[] = [];
  const rejects: GalleryPhoto[] = [];
  const unflagged: GalleryPhoto[] = [];
  const ratedPhotos: Array<{ photo: GalleryPhoto; rating: number }> = [];

  for (const photo of photos) {
    const record = state[photo.id] || { flag: 'none' as CullingFlag, rating: 0 };
    if (record.flag === 'pick') {
      picks.push(photo);
    } else if (record.flag === 'reject') {
      rejects.push(photo);
    } else {
      unflagged.push(photo);
    }

    if (record.rating > 0) {
      ratedPhotos.push({ photo, rating: record.rating });
    }
  }

  return {
    total: photos.length,
    picks,
    rejects,
    unflagged,
    ratedPhotos,
    generatedAt: new Date().toISOString(),
  };
}
