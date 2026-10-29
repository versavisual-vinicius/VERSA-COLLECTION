import { apiError, json, methodNotAllowed } from '../_lib/http.js';
import { query } from '../_lib/db.js';

interface CollectionSummaryRow {
  id: string;
  slug: string;
  title: string;
  total_items: number;
  cover: {
    sources?: Array<{ url: string; width: number }>;
  };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  try {
    const { rows } = await query<CollectionSummaryRow>(
      `SELECT id, slug, title, total_items, cover
       FROM public.collections
       WHERE visibility = 'public' AND password_required = false
       ORDER BY created_at DESC`,
    );

    return json({
      collections: rows.map((row) => ({
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
