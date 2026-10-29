import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookieValue, sessionCookieName } from './http.js';
import { query } from './db.js';

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
  const secret = process.env.RATE_LIMIT_SECRET || 'versa-rate-limit-default-secret';
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

  try {
    const { rows } = await query(
      `SELECT id FROM public.gallery_sessions
       WHERE collection_id = $1
         AND token_hash = $2
         AND revoked_at IS NULL
         AND expires_at > NOW()
       LIMIT 1`,
      [collectionId, tokenHash(token)],
    );
    return rows.length > 0;
  } catch (err) {
    console.error('Erro ao verificar sessão de galeria:', err);
    return false;
  }
}

export function sessionExpiry(): Date {
  return new Date(Date.now() + SESSION_SECONDS * 1000);
}

export { SESSION_SECONDS };
