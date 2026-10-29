import { applyAdminCollectionUpdate, type AdminCollectionUpdate } from '../_lib/adminCollections.js';
import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from '../_lib/http.js';
import { requireOwner } from '../_lib/auth.js';
import { query } from '../_lib/db.js';

interface LegacyRequest {
  collectionSlug: string;
  type: 'single' | 'collection' | 'favorites';
  photoId?: string;
  photoFileName?: string;
  clientEmail?: string;
  requestedSize: string;
  status?: string;
  requestedAt?: string;
  completedAt?: string;
  downloadUrl?: string;
}

interface MigrationInput {
  sourceKey: string;
  collections: AdminCollectionUpdate[];
  requests: LegacyRequest[];
}

export default async function handler(request: Request): Promise<Response> {
  if (!request.method || request.method !== 'POST') return methodNotAllowed(['POST']);
  if (!assertTrustedOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');

  try {
    const owner = await requireOwner(request);
    if (!owner) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');
    const input = await readJson<MigrationInput>(request);
    if (!input.sourceKey) return apiError(400, 'INVALID_INPUT', 'Identificador da migração obrigatório.');

    const { rows: prevRows } = await query<{ summary: Record<string, unknown> }>(
      'SELECT summary FROM public.migration_imports WHERE source_key = $1 LIMIT 1',
      [input.sourceKey],
    );
    if (prevRows.length > 0) return json({ imported: false, summary: prevRows[0].summary });

    for (const collection of input.collections ?? []) {
      await applyAdminCollectionUpdate(collection);
    }

    let importedRequests = 0;
    for (const legacy of input.requests ?? []) {
      const { rows: collRows } = await query<{ id: string }>(
        'SELECT id FROM public.collections WHERE slug = $1 LIMIT 1',
        [legacy.collectionSlug],
      );
      const collection = collRows[0];
      if (!collection) continue;

      await query(
        `INSERT INTO public.export_requests (
           collection_id, request_type, photo_id, photo_file_name,
           client_email, requested_size, status, download_url, requested_at, completed_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          collection.id,
          legacy.type,
          legacy.photoId ?? null,
          legacy.photoFileName ?? null,
          legacy.clientEmail ?? null,
          legacy.requestedSize,
          legacy.status ?? 'completed',
          legacy.downloadUrl ?? null,
          legacy.requestedAt ?? new Date().toISOString(),
          legacy.completedAt ?? null,
        ],
      );
      importedRequests += 1;
    }

    const summary = {
      collections: input.collections?.length ?? 0,
      requests: importedRequests,
      importedAt: new Date().toISOString(),
    };

    await query(
      `INSERT INTO public.migration_imports (source_key, summary)
       VALUES ($1, $2)
       ON CONFLICT (source_key) DO UPDATE SET summary = EXCLUDED.summary`,
      [input.sourceKey, JSON.stringify(summary)],
    );

    return json({ imported: true, summary }, 201);
  } catch (error) {
    console.error('admin.migrate.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Falha na migração dos dados locais.');
  }
}
