import type { GalleryCollection, GalleryPhoto } from '../../src/types/gallery.js';
import { query } from './db.js';

export interface CollectionRow {
  id: string;
  slug: string;
  title: string;
  business_name: string;
  business_url: string | null;
  cover: GalleryCollection['cover'];
  cover_focal_point: GalleryCollection['coverFocalPoint'];
  visibility: GalleryCollection['visibility'];
  password_required: boolean;
  access_password_hash: string | null;
  access_email_required: boolean;
  client_emails: string[];
  favorites_enabled: boolean;
  downloads: GalleryCollection['downloads'];
  download_pin_hash: string | null;
  sharing_enabled: boolean;
  slideshow_enabled: boolean;
  total_items: number;
  locale: string;
  theme: GalleryCollection['theme'];
  client_notes: string | null;
}

export function toClientCollection(row: CollectionRow): GalleryCollection {
  const downloads = { ...row.downloads };
  delete downloads.pin;
  delete downloads.directFolderUrl;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    businessName: row.business_name,
    businessUrl: row.business_url ?? undefined,
    cover: row.cover,
    coverFocalPoint: row.cover_focal_point,
    visibility: row.visibility,
    passwordRequired: row.password_required,
    favoritesEnabled: row.favorites_enabled,
    downloads,
    sharingEnabled: row.sharing_enabled,
    slideshowEnabled: row.slideshow_enabled,
    totalItems: row.total_items,
    locale: row.locale,
    theme: row.theme,
    sets: [],
  };
}

export async function getCollectionRow(slug: string): Promise<CollectionRow | null> {
  const { rows } = await query<CollectionRow>(
    'SELECT * FROM public.collections WHERE slug = $1 LIMIT 1',
    [slug],
  );
  return rows[0] ?? null;
}

export async function getCollectionBundle(row: CollectionRow) {
  const [photoRes, setRes] = await Promise.all([
    query<{ data: GalleryPhoto }>(
      'SELECT data FROM public.photos WHERE collection_id = $1 ORDER BY position ASC',
      [row.id],
    ),
    query<{ id: string; slug: string; title: string; data: Record<string, unknown>; position: number }>(
      'SELECT id, slug, title, data, position FROM public.gallery_sets WHERE collection_id = $1 ORDER BY position ASC',
      [row.id],
    ),
  ]);

  const collection = toClientCollection(row);
  collection.sets = setRes.rows.map((set) => ({
    id: set.id,
    slug: set.slug,
    title: set.title,
    ...(set.data ?? {}),
  }));

  return {
    collection,
    photos: photoRes.rows.map((photo) => photo.data),
  };
}
