import { applyAdminCollectionUpdate, type AdminCollectionUpdate } from '../_lib/adminCollections.js';
import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from '../_lib/http.js';
import { getSupabaseAdmin, requireOwner } from '../_lib/supabase.js';

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
  if (request.method !== 'POST') return methodNotAllowed(['POST']);
  if (!assertTrustedOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');

  try {
    const owner = await requireOwner(request);
    if (!owner) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');
    const input = await readJson<MigrationInput>(request);
    if (!input.sourceKey) return apiError(400, 'INVALID_INPUT', 'Identificador da migração obrigatório.');
    const supabase = getSupabaseAdmin();

    const { data: previous } = await supabase
      .from('migration_imports')
      .select('summary')
      .eq('source_key', input.sourceKey)
      .maybeSingle();
    if (previous) return json({ imported: false, summary: previous.summary });

    for (const collection of input.collections ?? []) {
      await applyAdminCollectionUpdate(collection);
    }

    let importedRequests = 0;
    for (const legacy of input.requests ?? []) {
      const { data: collection } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', legacy.collectionSlug)
        .maybeSingle();
      if (!collection) continue;

      const { error } = await supabase.from('export_requests').insert({
        collection_id: collection.id,
        request_type: legacy.type,
        photo_id: legacy.photoId ?? null,
        photo_file_name: legacy.photoFileName ?? null,
        client_email: legacy.clientEmail?.trim().toLowerCase() || null,
        pin_verified: false,
        requested_size: legacy.requestedSize,
        status: legacy.status ?? 'completed',
        requested_at: legacy.requestedAt ?? new Date().toISOString(),
        completed_at: legacy.completedAt ?? null,
        download_url: legacy.downloadUrl ?? null,
      });
      if (!error) importedRequests += 1;
    }

    const summary = {
      collections: input.collections?.length ?? 0,
      requests: importedRequests,
    };
    const { error: markerError } = await supabase.from('migration_imports').insert({
      source_key: input.sourceKey,
      imported_by: owner.id,
      summary,
    });
    if (markerError) throw markerError;

    return json({ imported: true, summary });
  } catch (error) {
    console.error('admin.migration.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível importar os dados locais.');
  }
}
