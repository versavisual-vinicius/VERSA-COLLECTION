import { useCallback, useEffect, useState } from 'react';
import type { FavoriteRecord } from '../types/gallery';
import { getOrCreateVisitorId } from './telemetry';

const FAVORITES_STORAGE_PREFIX = 'versa_gallery_favs_';

export interface UseFavoritesResult {
  favoriteIds: Set<string>;
  favoriteNotes: Record<string, string>;
  toggleFavorite: (photoId: string) => boolean; // retorna true se adicionou, false se removeu
  removeFavorite: (photoId: string) => void;
  updateFavoriteNote: (photoId: string, note: string) => void;
  clearFavorites: () => void;
  isFavorite: (photoId: string) => boolean;
  syncPending: boolean;
}

export function useFavorites(collectionId: string): UseFavoritesResult {
  const storageKey = `${FAVORITES_STORAGE_PREFIX}${collectionId}`;

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

  return {
    favoriteIds,
    favoriteNotes,
    toggleFavorite,
    removeFavorite,
    updateFavoriteNote,
    clearFavorites,
    isFavorite,
    syncPending,
  };
}
