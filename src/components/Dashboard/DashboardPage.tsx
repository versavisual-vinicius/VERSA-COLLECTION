import React, { useEffect, useState } from 'react';
import type { AdminMetrics } from '../../types/gallery';
import { fetchAdminMetrics } from '../../lib/backend';
import { StorageGaugeCard } from './StorageGaugeCard';
import { ProductHubGrid } from './ProductHubGrid';
import { SystemHealthCard } from './SystemHealthCard';

interface DashboardPageProps {
  onNavigateHome?: () => void;
  onOpenAdmin?: () => void;
  onCreateCollection?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateHome,
  onOpenAdmin,
  onCreateCollection,
}) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAdminMetrics()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar métricas:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleNavigate = (href: string) => {
    if (href === '/' && onNavigateHome) {
      onNavigateHome();
      return;
    }
    if (href.includes('admin=true') && onOpenAdmin) {
      onOpenAdmin();
      return;
    }
    window.location.href = href;
  };

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-[#050A0D] text-stone-100 font-sans selection:bg-[#5E7F8C]/30 selection:text-white pb-16"
    >
      {/* Barra de Navegação Superior */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#050A0D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              data-testid="btn-brand-home"
              onClick={onNavigateHome}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-heading text-lg font-bold tracking-wider text-stone-100 uppercase group-hover:text-teal-300 transition-colors">
                Versa Visual
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-[#5E7F8C]">
                / Studio Hub
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {onCreateCollection && (
              <button
                type="button"
                onClick={onCreateCollection}
                data-testid="btn-new-collection"
                className="inline-flex items-center rounded-lg bg-[#5E7F8C] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#5E7F8C]/90 focus:outline-none focus:ring-2 focus:ring-[#5E7F8C] transition-colors"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Nova Coleção
              </button>
            )}

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                data-testid="btn-open-admin"
                className="rounded-lg border border-stone-700 bg-stone-900/80 px-3 py-1.5 text-xs font-medium text-stone-300 hover:bg-stone-800 hover:text-white focus:outline-none transition-colors"
              >
                Painel Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner do Fotógrafo */}
        <section className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7F8C]">
            Hub Central Pixieset Parity
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-100 mt-1">
            Painel de Controle Editorial
          </h1>
          <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
            Visão consolidada de todas as galerias, acervo fotográfico, cota de armazenamento em nuvem e integridade dos serviços do estúdio.
          </p>
        </section>

        {/* Grade de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Produtos e Atalhos (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ProductHubGrid onNavigate={handleNavigate} />
          </div>

          {/* Coluna Direita: Métricas e Saúde (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <StorageGaugeCard metrics={metrics} loading={loading} />
            <SystemHealthCard
              services={metrics?.services}
              updatedAt={metrics?.updatedAt}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Rodapé Editorial */}
      <footer className="mt-16 border-t border-stone-900 pt-8 text-center text-xs text-stone-500 font-sans">
        <p>Versa Visual — Galeria Digital & Entrega em Alta Resolução</p>
        <p className="mt-1 font-mono text-stone-600">@v1ncsc • Plataforma de Engenharia Reversa</p>
      </footer>
    </div>
  );
};
