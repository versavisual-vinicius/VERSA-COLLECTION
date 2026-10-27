import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { telemetry } from '../lib/telemetry';
import { ShareDialog } from '../components/Dialogs/ShareDialog';
import { DownloadDialog } from '../components/Dialogs/DownloadDialog';
import { collectionFixture, galleryPhotos } from '../data/fixtures';

describe('Fase 8: Acessibilidade & Telemetria Segura (Seção 13 e 15)', () => {
  beforeEach(() => {
    telemetry.clearEvents();
    telemetry.setEnabled(true);
  });

  describe('Seção 15 — Telemetria Segura e Privacidade', () => {
    it('deve registrar eventos canônicos com campos comuns sem dados sensíveis', () => {
      telemetry.track('photo_opened', {
        collectionId: 'col-nat',
        photoId: 'photo-010',
        inputMethod: 'keyboard',
        metadata: {
          zoomLevel: 1.5,
          userEmail: 'sensivel@cliente.com', // Campo sensível que deve ser filtrado!
          userPin: '1234',                  // Campo sensível que deve ser filtrado!
          fileName: 'foto_bruta_original.cr3', // Campo sensível que deve ser filtrado!
        },
      });

      const events = telemetry.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event.eventName).toBe('photo_opened');
      expect(event.schemaVersion).toBe('1.0.0');
      expect(event.collectionId).toBe('col-nat');
      expect(event.photoId).toBe('photo-010');
      expect(event.visitorIdHash).toBeDefined();
      expect(event.deviceClass).toBeDefined();
      expect(event.inputMethod).toBe('keyboard');
      expect(event.timestamp).toBeDefined();

      // Campos sensíveis devem ter sido rigorosamente filtrados
      expect(event.metadata?.userEmail).toBeUndefined();
      expect(event.metadata?.userPin).toBeUndefined();
      expect(event.metadata?.fileName).toBeUndefined();
      expect(event.metadata?.zoomLevel).toBe(1.5);
    });

    it('deve respeitar desativação global da telemetria', () => {
      telemetry.setEnabled(false);
      telemetry.track('gallery_viewed', { collectionId: 'col-1' });

      expect(telemetry.getEvents()).toHaveLength(0);
    });
  });

  describe('Seção 13 — Acessibilidade WCAG 2.2 AA', () => {
    it('todas as fotos devem possuir alt semântico e não utilizar nome de arquivo bruto', () => {
      galleryPhotos.forEach((photo) => {
        expect(photo.alt).toBeTruthy();
        expect(photo.alt).not.toContain('.jpg');
        expect(photo.alt).not.toContain('.jpeg');
        expect(photo.alt).toContain('Fotografia');
      });
    });

    it('modais devem declarar role="dialog", aria-modal="true" e fechar via Escape', () => {
      const onCloseShare = vi.fn();
      render(
        <ShareDialog
          isOpen={true}
          title={collectionFixture.title}
          url="https://example.com"
          onClose={onCloseShare}
        />,
      );

      const dialog = screen.getByRole('dialog', { name: /compartilhar/i });
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onCloseShare).toHaveBeenCalledTimes(1);
    });
  });
});
