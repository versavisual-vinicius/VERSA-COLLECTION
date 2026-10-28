import { apiError, assertTrustedOrigin, json, methodNotAllowed } from '../_lib/http.js';
import { getSupabaseAdmin, requireOwner } from '../_lib/supabase.js';

export default async function handler(request: Request): Promise<Response> {
  if (!['GET', 'DELETE'].includes(request.method)) return methodNotAllowed(['GET', 'DELETE']);
  if (request.method === 'DELETE' && !assertTrustedOrigin(request)) {
    return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');
  }

  try {
    if (!(await requireOwner(request))) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');
    const supabase = getSupabaseAdmin();

    if (request.method === 'DELETE') {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from('export_requests').delete().lt('requested_at', cutoff);
      if (error) throw error;
      return json({ success: true });
    }

    const { data, error } = await supabase
      .from('export_requests')
      .select('*,collections(slug,title)')
      .order('requested_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return json({ requests: data ?? [] });
  } catch (error) {
    console.error('admin.exports.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível carregar as solicitações.');
  }
}
