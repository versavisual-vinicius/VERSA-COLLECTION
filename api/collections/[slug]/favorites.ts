import { apiError, json, methodNotAllowed } from '../../_lib/http.js';
import { getCollectionRow } from '../../_lib/collections.js';
import { query, withTransaction } from '../../_lib/db.js';
import type { FavoriteRecord } from '../../../src/types/gallery.js';

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  // pathname format: /api/collections/:slug/favorites or /api/collections/:slug/favorites/merge or /api/collections/:slug/favorites/:photoId
  const favIndex = segments.indexOf('favorites');
  const slug = decodeURIComponent(segments[favIndex - 1] ?? '');
  const subAction = segments[favIndex + 1];

  try {
    const row = await getCollectionRow(slug);
    if (!row) {
      return apiError(404, 'NOT_FOUND', 'Coleção não encontrada.');
    }

    // POST /api/collections/:slug/favorites/merge
    if (request.method === 'POST' && subAction === 'merge') {
      const body = (await request.json().catch(() => ({}))) as {
        visitorId?: string;
        clientEmail?: string;
        localFavorites?: FavoriteRecord[];
      };

      const email = body.clientEmail?.trim().toLowerCase();
      const visitorId = body.visitorId?.trim();
      const localFavorites = Array.isArray(body.localFavorites) ? body.localFavorites : [];

      if (!email && !visitorId) {
        return apiError(400, 'BAD_REQUEST', 'Identificador ou e-mail necessário.');
      }

      // Executa busca e upsert dos favoritos de forma atômica
      const mergedList = await withTransaction(async (txClient) => {
        let dbFavorites: FavoriteRecord[] = [];
        if (email) {
          const { rows } = await txClient.query<{
            photo_id: string;
            selected: boolean;
            note: string | null;
            updated_at: string;
          }>(
            'SELECT photo_id, selected, note, updated_at FROM public.favorites WHERE collection_id = $1 AND client_email = $2',
            [row.id, email],
          );
          dbFavorites = rows.map((r) => ({
            photoId: r.photo_id,
            selected: r.selected,
            note: r.note ?? undefined,
            updatedAt: r.updated_at,
          }));
        }

        const mergedMap = new Map<string, FavoriteRecord>();
        for (const item of dbFavorites) {
          mergedMap.set(item.photoId, item);
        }

        for (const item of localFavorites) {
          const existing = mergedMap.get(item.photoId);
          if (!existing) {
            mergedMap.set(item.photoId, item);
          } else {
            mergedMap.set(item.photoId, {
              photoId: item.photoId,
              selected: existing.selected || item.selected,
              note: item.note || existing.note,
              updatedAt: new Date().toISOString(),
            });
          }
        }

        const items = Array.from(mergedMap.values());

        if (email) {
          for (const item of items) {
            await txClient.query(
              `INSERT INTO public.favorites (collection_id, visitor_id, client_email, photo_id, selected, note, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, NOW())
               ON CONFLICT DO NOTHING`,
              [row.id, visitorId ?? null, email, item.photoId, item.selected, item.note ?? null],
            );
          }
        }

        return items;
      });

      return json({ success: true, favorites: mergedList }, 200);
    }

    // GET /api/collections/:slug/favorites
    if (request.method === 'GET') {
      const visitorId = url.searchParams.get('visitorId');
      const email = url.searchParams.get('email')?.trim().toLowerCase();

      if (!visitorId && !email) {
        return json({ favorites: [] }, 200);
      }

      try {
        const { rows } = await query<{
          photo_id: string;
          selected: boolean;
          note: string | null;
          updated_at: string;
        }>(
          `SELECT photo_id, selected, note, updated_at FROM public.favorites 
           WHERE collection_id = $1 AND (client_email = $2 OR visitor_id = $3)`,
          [row.id, email ?? null, visitorId ?? null],
        );

        return json(
          {
            favorites: rows.map((r) => ({
              photoId: r.photo_id,
              selected: r.selected,
              note: r.note ?? undefined,
              updatedAt: r.updated_at,
            })),
          },
          200,
        );
      } catch {
        return json({ favorites: [] }, 200);
      }
    }

    // PUT /api/collections/:slug/favorites/:photoId
    if (request.method === 'PUT' && subAction) {
      const photoId = subAction;
      const body = (await request.json().catch(() => ({}))) as {
        visitorId?: string;
        clientEmail?: string;
        selected?: boolean;
        note?: string;
      };

      const selected = body.selected !== false;
      const visitorId = body.visitorId ?? null;
      const email = body.clientEmail?.trim().toLowerCase() ?? null;

      try {
        await query(
          `INSERT INTO public.favorites (collection_id, visitor_id, client_email, photo_id, selected, note, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [row.id, visitorId, email, photoId, selected, body.note ?? null],
        );
      } catch {
        // Fallback gracioso
      }

      return json({ success: true, photoId, selected }, 200);
    }

    return methodNotAllowed(['GET', 'POST', 'PUT']);
  } catch (err) {
    console.error('favorites.error', err instanceof Error ? err.message : err);
    return apiError(500, 'INTERNAL_ERROR', 'Erro ao processar favoritos.');
  }
}

