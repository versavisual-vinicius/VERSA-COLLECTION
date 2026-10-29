import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardPage } from '../components/Dashboard/DashboardPage';
import { StorageGaugeCard } from '../components/Dashboard/StorageGaugeCard';
import { ProductHubGrid } from '../components/Dashboard/ProductHubGrid';
import { SystemHealthCard } from '../components/Dashboard/SystemHealthCard';
import type { AdminMetrics } from '../types/gallery';
import * as backendModule from '../lib/backend';

const mockMetrics: AdminMetrics = {
  totalCollections: 40,
  totalPhotos: 158,
  totalExports: 12,
  storageUsedBytes: 25 * 1024 * 1024 * 1024, // 25 GB
  storageLimitBytes: 100 * 1024 * 1024 * 1024, // 100 GB
  storagePercentage: 25,
  services: {
    database: 'healthy',
    server: 'healthy',
    cdn: 'healthy',
  },
  updatedAt: '2026-10-29T21:00:00.000Z',
};

describe('Fase 14: Dashboard Central & Hub Federado (Pixieset Parity)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('StorageGaugeCard', () => {
    it('renderiza consumo em GB, cota e percentual de progresso com tokens oficiais', () => {
      render(<StorageGaugeCard metrics={mockMetrics} />);

      expect(screen.getByTestId('storage-gauge-card')).toBeInTheDocument();
      expect(screen.getByText('25% Utilizado')).toBeInTheDocument();
      expect(screen.getByText(/25\.0 GB consumidos/)).toBeInTheDocument();
      expect(screen.getByText(/100 GB disponíveis/)).toBeInTheDocument();

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '25');
      expect(progressBar).toHaveStyle({ width: '25%' });

      expect(screen.getByText('40')).toBeInTheDocument();
      expect(screen.getByText('Coleções')).toBeInTheDocument();
      expect(screen.getByText('158')).toBeInTheDocument();
      expect(screen.getByText('Fotografias')).toBeInTheDocument();
    });

    it('exibe skeleton de carregamento quando loading=true', () => {
      const { container } = render(<StorageGaugeCard metrics={null} loading={true} />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('ProductHubGrid', () => {
    it('renderiza os 4 módulos canônicos do ecossistema', () => {
      render(<ProductHubGrid />);

      expect(screen.getByTestId('product-hub-grid')).toBeInTheDocument();
      expect(screen.getByText('Client Gallery')).toBeInTheDocument();
      expect(screen.getByText('Biblioteca de Fotos')).toBeInTheDocument();
      expect(screen.getByText('Studio Manager')).toBeInTheDocument();
      expect(screen.getByText('Configurações de Marca')).toBeInTheDocument();
    });

    it('chama onNavigate ao clicar em um módulo', () => {
      const onNavigate = vi.fn();
      render(<ProductHubGrid onNavigate={onNavigate} />);

      const galleryCard = screen.getByText('Client Gallery').closest('a');
      expect(galleryCard).toBeInTheDocument();
      if (galleryCard) fireEvent.click(galleryCard);

      expect(onNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('SystemHealthCard', () => {
    it('indica status operacional verde para todos os serviços', () => {
      render(<SystemHealthCard services={mockMetrics.services} updatedAt={mockMetrics.updatedAt} />);

      expect(screen.getByTestId('system-health-card')).toBeInTheDocument();
      expect(screen.getByText('Servidor Cloud Run (Node 24 LTS)')).toBeInTheDocument();
      expect(screen.getByText('Banco de Dados (AlloyDB / PostgreSQL)')).toBeInTheDocument();
      expect(screen.getByText('CDN Google Drive')).toBeInTheDocument();

      const badges = screen.getAllByText('Operacional');
      expect(badges.length).toBe(3);
    });

    it('exibe badge degradado em caso de falha de conexão', () => {
      render(
        <SystemHealthCard
          services={{ database: 'degraded', server: 'healthy', cdn: 'healthy' }}
        />,
      );
      expect(screen.getByText('Degradado')).toBeInTheDocument();
    });
  });

  describe('DashboardPage (Integração)', () => {
    it('carrega métricas e renderiza o painel completo do fotógrafo', async () => {
      vi.spyOn(backendModule, 'fetchAdminMetrics').mockResolvedValue(mockMetrics);
      const onNavigateHome = vi.fn();
      const onOpenAdmin = vi.fn();
      const onCreateCollection = vi.fn();

      render(
        <DashboardPage
          onNavigateHome={onNavigateHome}
          onOpenAdmin={onOpenAdmin}
          onCreateCollection={onCreateCollection}
        />,
      );

      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.getByText('Painel de Controle Editorial')).toBeInTheDocument();
      expect(screen.getByText('Nova Coleção')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('25% Utilizado')).toBeInTheDocument();
      });

      // Dispara ação de Nova Coleção
      fireEvent.click(screen.getByTestId('btn-new-collection'));
      expect(onCreateCollection).toHaveBeenCalledTimes(1);

      // Dispara abertura do Painel Admin
      fireEvent.click(screen.getByTestId('btn-open-admin'));
      expect(onOpenAdmin).toHaveBeenCalledTimes(1);

      // Dispara retorno para Home
      fireEvent.click(screen.getByTestId('btn-brand-home'));
      expect(onNavigateHome).toHaveBeenCalledTimes(1);
    });
  });
});
