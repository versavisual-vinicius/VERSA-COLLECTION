import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GalleryHero } from '../components/GalleryHero/GalleryHero';
import { AutoHideGalleryHeader } from '../components/Header/AutoHideGalleryHeader';
import { collectionFixture } from '../data/fixtures';

describe('Fase 2: Capa Editorial & Cabeçalho Inteligente', () => {
  describe('RF-002 & RF-003 — Capa Editorial (GalleryHero)', () => {
    it('deve renderizar a capa com imagem de ponto focal dinâmico (50% 28%)', () => {
      render(<GalleryHero collection={collectionFixture} />);

      const coverImg = screen.getByAltText(collectionFixture.cover.alt);
      expect(coverImg).toBeInTheDocument();
      expect(coverImg).toHaveStyle({ objectPosition: '50% 28%' });
    });

    it('deve renderizar o título editorial com estilo e tipografia da coleção', () => {
      render(<GalleryHero collection={collectionFixture} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(collectionFixture.title);
      expect(heading).toHaveClass('cover-title');
    });

    it('não deve renderizar aviso intrusivo na capa mesmo quando isOwnerPreview for true', () => {
      const { rerender } = render(<GalleryHero collection={collectionFixture} isOwnerPreview={false} />);
      expect(screen.queryByRole('status', { name: /modo de pré-visualização/i })).not.toBeInTheDocument();

      rerender(<GalleryHero collection={collectionFixture} isOwnerPreview={true} />);
      expect(screen.queryByRole('status', { name: /modo de pré-visualização/i })).not.toBeInTheDocument();
    });

    it('deve disparar onEnterGallery ou scroll suave ao clicar no botão de entrada', () => {
      const onEnterMock = vi.fn();
      render(<GalleryHero collection={collectionFixture} onEnterGallery={onEnterMock} />);

      const enterButton = screen.getByRole('button', { name: /entrar na galeria/i });
      fireEvent.click(enterButton);

      expect(onEnterMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('RF-004 — AutoHideGalleryHeader (Lógica Precisa de Scroll)', () => {
    beforeEach(() => {
      window.scrollY = 0;
    });

    const triggerScroll = (newY: number) => {
      window.scrollY = newY;
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
    };

    it('deve permanecer visível quando scrollY < 24 (topo da grade)', () => {
      render(
        <AutoHideGalleryHeader
          collectionTitle={collectionFixture.title}
          favoriteCount={0}
          onOpenFavorites={() => {}}
          onOpenDownload={() => {}}
        />,
      );

      const header = screen.getByTestId('auto-hide-header');
      expect(header).toHaveAttribute('data-visible', 'true');

      // Pequeno scroll dentro do topo
      triggerScroll(15);
      expect(header).toHaveAttribute('data-visible', 'true');
    });

    it('deve ignorar oscilações de scroll menores que 4px (anti-jitter)', () => {
      render(
        <AutoHideGalleryHeader
          collectionTitle={collectionFixture.title}
          favoriteCount={0}
          onOpenFavorites={() => {}}
          onOpenDownload={() => {}}
        />,
      );

      const header = screen.getByTestId('auto-hide-header');
      triggerScroll(10);
      triggerScroll(12); // delta = 2px (< 4px) -> ignorado
      expect(header).toHaveAttribute('data-visible', 'true');
    });

    it('deve ocultar o cabeçalho após 24px acumulados de descida', () => {
      render(
        <AutoHideGalleryHeader
          collectionTitle={collectionFixture.title}
          favoriteCount={0}
          onOpenFavorites={() => {}}
          onOpenDownload={() => {}}
        />,
      );

      const header = screen.getByTestId('auto-hide-header');

      // Desce fora do topo de uma vez acumulando >= 24px
      triggerScroll(100);
      expect(header).toHaveAttribute('data-visible', 'false');
    });

    it('deve reexibir o cabeçalho após 12px acumulados de subida', () => {
      render(
        <AutoHideGalleryHeader
          collectionTitle={collectionFixture.title}
          favoriteCount={0}
          onOpenFavorites={() => {}}
          onOpenDownload={() => {}}
        />,
      );

      const header = screen.getByTestId('auto-hide-header');

      // Desce para 200px -> oculto
      triggerScroll(200);
      expect(header).toHaveAttribute('data-visible', 'false');

      // Sobe 5px -> subida insuficiente (< 12px), ainda oculto
      triggerScroll(195);
      expect(header).toHaveAttribute('data-visible', 'false');

      // Sobe mais 15px (total 20px de subida) -> reexibe!
      triggerScroll(180);
      expect(header).toHaveAttribute('data-visible', 'true');
    });
  });
});
