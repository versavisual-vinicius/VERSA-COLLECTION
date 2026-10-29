export type CollectionVisibility = 'public' | 'password' | 'client-only' | 'hidden';

export type PageCursor = string;

export interface ImageSource {
  url: string;
  width: number;
  height: number;
  format: 'avif' | 'webp' | 'jpeg';
}

export interface ResponsiveImage {
  alt: string;
  width: number;
  height: number;
  dominantColor?: string;
  blurDataUrl?: string;
  sources: ImageSource[];
}

export interface DownloadPolicy {
  enabled: boolean;
  individualEnabled: boolean;
  collectionEnabled: boolean;
  requiresEmail: boolean;
  requiresPin: boolean;
  pin?: string;
  allowedSizes: Array<'original' | '3600' | '2048' | '1024' | '640'>;
  directFolderUrl?: string;
}

export interface GalleryTheme {
  headingFont: string;
  bodyFont: string;
  foreground: string;
  background: string;
  gridGapDesktop: number;
  gridGapMobile: number;
  coverOverlayOpacity: number;
}

export interface GallerySet {
  id: string;
  title: string;
  slug: string;
  photoCount?: number;
  photoIds?: string[];
  coverPhotoUrl?: string;
}

export interface GalleryCollection {
  id: string;
  slug: string;
  title: string;
  businessName: string;
  businessUrl?: string;
  cover: ResponsiveImage;
  coverFocalPoint: { x: number; y: number };
  visibility: CollectionVisibility;
  passwordRequired: boolean;
  /** @deprecated Compatibilidade temporária para importação local. Nunca preencher em payloads da API. */
  clientPassword?: string;
  /** @deprecated Compatibilidade temporária para importação local. Nunca preencher em payloads da API. */
  clientEmail?: string;
  /** @deprecated Compatibilidade temporária para importação local. Nunca preencher em payloads da API. */
  clientEmails?: string[];
  favoritesEnabled: boolean;
  downloads: DownloadPolicy;
  sharingEnabled: boolean;
  slideshowEnabled: boolean;
  totalItems: number;
  locale: string;
  theme: GalleryTheme;
  clientNotes?: string;
  sets?: GallerySet[];
  expiresAt?: string;
}

export interface GalleryPhoto {
  id: string;
  fileName: string;
  alt: string;
  width: number;
  height: number;
  focalPoint?: { x: number; y: number };
  dominantColor?: string;
  blurDataUrl?: string;
  sources: ImageSource[];
  downloadUrl?: string;
  shareUrl: string;
  caption?: string;
  position: number;
  positionTieBreaker: string;
  setId?: string;
  isPrivate?: boolean;
}

export interface GalleryPageResponse {
  items: GalleryPhoto[];
  nextCursor: PageCursor | null;
  totalItems: number;
}

export interface FavoriteRecord {
  photoId: string;
  selected: boolean;
  note?: string;
  updatedAt: string;
}

export type DownloadJobStatus = 'idle' | 'validating' | 'queued' | 'preparing' | 'ready' | 'failed' | 'expired';

export interface DownloadJob {
  id: string;
  status: DownloadJobStatus;
  progress?: number;
  expiresAt?: string;
  signedUrl?: string;
  errorCode?: string;
}

export interface ApiError {
  code:
    | 'NOT_FOUND'
    | 'HIDDEN'
    | 'PASSWORD_REQUIRED'
    | 'INVALID_PASSWORD'
    | 'CLIENT_AUTH_REQUIRED'
    | 'INVALID_PIN'
    | 'DOWNLOAD_DISABLED'
    | 'SIZE_UNAVAILABLE'
    | 'RATE_LIMITED'
    | 'TEMPORARILY_UNAVAILABLE';
  message: string;
  retryAfterSeconds?: number;
  requestId: string;
}

export type GalleryScreenState =
  | { type: 'loading-collection' }
  | { type: 'password-required' }
  | { type: 'ready'; collection: GalleryCollection }
  | { type: 'loading-more'; loaded: number; total: number }
  | { type: 'partial-error'; retryCursor: string }
  | { type: 'empty' }
  | { type: 'not-found' }
  | { type: 'unavailable' };

export type LightboxState =
  | { type: 'closed' }
  | { type: 'opening'; photoId: string }
  | { type: 'open'; photoId: string }
  | { type: 'slideshow'; photoId: string; paused: boolean }
  | { type: 'closing'; photoId: string };

export interface ExportRequest {
  id: string;
  collectionSlug: string;
  collectionTitle: string;
  type: 'single' | 'collection' | 'favorites';
  photoId?: string;
  photoFileName?: string;
  clientEmail: string;
  requestedSize: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface AdminMetrics {
  totalCollections: number;
  totalPhotos: number;
  totalExports: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  storagePercentage: number;
  services: {
    database: 'healthy' | 'degraded' | 'offline';
    server: 'healthy' | 'degraded' | 'offline';
    cdn: 'healthy' | 'degraded' | 'offline';
  };
  updatedAt: string;
}

export interface CollectionConfigUpdate {
  title?: string;
  visibility?: CollectionVisibility;
  passwordRequired?: boolean;
  clientPassword?: string;
  clientEmail?: string;
  clientEmails?: string[];
  downloads?: Partial<DownloadPolicy>;
  clientNotes?: string;
  expiresAt?: string;
  coverFocalPoint?: { x: number; y: number };
  theme?: Partial<GalleryTheme>;
  sets?: GallerySet[];
}

export interface LibraryPhotoItem extends GalleryPhoto {
  collectionSlug: string;
  collectionTitle: string;
}

export interface PhotoLibraryQuery {
  q?: string;
  collection?: string;
  orientation?: 'all' | 'portrait' | 'landscape';
  limit?: number;
  offset?: number;
}

export interface PhotoLibraryResponse {
  items: LibraryPhotoItem[];
  totalCount: number;
  hasMore: boolean;
  collections: Array<{
    slug: string;
    title: string;
    count: number;
  }>;
}

export interface CreateCollectionInput {
  title: string;
  slug: string;
  eventDate?: string;
  clientEmail?: string;
  coverUrl?: string;
  coverFocalPoint?: { x: number; y: number };
  layoutPreset?: 'masonry' | 'justified';
  visibility?: 'public' | 'password' | 'client-only' | 'hidden';
  password?: string;
  seedDemoPhotos?: boolean;
}

export interface CreateCollectionResponse {
  success: boolean;
  collection: {
    id: string;
    slug: string;
    title: string;
    totalItems: number;
    coverUrl?: string;
    createdAt: string;
  };
}
