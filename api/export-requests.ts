import { getCollectionRow } from './_lib/collections.js';
import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from './_lib/http.js';
import { hasGallerySession, verifySecret } from './_lib/security.js';
import { getSupabaseAdmin } from './_lib/supabase.js';

interface ExportInput {
  collectionSlug: string;
  type: 'single' | 'collection' | 'favorites';
  photoId?: string;
  clientEmail?: string;
  pin?: string;
  requestedSize: string;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed(['POST']);
  if (!assertTrustedOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');

  try {
    const input = await readJson<ExportInput>(request);
    const row = await getCollectionRow(input.collectionSlug);
    if (!row || row.visibility === 'hidden') return apiError(404, 'NOT_FOUND', 'Coleção não encontrada.');
    if (!row.downloads.enabled) return apiError(403, 'DOWNLOAD_DISABLED', 'Downloads desativados.');

    if (row.password_required && !(await hasGallerySession(request, row.slug, row.id))) {
      return apiError(401, 'CLIENT_AUTH_REQUIRED', 'Sessão da galeria expirada.');
    }

    const pinRequired = Boolean(row.downloads.requiresPin);
    const pinVerified = !pinRequired || (await verifySecret(input.pin?.trim() ?? '', row.download_pin_hash));
    if (!pinVerified) return apiError(401, 'INVALID_PIN', 'PIN inválido.');

    const email = input.clientEmail?.trim().toLowerCase() ?? '';
    if (row.downloads.requiresEmail && !email) {
      return apiError(400, 'CLIENT_AUTH_REQUIRED', 'Informe o e-mail para o download.');
    }
    if (!row.downloads.allowedSizes.includes(input.requestedSize as never)) {
      return apiError(400, 'SIZE_UNAVAILABLE', 'Resolução não permitida para esta galeria.');
    }

    const supabase = getSupabaseAdmin();
    let downloadUrl = row.downloads.directFolderUrl as string | undefined;
    let photoFileName: string | null = null;

    if (input.photoId) {
      const { data: photo, error: photoError } = await supabase
        .from('photos')
        .select('data')
        .eq('collection_id', row.id)
        .eq('id', input.photoId)
        .maybeSingle();
      if (photoError) throw photoError;
      if (!photo) return apiError(404, 'NOT_FOUND', 'Fotografia não encontrada.');
      const data = photo.data as Record<string, unknown>;
      photoFileName = (data.fileName as string | undefined) ?? null;
      const sources = (data.sources as Array<{ width: number; url: string }> | undefined) ?? [];
      downloadUrl = input.requestedSize === 'original'
        ? ((data.downloadUrl as string | undefined) ?? sources.at(-1)?.url)
        : (sources.find((source) => source.width === Number(input.requestedSize))?.url
          ?? (data.downloadUrl as string | undefined)
          ?? sources[0]?.url);
    }

    const { data: created, error } = await supabase
      .from('export_requests')
      .insert({
        collection_id: row.id,
        request_type: input.type,
        photo_id: input.photoId ?? null,
        photo_file_name: photoFileName,
        client_email: email || null,
        pin_verified: pinRequired,
        requested_size: input.requestedSize,
        status: downloadUrl ? 'ready' : 'pending',
        download_url: downloadUrl ?? null,
      })
      .select('id,status,requested_at')
      .single();
    if (error) throw error;

    return json({ request: created, downloadUrl: downloadUrl ?? null }, 201);
  } catch (error) {
    console.error('export.request.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível preparar o download.');
  }
}
