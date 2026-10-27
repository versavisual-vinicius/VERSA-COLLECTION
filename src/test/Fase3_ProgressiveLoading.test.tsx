import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { useGalleryProgressivePhotos } from '../components/Masonry/useGalleryProgressivePhotos';
import { InfiniteMasonryGrid } from '../components/Masonry/InfiniteMasonryGrid';
import type { GalleryPageResponse } from '../types/gallery';
import { galleryPhotos } from '../data/fixtures';

describe('Fase 3: Infinite Masonry Grid & Carregamento Progressivo (RF-006)', () => {
  describe('Hook useGalleryProgressivePhotos', () => {
    it('deve carregar o primeiro lote obrigatório com 16 itens', () => {
      const { result } = renderHook(() =>
        useGalleryProgressivePhotos({
          initialLimit: 16,
          batchLimit: 8,
        }),
      );

      expect(result.current.status).toBe('ready');
      expect(result.current.photos).toHaveLength(16);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.totalItems).toBe(127);
    });

    it('deve carregar o segundo lote com 8 itens subsequentes ao chamar loadMore()', async () => {
      const { result } = renderHook(() =>
        useGalleryProgressivePhotos({
          initialLimit: 16,
          batchLimit: 8,
        }),
      );

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      await act(async () => {
        await result.current.loadMore();
      });

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      // 16 do 1º lote + 8 do 2º lote = 24 itens
      expect(result.current.photos).toHaveLength(24);
      expect(result.current.photos[0].position).toBe(1);
      expect(result.current.photos[23].position).toBe(24);
    });

    it('deve deduplicar itens caso a API retorne registros já presentes', async () => {
      // Mock que repete itens
      const duplicateFetcher = vi.fn().mockResolvedValueOnce({
        items: galleryPhotos.slice(0, 16),
        nextCursor: 'cursor_2',
        totalItems: 127,
      }).mockResolvedValueOnce({
        // Retorna itens 14 a 22 (14 e 15 são duplicados)
        items: galleryPhotos.slice(14, 22),
        nextCursor: null,
        totalItems: 127,
      });

      const { result } = renderHook(() =>
        useGalleryProgressivePhotos({
          fetcher: duplicateFetcher,
          initialLimit: 16,
          batchLimit: 8,
        }),
      );

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      await act(async () => {
        await result.current.loadMore();
      });

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      // Verifica que não há IDs repetidos
      const ids = result.current.photos.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('deve tratar falha com partial-error e permitir recuperação via retry()', async () => {
      let failOnce = true;
      const failingFetcher = vi.fn().mockImplementation(async (cursor, limit) => {
        if (cursor && failOnce) {
          failOnce = false;
          throw new Error('Falha de rede simulada');
        }
        return {
          items: galleryPhotos.slice(0, cursor ? 24 : 16),
          nextCursor: cursor ? null : 'cursor_16',
          totalItems: 127,
        };
      });

      const { result } = renderHook(() =>
        useGalleryProgressivePhotos({
          fetcher: failingFetcher,
          initialLimit: 16,
          batchLimit: 8,
        }),
      );

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      // Dispara loadMore que falha
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.status).toBe('partial-error');
      expect(result.current.error).toBe('Falha de rede simulada');
      // Fotos já carregadas continuam intactas
      expect(result.current.photos).toHaveLength(16);

      // Dispara retry
      await act(async () => {
        await result.current.retry();
      });

      await vi.waitFor(() => {
        expect(result.current.status).toBe('ready');
      });
      expect(result.current.photos.length).toBeGreaterThan(16);
    });
  });

  describe('Componente InfiniteMasonryGrid', () => {
    it('deve exibir sentinela de prefetch quando hasMore for true', () => {
      render(
        <InfiniteMasonryGrid
          photos={galleryPhotos.slice(0, 16)}
          hasMore={true}
          onOpenPhoto={() => {}}
        />,
      );

      expect(screen.getByTestId('prefetch-sentinel')).toBeInTheDocument();
    });

    it('deve exibir indicador discreto quando status for loading-more', () => {
      render(
        <InfiniteMasonryGrid
          photos={galleryPhotos.slice(0, 16)}
          hasMore={true}
          status="loading-more"
          onOpenPhoto={() => {}}
        />,
      );

      expect(screen.getByText(/carregando mais fotografias/i)).toBeInTheDocument();
    });

    it('deve exibir aviso de erro e botão de retry quando status for partial-error', () => {
      const onRetryMock = vi.fn();
      render(
        <InfiniteMasonryGrid
          photos={galleryPhotos.slice(0, 16)}
          hasMore={true}
          status="partial-error"
          errorMessage="Instabilidade momentânea de conexão"
          onRetry={onRetryMock}
          onOpenPhoto={() => {}}
        />,
      );

      expect(screen.getByText('Instabilidade momentânea de conexão')).toBeInTheDocument();
      const retryBtn = screen.getByRole('button', { name: /tentar carregar novamente/i });
      fireEvent.click(retryBtn);

      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });
});
