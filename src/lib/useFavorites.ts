import { useCallback, useEffect, useState } from 'react';
import type { FavoriteRecord } from '../types/gallery';

const FAVORITES_STORAGE_PREFIX = 'versa_gallery_favs_';

export interface UseFavoritesResult {
  favoriteIds: Set<string>;
  favoriteNotes: Record<string, string>;
  clientEmail: string | null;
  toggleFavorite: (photoId: string) => boolean; // retorna true se adicionou, false se removeu
  removeFavorite: (photoId: string) => void;
  updateFavoriteNote: (photoId: string, note: string) => void;
  clearFavorites: () => void;
  isFavorite: (photoId: string) => boolean;
  syncPending: boolean;
  syncWithEmail: (email: string) => Promise<void>;
}

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server-visitor';
  try {
    let id = localStorage.getItem('versa_visitor_id');
    if (!id) {
      id = 'vis_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem('versa_visitor_id', id);
    }
    return id;
  } catch {
    return 'fallback-visitor';
  }
}

const EMAIL_STORAGE_KEY = 'versa_client_email';

export function useFavorites(collectionId: string): UseFavoritesResult {
  const storageKey = `${FAVORITES_STORAGE_PREFIX}${collectionId}`;

  const [clientEmail, setClientEmailState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(EMAIL_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  // Inicializa a partir de localStorage
  const [favoriteRecords, setFavoriteRecords] = useState<FavoriteRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(storageKey);
      if (data) {
        return JSON.parse(data) as FavoriteRecord[];
      }
    } catch {
      // Ignora falhas em parsing
    }
    return [];
  });

  const [syncPending, setSyncPending] = useState(false);

  // Sincroniza e persiste alterações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favoriteRecords));
    } catch {
      // Quota ou navegação anônima restritiva
    }
  }, [favoriteRecords, storageKey]);

  const favoriteIds = new Set(
    favoriteRecords.filter((rec) => rec.selected).map((rec) => rec.photoId),
  );

  const favoriteNotes = favoriteRecords
    .filter((rec) => rec.selected && rec.note)
    .reduce<Record<string, string>>((acc, rec) => {
      acc[rec.photoId] = rec.note!;
      return acc;
    }, {});

  const isFavorite = useCallback(
    (photoId: string) => favoriteIds.has(photoId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (photoId: string): boolean => {
      let isAdded = false;

      setFavoriteRecords((prev) => {
        const now = new Date().toISOString();
        const existingIndex = prev.findIndex((r) => r.photoId === photoId);

        if (existingIndex >= 0) {
          const current = prev[existingIndex];
          const nextSelected = !current.selected;
          isAdded = nextSelected;

          const updated = [...prev];
          updated[existingIndex] = {
            ...current,
            selected: nextSelected,
            updatedAt: now,
          };
          return updated;
        }

        isAdded = true;
        return [
          ...prev,
          {
            photoId,
            selected: true,
            updatedAt: now,
          },
        ];
      });

      // Simula sincronização em segundo plano (otimista)
      setSyncPending(true);
      setTimeout(() => setSyncPending(false), 300);

      return isAdded;
    },
    [],
  );

  const removeFavorite = useCallback((photoId: string) => {
    setFavoriteRecords((prev) => {
      const now = new Date().toISOString();
      const existingIndex = prev.findIndex((r) => r.photoId === photoId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...prev[existingIndex],
          selected: false,
          updatedAt: now,
        };
        return updated;
      }
      return prev;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    const now = new Date().toISOString();
    setFavoriteRecords((prev) =>
      prev.map((r) => ({ ...r, selected: false, updatedAt: now })),
    );
  }, []);

  const updateFavoriteNote = useCallback((photoId: string, note: string) => {
    setFavoriteRecords((prev) => {
      const now = new Date().toISOString();
      const existingIndex = prev.findIndex((r) => r.photoId === photoId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...prev[existingIndex],
          note: note.trim() || undefined,
          updatedAt: now,
        };
        return updated;
      }
      return [
        ...prev,
        {
          photoId,
          selected: true,
          note: note.trim() || undefined,
          updatedAt: now,
        },
      ];
    });
  }, []);

  const syncWithEmail = useCallback(
    async (email: string) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) return;

      setClientEmailState(cleanEmail);
      try {
        localStorage.setItem(EMAIL_STORAGE_KEY, cleanEmail);
      } catch {
        // Ignora
      }

      setSyncPending(true);
      const visitorId = getOrCreateVisitorId();

      try {
        if (typeof window !== 'undefined' && (window as unknown as { __VITE_API_ENABLED?: boolean }).__VITE_API_ENABLED) {
          const res = await fetch(`/api/collections/${encodeURIComponent(collectionId)}/favorites/merge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId,
              clientEmail: cleanEmail,
              localFavorites: favoriteRecords,
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { favorites: FavoriteRecord[] };
            if (Array.isArray(data.favorites)) {
              setFavoriteRecords(data.favorites);
            }
          }
        }
      } catch {
        // Fallback silencioso mantendo offline-first
      } finally {
        setSyncPending(false);
      }
    },
    [collectionId, favoriteRecords],
  );

  return {
    favoriteIds,
    favoriteNotes,
    clientEmail,
    toggleFavorite,
    removeFavorite,
    updateFavoriteNote,
    clearFavorites,
    isFavorite,
    syncPending,
    syncWithEmail,
  };
}
