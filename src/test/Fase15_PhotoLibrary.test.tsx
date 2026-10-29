import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { PhotoLibraryFilterBar } from '../components/PhotoLibrary/PhotoLibraryFilterBar';
import { PhotoLibraryEmptyState } from '../components/PhotoLibrary/PhotoLibraryEmptyState';
import { PhotoLibraryPage } from '../components/PhotoLibrary/PhotoLibraryPage';

describe('Fase 15: Biblioteca Central de Fotos & Busca Resiliente (Pixieset Parity)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  describe('PhotoLibraryFilterBar', () => {
    it('renderiza os elementos da barra de filtros com acessibilidade', () => {
      const onSearchChange = vi.fn();
      const onCollectionChange = vi.fn();
      const onOrientationChange = vi.fn();

      render(
        <PhotoLibraryFilterBar
          searchTerm="noiva"
          onSearchChange={onSearchChange}
          selectedCollection="modec-dia-das-criancas-2026"
          onCollectionChange={onCollectionChange}
          selectedOrientation="all"
          onOrientationChange={onOrientationChange}
          collections={[{ slug: 'modec-dia-das-criancas-2026', title: 'MODEC 2026', count: 158 }]}
          totalCount={158}
        />,
      );

      const input = screen.getByTestId('input-photo-search');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('noiva');

      const select = screen.getByTestId('select-collection-filter');
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue('modec-dia-das-criancas-2026');

      const btnClear = screen.getByTestId('btn-clear-search');
      expect(btnClear).toBeInTheDocument();
      fireEvent.click(btnClear);
      expect(onSearchChange).toHaveBeenCalledWith('');

      const btnPortrait = screen.getByTestId('filter-orientation-portrait');
      fireEvent.click(btnPortrait);
      expect(onOrientationChange).toHaveBeenCalledWith('portrait');
    });
  });

  describe('PhotoLibraryEmptyState', () => {
    it('renderiza estado vazio para busca sem resultados', () => {
      const onClear = vi.fn();
      render(
        <PhotoLibraryEmptyState
          isSearchEmpty={true}
          searchTerm="termo_inexistente"
          onClearSearch={onClear}
        />,
      );

      expect(screen.getByText(/Nenhuma foto encontrada para "termo_inexistente"/i)).toBeInTheDocument();
      const btnClear = screen.getByTestId('btn-empty-clear-search');
      fireEvent.click(btnClear);
      expect(onClear).toHaveBeenCalled();
    });

    it('renderiza estado vazio para acervo zerado com CTA de nova coleção', () => {
      const onCreate = vi.fn();
      render(
        <PhotoLibraryEmptyState
          isSearchEmpty={false}
          onCreateCollection={onCreate}
        />,
      );

      expect(screen.getByText(/Você ainda não tem fotos no acervo\?/i)).toBeInTheDocument();
      const btnCreate = screen.getByTestId('btn-empty-create-collection');
      fireEvent.click(btnCreate);
      expect(onCreate).toHaveBeenCalled();
    });
  });

  describe('PhotoLibraryPage', () => {
    it('renderiza a página da biblioteca com cabeçalho, filtros e fotos', async () => {
      const onNavigateHome = vi.fn();
      const onNavigateDashboard = vi.fn();
      const onOpenAdmin = vi.fn();

      render(
        <PhotoLibraryPage
          onNavigateHome={onNavigateHome}
          onNavigateDashboard={onNavigateDashboard}
          onOpenAdmin={onOpenAdmin}
        />,
      );

      expect(screen.getByTestId('photo-library-page')).toBeInTheDocument();
      expect(screen.getByText(/Biblioteca Central de Fotos/i)).toBeInTheDocument();

      // Navegação para o Studio Hub
      const btnBack = screen.getByTestId('btn-back-dashboard');
      fireEvent.click(btnBack);
      expect(onNavigateDashboard).toHaveBeenCalled();

      // Aguarda carregamento inicial de fotos
      await waitFor(() => {
        expect(screen.getByTestId('photo-library-grid')).toBeInTheDocument();
      });

      // Abre Lightbox ao clicar no primeiro card
      const photoCards = screen.getAllByTestId(/^library-photo-card-/);
      expect(photoCards.length).toBeGreaterThan(0);
      fireEvent.click(photoCards[0]);

      // Verifica se Lightbox abriu
      await waitFor(() => {
        expect(screen.getByTestId('photo-lightbox')).toBeInTheDocument();
      });
    });
  });

  describe('Roteamento SPA em App.tsx para /photos', () => {
    it('deve renderizar a PhotoLibraryPage ao acessar rota /photos diretamente', async () => {
      window.history.replaceState({}, '', '/photos');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('photo-library-page')).toBeInTheDocument();
        expect(screen.getByText(/Biblioteca Central de Fotos/i)).toBeInTheDocument();
      });
    });

    it('deve renderizar a PhotoLibraryPage com query param ?view=photos', async () => {
      window.history.replaceState({}, '', '/?view=photos');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('photo-library-page')).toBeInTheDocument();
      });
    });
  });
});
