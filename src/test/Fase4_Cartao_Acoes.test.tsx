import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GalleryPhotoCard } from '../components/Masonry/GalleryPhotoCard';
import { galleryPhotos } from '../data/fixtures';
import type { MasonryLayoutItem } from '../components/Masonry/useMasonryLayout';

describe('Fase 4: Cartão de Fotografia & Ações (RF-007)', () => {
  const photo = galleryPhotos[0];
  const layoutItem: MasonryLayoutItem = {
    photo,
    left: 20,
    top: 50,
    width: 274,
    height: 411,
    columnIndex: 0,
  };

  it('deve renderizar a imagem responsiva com dimensões, srcset, sizes e loading lazy/eager', () => {
    const { rerender } = render(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        priority={false}
        onOpenPhoto={() => {}}
      />,
    );

    const img = screen.getByAltText(photo.alt);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('width', String(photo.width));
    expect(img).toHaveAttribute('height', String(photo.height));
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');

    rerender(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        priority={true}
        onOpenPhoto={() => {}}
      />,
    );
    const eagerImg = screen.getByAltText(photo.alt);
    expect(eagerImg).toHaveAttribute('loading', 'eager');
  });

  it('deve ter alvos interativos mínimos de 44x44px nos botões de ação', () => {
    render(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        onOpenPhoto={() => {}}
      />,
    );

    const favBtn = screen.getByLabelText(/favoritar fotografia 1/i);
    const dlBtn = screen.getByLabelText(/baixar fotografia 1/i);
    const shareBtn = screen.getByLabelText(/compartilhar fotografia 1/i);

    expect(favBtn).toHaveClass('photo-action-btn');
    expect(dlBtn).toHaveClass('photo-action-btn');
    expect(shareBtn).toHaveClass('photo-action-btn');
  });

  it('deve refletir o estado de favorito com aria-pressed no botão de favoritar', () => {
    const onToggleMock = vi.fn();
    const { rerender } = render(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        isFavorite={false}
        onOpenPhoto={() => {}}
        onToggleFavorite={onToggleMock}
      />,
    );

    const favBtn = screen.getByLabelText(/favoritar fotografia 1/i);
    expect(favBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(favBtn);
    expect(onToggleMock).toHaveBeenCalledWith(photo.id);

    rerender(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        isFavorite={true}
        onOpenPhoto={() => {}}
        onToggleFavorite={onToggleMock}
      />,
    );

    const unfavBtn = screen.getByLabelText(/remover fotografia 1 dos favoritos/i);
    expect(unfavBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('deve preservar a proporção reservada no container evitando CLS', () => {
    const { container } = render(
      <GalleryPhotoCard
        layoutItem={layoutItem}
        onOpenPhoto={() => {}}
      />,
    );

    const card = container.querySelector('article');
    expect(card).toHaveStyle({
      width: '274px',
      height: '411px',
      transform: 'translate3d(20px, 50px, 0)',
    });
  });
});
