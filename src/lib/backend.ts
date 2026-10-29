import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type {
  CollectionConfigUpdate,
  ExportRequest,
  GalleryCollection,
  GalleryPhoto,
} from '../types/gallery';

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
