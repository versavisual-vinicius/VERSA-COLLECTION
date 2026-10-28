import type { GalleryCollection, GalleryPhoto } from '../../src/types/gallery.js';
import { getSupabaseAdmin } from './supabase.js';

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
  const { data, error } = await getSupabaseAdmin()
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as CollectionRow | null;
}

export async function getCollectionBundle(row: CollectionRow) {
  const supabase = getSupabaseAdmin();
  const [{ data: photoRows, error: photoError }, { data: setRows, error: setError }] = await Promise.all([
    supabase.from('photos').select('data').eq('collection_id', row.id).order('position'),
    supabase.from('gallery_sets').select('id,slug,title,data,position').eq('collection_id', row.id).order('position'),
  ]);
  if (photoError) throw photoError;
  if (setError) throw setError;

  const collection = toClientCollection(row);
  collection.sets = (setRows ?? []).map((set) => ({
    id: set.id as string,
    slug: set.slug as string,
    title: set.title as string,
    ...((set.data ?? {}) as object),
  }));

  return {
    collection,
    photos: (photoRows ?? []).map((photo) => photo.data as GalleryPhoto),
  };
}
