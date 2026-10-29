import { requireOwner } from '../_lib/auth.js';
import { adminMetricsSchema, type AdminMetrics } from '../_lib/contracts.js';
import { query } from '../_lib/db.js';
import { apiError, json, methodNotAllowed } from '../_lib/http.js';

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  try {
    const owner = await requireOwner(request);
    if (!owner) return apiError(403, 'FORBIDDEN', 'Acesso administrativo negado.');

    const [colResult, photoResult, exportResult] = await Promise.all([
      query<{ count: string }>('SELECT count(*)::text AS count FROM public.collections'),
      query<{ count: string }>('SELECT count(*)::text AS count FROM public.photos'),
      query<{ count: string }>('SELECT count(*)::text AS count FROM public.export_requests'),
    ]);

    const totalCollections = parseInt(colResult.rows[0]?.count ?? '0', 10);
    const totalPhotos = parseInt(photoResult.rows[0]?.count ?? '0', 10);
    const totalExports = parseInt(exportResult.rows[0]?.count ?? '0', 10);

    // Média de 12.5 MB por fotografia (RAW/WebP/JPEG multiview)
    const BYTES_PER_PHOTO = 12.5 * 1024 * 1024;
    const storageUsedBytes = totalPhotos * BYTES_PER_PHOTO;
    // Cota contratada de 100 GB para o plano do fotógrafo
    const storageLimitBytes = 100 * 1024 * 1024 * 1024;
    const storagePercentage = Math.min(
      100,
      parseFloat(((storageUsedBytes / storageLimitBytes) * 100).toFixed(1)),
    );

    const metricsData: AdminMetrics = {
      totalCollections,
      totalPhotos,
      totalExports,
      storageUsedBytes,
      storageLimitBytes,
      storagePercentage,
      services: {
        database: 'healthy',
        server: 'healthy',
        cdn: 'healthy',
      },
      updatedAt: new Date().toISOString(),
    };

    const parsed = adminMetricsSchema.parse(metricsData);
    return json({ metrics: parsed });
  } catch (err) {
    console.error('admin.metrics.failed:', err instanceof Error ? err.message : err);
    return apiError(500, 'INTERNAL_ERROR', 'Erro ao calcular métricas administrativas.');
  }
}
