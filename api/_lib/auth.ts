import { cookieValue } from './http.js';

export interface OwnerUser {
  id: string;
  role: 'owner';
  email?: string;
}

export async function requireOwner(request: Request): Promise<OwnerUser | null> {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : (cookieValue(request, 'versa_admin_sid') ?? '').trim();

  if (!token) return null;

  const adminToken = process.env.ADMIN_TOKEN || process.env.RATE_LIMIT_SECRET;
  if (adminToken && token === adminToken) {
    return { id: 'owner-local', role: 'owner' };
  }

  return null;
}
