
interface CollectionDownloadProps {
  onOpenDownload: () => void;
  enabled?: boolean;
}

export function CollectionDownload({ onOpenDownload, enabled = true }: CollectionDownloadProps) {
  if (!enabled) return null;

  return (
    <button
      type="button"
      className="header-action-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] transition-colors text-xs font-medium shadow-xs"
      onClick={onOpenDownload}
      aria-label="Baixar fotografias da coleção"
    >
      <span aria-hidden="true" className="text-[#5E7F8C]">↓</span>
      <span>Download</span>
    </button>
  );
}
