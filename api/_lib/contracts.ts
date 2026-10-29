import { z } from 'zod';
import { apiError } from './http.js';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de e-mail inválido');

export const unlockSessionSchema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
  email: emailSchema.optional(),
});

export type UnlockSessionInput = z.infer<typeof unlockSessionSchema>;

export const exportRequestSchema = z.object({
  collectionSlug: z.string().min(1, 'Slug da coleção obrigatório'),
  type: z.enum(['single', 'collection', 'favorites']),
  photoId: z.string().optional(),
  clientEmail: emailSchema.optional(),
  pin: z.string().regex(/^\d{4}$/, 'O PIN deve conter exatamente 4 dígitos').optional(),
  requestedSize: z.string().min(1, 'Resolução solicitada obrigatória'),
});

export type ExportRequestInput = z.infer<typeof exportRequestSchema>;

export const favoriteRecordSchema = z.object({
  photoId: z.string().min(1, 'Identificador da foto obrigatório'),
  selected: z.boolean(),
  note: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const favoritesMergeSchema = z.object({
  visitorId: z.string().trim().min(1).optional(),
  clientEmail: emailSchema.optional(),
  localFavorites: z.array(favoriteRecordSchema).optional().default([]),
}).refine((data) => Boolean(data.visitorId || data.clientEmail), {
  message: 'Identificador (visitorId) ou e-mail é obrigatório para sincronização.',
});

export type FavoritesMergeInput = z.infer<typeof favoritesMergeSchema>;

export const favoritePutSchema = z.object({
  visitorId: z.string().trim().optional(),
  clientEmail: emailSchema.optional(),
  selected: z.boolean().optional().default(true),
  note: z.string().optional(),
});

export type FavoritePutInput = z.infer<typeof favoritePutSchema>;

export const allowedSizeSchema = z.enum(['original', '3600', '2048', '1024', '640']);

export const downloadPolicyUpdateSchema = z.object({
  enabled: z.boolean().optional(),
  individualEnabled: z.boolean().optional(),
  collectionEnabled: z.boolean().optional(),
  requiresEmail: z.boolean().optional(),
  requiresPin: z.boolean().optional(),
  pin: z.string().regex(/^\d{4}$/, 'O PIN deve conter 4 dígitos').optional(),
  allowedSizes: z.array(allowedSizeSchema).optional(),
  directFolderUrl: z.string().url().optional(),
});

export const adminCollectionUpdateSchema = z.object({
  slug: z.string().min(1, 'Slug obrigatório'),
  title: z.string().min(1).optional(),
  visibility: z.enum(['public', 'password', 'client-only', 'hidden']).optional(),
  passwordRequired: z.boolean().optional(),
  clientPassword: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional(),
  clientEmail: emailSchema.optional(),
  clientEmails: z.array(emailSchema).optional(),
  clientNotes: z.string().optional(),
  expiresAt: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
  coverFocalPoint: z
    .object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    })
    .optional(),
  theme: z.record(z.string(), z.unknown()).optional(),
  downloads: downloadPolicyUpdateSchema.optional(),
});

export type AdminCollectionUpdateInput = z.infer<typeof adminCollectionUpdateSchema>;

export const adminMetricsSchema = z.object({
  totalCollections: z.number().int().min(0),
  totalPhotos: z.number().int().min(0),
  totalExports: z.number().int().min(0),
  storageUsedBytes: z.number().min(0),
  storageLimitBytes: z.number().min(0),
  storagePercentage: z.number().min(0).max(100),
  services: z.object({
    database: z.enum(['healthy', 'degraded', 'offline']),
    server: z.enum(['healthy', 'degraded', 'offline']),
    cdn: z.enum(['healthy', 'degraded', 'offline']),
  }),
  updatedAt: z.string(),
});

export type AdminMetrics = z.infer<typeof adminMetricsSchema>;

export const photoLibraryQuerySchema = z.object({
  q: z.string().optional().default(''),
  collection: z.string().optional().default(''),
  orientation: z.enum(['all', 'portrait', 'landscape']).optional().default('all'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(32),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type PhotoLibraryQuery = z.infer<typeof photoLibraryQuerySchema>;

export const libraryPhotoItemSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  focalPoint: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  dominantColor: z.string().optional(),
  blurDataUrl: z.string().optional(),
  sources: z.array(
    z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      format: z.enum(['avif', 'webp', 'jpeg']),
    }),
  ),
  downloadUrl: z.string().optional(),
  shareUrl: z.string(),
  caption: z.string().optional(),
  position: z.number(),
  positionTieBreaker: z.string(),
  setId: z.string().optional(),
  isPrivate: z.boolean().optional(),
  collectionSlug: z.string(),
  collectionTitle: z.string(),
});

export type LibraryPhotoItem = z.infer<typeof libraryPhotoItemSchema>;

export const photoLibraryResponseSchema = z.object({
  items: z.array(libraryPhotoItemSchema),
  totalCount: z.number().int().min(0),
  hasMore: z.boolean(),
  collections: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      count: z.number().int().min(0),
    }),
  ),
});

export type PhotoLibraryResponse = z.infer<typeof photoLibraryResponseSchema>;

/**
 * Validador fail-closed: faz o parse do schema e retorna ou os dados tipados
 * ou uma Response HTTP 400 com payload estruturado de erro.
 */
export function validateContract<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; response: Response } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
    code: i.code,
  }));

  return {
    success: false,
    response: apiError(400, 'INVALID_INPUT', 'Falha na validação do payload.', {}, { issues }),
  };
}
