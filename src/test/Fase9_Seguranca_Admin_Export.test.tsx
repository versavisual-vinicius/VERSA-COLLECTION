import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  saveCollectionConfig,
  getStoredCollectionConfig,
  resetCollectionConfig,
  verifyClientAccess,
  saveExportRequest,
  getAllExportRequests,
  clearExportRequests,
} from '../lib/collectionSettings';
import { GalleryPasswordGate } from '../components/Security/GalleryPasswordGate';
import { AdminPanel } from '../components/Admin/AdminPanel';
import { collectionFixture } from '../data/fixtures';
import type { GalleryCollection } from '../types/gallery';

describe('Fase 9: Segurança do Cliente, Painel do Vini & Solicitações de Exportação', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('collectionSettings (Persistência & Regras de Acesso)', () => {
    it('deve salvar, recuperar e resetar configurações da coleção no localStorage', () => {
      expect(getStoredCollectionConfig('test-slug')).toBeNull();

      saveCollectionConfig('test-slug', {
        title: 'Coleção Teste',
        passwordRequired: true,
        clientPassword: 'segredo123',
        downloads: {
          requiresPin: true,
          pin: '9999',
        },
      });

      const stored = getStoredCollectionConfig('test-slug');
      expect(stored).not.toBeNull();
      expect(stored?.clientPassword).toBe('segredo123');
      expect(stored?.downloads?.pin).toBe('9999');

      resetCollectionConfig('test-slug');
      expect(getStoredCollectionConfig('test-slug')).toBeNull();
    });

    it('deve validar acesso do cliente por senha e e-mail restrito', () => {
      const protectedCollection: GalleryCollection = {
        ...collectionFixture,
        passwordRequired: true,
        clientPassword: 'clientepass',
        clientEmail: 'vip@modec.com',
      };

      // Senha incorreta
      const wrongPass = verifyClientAccess(protectedCollection, 'errada', 'vip@modec.com');
      expect(wrongPass.success).toBe(false);
      expect(wrongPass.error).toContain('Senha incorreta');

      // Senha correta, mas e-mail não autorizado
      const wrongEmail = verifyClientAccess(protectedCollection, 'clientepass', 'outro@modec.com');
      expect(wrongEmail.success).toBe(false);
      expect(wrongEmail.error).toContain('não possui autorização');

      // Credenciais válidas
      const valid = verifyClientAccess(protectedCollection, 'clientepass', 'vip@modec.com');
      expect(valid.success).toBe(true);
    });

    it('deve registrar solicitações de exportação no feed de auditoria', () => {
      expect(getAllExportRequests()).toHaveLength(0);

      saveExportRequest({
        collectionSlug: 'modec-2026',
        collectionTitle: 'MODEC 2026',
        type: 'collection',
        clientEmail: 'gestao@modec.com',
        requestedSize: 'original',
        status: 'ready',
      });

      const list = getAllExportRequests();
      expect(list).toHaveLength(1);
      expect(list[0].clientEmail).toBe('gestao@modec.com');
      expect(list[0].collectionSlug).toBe('modec-2026');

      clearExportRequests();
      expect(getAllExportRequests()).toHaveLength(0);
    });

  });

  describe('GalleryPasswordGate (Desafio de Senha do Cliente)', () => {
    it('deve bloquear acesso e exibir erro ao submeter senha incorreta', async () => {
      const onUnlockedMock = vi.fn();

      const col: GalleryCollection = {
        ...collectionFixture,
        passwordRequired: true,
        clientPassword: 'modec-vip-pass',
      };

      render(<GalleryPasswordGate collection={col} onUnlocked={onUnlockedMock} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(col.title);
      expect(screen.getByLabelText(/senha de acesso/i)).toBeInTheDocument();

      const passInput = screen.getByLabelText(/senha de acesso/i);
      fireEvent.change(passInput, { target: { value: 'senha-incorreta' } });

      const submitBtn = screen.getByRole('button', { name: /entrar na galeria/i });
      fireEvent.click(submitBtn);

      await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/senha incorreta/i));
      expect(onUnlockedMock).not.toHaveBeenCalled();
    });

    it('deve desbloquear a galeria ao submeter a senha correta', async () => {
      const onUnlockedMock = vi.fn();

      const col: GalleryCollection = {
        ...collectionFixture,
        passwordRequired: true,
        clientPassword: 'modec-vip-pass',
      };

      render(<GalleryPasswordGate collection={col} onUnlocked={onUnlockedMock} />);

      const passInput = screen.getByLabelText(/senha de acesso/i);
      fireEvent.change(passInput, { target: { value: 'modec-vip-pass' } });

      const submitBtn = screen.getByRole('button', { name: /entrar na galeria/i });
      fireEvent.click(submitBtn);

      await waitFor(() => expect(onUnlockedMock).toHaveBeenCalledTimes(1));
    });
  });

  describe('AdminPanel (Painel do Vini)', () => {
    it('deve desativar autenticação local quando o backend seguro não está configurado', () => {
      const onCloseMock = vi.fn();
      render(<AdminPanel onClose={onCloseMock} />);

      expect(screen.getByText(/Backend seguro ainda não configurado/i)).toBeInTheDocument();
      expect(screen.queryByText(/senha mestra/i)).not.toBeInTheDocument();
    });

  });
});

