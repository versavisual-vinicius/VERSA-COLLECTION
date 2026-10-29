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

  // Fallback opcional legado se SUPABASE_URL estiver presente
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await client.auth.getUser(token);
      if (!error && data.user && data.user.app_metadata.role === 'owner') {
        return { id: data.user.id, role: 'owner', email: data.user.email };
      }
    } catch {
      // Ignora falha de fallback
    }
  }

  return null;
}

