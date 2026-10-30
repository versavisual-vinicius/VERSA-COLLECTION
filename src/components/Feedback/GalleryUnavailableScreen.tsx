interface GalleryUnavailableScreenProps {
  message?: string | null;
  onRetry?: () => void;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

/**
 * GalleryUnavailableScreen (RF-001 & Seção 9 — state: 'unavailable')
 * Exibido quando ocorre falha de comunicação com o servidor (HTTP 500/503) ou timeout.
 */
export function GalleryUnavailableScreen({
  message,
  onRetry,
  onGoHome,
  onOpenAdmin,
}: GalleryUnavailableScreenProps) {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#F6F8F9] text-[#11161B] px-4 py-12 select-none relative overflow-hidden"
      role="alert"
      aria-labelledby="unavailable-title"
      data-testid="gallery-unavailable-screen"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-white border border-[#5E7F8C]/15 shadow-xl text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-[#5E7F8C] mb-2 font-semibold">
          Versa Visual · Status do Servidor
        </p>

        <h1
          id="unavailable-title"
          className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-[#11161B] mb-3"
        >
          Serviço temporariamente indisponível
        </h1>

        <div className="w-8 h-0.5 bg-[#5E7F8C] mx-auto mb-6 rounded-full" />

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#5A6872] leading-relaxed mb-6">
          {message ||
            'Não foi possível conectar ao servidor de galerias neste instante. Isso pode ocorrer por oscilação momentânea da rede.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Tentar carregar novamente
            </button>
          )}

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Ir para a página inicial
          </button>
        </div>

        {onOpenAdmin && (
          <div className="mt-6 pt-5 border-t border-[#5E7F8C]/15">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[11px] uppercase tracking-widest text-[#5A6872] hover:text-[#11161B] transition-colors"
            >
              Acesso do Fotógrafo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

