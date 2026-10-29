import type { CollectionConfigUpdate, DownloadPolicy } from '../../src/types/gallery.js';
import { hashSecret } from './security.js';
import { query, type TransactionClient } from './db.js';

export interface AdminCollectionUpdate extends CollectionConfigUpdate {
  slug: string;
  clientEmails?: string[];
  downloads?: Partial<DownloadPolicy>;
}

export async function applyAdminCollectionUpdate(
  input: AdminCollectionUpdate,
  client?: TransactionClient,
) {
  const q = client ? client.query.bind(client) : query;
  const { rows: currentRows } = await q<Record<string, unknown>>(
    'SELECT * FROM public.collections WHERE slug = $1 LIMIT 1',
    [input.slug],
  );
  const current = currentRows[0];
  if (!current) throw new Error('NOT_FOUND');

  const password = input.clientPassword?.trim();
  const pin = input.downloads?.pin?.trim();
  if (password && password.length < 8) throw new Error('PASSWORD_TOO_SHORT');
  if (pin && !/^\d{4}$/.test(pin)) throw new Error('PIN_INVALID_FORMAT');
  const passwordRequired = input.passwordRequired ?? current.password_required;
  const nextDownloads = {
    ...(current.downloads as object),
    ...(input.downloads ?? {}),
  } as DownloadPolicy;
  delete nextDownloads.pin;

  const accessPasswordHash = password
    ? await hashSecret(password)
    : (current.access_password_hash as string | null);
  const downloadPinHash = pin
    ? await hashSecret(pin)
    : (current.download_pin_hash as string | null);

  if (passwordRequired && !accessPasswordHash) throw new Error('PASSWORD_REQUIRED_WITHOUT_SECRET');
  if (nextDownloads.requiresPin && !downloadPinHash) throw new Error('PIN_REQUIRED_WITHOUT_SECRET');

  const emails = (input.clientEmails ?? (input.clientEmail ? [input.clientEmail] : (current.client_emails as string[]) ?? []))
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean);
  if (emails.some((email: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error('EMAIL_INVALID_FORMAT');
  }

  const nextTheme = input.theme
    ? { ...(current.theme as object), ...input.theme }
    : current.theme;

  const { rows: updatedRows } = await q<Record<string, unknown>>(
    `UPDATE public.collections SET
      title = $1,
      visibility = $2,
      password_required = $3,
      access_password_hash = $4,
      access_email_required = $5,
      client_emails = $6,
      downloads = $7,
      download_pin_hash = $8,
      client_notes = $9,
      cover_focal_point = COALESCE($10, cover_focal_point),
      theme = COALESCE($11, theme),
      expires_at = $12,
      updated_at = $13
    WHERE id = $14
    RETURNING *`,
    [
      input.title ?? current.title,
      input.visibility ?? current.visibility,
      passwordRequired,
      passwordRequired ? accessPasswordHash : null,
      emails.length > 0,
      emails,
      JSON.stringify(nextDownloads),
      nextDownloads.requiresPin ? downloadPinHash : null,
      input.clientNotes ?? current.client_notes,
      input.coverFocalPoint ? JSON.stringify(input.coverFocalPoint) : null,
      input.theme ? JSON.stringify(nextTheme) : null,
      input.expiresAt ? new Date(input.expiresAt).toISOString() : (current.expires_at ?? null),
      new Date().toISOString(),
      current.id,
    ],
  );
  return updatedRows[0];
}

export function sanitizeAdminCollection(row: Record<string, unknown>) {
  const cover = row.cover as { sources?: Array<{ url: string }> } | undefined;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    visibility: row.visibility,
    passwordRequired: row.password_required,
    hasPassword: Boolean(row.access_password_hash),
    clientEmails: row.client_emails ?? [],
    downloads: row.downloads,
    hasDownloadPin: Boolean(row.download_pin_hash),
    clientNotes: row.client_notes ?? '',
    expiresAt: row.expires_at ? new Date(row.expires_at as string).toISOString() : undefined,
    coverFocalPoint: row.cover_focal_point as { x: number; y: number } | undefined,
    theme: row.theme,
    coverUrl: cover?.sources?.[0]?.url,
    updatedAt: row.updated_at,
  };
}
