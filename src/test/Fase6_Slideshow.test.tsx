import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { SlideshowController } from '../components/Lightbox/SlideshowController';
import { PhotoLightbox } from '../components/Lightbox/PhotoLightbox';
import { galleryPhotos } from '../data/fixtures';

describe('Fase 6: Slideshow (RF-009)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve avançar automaticamente a cada 4 segundos durante a reprodução', () => {
    const onNextMock = vi.fn();
    const onPauseMock = vi.fn();

    render(
      <SlideshowController
        isActive={true}
        intervalMs={4000}
        onNext={onNextMock}
        onPause={onPauseMock}
      />,
    );

    expect(onNextMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onNextMock).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onNextMock).toHaveBeenCalledTimes(2);
  });

  it('deve pausar automaticamente ao perder visibilidade da aba (visibilitychange)', () => {
    const onNextMock = vi.fn();
    const onPauseMock = vi.fn();

    render(
      <SlideshowController
        isActive={true}
        intervalMs={4000}
        onNext={onNextMock}
        onPause={onPauseMock}
      />,
    );

    // Simula aba ficando em segundo plano
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(onPauseMock).toHaveBeenCalledTimes(1);

    // Restaura
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
  });

  it('deve alternar slideshow com a barra de espaço na lightbox', () => {
    const onToggleSlideshowMock = vi.fn();

    render(
      <PhotoLightbox
        photo={galleryPhotos[0]}
        currentIndex={0}
        totalPhotos={127}
        isSlideshowActive={false}
        onClose={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onToggleSlideshow={onToggleSlideshowMock}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });
    expect(onToggleSlideshowMock).toHaveBeenCalledTimes(1);
  });

  it('deve ocultar controles após 2 segundos de inatividade durante apresentação', () => {
    render(
      <PhotoLightbox
        photo={galleryPhotos[0]}
        currentIndex={0}
        totalPhotos={127}
        isSlideshowActive={true}
        onClose={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
      />,
    );

    const toolbarContainer = document.querySelector('.lightbox-toolbar')?.parentElement;
    expect(toolbarContainer).toHaveClass('opacity-100');

    // Avança 2 segundos sem interação
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(toolbarContainer).toHaveClass('opacity-0');

    // Movimento do mouse reexibe os controles
    const backdrop = document.querySelector('.lightbox-backdrop');
    fireEvent.mouseMove(backdrop!);
    expect(toolbarContainer).toHaveClass('opacity-100');
  });
});
