import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoLightbox } from '../components/Lightbox/PhotoLightbox';
import { galleryPhotos } from '../data/fixtures';

describe('Fase 5: Lightbox & Sincronização de URL (RF-008 & Seção 6)', () => {
  const photo = galleryPhotos[2]; // Foto 3
  const totalPhotos = 127;

  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('deve aplicar lock de scroll no body ao abrir e restaurar ao fechar', () => {
    const { unmount } = render(
      <PhotoLightbox
        photo={photo}
        currentIndex={2}
        totalPhotos={totalPhotos}
        onClose={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
      />,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('deve permitir navegação por teclado com ArrowLeft, ArrowRight e Escape', () => {
    const onPreviousMock = vi.fn();
    const onNextMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <PhotoLightbox
        photo={photo}
        currentIndex={2}
        totalPhotos={totalPhotos}
        onClose={onCloseMock}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />,
    );

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNextMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onPreviousMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('deve suportar gestos touch/swipe horizontal para avançar e voltar', () => {
    const onPreviousMock = vi.fn();
    const onNextMock = vi.fn();

    render(
      <PhotoLightbox
        photo={photo}
        currentIndex={2}
        totalPhotos={totalPhotos}
        onClose={() => {}}
        onPrevious={onPreviousMock}
        onNext={onNextMock}
      />,
    );

    const mediaWrap = document.querySelector('.lightbox-media-wrap');
    expect(mediaWrap).toBeInTheDocument();

    // Swipe para a esquerda (próxima foto): touchstart em 200, touchend em 100 -> deltaX = -100px
    fireEvent.touchStart(mediaWrap!, {
      touches: [{ clientX: 200, clientY: 150 }],
    });
    fireEvent.touchEnd(mediaWrap!, {
      changedTouches: [{ clientX: 100, clientY: 150 }],
    });
    expect(onNextMock).toHaveBeenCalledTimes(1);

    // Swipe para a direita (foto anterior): touchstart em 100, touchend em 220 -> deltaX = +120px
    fireEvent.touchStart(mediaWrap!, {
      touches: [{ clientX: 100, clientY: 150 }],
    });
    fireEvent.touchEnd(mediaWrap!, {
      changedTouches: [{ clientX: 220, clientY: 150 }],
    });
    expect(onPreviousMock).toHaveBeenCalledTimes(1);
  });

  it('deve exibir indicador de posição e legenda quando presente', () => {
    render(
      <PhotoLightbox
        photo={photo}
        currentIndex={2}
        totalPhotos={totalPhotos}
        onClose={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
      />,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('127')).toBeInTheDocument();
  });
});
