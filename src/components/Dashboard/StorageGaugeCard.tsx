import React from 'react';
import type { AdminMetrics } from '../../types/gallery';

interface StorageGaugeCardProps {
  metrics: AdminMetrics | null;
  loading?: boolean;
}

export const StorageGaugeCard: React.FC<StorageGaugeCardProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="rounded-xl border border-stone-800 bg-[#0d1418]/60 p-6 backdrop-blur-md animate-pulse">
        <div className="h-4 w-32 bg-stone-800 rounded mb-4" />
        <div className="h-8 w-48 bg-stone-800 rounded mb-6" />
        <div className="h-3 w-full bg-stone-800 rounded mb-4" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-10 bg-stone-800 rounded" />
          <div className="h-10 bg-stone-800 rounded" />
          <div className="h-10 bg-stone-800 rounded" />
        </div>
      </div>
    );
  }

  const usedGb = (metrics.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const totalGb = Math.round(metrics.storageLimitBytes / (1024 * 1024 * 1024));

  return (
    <div
      data-testid="storage-gauge-card"
      className="rounded-xl border border-stone-800 bg-[#0d1418]/80 p-6 shadow-2xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#5E7F8C]">
            Armazenamento & Nuvem
          </span>
          <h3 className="font-heading text-xl font-bold text-stone-100 mt-1">
            Plano Profissional Versa
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#5E7F8C]/10 px-3 py-1 text-xs font-medium text-[#5E7F8C] border border-[#5E7F8C]/30">
          {metrics.storagePercentage}% Utilizado
        </span>
      </div>

      <div className="my-4">
        <div className="flex justify-between text-sm text-stone-400 mb-2 font-mono">
          <span>{usedGb} GB consumidos</span>
          <span>{totalGb} GB disponíveis</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-stone-900 border border-stone-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5E7F8C] to-teal-400 transition-all duration-700"
            style={{ width: `${Math.max(2, metrics.storagePercentage)}%` }}
            role="progressbar"
            aria-valuenow={metrics.storagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Armazenamento consumido"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stone-800/80 pt-5 text-center">
        <div>
          <span className="block text-2xl font-heading font-extrabold text-stone-100">
            {metrics.totalCollections}
          </span>
          <span className="text-xs text-stone-400 font-medium">Coleções</span>
        </div>
        <div className="border-x border-stone-800/80 px-2">
          <span className="block text-2xl font-heading font-extrabold text-stone-100">
            {metrics.totalPhotos}
          </span>
          <span className="text-xs text-stone-400 font-medium">Fotografias</span>
        </div>
        <div>
          <span className="block text-2xl font-heading font-extrabold text-stone-100">
            {metrics.totalExports}
          </span>
          <span className="text-xs text-stone-400 font-medium">Exportações</span>
        </div>
      </div>
    </div>
  );
};
