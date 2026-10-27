import { describe, it, expect } from 'vitest';
import { calculateMasonryLayout } from '../components/Masonry/useMasonryLayout';
import type { GalleryPhoto } from '../types/gallery';

const createMockPhoto = (id: string, width: number, height: number, position: number): GalleryPhoto => ({
  id,
  fileName: `${id}.jpg`,
  alt: `Fotografia ${position}`,
  width,
  height,
  sources: [{ url: `https://example.com/${id}.jpg`, width, height, format: 'jpeg' }],
  shareUrl: `https://example.com/share/${id}`,
  position,
  positionTieBreaker: id,
});

describe('Motor do Masonry Calculado (Seção 18 e RF-005)', () => {
  describe('Paridade Geométrica Canônica', () => {
    it('deve calcular 4 colunas com 274px de largura em viewport de 1154px (desktop)', () => {
      const photos = [
        createMockPhoto('p1', 1200, 800, 1),
        createMockPhoto('p2', 800, 1200, 2),
        createMockPhoto('p3', 900, 900, 3),
        createMockPhoto('p4', 1200, 800, 4),
      ];

      const result = calculateMasonryLayout(photos, 1154, {
        gapDesktop: 6,
        marginDesktop: 20,
      });

      expect(result.columnCount).toBe(4);
      expect(result.margin).toBe(20);
      expect(result.gap).toBe(6);
      // Paridade exata da spec: (1154 - 40 - 18) / 4 = 1096 / 4 = 274px
      expect(result.columnWidth).toBe(274);
    });

    it('deve calcular 2 colunas com 189px de largura em viewport de 390px (mobile)', () => {
      const photos = [
        createMockPhoto('p1', 800, 1200, 1),
        createMockPhoto('p2', 1200, 800, 2),
      ];

      const result = calculateMasonryLayout(photos, 390, {
        gapMobile: 4,
        marginMobile: 4,
      });

      expect(result.columnCount).toBe(2);
      expect(result.margin).toBe(4);
      expect(result.gap).toBe(4);
      // Paridade exata da spec: (390 - 8 - 4) / 2 = 378 / 2 = 189px
      expect(result.columnWidth).toBe(189);
    });

    it('deve calcular 3 colunas em viewports entre 600px e 899px (tablet)', () => {
      const photos = [createMockPhoto('p1', 800, 1200, 1)];
      const result = calculateMasonryLayout(photos, 768);
      expect(result.columnCount).toBe(3);
    });
  });

  describe('Distribuição por Menor Altura Acumulada e Desempate', () => {
    it('deve alocar a foto na coluna com menor altura acumulada', () => {
      // 4 fotos iniciais em 4 colunas (largura 274)
      // p1: 1:1 -> altura 274
      // p2: 2:1 -> altura 137 (menor)
      // p3: 1:2 -> altura 548 (maior)
      // p4: 1:1 -> altura 274
      const photos = [
        createMockPhoto('p1', 1000, 1000, 1),
        createMockPhoto('p2', 2000, 1000, 2),
        createMockPhoto('p3', 1000, 2000, 3),
        createMockPhoto('p4', 1000, 1000, 4),
        createMockPhoto('p5', 1000, 1000, 5), // Deve entrar na coluna 1 (p2), pois é a mais baixa
      ];

      const result = calculateMasonryLayout(photos, 1154, { gapDesktop: 6, marginDesktop: 20 });
      const item5 = result.layoutItems[4];

      expect(item5.columnIndex).toBe(1); // coluna 1 é a de p2
      expect(item5.top).toBe(result.layoutItems[1].height + 6);
    });

    it('em caso de empate de altura, deve alocar na coluna mais à esquerda', () => {
      const photos = [
        createMockPhoto('p1', 1000, 1000, 1), // col 0
        createMockPhoto('p2', 1000, 1000, 2), // col 1
        createMockPhoto('p3', 1000, 1000, 3), // col 2
        createMockPhoto('p4', 1000, 1000, 4), // col 3
        createMockPhoto('p5', 1000, 1000, 5), // Todas têm 274 + 6 -> empate! Deve escolher col 0
      ];

      const result = calculateMasonryLayout(photos, 1154, { gapDesktop: 6, marginDesktop: 20 });
      expect(result.layoutItems[4].columnIndex).toBe(0);
    });
  });

  describe('Preservação Estrita da Ordem do DOM', () => {
    it('deve manter a ordem dos layoutItems rigorosamente igual à ordem da lista da API', () => {
      const photos = Array.from({ length: 16 }, (_, i) =>
        createMockPhoto(`photo-${i + 1}`, 1000, i % 2 === 0 ? 800 : 1200, i + 1),
      );

      const result = calculateMasonryLayout(photos, 1154);

      photos.forEach((photo, idx) => {
        expect(result.layoutItems[idx].photo.id).toBe(photo.id);
        expect(result.layoutItems[idx].photo.position).toBe(photo.position);
      });
    });
  });
});
