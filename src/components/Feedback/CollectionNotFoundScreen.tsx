interface CollectionNotFoundScreenProps {
  slug?: string;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

/**
 * CollectionNotFoundScreen (RF-001 & Seção 9 — state: 'not-found')
 * Exibido quando o collectionSlug informado na rota não existe no acervo ou retorna HTTP 404.
 * Design editorial Versa Visual (#050A0D, acento #5E7F8C, Outfit + DM Sans).
 */
export function CollectionNotFoundScreen({
  slug,
  onGoHome,
  onOpenAdmin,
}: CollectionNotFoundScreenProps) {
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
      aria-labelledby="not-found-title"
      data-testid="collection-not-found-screen"
    >
      {/* Brilho sutil de fundo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#5E7F8C]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-white border border-[#5E7F8C]/15 shadow-xl text-center">
        <div className="w-14 h-14 rounded-full bg-[#5E7F8C]/10 border border-[#5E7F8C]/20 flex items-center justify-center mx-auto mb-6">
          <span className="font-['Outfit'] text-lg font-extrabold text-[#5E7F8C]">404</span>
        </div>

        <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-[#5E7F8C] mb-2 font-semibold">
          Versa Visual · Acervo Digital
        </p>

        <h1
          id="not-found-title"
          className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-[#11161B] mb-3"
        >
          Galeria não encontrada
        </h1>

        <div className="w-8 h-0.5 bg-[#5E7F8C] mx-auto mb-6 rounded-full" />

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#5A6872] leading-relaxed mb-6">
          O endereço acessado{slug ? ` ("${slug}")` : ''} não corresponde a nenhuma coleção ativa ou o link de entrega foi atualizado. Verifique se o link foi copiado integralmente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            Ir para a página inicial
          </button>

          <a
            href={`https://api.whatsapp.com/send?phone=5522998634563&text=${encodeURIComponent(
              `Olá, Vinicius! Tentei acessar a galeria${slug ? ` "${slug}"` : ''}, mas o link informou que não foi encontrada.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors text-center shadow-xs"
          >
            Falar com o fotógrafo
          </a>
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

