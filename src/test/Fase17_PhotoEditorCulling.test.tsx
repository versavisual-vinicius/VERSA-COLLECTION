import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoEditorPage } from '../components/PhotoEditor/PhotoEditorPage';

describe('Fase 17: Photo Editor & Culling Workspace (Pixieset Parity)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('deve renderizar o workspace com canvas, toolbar e filmstrip', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    expect(screen.getByTestId('photo-editor-page')).toBeInTheDocument();
    expect(screen.getByTestId('culling-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('culling-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('filmstrip-bar')).toBeInTheDocument();
  });

  it('deve atribuir estrelas (1-5) e selo de aprovação (Pick) via atalhos de teclado', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    // Pressionar tecla '5' para atribuir 5 estrelas na foto #1
    fireEvent.keyDown(window, { key: '5' });
    expect(screen.getByTestId('badge-culling-rating')).toBeInTheDocument();
    expect(screen.getByTestId('thumb-rating-0')).toHaveTextContent('★5');

    // Pressionar 'P' marca como Pick e avança automaticamente para a foto #2 (índice 1)
    fireEvent.keyDown(window, { key: 'p' });
    expect(screen.getByTestId('thumb-pick-0')).toBeInTheDocument();

    // Voltando para a foto #1 com ArrowLeft para conferir o badge Pick no canvas
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByTestId('badge-culling-pick')).toBeInTheDocument();
  });

  it('deve navegar entre fotos com ArrowRight e ArrowLeft e sincronizar com filmstrip', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    const imgBefore = screen.getByTestId('culling-canvas-image').getAttribute('alt');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    const imgAfter = screen.getByTestId('culling-canvas-image').getAttribute('alt');

    expect(imgAfter).not.toBe(imgBefore);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByTestId('culling-canvas-image').getAttribute('alt')).toBe(imgBefore);
  });

  it('deve filtrar fotos ao selecionar filtro Apenas Escolhidas (Picks)', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    // Marca a primeira foto como Pick
    fireEvent.click(screen.getByTestId('btn-flag-pick'));

    // Ativa o filtro Picks
    fireEvent.click(screen.getByTestId('filter-culling-picks'));

    // Apenas 1 miniatura deve estar no filmstrip filtrado
    expect(screen.getByTestId('filmstrip-thumb-0')).toBeInTheDocument();
    expect(screen.queryByTestId('filmstrip-thumb-1')).not.toBeInTheDocument();
  });

  it('deve abrir o painel de estilos editoriais e aplicar filtro CSS na imagem do canvas', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    fireEvent.click(screen.getByTestId('btn-toggle-styles'));
    expect(screen.getByTestId('style-preset-panel')).toBeInTheDocument();

    // Seleciona B&W Noir 35mm
    fireEvent.click(screen.getByTestId('preset-style-bw-noir'));

    const canvasImg = screen.getByTestId('culling-canvas-image');
    expect(canvasImg).toHaveStyle({
      filter: 'grayscale(100%) contrast(1.22) brightness(0.96)',
    });
  });

  it('deve exibir modal de exportação com o resumo atualizado de Picks e Rejects', () => {
    render(<PhotoEditorPage initialSlug="fixture" />);

    // Foto 1 -> Pick (auto-avança para Foto 2)
    fireEvent.keyDown(window, { key: 'P' });
    // Foto 2 -> Reject (auto-avança para Foto 3)
    fireEvent.keyDown(window, { key: 'X' });

    fireEvent.click(screen.getByTestId('btn-export-culling'));
    expect(screen.getByTestId('culling-export-modal')).toBeInTheDocument();
    expect(screen.getByText('Exportar Relatório de Triagem')).toBeInTheDocument();
  });
});
