import { photoLibraryQuerySchema, type LibraryPhotoItem, type PhotoLibraryResponse } from './_lib/contracts.js';
import { query } from './_lib/db.js';
import { apiError, json, methodNotAllowed } from './_lib/http.js';
import type { GalleryPhoto } from '../src/types/gallery.js';

interface PhotoQueryRow {
  id: string;
  data: Record<string, unknown>;
  collection_slug: string;
  collection_title: string;
}

interface CollectionCountRow {
  slug: string;
  title: string;
  count: number;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  try {
    const url = new URL(request.url);
    const rawParams = {
      q: url.searchParams.get('q') ?? '',
      collection: url.searchParams.get('collection') ?? '',
      orientation: url.searchParams.get('orientation') ?? 'all',
      limit: url.searchParams.get('limit') ?? 32,
      offset: url.searchParams.get('offset') ?? 0,
    };

    const queryValidation = photoLibraryQuerySchema.safeParse(rawParams);
    if (!queryValidation.success) {
      return apiError(
        400,
        'INVALID_QUERY',
        'Parâmetros de busca inválidos.',
        {},
        { issues: queryValidation.error.issues },
      );
    }

    const { q, collection, orientation, limit, offset } = queryValidation.data;

    const whereConditions: string[] = [];
    const queryParams: unknown[] = [];
    let idx = 1;

    if (collection) {
      whereConditions.push(`c.slug = $${idx++}`);
      queryParams.push(collection);
    }

    if (q.trim()) {
      whereConditions.push(
        `(p.data->>'fileName' ILIKE $${idx} OR p.data->>'caption' ILIKE $${idx} OR p.data->>'alt' ILIKE $${idx} OR c.title ILIKE $${idx})`,
      );
      queryParams.push(`%${q.trim()}%`);
      idx++;
    }

    if (orientation === 'portrait') {
      whereConditions.push(`(p.data->>'height')::numeric > (p.data->>'width')::numeric`);
    } else if (orientation === 'landscape') {
      whereConditions.push(`(p.data->>'width')::numeric >= (p.data->>'height')::numeric`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const photosSql = `
      SELECT 
        p.id,
        p.data,
        c.slug as collection_slug,
        c.title as collection_title
      FROM public.photos p
      JOIN public.collections c ON c.id = p.collection_id
      ${whereClause}
      ORDER BY c.title ASC, p.position ASC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const countSql = `
      SELECT count(*)::text as count
      FROM public.photos p
      JOIN public.collections c ON c.id = p.collection_id
      ${whereClause}
    `;

    const collectionsSql = `
      SELECT c.slug, c.title, count(p.id)::int as count
      FROM public.collections c
      LEFT JOIN public.photos p ON p.collection_id = c.id
      GROUP BY c.slug, c.title
      ORDER BY c.title ASC
    `;

    const [photosResult, countResult, collectionsResult] = await Promise.all([
      query<PhotoQueryRow>(photosSql, [...queryParams, limit, offset]),
      query<{ count: string }>(countSql, queryParams),
      query<CollectionCountRow>(collectionsSql),
    ]);

    const totalCount = parseInt(countResult.rows[0]?.count ?? '0', 10);
    const items: LibraryPhotoItem[] = photosResult.rows.map((row) => ({
      ...(row.data as unknown as GalleryPhoto),
      id: row.id || (row.data.id as string),
      collectionSlug: row.collection_slug,
      collectionTitle: row.collection_title,
    }));

    const responsePayload: PhotoLibraryResponse = {
      items,
      totalCount,
      hasMore: offset + items.length < totalCount,
      collections: collectionsResult.rows,
    };

    return json(responsePayload);
  } catch (err) {
    console.error('photos.library.failed:', err instanceof Error ? err.message : err);
    return apiError(500, 'INTERNAL_ERROR', 'Falha ao buscar fotos da biblioteca.');
  }
}
