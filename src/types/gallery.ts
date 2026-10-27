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
  allowedSizes: Array<'original' | '3600' | '2048' | '1024' | '640'>;
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
  favoritesEnabled: boolean;
  downloads: DownloadPolicy;
  sharingEnabled: boolean;
  slideshowEnabled: boolean;
  totalItems: number;
  locale: string;
  theme: GalleryTheme;
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
}

export interface GalleryPageResponse {
  items: GalleryPhoto[];
  nextCursor: PageCursor | null;
  totalItems: number;
}

export interface FavoriteRecord {
  photoId: string;
  selected: boolean;
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
