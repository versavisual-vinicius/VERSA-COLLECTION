import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { EmptyGalleryState } from '../components/Feedback/EmptyGalleryState';
import { ExpiredCollectionScreen } from '../components/Feedback/ExpiredCollectionScreen';
import { CoverFocalPicker } from '../components/Admin/CoverFocalPicker';
import { useFavorites } from '../lib/useFavorites';
import { collectionFixture } from '../data/fixtures';

describe('Fase 11: Novos Recursos (EmptyState, Expiry, Favoritos por E-mail & CoverFocalPicker)', () => {
  describe('11.1: Estado de Galeria Vazia (EmptyGalleryState)', () => {
    it('deve renderizar mensagem de acervo em preparação para coleção sem fotos', () => {
      const onRefreshMock = vi.fn();
      render(
        <EmptyGalleryState
          isSetFilter={false}
          onRefresh={onRefreshMock}
        />,
      );

      expect(screen.getByText(/acervo em preparação/i)).toBeInTheDocument();
      expect(screen.getByText(/esta coleção ainda não possui fotografias disponíveis/i)).toBeInTheDocument();
      const refreshBtn = screen.getByRole('button', { name: /atualizar galeria/i });
      fireEvent.click(refreshBtn);
      expect(onRefreshMock).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar mensagem contextual para conjunto (set) sem fotos com botão para ver todas', () => {
      const onClearFilterMock = vi.fn();
      render(
        <EmptyGalleryState
          isSetFilter={true}
          onClearFilter={onClearFilterMock}
        />,
      );

      expect(screen.getByText(/conjunto sem registros/i)).toBeInTheDocument();
      expect(screen.getByText(/nenhuma fotografia encontrada neste conjunto/i)).toBeInTheDocument();
      const clearBtn = screen.getByRole('button', { name: /ver todas as fotografias/i });
      fireEvent.click(clearBtn);
      expect(onClearFilterMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('11.2: Expiração Automática de Coleção (ExpiredCollectionScreen)', () => {
    it('deve renderizar tela de expiração com aviso de disponibilidade encerrada e link de WhatsApp', () => {
      const expiredCollection = {
        ...collectionFixture,
        expiresAt: '2025-01-01T00:00:00.000Z',
      };
      const onOpenAdminMock = vi.fn();

      render(
        <ExpiredCollectionScreen
          collection={expiredCollection}
          onOpenAdmin={onOpenAdminMock}
        />,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/prazo de exibição encerrado/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /falar no whatsapp/i })).toHaveAttribute(
        'href',
        expect.stringContaining('api.whatsapp.com'),
      );

      const adminBtn = screen.getByRole('button', { name: /acesso do fotógrafo/i });
      fireEvent.click(adminBtn);
      expect(onOpenAdminMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('11.3: Sincronização de Favoritos por E-mail (useFavorites)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('deve armazenar e retornar o e-mail do cliente ao sincronizar', async () => {
      const { result } = renderHook(() => useFavorites('collection-email-test'));

      expect(result.current.clientEmail).toBeNull();

      await act(async () => {
        await result.current.syncWithEmail('cliente@exemplo.com');
      });

      expect(result.current.clientEmail).toBe('cliente@exemplo.com');
      expect(localStorage.getItem('versa_client_email')).toBe('cliente@exemplo.com');
    });
  });

  describe('11.4: Editor de Ponto Focal (CoverFocalPicker)', () => {
    it('deve emitir novo ponto focal percentual ao clicar no canvas da capa', () => {
      const onChangeMock = vi.fn();
      render(
        <CoverFocalPicker
          coverUrl="https://exemplo.com/cover.jpg"
          focalPoint={{ x: 50, y: 35 }}
          onChange={onChangeMock}
        />,
      );

      expect(screen.getByText(/X: 50% · Y: 35%/i)).toBeInTheDocument();

      const container = screen.getByTitle(/clique para reposicionar o ponto focal/i);
      // Simula getBoundingClientRect
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        right: 200,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.pointerDown(container, { clientX: 160, clientY: 40 });
      expect(onChangeMock).toHaveBeenCalledWith({ x: 80, y: 40 });
    });
  });
});
