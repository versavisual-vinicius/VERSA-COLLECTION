import { apiError, assertTrustedOrigin, json, methodNotAllowed } from '../_lib/http.js';
import { requireOwner } from '../_lib/auth.js';
import { query } from '../_lib/db.js';

export default async function handler(request: Request): Promise<Response> {
  if (!['GET', 'DELETE'].includes(request.method)) return methodNotAllowed(['GET', 'DELETE']);
  if (request.method === 'DELETE' && !assertTrustedOrigin(request)) {
    return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');
  }

  try {
    if (!(await requireOwner(request))) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');

    if (request.method === 'DELETE') {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      await query('DELETE FROM public.export_requests WHERE requested_at < $1', [cutoff]);
      return json({ success: true });
    }

    const { rows } = await query(
      `SELECT r.*, json_build_object('slug', c.slug, 'title', c.title) AS collections
       FROM public.export_requests r
       LEFT JOIN public.collections c ON c.id = r.collection_id
       ORDER BY r.requested_at DESC
       LIMIT 100`,
    );
    return json({ requests: rows });
  } catch (error) {
    console.error('admin.exports.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível carregar as solicitações.');
  }
}
