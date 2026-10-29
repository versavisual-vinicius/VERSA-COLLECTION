import { randomBytes, scryptSync } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pg from 'pg';

const { Client } = pg;

const hashSecret = (secret) => {
  if (!secret) return null;
  const salt = randomBytes(16).toString('base64url');
  const derived = scryptSync(secret, salt, 64);
  return `scrypt$${salt}$${derived.toString('base64url')}`;
};

const escapeString = (val) => {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
};

const escapeJson = (val) => {
  if (val === null || val === undefined) return 'NULL';
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
};

const escapeArray = (arr) => {
  if (!arr || arr.length === 0) return "'{}'::text[]";
  const items = arr.map((item) => `'${String(item).replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${items}]::text[]`;
};

const escapeBool = (val) => (val ? 'true' : 'false');
const escapeInt = (val) => (Number.isInteger(val) ? String(val) : '0');

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const indexPath = resolve('src/data/collections/index.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));

const sqlStatements = [
  '-- Semente gerada automaticamente para Cloud SQL / PostgreSQL (Cloud Run)',
  'BEGIN;',
  '',
];

const dbOperations = [];

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
  if (collection.downloads) {
    delete collection.downloads.pin;
  }

  const collectionRow = {
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    business_name: collection.businessName ?? 'Versa Visual',
    business_url: collection.businessUrl ?? null,
    cover: collection.cover,
    cover_focal_point: collection.coverFocalPoint ?? { x: 50, y: 50 },
    visibility: collection.visibility ?? 'hidden',
    password_required: Boolean(collection.passwordRequired),
    access_password_hash: hashSecret(password),
    access_email_required: emails.length > 0,
    client_emails: emails,
    favorites_enabled: collection.favoritesEnabled ?? true,
    downloads: collection.downloads ?? { enabled: false },
    download_pin_hash: hashSecret(pin),
    sharing_enabled: collection.sharingEnabled ?? true,
    slideshow_enabled: collection.slideshowEnabled ?? true,
    total_items: payload.photos.length,
    locale: collection.locale ?? 'pt-BR',
    theme: collection.theme ?? {},
    client_notes: collection.clientNotes ?? null,
    updated_at: new Date().toISOString(),
  };

  sqlStatements.push(`-- Coleção: ${collection.slug}`);
  sqlStatements.push(`INSERT INTO public.collections (
  id, slug, title, business_name, business_url, cover, cover_focal_point,
  visibility, password_required, access_password_hash, access_email_required,
  client_emails, favorites_enabled, downloads, download_pin_hash,
  sharing_enabled, slideshow_enabled, total_items, locale, theme,
  client_notes, updated_at
) VALUES (
  ${escapeString(collectionRow.id)},
  ${escapeString(collectionRow.slug)},
  ${escapeString(collectionRow.title)},
  ${escapeString(collectionRow.business_name)},
  ${escapeString(collectionRow.business_url)},
  ${escapeJson(collectionRow.cover)},
  ${escapeJson(collectionRow.cover_focal_point)},
  ${escapeString(collectionRow.visibility)},
  ${escapeBool(collectionRow.password_required)},
  ${escapeString(collectionRow.access_password_hash)},
  ${escapeBool(collectionRow.access_email_required)},
  ${escapeArray(collectionRow.client_emails)},
  ${escapeBool(collectionRow.favorites_enabled)},
  ${escapeJson(collectionRow.downloads)},
  ${escapeString(collectionRow.download_pin_hash)},
  ${escapeBool(collectionRow.sharing_enabled)},
  ${escapeBool(collectionRow.slideshow_enabled)},
  ${escapeInt(collectionRow.total_items)},
  ${escapeString(collectionRow.locale)},
  ${escapeJson(collectionRow.theme)},
  ${escapeString(collectionRow.client_notes)},
  ${escapeString(collectionRow.updated_at)}::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  business_name = EXCLUDED.business_name,
  business_url = EXCLUDED.business_url,
  cover = EXCLUDED.cover,
  cover_focal_point = EXCLUDED.cover_focal_point,
  visibility = EXCLUDED.visibility,
  password_required = EXCLUDED.password_required,
  access_password_hash = EXCLUDED.access_password_hash,
  access_email_required = EXCLUDED.access_email_required,
  client_emails = EXCLUDED.client_emails,
  favorites_enabled = EXCLUDED.favorites_enabled,
  downloads = EXCLUDED.downloads,
  download_pin_hash = EXCLUDED.download_pin_hash,
  sharing_enabled = EXCLUDED.sharing_enabled,
  slideshow_enabled = EXCLUDED.slideshow_enabled,
  total_items = EXCLUDED.total_items,
  locale = EXCLUDED.locale,
  theme = EXCLUDED.theme,
  client_notes = EXCLUDED.client_notes,
  updated_at = EXCLUDED.updated_at;
`);

  dbOperations.push({
    text: `INSERT INTO public.collections (
      id, slug, title, business_name, business_url, cover, cover_focal_point,
      visibility, password_required, access_password_hash, access_email_required,
      client_emails, favorites_enabled, downloads, download_pin_hash,
      sharing_enabled, slideshow_enabled, total_items, locale, theme,
      client_notes, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      business_name = EXCLUDED.business_name,
      business_url = EXCLUDED.business_url,
      cover = EXCLUDED.cover,
      cover_focal_point = EXCLUDED.cover_focal_point,
      visibility = EXCLUDED.visibility,
      password_required = EXCLUDED.password_required,
      access_password_hash = EXCLUDED.access_password_hash,
      access_email_required = EXCLUDED.access_email_required,
      client_emails = EXCLUDED.client_emails,
      favorites_enabled = EXCLUDED.favorites_enabled,
      downloads = EXCLUDED.downloads,
      download_pin_hash = EXCLUDED.download_pin_hash,
      sharing_enabled = EXCLUDED.sharing_enabled,
      slideshow_enabled = EXCLUDED.slideshow_enabled,
      total_items = EXCLUDED.total_items,
      locale = EXCLUDED.locale,
      theme = EXCLUDED.theme,
      client_notes = EXCLUDED.client_notes,
      updated_at = EXCLUDED.updated_at;`,
    values: [
      collectionRow.id,
      collectionRow.slug,
      collectionRow.title,
      collectionRow.business_name,
      collectionRow.business_url,
      JSON.stringify(collectionRow.cover),
      JSON.stringify(collectionRow.cover_focal_point),
      collectionRow.visibility,
      collectionRow.password_required,
      collectionRow.access_password_hash,
      collectionRow.access_email_required,
      collectionRow.client_emails,
      collectionRow.favorites_enabled,
      JSON.stringify(collectionRow.downloads),
      collectionRow.download_pin_hash,
      collectionRow.sharing_enabled,
      collectionRow.slideshow_enabled,
      collectionRow.total_items,
      collectionRow.locale,
      JSON.stringify(collectionRow.theme),
      collectionRow.client_notes,
      collectionRow.updated_at,
    ],
  });

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

  for (const set of sets) {
    sqlStatements.push(`INSERT INTO public.gallery_sets (
  id, collection_id, slug, title, position, data
) VALUES (
  ${escapeString(set.id)},
  ${escapeString(set.collection_id)},
  ${escapeString(set.slug)},
  ${escapeString(set.title)},
  ${escapeInt(set.position)},
  ${escapeJson(set.data)}
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  data = EXCLUDED.data;
`);

    dbOperations.push({
      text: `INSERT INTO public.gallery_sets (id, collection_id, slug, title, position, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        collection_id = EXCLUDED.collection_id,
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        position = EXCLUDED.position,
        data = EXCLUDED.data;`,
      values: [set.id, set.collection_id, set.slug, set.title, set.position, JSON.stringify(set.data)],
    });
  }

  const photos = payload.photos.map((photo) => ({
    id: photo.id,
    collection_id: collection.id,
    set_id: photo.setId ?? null,
    position: photo.position,
    data: photo,
  }));

  for (const photo of photos) {
    sqlStatements.push(`INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  ${escapeString(photo.id)},
  ${escapeString(photo.collection_id)},
  ${escapeString(photo.set_id)},
  ${escapeInt(photo.position)},
  ${escapeJson(photo.data)}
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;
`);

    dbOperations.push({
      text: `INSERT INTO public.photos (id, collection_id, set_id, position, data)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        collection_id = EXCLUDED.collection_id,
        set_id = EXCLUDED.set_id,
        position = EXCLUDED.position,
        data = EXCLUDED.data;`,
      values: [photo.id, photo.collection_id, photo.set_id, photo.position, JSON.stringify(photo.data)],
    });
  }

  console.log(`Coleção processada: ${collection.slug} (${photos.length} fotos, ${sets.length} sets)`);
}

sqlStatements.push('COMMIT;');
const sqlOutput = sqlStatements.join('\n');

const sqlFilePath = resolve('scripts/seed-collections.sql');
await writeFile(sqlFilePath, sqlOutput, 'utf8');
console.log(`✅ Arquivo SQL gerado: ${sqlFilePath}`);

if (databaseUrl) {
  console.log('Conectando ao PostgreSQL / Cloud SQL via DATABASE_URL...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    for (const op of dbOperations) {
      await client.query(op.text, op.values);
    }
    await client.query('COMMIT');
    console.log('✅ Dados inseridos com sucesso no PostgreSQL / Cloud SQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante execução SQL no PostgreSQL:', err);
    throw err;
  } finally {
    await client.end();
  }
} else {
  console.log('ℹ️  DATABASE_URL não definida. Para aplicar no Cloud SQL / PostgreSQL execute:');
  console.log('    psql "$DATABASE_URL" -f scripts/seed-collections.sql');
}
