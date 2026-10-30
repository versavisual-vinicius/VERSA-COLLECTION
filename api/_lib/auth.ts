export interface OwnerUser {
  id: string;
  role: 'owner';
  email?: string;
}

export async function requireOwner(request: Request): Promise<OwnerUser | null> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) return null;

  const adminToken = process.env.ADMIN_TOKEN || process.env.RATE_LIMIT_SECRET;
  if (adminToken && token === adminToken) {
    return { id: 'owner-local', role: 'owner' };
  }

  return null;
}

