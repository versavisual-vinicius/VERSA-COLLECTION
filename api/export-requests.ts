import { getCollectionRow } from './_lib/collections.js';
import { exportRequestSchema, validateContract } from './_lib/contracts.js';
import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from './_lib/http.js';
import { hasGallerySession, verifySecret } from './_lib/security.js';
import { query } from './_lib/db.js';

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed(['POST']);
  if (!assertTrustedOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');

  try {
    const raw = await readJson<unknown>(request).catch(() => ({}));
    const validation = validateContract(exportRequestSchema, raw);
    if (!validation.success) {
      return validation.response;
    }
    const input = validation.data;
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

    let downloadUrl = row.downloads.directFolderUrl as string | undefined;
    let photoFileName: string | null = null;

    if (input.photoId) {
      const { rows: photoRows } = await query<{ data: Record<string, unknown> }>(
        'SELECT data FROM public.photos WHERE collection_id = $1 AND id = $2 LIMIT 1',
        [row.id, input.photoId],
      );
      const photo = photoRows[0];
      if (!photo) return apiError(404, 'NOT_FOUND', 'Fotografia não encontrada.');
      const data = photo.data;
      photoFileName = (data.fileName as string | undefined) ?? null;
      const sources = (data.sources as Array<{ width: number; url: string }> | undefined) ?? [];
      downloadUrl = input.requestedSize === 'original'
        ? ((data.downloadUrl as string | undefined) ?? sources.at(-1)?.url)
        : (sources.find((source) => source.width === Number(input.requestedSize))?.url
          ?? (data.downloadUrl as string | undefined)
          ?? sources[0]?.url);
    }

    const { rows: createdRows } = await query<{ id: string; status: string; requested_at: string }>(
      `INSERT INTO public.export_requests (
         collection_id, request_type, photo_id, photo_file_name,
         client_email, pin_verified, requested_size, status, download_url
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, status, requested_at`,
      [
        row.id,
        input.type,
        input.photoId ?? null,
        photoFileName,
        email || null,
        pinRequired,
        input.requestedSize,
        downloadUrl ? 'ready' : 'pending',
        downloadUrl ?? null,
      ],
    );
    const created = createdRows[0];

    return json({ request: created, downloadUrl: downloadUrl ?? null }, 201);
  } catch (error) {
    console.error('export.request.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível preparar o download.');
  }
}
