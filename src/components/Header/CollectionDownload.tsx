import React from 'react';

interface CollectionDownloadProps {
  onOpenDownload: () => void;
  enabled?: boolean;
}

export function CollectionDownload({ onOpenDownload, enabled = true }: CollectionDownloadProps) {
  if (!enabled) return null;

  return (
    <button
      type="button"
      className="header-action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-xs"
      onClick={onOpenDownload}
      aria-label="Baixar fotografias da coleção"
    >
      <span aria-hidden="true">↓</span>
      <span>Download</span>
    </button>
  );
}
