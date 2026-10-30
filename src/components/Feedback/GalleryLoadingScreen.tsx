interface GalleryLoadingScreenProps {
  title?: string;
}

/**
 * GalleryLoadingScreen (RF-001 & Seção 9 — state: 'loading-collection')
 * Splash editorial exibido durante o carregamento inicial dos metadados da coleção.
 */
export function GalleryLoadingScreen({ title }: GalleryLoadingScreenProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F6F8F9] text-[#11161B] px-6 select-none relative overflow-hidden"
      role="status"
      aria-live="polite"
      data-testid="gallery-loading-screen"
    >
      {/* Shimmer sutil de capa em 100dvh */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#5E7F8C]/[0.05] to-transparent animate-pulse pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Monograma Versa Visual */}
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#5E7F8C]/40 flex items-center justify-center mb-6 shadow-md">
          <span className="font-['Outfit'] text-xl font-extrabold tracking-widest text-[#5E7F8C]">
            VV
          </span>
        </div>

        <p className="eyebrow text-[10px] tracking-[0.45em] uppercase text-[#5E7F8C] mb-2 font-semibold">
          Versa Visual
        </p>

        <h2 className="font-['Outfit'] text-lg sm:text-xl font-semibold text-[#11161B] mb-2">
          {title || 'Carregando galeria…'}
        </h2>

        {title && (
          <p className="font-['DM_Sans'] text-xs text-[#5A6872] mb-4">
            Carregando galeria…
          </p>
        )}

        {/* Barra de progresso indeterminada editorial */}
        <div className="w-36 h-0.5 bg-black/10 rounded-full overflow-hidden mt-3">
          <div className="w-1/2 h-full bg-[#5E7F8C] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

