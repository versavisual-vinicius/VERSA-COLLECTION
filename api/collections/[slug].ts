import { apiError, json, methodNotAllowed } from '../_lib/http.js';
import { getCollectionBundle, getCollectionRow, toClientCollection } from '../_lib/collections.js';
import { hasGallerySession } from '../_lib/security.js';

function slugFrom(request: Request): string {
  return decodeURIComponent(new URL(request.url).pathname.split('/').filter(Boolean).at(-1) ?? '');
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  try {
    const slug = slugFrom(request);
    const row = await getCollectionRow(slug);
    if (!row || row.visibility === 'hidden') {
      return apiError(404, 'NOT_FOUND', 'Coleção não encontrada.');
    }

    if (row.password_required) {
      const authorized = await hasGallerySession(request, slug, row.id);
      if (!authorized) {
        return json(
          {
            error: {
              code: 'PASSWORD_REQUIRED',
              message: 'Autenticação da galeria necessária.',
              requestId: crypto.randomUUID(),
            },
            collection: toClientCollection(row),
            requiresEmail: row.access_email_required,
          },
          401,
        );
      }
    }

    return json(await getCollectionBundle(row), 200, {
      'cache-control': row.password_required ? 'private, no-store' : 'public, max-age=60, stale-while-revalidate=300',
    });
  } catch (error) {
    console.error('collections.read.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Coleção temporariamente indisponível.');
  }
}
