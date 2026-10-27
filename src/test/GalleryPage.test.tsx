import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GalleryPage } from '../components/GalleryPage';
import { collectionFixture, galleryPhotos } from '../data/fixtures';

describe('GalleryPage (Componentização Modular & Fluxos)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('deve renderizar a capa editorial com título, subtítulo e botão de entrada', () => {
    render(<GalleryPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(collectionFixture.title);
    expect(screen.getAllByText(collectionFixture.businessName)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar na galeria/i })).toBeInTheDocument();
  });

  it('deve renderizar o cabeçalho com a identidade e contador de favoritos', () => {
    render(<GalleryPage />);

    expect(screen.getByText('COLLECTION')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver favoritos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /baixar fotografias da coleção/i })).toBeInTheDocument();
  });

  it('deve renderizar a grade masonry calculada contendo as fotos da fixture', () => {
    render(<GalleryPage />);

    const grid = screen.getByTestId('infinite-masonry-grid');
    expect(grid).toBeInTheDocument();

    // Primeira foto deve estar presente no DOM
    const firstPhotoCard = screen.getByLabelText(/abrir fotografia 1 da coleção/i);
    expect(firstPhotoCard).toBeInTheDocument();
  });

  it('deve abrir a lightbox ao clicar em uma fotografia e sincronizar a URL', () => {
    render(<GalleryPage />);

    const firstPhotoCard = screen.getByLabelText(/abrir fotografia 1 da coleção/i);
    fireEvent.click(firstPhotoCard);

    // Lightbox deve estar aberta com role="dialog"
    const dialog = screen.getByRole('dialog', { name: /visualização ampliada da fotografia 1/i });
    expect(dialog).toBeInTheDocument();
    expect(window.location.search).toContain('photo=photo-001');

    // Fechar lightbox via botão
    const closeBtn = screen.getByRole('button', { name: /fechar visualização ampliada/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /visualização ampliada da fotografia 1/i })).not.toBeInTheDocument();
    expect(window.location.search).not.toContain('photo=');
  });

  it('deve permitir alternar favoritos e atualizar o contador no cabeçalho', () => {
    render(<GalleryPage />);

    // Favoritar foto 1
    const favBtn = screen.getByLabelText('Favoritar fotografia 1');
    fireEvent.click(favBtn);

    // Contador de favoritos deve subir para 1
    expect(screen.getByRole('button', { name: /ver favoritos \(1 itens selecionados\)/i })).toBeInTheDocument();

    // Desfavoritar
    const unfavBtn = screen.getByLabelText('Remover fotografia 1 dos favoritos');
    fireEvent.click(unfavBtn);

    expect(screen.getByRole('button', { name: /ver favoritos \(0 itens selecionados\)/i })).toBeInTheDocument();
  });

  it('deve abrir o diálogo de compartilhamento da foto', () => {
    render(<GalleryPage />);

    const shareBtn = screen.getByLabelText('Compartilhar fotografia 1');
    fireEvent.click(shareBtn);

    expect(screen.getByRole('dialog', { name: /compartilhar/i })).toBeInTheDocument();
  });

  it('deve abrir o diálogo de download com seleção de tamanho', () => {
    render(<GalleryPage />);

    const downloadBtn = screen.getByLabelText('Baixar fotografia 1');
    fireEvent.click(downloadBtn);

    expect(screen.getByRole('dialog', { name: /baixar fotografia/i })).toBeInTheDocument();
    expect(screen.getByText(/resolução total/i)).toBeInTheDocument();
  });
});
