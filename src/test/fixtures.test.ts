import { describe, it, expect } from 'vitest';
import { collectionFixture, galleryPhotos, getGalleryPageMock } from '../data/fixtures';
import type { GalleryPhoto } from '../types/gallery';

describe('Fase 1: Contratos e Fixtures da Galeria', () => {
  it('deve conter a coleção fixture com todos os metadados canônicos', () => {
    expect(collectionFixture.id).toBe('collection-nat');
    expect(collectionFixture.slug).toBe('nat');
    expect(collectionFixture.title).toBe('OTICAS ELOY – NAT');
    expect(collectionFixture.totalItems).toBe(127);
    expect(collectionFixture.cover).toBeDefined();
    expect(collectionFixture.cover.sources.length).toBeGreaterThan(0);
    expect(collectionFixture.coverFocalPoint).toEqual({ x: 50, y: 28 });
    expect(collectionFixture.downloads.allowedSizes).toContain('original');
    expect(collectionFixture.downloads.allowedSizes).toContain('2048');
  });

  it('deve conter exatamente 127 fotos com dimensões reais e proporções mistas', () => {
    expect(galleryPhotos).toHaveLength(127);

    const hasPortrait = galleryPhotos.some((p) => p.height > p.width);
    const hasLandscape = galleryPhotos.some((p) => p.width > p.height);
    const hasSquare = galleryPhotos.some((p) => p.width === p.height);

    expect(hasPortrait).toBe(true);
    expect(hasLandscape).toBe(true);
    expect(hasSquare).toBe(true);
  });

  it('deve ter posições sequenciais estritas de 1 a 127 e positionTieBreaker único', () => {
    const tieBreakers = new Set<string>();

    galleryPhotos.forEach((photo: GalleryPhoto, index: number) => {
      expect(photo.position).toBe(index + 1);
      expect(photo.positionTieBreaker).toBe(photo.id);
      expect(photo.alt).toBe(`Fotografia ${index + 1} da coleção ${collectionFixture.title}`);
      expect(photo.focalPoint).toBeDefined();
      expect(photo.focalPoint?.x).toBeGreaterThanOrEqual(0);
      expect(photo.focalPoint?.x).toBeLessThanOrEqual(100);
      expect(photo.focalPoint?.y).toBeGreaterThanOrEqual(0);
      expect(photo.focalPoint?.y).toBeLessThanOrEqual(100);

      tieBreakers.add(photo.positionTieBreaker);
    });

    expect(tieBreakers.size).toBe(127);
  });

  describe('Mock de Paginação Progressiva com Cursor', () => {
    it('deve retornar primeiro lote com 16 itens e cursor opaco inicial', () => {
      const page1 = getGalleryPageMock();

      expect(page1.items).toHaveLength(16);
      expect(page1.totalItems).toBe(127);
      expect(page1.nextCursor).toBe('cursor_pos_16');
      expect(page1.items[0].position).toBe(1);
      expect(page1.items[15].position).toBe(16);
    });

    it('deve retornar lotes subsequentes com 8 itens a partir do cursor', () => {
      const page2 = getGalleryPageMock('cursor_pos_16');

      expect(page2.items).toHaveLength(8);
      expect(page2.items[0].position).toBe(17);
      expect(page2.items[7].position).toBe(24);
      expect(page2.nextCursor).toBe('cursor_pos_24');
    });

    it('deve paginar toda a coleção até o final sem perder itens e com nextCursor null no fim', () => {
      let currentCursor: string | null = null;
      const allLoadedPhotos: GalleryPhoto[] = [];

      while (true) {
        const page = getGalleryPageMock(currentCursor);
        allLoadedPhotos.push(...page.items);
        if (!page.nextCursor) {
          break;
        }
        currentCursor = page.nextCursor;
      }

      expect(allLoadedPhotos).toHaveLength(127);
      expect(allLoadedPhotos[0].id).toBe('photo-001');
      expect(allLoadedPhotos[126].id).toBe('photo-127');
    });

    it('deve se recuperar com segurança caso o cursor seja inválido ou corrompido', () => {
      const pageFallback = getGalleryPageMock('cursor_invalido_corrompido');
      expect(pageFallback.items).toHaveLength(8);
      expect(pageFallback.items[0].position).toBe(1);
    });
  });
});
