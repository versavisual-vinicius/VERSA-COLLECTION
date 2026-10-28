import { randomBytes, scryptSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`);
  return value;
};

const hashSecret = (secret) => {
  if (!secret) return null;
  const salt = randomBytes(16).toString('base64url');
  const derived = scryptSync(secret, salt, 64);
  return `scrypt$${salt}$${derived.toString('base64url')}`;
};

const supabase = createClient(required('SUPABASE_URL'), required('SUPABASE_SECRET_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const indexPath = resolve('src/data/collections/index.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));

for (const entry of index) {
  const filePath = resolve(`src/data/collections/${entry.slug}.json`);
  const payload = JSON.parse(await readFile(filePath, 'utf8'));
  const collection = structuredClone(payload.collection);
  const password = collection.clientPassword;
  const emails = [collection.clientEmail, ...(collection.clientEmails ?? [])]
    .filter(Boolean)
    .map((email) => email.trim().toLowerCase());
  const pin = collection.downloads?.pin;
  delete collection.clientPassword;
  delete collection.clientEmail;
  delete collection.clientEmails;
  delete collection.downloads.pin;

  const { error: collectionError } = await supabase.from('collections').upsert({
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    business_name: collection.businessName,
    business_url: collection.businessUrl ?? null,
    cover: collection.cover,
    cover_focal_point: collection.coverFocalPoint,
    visibility: collection.visibility,
    password_required: collection.passwordRequired,
    access_password_hash: hashSecret(password),
    access_email_required: emails.length > 0,
    client_emails: emails,
    favorites_enabled: collection.favoritesEnabled,
    downloads: collection.downloads,
    download_pin_hash: hashSecret(pin),
    sharing_enabled: collection.sharingEnabled,
    slideshow_enabled: collection.slideshowEnabled,
    total_items: payload.photos.length,
    locale: collection.locale,
    theme: collection.theme,
    client_notes: collection.clientNotes ?? null,
    updated_at: new Date().toISOString(),
  });
  if (collectionError) throw collectionError;

  const sets = (collection.sets ?? []).map((set, position) => ({
    id: set.id,
    collection_id: collection.id,
    slug: set.slug,
    title: set.title,
    position,
    data: {
      photoCount: set.photoCount,
      photoIds: set.photoIds,
      coverPhotoUrl: set.coverPhotoUrl,
    },
  }));
  if (sets.length > 0) {
    const { error } = await supabase.from('gallery_sets').upsert(sets);
    if (error) throw error;
  }

  const photos = payload.photos.map((photo) => ({
    id: photo.id,
    collection_id: collection.id,
    set_id: photo.setId ?? null,
    position: photo.position,
    data: photo,
  }));
  for (let start = 0; start < photos.length; start += 250) {
    const { error } = await supabase.from('photos').upsert(photos.slice(start, start + 250));
    if (error) throw error;
  }

  console.log(`Coleção sincronizada: ${collection.slug} (${photos.length} fotos)`);
}
