import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryPhoto, GalleryPageResponse, PageCursor } from '../../types/gallery';
import { getGalleryPageMock } from '../../data/fixtures';

export type LoadingStatus = 'loading' | 'ready' | 'loading-more' | 'partial-error';

export interface UseGalleryProgressivePhotosOptions {
  collectionId?: string;
  initialLimit?: number;
  batchLimit?: number;
  fetcher?: (cursor: PageCursor | null, limit: number, signal?: AbortSignal) => Promise<GalleryPageResponse>;
}

export interface UseGalleryProgressivePhotosResult {
  photos: GalleryPhoto[];
  status: LoadingStatus;
  totalItems: number;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

const defaultFetcher = async (
  cursor: PageCursor | null,
  limit: number,
  signal?: AbortSignal,
): Promise<GalleryPageResponse> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
      } else {
        resolve(getGalleryPageMock(cursor, limit));
      }
    }, 20);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};

/**
 * Hook para carregamento progressivo de fotografias com paginação por cursor (RF-006):
 * - Primeiro lote inicial imediato (16 itens) para hidratação veloz e zero CLS.
 * - Lotes subsequentes: 8 itens via cursor sob demanda.
 * - Deduplicação automática por photo.id.
 * - Cancelamento seguro de requisições pendentes via AbortController.
 * - Recuperação de erro parcial via retry().
 */
export function useGalleryProgressivePhotos(
  options: UseGalleryProgressivePhotosOptions = {},
): UseGalleryProgressivePhotosResult {
  const {
    collectionId = 'default',
    initialLimit = 16,
    batchLimit = 8,
    fetcher,
  } = options;

  const isCustomFetcher = Boolean(fetcher);
  const effectiveFetcher = fetcher ?? defaultFetcher;

  // Inicialização imediata do 1º lote (16 itens) para evitar flash de tela vazia e permitir SSR
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    if (isCustomFetcher) return [];
    return getGalleryPageMock(null, initialLimit).items;
  });

  const [status, setStatus] = useState<LoadingStatus>(() => (isCustomFetcher ? 'loading' : 'ready'));

  const [nextCursor, setNextCursor] = useState<PageCursor | null>(() => {
    if (isCustomFetcher) return null;
    return getGalleryPageMock(null, initialLimit).nextCursor;
  });

  const [totalItems, setTotalItems] = useState<number>(() => {
    if (isCustomFetcher) return 0;
    return getGalleryPageMock(null, initialLimit).totalItems;
  });

  const [error, setError] = useState<string | null>(null);

  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;
    isFetchingRef.current = true;

    setStatus('loading');
    setError(null);

    try {
      const response = await effectiveFetcher(null, initialLimit, abortController.signal);

      if (!abortController.signal.aborted) {
        setPhotos(response.items);
        setNextCursor(response.nextCursor);
        setTotalItems(response.totalItems);
        setStatus('ready');
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!abortController.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar coleção inicial');
        setStatus('partial-error');
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [effectiveFetcher, initialLimit]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !nextCursor || status === 'loading-more') {
      return;
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;
    isFetchingRef.current = true;

    setStatus('loading-more');
    setError(null);

    try {
      const response = await effectiveFetcher(nextCursor, batchLimit, abortController.signal);

      if (!abortController.signal.aborted) {
        setPhotos((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newUniquePhotos = response.items.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newUniquePhotos];
        });

        setNextCursor(response.nextCursor);
        setTotalItems(response.totalItems);
        setStatus('ready');
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!abortController.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar mais fotos');
        setStatus('partial-error');
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [batchLimit, effectiveFetcher, nextCursor, status]);

  const retry = useCallback(async () => {
    if (photos.length === 0) {
      await loadInitial();
    } else {
      await loadMore();
    }
  }, [loadInitial, loadMore, photos.length]);

  // Se for fetcher customizado ou a coleção mudar, executa busca inicial
  useEffect(() => {
    if (isCustomFetcher) {
      loadInitial();
    }

    return () => {
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
    };
  }, [collectionId, isCustomFetcher, loadInitial]);

  const hasMore = Boolean(nextCursor);

  return {
    photos,
    status,
    totalItems,
    hasMore,
    error,
    loadMore,
    retry,
  };
}
