import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookieValue, sessionCookieName } from './http.js';
import { getSupabaseAdmin } from './supabase.js';

const scrypt = promisify(scryptCallback);
const SESSION_SECONDS = 12 * 60 * 60;

export async function hashSecret(secret: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url');
  const derived = (await scrypt(secret, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString('base64url')}`;
}

export async function verifySecret(secret: string, encoded?: string | null): Promise<boolean> {
  if (!encoded) return false;
  const [scheme, salt, expectedValue] = encoded.split('$');
  if (scheme !== 'scrypt' || !salt || !expectedValue) return false;

  const expected = Buffer.from(expectedValue, 'base64url');
  const actual = (await scrypt(secret, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function newOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function clientIpHash(request: Request): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error('MISSING_ENV:RATE_LIMIT_SECRET');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHmac('sha256', secret).update(ip).digest('hex');
}

export async function hasGallerySession(
  request: Request,
  slug: string,
  collectionId: string,
): Promise<boolean> {
  const token = cookieValue(request, sessionCookieName(slug));
  if (!token) return false;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('gallery_sessions')
    .select('id')
    .eq('collection_id', collectionId)
    .eq('token_hash', tokenHash(token))
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  return !error && Boolean(data);
}

export function sessionExpiry(): Date {
  return new Date(Date.now() + SESSION_SECONDS * 1000);
}

export { SESSION_SECONDS };
