import type { CollectionConfigUpdate, DownloadPolicy } from '../../src/types/gallery.js';
import { hashSecret } from './security.js';
import { getSupabaseAdmin } from './supabase.js';

export interface AdminCollectionUpdate extends CollectionConfigUpdate {
  slug: string;
  clientEmails?: string[];
  downloads?: Partial<DownloadPolicy>;
}

export async function applyAdminCollectionUpdate(input: AdminCollectionUpdate) {
  const supabase = getSupabaseAdmin();
  const { data: current, error: currentError } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', input.slug)
    .single();
  if (currentError) throw currentError;

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

  const emails = (input.clientEmails ?? (input.clientEmail ? [input.clientEmail] : current.client_emails ?? []))
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean);
  if (emails.some((email: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error('EMAIL_INVALID_FORMAT');
  }

  const { data, error } = await supabase
    .from('collections')
    .update({
      title: input.title ?? current.title,
      visibility: input.visibility ?? current.visibility,
      password_required: passwordRequired,
      access_password_hash: passwordRequired ? accessPasswordHash : null,
      access_email_required: emails.length > 0,
      client_emails: emails,
      downloads: nextDownloads,
      download_pin_hash: nextDownloads.requiresPin ? downloadPinHash : null,
      client_notes: input.clientNotes ?? current.client_notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', current.id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export function sanitizeAdminCollection(row: Record<string, unknown>) {
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
    updatedAt: row.updated_at,
  };
}
