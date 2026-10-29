import { apiError, assertTrustedOrigin, json, methodNotAllowed, readJson } from '../_lib/http.js';
import { query, withTransaction } from '../_lib/db.js';
import { createCollectionSchema, validateContract, type CreateCollectionResponse } from '../_lib/contracts.js';
import { hashSecret } from '../_lib/security.js';

interface CollectionSummaryRow {
  id: string;
  slug: string;
  title: string;
  total_items: number;
  cover: {
    sources?: Array<{ url: string; width: number }>;
  };
}

const DEFAULT_COVER_URL =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=2400&q=80';

const DEMO_SEEDS = [
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    aspect: 'portrait',
    w: 1200,
    h: 1600,
  },
  {
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    w: 1200,
    h: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    aspect: 'portrait',
    w: 1200,
    h: 1500,
  },
  {
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    aspect: 'square',
    w: 1200,
    h: 1200,
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    aspect: 'portrait',
    w: 1200,
    h: 1600,
  },
  {
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    w: 1200,
    h: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    aspect: 'portrait',
    w: 1200,
    h: 1600,
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    w: 1200,
    h: 800,
  },
];

export default async function handler(request: Request): Promise<Response> {
  if (!['GET', 'POST'].includes(request.method)) return methodNotAllowed(['GET', 'POST']);

  if (request.method === 'POST') {
    if (!assertTrustedOrigin(request)) {
      return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');
    }

    try {
      const raw = await readJson<unknown>(request).catch(() => ({}));
      const validation = validateContract(createCollectionSchema, raw);
      if (!validation.success) {
        return validation.response;
      }

      const input = validation.data;
      const collectionId = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const coverUrl = input.coverUrl?.trim() || DEFAULT_COVER_URL;
      const coverFocalPoint = input.coverFocalPoint || { x: 50, y: 50 };

      const coverData = {
        title: input.title,
        businessSignature: '@v1ncsc',
        sources: [
          { url: coverUrl, width: 2400, format: 'jpeg' },
          { url: coverUrl, width: 1200, format: 'jpeg' },
        ],
        focalPoint: coverFocalPoint,
      };

      const settingsData = {
        layoutPreset: input.layoutPreset,
        eventDate: input.eventDate,
      };

      let passwordHash: string | null = null;
      let passwordRequired = false;
      if (input.visibility === 'password' && input.password?.trim()) {
        passwordHash = await hashSecret(input.password.trim());
        passwordRequired = true;
      }

      const clientEmails = input.clientEmail ? [input.clientEmail] : [];

      const result = await withTransaction(async (client) => {
        // Verificar unicidade de slug
        const existing = await client.query('SELECT id FROM public.collections WHERE slug = $1', [
          input.slug,
        ]);
        if (existing.rows.length > 0) {
          throw new Error('SLUG_ALREADY_EXISTS');
        }

        const initialTotalItems = input.seedDemoPhotos ? DEMO_SEEDS.length : 0;

        await client.query(
          `INSERT INTO public.collections (
            id, slug, title, visibility, password_required, password_hash,
            client_emails, total_items, cover, settings, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11
          )`,
          [
            collectionId,
            input.slug,
            input.title,
            input.visibility,
            passwordRequired,
            passwordHash,
            clientEmails,
            initialTotalItems,
            coverData,
            settingsData,
            createdAt,
          ],
        );

        if (input.seedDemoPhotos) {
          for (let i = 0; i < DEMO_SEEDS.length; i++) {
            const seed = DEMO_SEEDS[i];
            const photoId = `demo-${collectionId.slice(0, 8)}-${i + 1}`;
            const photoData = {
              id: photoId,
              fileName: `FOTO_${String(i + 1).padStart(3, '0')}.jpg`,
              title: `${input.title} #${i + 1}`,
              alt: `${input.title} foto ${i + 1}`,
              width: seed.w,
              height: seed.h,
              dominantColor: '#121212',
              sources: [{ url: seed.url, width: seed.w, height: seed.h, format: 'jpeg' }],
              shareUrl: `/?collection=${input.slug}&photo=${photoId}`,
              position: i + 1,
              positionTieBreaker: `pos-${i + 1}`,
            };

            await client.query(
              `INSERT INTO public.photos (id, collection_id, position, data, created_at)
               VALUES ($1, $2, $3, $4, $5)`,
              [photoId, collectionId, i + 1, photoData, createdAt],
            );
          }
        }

        return {
          id: collectionId,
          slug: input.slug,
          title: input.title,
          totalItems: initialTotalItems,
          coverUrl,
          createdAt,
        };
      });

      const responsePayload: CreateCollectionResponse = {
        success: true,
        collection: result,
      };

      return json(responsePayload, 201);
    } catch (error) {
      if (error instanceof Error && error.message === 'SLUG_ALREADY_EXISTS') {
        return apiError(409, 'SLUG_ALREADY_EXISTS', 'O identificador (slug) informado já está em uso.');
      }
      console.error('collections.create.failed', error instanceof Error ? error.message : error);
      return apiError(500, 'COLLECTION_CREATE_FAILED', 'Falha ao criar nova coleção no servidor.');
    }
  }

  // GET: listagem de coleções
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
