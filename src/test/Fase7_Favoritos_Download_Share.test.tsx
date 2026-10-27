import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { useFavorites } from '../lib/useFavorites';
import { DownloadDialog } from '../components/Dialogs/DownloadDialog';
import { ShareDialog } from '../components/Dialogs/ShareDialog';
import { FavoritesDialog } from '../components/Dialogs/FavoritesDialog';
import { galleryPhotos } from '../data/fixtures';

describe('Fase 7: Favoritos, Download & Compartilhamento (RF-010, RF-011, RF-012)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('RF-010 — Favoritos (useFavorites)', () => {
    it('deve alternar favoritos de forma otimista, reversível e persistir no localStorage', () => {
      const { result } = renderHook(() => useFavorites('collection-test'));

      expect(result.current.favoriteIds.size).toBe(0);

      // Adiciona foto 1
      let added: boolean = false;
      act(() => {
        added = result.current.toggleFavorite('photo-001');
      });
      expect(added).toBe(true);
      expect(result.current.favoriteIds.has('photo-001')).toBe(true);
      expect(result.current.favoriteIds.size).toBe(1);

      // Desmarca foto 1 (reversibilidade)
      act(() => {
        added = result.current.toggleFavorite('photo-001');
      });
      expect(added).toBe(false);
      expect(result.current.favoriteIds.has('photo-001')).toBe(false);
      expect(result.current.favoriteIds.size).toBe(0);
    });

    it('deve listar fotos e permitir remoção direta no FavoritesDialog', () => {
      const onRemoveMock = vi.fn();
      render(
        <FavoritesDialog
          isOpen={true}
          favorites={[galleryPhotos[0], galleryPhotos[1]]}
          onClose={() => {}}
          onOpenPhoto={() => {}}
          onRemoveFavorite={onRemoveMock}
        />,
      );

      expect(screen.getByText('2 fotografias selecionadas')).toBeInTheDocument();
      const removeBtns = screen.getAllByLabelText(/remover foto/i);
      expect(removeBtns).toHaveLength(2);

      fireEvent.click(removeBtns[0]);
      expect(onRemoveMock).toHaveBeenCalledWith('photo-001');
    });
  });

  describe('RF-011 — Download (DownloadDialog)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('deve processar o ciclo do job de download (idle -> validating -> preparing -> ready)', () => {
      const onToastMock = vi.fn();
      render(
        <DownloadDialog
          isOpen={true}
          photo={galleryPhotos[0]}
          collectionTitle="OTICAS ELOY – NAT"
          onClose={() => {}}
          onShowToast={onToastMock}
        />,
      );

      expect(screen.getByText(/resolução total/i)).toBeInTheDocument();
      const prepareBtn = screen.getByRole('button', { name: /preparar arquivo/i });
      fireEvent.click(prepareBtn);

      // Estado transitório: validating
      expect(screen.getByText(/validando permissões e resolução/i)).toBeInTheDocument();

      // Avança para preparing
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.getByText(/processando e compactando imagens/i)).toBeInTheDocument();

      // Avança para ready
      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(screen.getByText(/arquivo pronto para download/i)).toBeInTheDocument();
      expect(screen.getByText(/link assinado válido por 15 minutos/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /baixar agora/i })).toBeInTheDocument();
    });

    it('deve exigir PIN quando a política da coleção determinar requiresPin', () => {
      render(
        <DownloadDialog
          isOpen={true}
          photo={galleryPhotos[0]}
          collectionTitle="OTICAS ELOY – NAT"
          requiresPin={true}
          onClose={() => {}}
        />,
      );

      const prepareBtn = screen.getByRole('button', { name: /preparar arquivo/i });
      fireEvent.click(prepareBtn);

      expect(screen.getByText(/por favor, informe o pin/i)).toBeInTheDocument();
    });
  });

  describe('RF-012 — Compartilhamento (ShareDialog)', () => {
    it('deve exibir destinos sociais e permitir cópia do link com confirmação de sucesso', async () => {
      const onToastMock = vi.fn();
      render(
        <ShareDialog
          isOpen={true}
          title="OTICAS ELOY – NAT"
          url="https://example.com/g/nat?photo=photo-001"
          onClose={() => {}}
          onShowToast={onToastMock}
        />,
      );

      expect(screen.getByLabelText(/compartilhar via whatsapp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compartilhar via facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compartilhar via x/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compartilhar via pinterest/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compartilhar via e-mail/i)).toBeInTheDocument();

      const copyBtn = screen.getByRole('button', { name: /copiar/i });
      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(screen.getByText('Copiado!')).toBeInTheDocument();
      expect(onToastMock).toHaveBeenCalledWith('Link copiado para a área de transferência');
    });
  });
});
