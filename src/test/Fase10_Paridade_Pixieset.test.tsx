import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import React from 'react';
import { GalleryPage } from '../components/GalleryPage';
import { useFavorites } from '../lib/useFavorites';
import { FavoritesDialog } from '../components/Dialogs/FavoritesDialog';
import { ShareDialog } from '../components/Dialogs/ShareDialog';
import { PhotoLightbox } from '../components/Lightbox/PhotoLightbox';
import { AdminPanel } from '../components/Admin/AdminPanel';
import { setAdminAuthenticated } from '../lib/collectionSettings';
import App from '../App';
import { galleryPhotos } from '../data/fixtures';

describe('Fase 10: Paridade Cirúrgica REA vs. Pixieset Real', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('10.1: deve sincronizar URL profunda a partir do parâmetro ?pid= (padrão Pixieset)', async () => {
    const targetPhoto = galleryPhotos[1];
    window.history.replaceState({}, '', `/?collection=fixture&pid=${targetPhoto.id}`);

    render(<GalleryPage collectionSlug="fixture" />);

    // Deve abrir o Lightbox na foto especificada por ?pid=
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /Visualização ampliada da fotografia/i })).toBeInTheDocument();
  });

  it('10.2: useFavorites deve salvar e atualizar notas do cliente (paridade isNoteOn)', () => {
    const { result } = renderHook(() => useFavorites('col-test'));

    act(() => {
      result.current.toggleFavorite('photo-123');
    });
    expect(result.current.isFavorite('photo-123')).toBe(true);

    act(() => {
      result.current.updateFavoriteNote('photo-123', 'Essa vai para o álbum principal');
    });

    expect(result.current.favoriteNotes['photo-123']).toBe('Essa vai para o álbum principal');
  });

  it('10.3: FavoritesDialog deve exibir e permitir editar observação da foto', () => {
    const onUpdateNoteMock = vi.fn();
    const testPhotos = [galleryPhotos[0]];

    render(
      <FavoritesDialog
        isOpen={true}
        favorites={testPhotos}
        favoriteNotes={{ [galleryPhotos[0].id]: 'Tratar reflexo' }}
        onClose={() => {}}
        onOpenPhoto={() => {}}
        onRemoveFavorite={() => {}}
        onUpdateNote={onUpdateNoteMock}
      />,
    );

    // Deve exibir o badge com a nota
    expect(screen.getByText('Tratar reflexo')).toBeInTheDocument();

    // Clica no botão de nota para editar
    fireEvent.click(screen.getByTitle('Nota: Tratar reflexo'));

    const input = screen.getByPlaceholderText(/Ex: Gostei dessa/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Nova nota de teste' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(onUpdateNoteMock).toHaveBeenCalledWith(galleryPhotos[0].id, 'Nova nota de teste');
  });

  it('10.4: ShareDialog deve oferecer alternância de QR Code para escaneamento no celular', () => {
    render(
      <ShareDialog
        isOpen={true}
        title="Coleção Teste"
        url="https://versa.gallery/g/teste"
        onClose={() => {}}
      />,
    );

    const qrToggleBtn = screen.getByRole('button', { name: /Escanear QR Code no celular/i });
    expect(qrToggleBtn).toBeInTheDocument();

    // Clica para exibir QR Code
    fireEvent.click(qrToggleBtn);

    expect(screen.getByRole('button', { name: /Ocultar QR Code/i })).toBeInTheDocument();
    const qrImg = screen.getByAltText(/QR Code para Coleção Teste/i);
    expect(qrImg).toBeInTheDocument();
    expect(qrImg.getAttribute('src')).toContain('api.qrserver.com');
  });

  it('10.5: App deve renderizar PhotographerHomePage na raiz quando nenhuma coleção é especificada', () => {
    window.history.replaceState({}, '', '/');

    render(<App />);

    expect(screen.getByText(/Catálogo Oficial de Clientes/i)).toBeInTheDocument();
    expect(screen.getByText(/Coleções Digitais Exclusivas/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Vinicius Cunha Fotografia/i).length).toBeGreaterThan(0);
  });

  it('10.6: GallerySetsNav deve renderizar sub-galerias e permitir alternar conjuntos', async () => {
    render(<GalleryPage collectionSlug="fixture" />);

    // Deve encontrar a barra de navegação de sub-galerias (#nav-galleries)
    const nav = screen.getByRole('tablist');
    expect(nav).toBeInTheDocument();

    // Deve listar as abas "Todas as Fotos", "Destaques", "Editorial Principal", "Detalhes & Estilo"
    expect(screen.getByRole('tab', { name: /Todas as Fotos/i })).toBeInTheDocument();
    const destaquesTab = screen.getByRole('tab', { name: /Destaques/i });
    expect(destaquesTab).toBeInTheDocument();

    // Clica na aba Destaques
    fireEvent.click(destaquesTab);
    expect(destaquesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('10.7: PhotoLightbox deve expor botões de nota e privacidade com IDs paritários (#sv-note-btn e #sv-lock-btn)', () => {
    const onToggleFavMock = vi.fn();
    const onTogglePrivateMock = vi.fn();
    const onUpdateNoteMock = vi.fn();

    render(
      <PhotoLightbox
        photo={galleryPhotos[0]}
        currentIndex={0}
        totalPhotos={10}
        onClose={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onToggleFavorite={onToggleFavMock}
        onTogglePrivate={onTogglePrivateMock}
        onUpdateNote={onUpdateNoteMock}
      />,
    );

    const noteBtn = document.getElementById('sv-note-btn');
    expect(noteBtn).toBeInTheDocument();

    const lockBtn = document.getElementById('sv-lock-btn');
    expect(lockBtn).toBeInTheDocument();

    // Clica no botão de privacidade
    fireEvent.click(lockBtn!);
    expect(onTogglePrivateMock).toHaveBeenCalledWith(galleryPhotos[0].id);

    // Clica no botão de nota para abrir popover
    fireEvent.click(noteBtn!);
    expect(screen.getByText(/Anotação do Cliente/i)).toBeInTheDocument();
  });

  it('10.8: FavoritesDialog deve fornecer botão para empacotamento ZIP dos favoritos', () => {
    render(
      <FavoritesDialog
        isOpen={true}
        favorites={[galleryPhotos[0], galleryPhotos[1]]}
        onClose={() => {}}
        onOpenPhoto={() => {}}
        onRemoveFavorite={() => {}}
      />,
    );

    const zipBtn = screen.getByRole('button', { name: /Baixar Meus Favoritos \(\.ZIP\)/i });
    expect(zipBtn).toBeInTheDocument();
  });

  it('10.9: AdminPanel deve exibir opções de exportação e importação de configurações em JSON', () => {
    setAdminAuthenticated(true);

    render(
      <AdminPanel
        initialSlug="fixture"
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: /Exportar JSON/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Importar JSON/i })).toBeInTheDocument();
  });
});
