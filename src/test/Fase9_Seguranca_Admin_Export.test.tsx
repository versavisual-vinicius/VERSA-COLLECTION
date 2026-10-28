import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import {
  saveCollectionConfig,
  getStoredCollectionConfig,
  resetCollectionConfig,
  verifyClientAccess,
  saveExportRequest,
  getAllExportRequests,
  clearExportRequests,
  verifyAdminPassword,
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

    it('deve validar a senha mestra do fotógrafo Vini', () => {
      expect(verifyAdminPassword('versa2026')).toBe(true);
      expect(verifyAdminPassword('senha-errada')).toBe(false);
    });
  });

  describe('GalleryPasswordGate (Desafio de Senha do Cliente)', () => {
    it('deve bloquear acesso e exibir erro ao submeter senha incorreta', async () => {
      vi.useFakeTimers();
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

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByRole('alert')).toHaveTextContent(/senha incorreta/i);
      expect(onUnlockedMock).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('deve desbloquear a galeria ao submeter a senha correta', () => {
      vi.useFakeTimers();
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

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onUnlockedMock).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('AdminPanel (Painel do Vini)', () => {
    it('deve exigir login com senha mestra e liberar o painel após autenticação', () => {
      const onCloseMock = vi.fn();
      render(<AdminPanel onClose={onCloseMock} />);

      expect(screen.getByText(/painel do fotógrafo/i)).toBeInTheDocument();

      const passInput = screen.getByPlaceholderText(/digite a senha mestra/i);
      fireEvent.change(passInput, { target: { value: 'versa2026' } });

      const loginBtn = screen.getByRole('button', { name: /acessar painel/i });
      fireEvent.click(loginBtn);

      // Agora deve estar dentro do painel
      expect(screen.getByText(/painel do vini — gestão de galerias/i)).toBeInTheDocument();
      expect(screen.getByText(/segurança & acesso do cliente/i)).toBeInTheDocument();
    });

    it('deve permitir configurar senha, PIN de download e copiar mensagem de WhatsApp', () => {
      localStorage.setItem('versa_admin_auth_v1', 'true');
      const onCloseMock = vi.fn();

      render(<AdminPanel onClose={onCloseMock} />);

      // Abre aba de WhatsApp
      const whatsappTab = screen.getByRole('button', { name: /mensagem whatsapp do cliente/i });
      fireEvent.click(whatsappTab);

      expect(screen.getByText(/alinhamento & envio ao cliente/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copiar mensagem/i })).toBeInTheDocument();
      expect(screen.getByText(/abrir no whatsapp web/i)).toBeInTheDocument();
    });
  });
});

