import React from 'react';
import type { AdminMetrics } from '../../types/gallery';

interface SystemHealthCardProps {
  services?: AdminMetrics['services'];
  updatedAt?: string;
  loading?: boolean;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  services = { database: 'healthy', server: 'healthy', cdn: 'healthy' },
  updatedAt,
  loading,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-stone-800 bg-[#0d1418]/60 p-5 backdrop-blur-md animate-pulse">
        <div className="h-4 w-32 bg-stone-800 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-8 bg-stone-800 rounded" />
          <div className="h-8 bg-stone-800 rounded" />
          <div className="h-8 bg-stone-800 rounded" />
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: 'healthy' | 'degraded' | 'offline') => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Operacional
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 mr-1.5" />
            Degradado
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center text-xs font-medium text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-400 mr-1.5" />
            Indisponível
          </span>
        );
    }
  };

  const formattedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : 'Agora';

  return (
    <div
      data-testid="system-health-card"
      className="rounded-xl border border-stone-800 bg-[#0d1418]/80 p-5 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm font-semibold tracking-wide uppercase text-stone-300">
          Infraestrutura & Serviços
        </h3>
        <span className="text-[11px] text-stone-500 font-mono">
          Checado às {formattedTime}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
          <div>
            <span className="block text-sm font-medium text-stone-200">
              Servidor Cloud Run (Node 24 LTS)
            </span>
            <span className="text-xs text-stone-500">API REST e roteamento unificado</span>
          </div>
          {renderStatusBadge(services.server)}
        </div>

        <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
          <div>
            <span className="block text-sm font-medium text-stone-200">
              Banco de Dados (AlloyDB / PostgreSQL)
            </span>
            <span className="text-xs text-stone-500">Transações ACID & Fail-Closed</span>
          </div>
          {renderStatusBadge(services.database)}
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <span className="block text-sm font-medium text-stone-200">
              CDN Google Drive
            </span>
            <span className="text-xs text-stone-500">Entrega de imagens em alta resolução</span>
          </div>
          {renderStatusBadge(services.cdn)}
        </div>
      </div>
    </div>
  );
};
