import { describe, expect, it } from 'vitest';
import {
  adminCollectionUpdateSchema,
  exportRequestSchema,
  favoritesMergeSchema,
  unlockSessionSchema,
  validateContract,
} from '../../api/_lib/contracts.js';

describe('Fase 13: REA Contracts & Validation Hardening', () => {
  describe('unlockSessionSchema (Galeria Privada)', () => {
    it('aceita senha válida e e-mail normalizado', () => {
      const result = validateContract(unlockSessionSchema, {
        password: 'minha-senha-secreta',
        email: '  CLIENTE@EXAMPLE.COM  ',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.password).toBe('minha-senha-secreta');
        expect(result.data.email).toBe('cliente@example.com');
      }
    });

    it('rejeita requisição com senha vazia ou ausente', async () => {
      const result = validateContract(unlockSessionSchema, {
        email: 'cliente@example.com',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
        const body = (await result.response.json()) as { error: { code: string; details: { issues: Array<{ path: string }> } } };
        expect(body.error.code).toBe('INVALID_INPUT');
        expect(body.error.details.issues.some((i) => i.path === 'password')).toBe(true);
      }
    });

    it('rejeita e-mail malformado', () => {
      const result = validateContract(unlockSessionSchema, {
        password: 'senha',
        email: 'email-invalido-sem-arroba',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('exportRequestSchema (Solicitação de Download)', () => {
    it('valida payload correto de download de foto única', () => {
      const result = validateContract(exportRequestSchema, {
        collectionSlug: 'casamento-marina',
        type: 'single',
        photoId: 'photo-001',
        clientEmail: 'noiva@example.com',
        pin: '1234',
        requestedSize: 'original',
      });

      expect(result.success).toBe(true);
    });

    it('rejeita PIN que não contenha exatamente 4 dígitos numéricos', async () => {
      const result = validateContract(exportRequestSchema, {
        collectionSlug: 'casamento-marina',
        type: 'collection',
        pin: '12',
        requestedSize: '3600',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
        const body = (await result.response.json()) as { error: { code: string } };
        expect(body.error.code).toBe('INVALID_INPUT');
      }
    });

    it('rejeita tipo de exportação não suportado', () => {
      const result = validateContract(exportRequestSchema, {
        collectionSlug: 'ensaio',
        type: 'all-unsupported-type' as never,
        requestedSize: 'original',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('favoritesMergeSchema (Sincronização de Favoritos)', () => {
    it('aceita sincronização contendo apenas visitorId', () => {
      const result = validateContract(favoritesMergeSchema, {
        visitorId: 'visitor-uuid-1234',
        localFavorites: [
          { photoId: 'photo-1', selected: true, note: 'Amei esta' },
        ],
      });

      expect(result.success).toBe(true);
    });

    it('rejeita sincronização sem visitorId e sem clientEmail', async () => {
      const result = validateContract(favoritesMergeSchema, {
        localFavorites: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
      }
    });
  });

  describe('adminCollectionUpdateSchema (Gestão Administrativa)', () => {
    it('valida atualização administrativa completa', () => {
      const result = validateContract(adminCollectionUpdateSchema, {
        slug: 'ensaio-nanda',
        title: 'Ensaio Nanda',
        visibility: 'password',
        clientPassword: 'senha-com-mais-de-8-caracteres',
        clientEmails: ['nanda@example.com', 'fotografo@versavisual.com'],
        coverFocalPoint: { x: 50, y: 30 },
        downloads: {
          enabled: true,
          requiresPin: true,
          pin: '9876',
          allowedSizes: ['original', '2048'],
        },
      });

      expect(result.success).toBe(true);
    });

    it('rejeita senha administrativa menor que 8 caracteres', async () => {
      const result = validateContract(adminCollectionUpdateSchema, {
        slug: 'ensaio-nanda',
        clientPassword: '123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
        const body = (await result.response.json()) as { error: { code: string; details: { issues: Array<{ path: string }> } } };
        expect(body.error.details.issues.some((i) => i.path === 'clientPassword')).toBe(true);
      }
    });
  });
});
