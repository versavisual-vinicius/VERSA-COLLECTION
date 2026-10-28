import { applyAdminCollectionUpdate, sanitizeAdminCollection, type AdminCollectionUpdate } from '../_lib/adminCollections.js';
import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from '../_lib/http.js';
import { getSupabaseAdmin, requireOwner } from '../_lib/supabase.js';

export default async function handler(request: Request): Promise<Response> {
  if (!['GET', 'PUT'].includes(request.method)) return methodNotAllowed(['GET', 'PUT']);
  if (request.method === 'PUT' && !assertTrustedOrigin(request)) {
    return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');
  }

  try {
    if (!(await requireOwner(request))) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');

    if (request.method === 'PUT') {
      const input = await readJson<AdminCollectionUpdate>(request);
      if (!input.slug) return apiError(400, 'INVALID_INPUT', 'Slug obrigatório.');
      const updated = await applyAdminCollectionUpdate(input);
      return json({ collection: sanitizeAdminCollection(updated) });
    }

    const slug = new URL(request.url).searchParams.get('slug');
    let query = getSupabaseAdmin().from('collections').select('*').order('created_at');
    if (slug) query = query.eq('slug', slug);
    const { data, error } = await query;
    if (error) throw error;
    return json({ collections: (data ?? []).map((row) => sanitizeAdminCollection(row)) });
  } catch (error) {
    if (error instanceof Error && error.message === 'PASSWORD_REQUIRED_WITHOUT_SECRET') {
      return apiError(400, 'PASSWORD_REQUIRED', 'Defina uma nova senha para proteger a galeria.');
    }
    if (error instanceof Error && error.message === 'PIN_REQUIRED_WITHOUT_SECRET') {
      return apiError(400, 'PIN_REQUIRED', 'Defina um novo PIN para ativar a proteção.');
    }
    if (error instanceof Error && error.message === 'PASSWORD_TOO_SHORT') {
      return apiError(400, 'PASSWORD_TOO_SHORT', 'A senha deve ter pelo menos 8 caracteres.');
    }
    if (error instanceof Error && error.message === 'PIN_INVALID_FORMAT') {
      return apiError(400, 'PIN_INVALID_FORMAT', 'O PIN deve conter exatamente 4 dígitos.');
    }
    if (error instanceof Error && error.message === 'EMAIL_INVALID_FORMAT') {
      return apiError(400, 'EMAIL_INVALID_FORMAT', 'Revise os e-mails autorizados.');
    }
    console.error('admin.collections.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível salvar a coleção.');
  }
}
