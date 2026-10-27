import { useMemo } from 'react';
import type { GalleryPhoto } from '../../types/gallery';

export interface MasonryLayoutItem {
  photo: GalleryPhoto;
  left: number;
  top: number;
  width: number;
  height: number;
  columnIndex: number;
}

export interface MasonryLayoutOptions {
  gapDesktop?: number;
  gapMobile?: number;
  marginDesktop?: number;
  marginMobile?: number;
}

export interface MasonryLayoutResult {
  layoutItems: MasonryLayoutItem[];
  totalHeight: number;
  columnCount: number;
  columnWidth: number;
  gap: number;
  margin: number;
}

/**
 * Calcula a posição determinística de cada fotografia no grid masonry.
 * Regras Seção 18 e RF-005:
 * - >= 900px: 4 colunas.
 * - 600–899px: 3 colunas.
 * - < 600px: 2 colunas.
 * - Inserção sempre na coluna com menor altura acumulada (desempate: coluna mais à esquerda).
 * - A ordem do array de retorno preserva estritamente a ordem do DOM idêntica à lista recebida.
 */
export function calculateMasonryLayout(
  items: GalleryPhoto[],
  containerWidth: number,
  options: MasonryLayoutOptions = {},
): MasonryLayoutResult {
  const {
    gapDesktop = 6,
    gapMobile = 4,
    marginDesktop = 20,
    marginMobile = 4,
  } = options;

  let columnCount = 4;
  let gap = gapDesktop;
  let margin = marginDesktop;

  if (containerWidth < 600) {
    columnCount = 2;
    gap = gapMobile;
    margin = marginMobile;
  } else if (containerWidth < 900) {
    columnCount = 3;
    gap = 6;
    margin = 12;
  } else {
    columnCount = 4;
    gap = gapDesktop;
    margin = marginDesktop;
  }

  // Previne largura negativa ou zero em renderizações SSR/iniciais
  const safeContainerWidth = Math.max(containerWidth, 320);
  const availableWidth = Math.max(0, safeContainerWidth - 2 * margin);
  const totalGaps = (columnCount - 1) * gap;
  const columnWidth = Math.max(1, Math.floor((availableWidth - totalGaps) / columnCount));

  const colHeights = new Array(columnCount).fill(0);

  const layoutItems: MasonryLayoutItem[] = items.map((photo) => {
    // Busca coluna com menor altura acumulada; desempate escolhe a mais à esquerda
    let minColIndex = 0;
    let minHeight = colHeights[0];

    for (let c = 1; c < columnCount; c++) {
      if (colHeights[c] < minHeight) {
        minHeight = colHeights[c];
        minColIndex = c;
      }
    }

    const aspectRatio = photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1;
    const itemHeight = Math.max(1, Math.round(columnWidth / aspectRatio));

    const left = margin + minColIndex * (columnWidth + gap);
    const top = colHeights[minColIndex];

    colHeights[minColIndex] += itemHeight + gap;

    return {
      photo,
      left,
      top,
      width: columnWidth,
      height: itemHeight,
      columnIndex: minColIndex,
    };
  });

  const totalHeight = Math.max(...colHeights, 0);

  return {
    layoutItems,
    totalHeight,
    columnCount,
    columnWidth,
    gap,
    margin,
  };
}

export function useMasonryLayout(
  items: GalleryPhoto[],
  containerWidth: number,
  options?: MasonryLayoutOptions,
): MasonryLayoutResult {
  return useMemo(
    () => calculateMasonryLayout(items, containerWidth, options),
    [items, containerWidth, options?.gapDesktop, options?.gapMobile, options?.marginDesktop, options?.marginMobile],
  );
}
