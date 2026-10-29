import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminMetrics,
  CollectionConfigUpdate,
  CreateCollectionInput,
  CreateCollectionResponse,
  ExportRequest,
  GalleryCollection,
  GalleryPhoto,
  LibraryPhotoItem,
  PhotoLibraryQuery,
  PhotoLibraryResponse,
} from '../types/gallery';
import { availableCollections } from '../data/collectionsRegistry';

export interface CollectionBundle {
  collection: GalleryCollection;
  photos: GalleryPhoto[];
}

export interface PublicCollectionCard {
  id: string;
  slug: string;
  title: string;
  totalItems: number;
  cover: GalleryCollection['cover'];
}

export interface ProtectedCollectionError {
  collection: GalleryCollection;
  requiresEmail: boolean;
}

export interface AdminCollection {
  id: string;
  slug: string;
  title: string;
  visibility: GalleryCollection['visibility'];
  passwordRequired: boolean;
  hasPassword: boolean;
  clientEmails: string[];
  downloads: GalleryCollection['downloads'];
  hasDownloadPin: boolean;
  clientNotes: string;
  updatedAt: string;
  expiresAt?: string;
  coverFocalPoint?: { x: number; y: number };
  theme?: GalleryCollection['theme'];
  coverUrl?: string;
  sets?: GalleryCollection['sets'];
}

export class BackendError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const backendEnabled = import.meta.env.VITE_API_ENABLED === 'true';

let browserClient: SupabaseClient | null = null;

function getBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase ainda não configurado no frontend.');
  browserClient = createClient(url, key);
  return browserClient;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = body.error ?? {};
    throw new BackendError(
      response.status,
      error.code ?? 'UNKNOWN',
      error.message ?? 'Falha de comunicação com o backend.',
      body,
    );
  }
  return body as T;
}

export async function fetchCollectionBundle(slug: string): Promise<CollectionBundle> {
  const response = await fetch(`/api/collections/${encodeURIComponent(slug)}`, {
    credentials: 'include',
    headers: { accept: 'application/json' },
  });
  return parseResponse<CollectionBundle>(response);
}

export async function fetchPublicCollections(): Promise<PublicCollectionCard[]> {
  const response = await fetch('/api/collections', { headers: { accept: 'application/json' } });
  const result = await parseResponse<{ collections: PublicCollectionCard[] }>(response);
  return result.collections;
}

export async function unlockCollection(slug: string, password: string, email?: string): Promise<void> {
  const response = await fetch(`/api/collections/${encodeURIComponent(slug)}/session`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password, email }),
  });
  await parseResponse<{ success: true }>(response);
}

export async function createExportRequest(input: {
  collectionSlug: string;
  type: 'single' | 'collection' | 'favorites';
  photoId?: string;
  clientEmail?: string;
  pin?: string;
  requestedSize: string;
}): Promise<{ downloadUrl: string | null }> {
  const response = await fetch('/api/export-requests', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseResponse<{ downloadUrl: string | null }>(response);
}

export async function requestAdminMagicLink(email: string): Promise<void> {
  const redirectTo = `${window.location.origin}${window.location.pathname}?admin=true`;
  const { error } = await getBrowserClient().auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
  });
  if (error) throw error;
}

export async function getAdminSession(): Promise<Session | null> {
  const { data, error } = await getBrowserClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await getBrowserClient().auth.signOut();
  if (error) throw error;
}

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await getAdminSession();
  if (!session) throw new BackendError(401, 'ADMIN_AUTH_REQUIRED', 'Faça login por magic link.');
  const response = await fetch(path, {
    ...init,
    headers: {
      ...init.headers,
      authorization: `Bearer ${session.access_token}`,
    },
  });
  return parseResponse<T>(response);
}

export async function fetchAdminCollections(): Promise<AdminCollection[]> {
  const result = await adminFetch<{ collections: AdminCollection[] }>('/api/admin/collections');
  return result.collections;
}

export async function updateAdminCollection(
  slug: string,
  update: CollectionConfigUpdate,
): Promise<AdminCollection> {
  const result = await adminFetch<{ collections?: AdminCollection[]; collection?: AdminCollection }>(
    '/api/admin/collections',
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, ...update }),
    },
  );
  return result.collection ?? result.collections?.[0] ?? (await fetchAdminCollections()).find((item) => item.slug === slug)!;
}

export async function fetchAdminExportRequests(): Promise<ExportRequest[]> {
  const result = await adminFetch<{ requests: Array<Record<string, unknown>> }>('/api/admin/export-requests');
  return result.requests.map((row) => {
    const collection = row.collections as { slug?: string; title?: string } | null;
    return {
      id: String(row.id),
      collectionSlug: collection?.slug ?? '',
      collectionTitle: collection?.title ?? '',
      type: row.request_type as ExportRequest['type'],
      photoId: row.photo_id as string | undefined,
      photoFileName: row.photo_file_name as string | undefined,
      clientEmail: (row.client_email as string | undefined) ?? '',
      requestedSize: String(row.requested_size),
      status: row.status as ExportRequest['status'],
      requestedAt: String(row.requested_at),
      completedAt: row.completed_at as string | undefined,
      downloadUrl: row.download_url as string | undefined,
    };
  });
}

export async function importLegacyBrowserData(): Promise<{ collections: number; requests: number }> {
  const collections: AdminCollection[] = await fetchAdminCollections();
  const updates: Array<CollectionConfigUpdate & { slug: string }> = [];
  for (const collection of collections) {
    const raw = localStorage.getItem(`versa_col_config_${collection.slug}`);
    if (raw) updates.push({ slug: collection.slug, ...(JSON.parse(raw) as CollectionConfigUpdate) });
  }
  const requests = JSON.parse(localStorage.getItem('versa_export_requests_v1') ?? '[]') as ExportRequest[];
  const sourceKey = `browser-${window.location.hostname}-${collections.map((item) => item.slug).join(',')}`;
  const result = await adminFetch<{ summary: { collections: number; requests: number } }>(
    '/api/admin/migrate-local',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sourceKey, collections: updates, requests }),
    },
  );
  return result.summary;
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const computeLocal = (dbStatus: 'healthy' | 'degraded'): AdminMetrics => {
    const collectionsCount = Object.keys(availableCollections).length;
    const photosCount = Object.values(availableCollections).reduce(
      (acc, c) => acc + c.photos.length,
      0,
    );
    const bytesPerPhoto = 12.5 * 1024 * 1024;
    const storageUsedBytes = photosCount * bytesPerPhoto;
    const storageLimitBytes = 100 * 1024 * 1024 * 1024;
    const storagePercentage = Math.min(
      100,
      parseFloat(((storageUsedBytes / storageLimitBytes) * 100).toFixed(1)),
    );

    return {
      totalCollections: collectionsCount,
      totalPhotos: photosCount,
      totalExports: 0,
      storageUsedBytes,
      storageLimitBytes,
      storagePercentage,
      services: {
        database: dbStatus,
        server: 'healthy',
        cdn: 'healthy',
      },
      updatedAt: new Date().toISOString(),
    };
  };

  if (!backendEnabled) {
    return computeLocal('healthy');
  }

  try {
    const result = await adminFetch<{ metrics: AdminMetrics }>('/api/admin/metrics');
    return result.metrics;
  } catch (err) {
    console.warn('Falha ao buscar métricas online, usando fallback local:', err);
    return computeLocal('degraded');
  }
}

export async function fetchPhotoLibrary(
  query: PhotoLibraryQuery = {},
  signal?: AbortSignal,
): Promise<PhotoLibraryResponse> {
  const computeLocal = (): PhotoLibraryResponse => {
    const qTerm = (query.q ?? '').trim().toLowerCase();
    const colFilter = (query.collection ?? '').trim();
    const orientFilter = query.orientation ?? 'all';
    const limit = query.limit ?? 32;
    const offset = query.offset ?? 0;

    const allCollections = Object.values(availableCollections);
    const collectionsList = allCollections.map((c) => ({
      slug: c.collection.slug,
      title: c.collection.title,
      count: c.photos.length,
    }));

    let allPhotos: LibraryPhotoItem[] = [];
    for (const c of allCollections) {
      if (colFilter && c.collection.slug !== colFilter) continue;
      for (const p of c.photos) {
        allPhotos.push({
          ...p,
          collectionSlug: c.collection.slug,
          collectionTitle: c.collection.title,
        });
      }
    }

    if (qTerm) {
      allPhotos = allPhotos.filter(
        (p) =>
          p.fileName.toLowerCase().includes(qTerm) ||
          (p.caption && p.caption.toLowerCase().includes(qTerm)) ||
          p.alt.toLowerCase().includes(qTerm) ||
          p.collectionTitle.toLowerCase().includes(qTerm),
      );
    }

    if (orientFilter === 'portrait') {
      allPhotos = allPhotos.filter((p) => p.height > p.width);
    } else if (orientFilter === 'landscape') {
      allPhotos = allPhotos.filter((p) => p.width >= p.height);
    }

    const totalCount = allPhotos.length;
    const items = allPhotos.slice(offset, offset + limit);

    return {
      items,
      totalCount,
      hasMore: offset + items.length < totalCount,
      collections: collectionsList,
    };
  };

  if (!backendEnabled) {
    return computeLocal();
  }

  try {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.collection) params.set('collection', query.collection);
    if (query.orientation && query.orientation !== 'all') params.set('orientation', query.orientation);
    if (query.limit) params.set('limit', String(query.limit));
    if (query.offset) params.set('offset', String(query.offset));

    const res = await fetch(`/api/photos?${params.toString()}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      throw new BackendError(res.status, 'PHOTOS_FETCH_FAILED', 'Falha ao buscar fotos da biblioteca.');
    }

    return (await res.json()) as PhotoLibraryResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    console.warn('Falha ao consultar /api/photos, usando fallback local:', err);
    return computeLocal();
  }
}

export async function createCollection(
  input: CreateCollectionInput,
  signal?: AbortSignal,
): Promise<CreateCollectionResponse> {
  const localFallback = (): CreateCollectionResponse => {
    const id = `col-${input.slug}-${Date.now().toString(36)}`;
    const coverUrl =
      input.coverUrl ||
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=2400&q=80';
    const createdAt = new Date().toISOString();

    const fixtureList = availableCollections.fixture?.photos || [];
    const demoPhotosList = input.seedDemoPhotos
      ? fixtureList.slice(0, 8).map((p, idx) => ({
          ...p,
          id: `demo-${id}-${idx + 1}`,
          shareUrl: `/?collection=${input.slug}&photo=demo-${id}-${idx + 1}`,
        }))
      : [];

    const newCol: GalleryCollection = {
      id,
      slug: input.slug,
      title: input.title,
      businessName: 'Versa Visual',
      cover: {
        alt: input.title,
        width: 2400,
        height: 1600,
        dominantColor: '#050A0D',
        sources: [{ url: coverUrl, width: 2400, height: 1600, format: 'jpeg' as const }],
      },
      coverFocalPoint: input.coverFocalPoint || { x: 50, y: 50 },
      visibility: input.visibility || 'public',
      passwordRequired: Boolean(input.visibility === 'password' && input.password),
      favoritesEnabled: true,
      downloads: {
        enabled: true,
        individualEnabled: true,
        collectionEnabled: true,
        requiresEmail: false,
        requiresPin: false,
        allowedSizes: ['original', '3600', '2048'],
      },
      sharingEnabled: true,
      slideshowEnabled: true,
      totalItems: demoPhotosList.length,
      locale: 'pt-BR',
      theme: {
        headingFont: 'Outfit',
        bodyFont: 'DM Sans',
        foreground: '#FFFFFF',
        background: '#050A0D',
        gridGapDesktop: 6,
        gridGapMobile: 4,
        coverOverlayOpacity: 0.5,
      },
      sets: [
        {
          id: `set-${id}-main`,
          title: 'Geral',
          slug: 'geral',
          photoCount: demoPhotosList.length,
        },
      ],
    };

    availableCollections[input.slug] = {
      collection: newCol,
      photos: demoPhotosList,
    };

    return {
      success: true,
      collection: {
        id,
        slug: input.slug,
        title: input.title,
        totalItems: newCol.totalItems,
        coverUrl,
        createdAt,
      },
    };
  };

  if (!backendEnabled) {
    return localFallback();
  }

  try {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(input),
      signal,
    });

    if (!res.ok) {
      const errBody = (await res.json().catch(() => ({}))) as {
        error?: { code?: string; message?: string; details?: unknown };
      };
      throw new BackendError(
        res.status,
        errBody.error?.code || 'COLLECTION_CREATE_FAILED',
        errBody.error?.message || 'Falha ao criar nova coleção.',
        errBody.error?.details,
      );
    }

    const data = (await res.json()) as CreateCollectionResponse;
    localFallback();
    return data;
  } catch (err) {
    if (err instanceof BackendError) throw err;
    if (err instanceof Error && err.name === 'AbortError') throw err;
    console.warn('Falha na chamada POST /api/collections, usando fallback local:', err);
    return localFallback();
  }
}


