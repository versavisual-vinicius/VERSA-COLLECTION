import { apiError, json, methodNotAllowed } from '../_lib/http.js';
import { getSupabaseAdmin } from '../_lib/supabase.js';

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('collections')
      .select('id,slug,title,total_items,cover,visibility')
      .eq('visibility', 'public')
      .eq('password_required', false)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return json({
      collections: (data ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        totalItems: row.total_items,
        coverUrl: row.cover?.sources?.[1]?.url ?? row.cover?.sources?.[0]?.url ?? '',
      })),
    });
  } catch (error) {
    console.error('collections.list.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Coleções temporariamente indisponíveis.');
  }
}
