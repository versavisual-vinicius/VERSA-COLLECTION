interface PhotographerEmptyStateProps {
  onOpenAdmin?: () => void;
}

/**
 * PhotographerEmptyState
 * Exibido na página inicial pública do fotógrafo (/) quando não há coleções públicas ativas.
 */
export function PhotographerEmptyState({ onOpenAdmin }: PhotographerEmptyStateProps) {
  return (
    <div
      className="w-full py-20 px-6 rounded-2xl bg-white border border-[#5E7F8C]/15 flex flex-col items-center justify-center text-center select-none shadow-sm"
      role="status"
      data-testid="photographer-empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-[#5E7F8C]/10 border border-[#5E7F8C]/20 flex items-center justify-center mb-6">
        <svg
          className="w-7 h-7 text-[#5E7F8C]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-[#5E7F8C] mb-2 font-semibold">
        Curadoria Editorial
      </p>

      <h3 className="font-['Outfit'] text-2xl font-bold text-[#11161B] mb-3">
        Novas entregas em preparação
      </h3>

      <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#5A6872] max-w-md mb-8 leading-relaxed">
        No momento não há galerias públicas listadas no catálogo aberto. Se você recebeu um link exclusivo com senha, acesse diretamente pelo endereço enviado no seu WhatsApp.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="https://api.whatsapp.com/send?phone=5522998634563&text=Ol%C3%A1%2C%20Vinicius!%20Gostaria%20de%20solicitar%20o%20link%20da%20minha%20galeria."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          Solicitar link no WhatsApp
        </a>

        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-5 py-2.5 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Painel do Fotógrafo
          </button>
        )}
      </div>
    </div>
  );
}

