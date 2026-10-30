import type { GalleryCollection } from '../../types/gallery';

interface ExpiredCollectionScreenProps {
  collection: GalleryCollection;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

/**
 * ExpiredCollectionScreen
 * Renderizado quando uma galeria ultrapassa a data limite configurada em `expiresAt`.
 * Estética editorial sofisticada com preservação do branding Versa Visual.
 */
export function ExpiredCollectionScreen({ collection, onGoHome, onOpenAdmin }: ExpiredCollectionScreenProps) {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };
  const coverSrc =
    collection.cover?.sources?.[1]?.url ||
    collection.cover?.sources?.[0]?.url ||
    '';

  const formattedDate = collection.expiresAt
    ? new Date(collection.expiresAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F8F9] text-[#11161B] overflow-hidden select-none"
      role="alert"
      aria-labelledby="expired-title"
      data-testid="expired-collection-screen"
    >
      {/* Imagem de Capa com Desfoque Profundo */}
      {coverSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${coverSrc})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradiente Vinheta Claro */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#F6F8F9]/80 via-[#F6F8F9]/90 to-[#F6F8F9] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg mx-4 p-8 sm:p-10 rounded-2xl bg-white border border-[#5E7F8C]/15 shadow-xl text-center">
        {/* Marca & Identidade */}
        <div className="mb-6">
          <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-[#5E7F8C] mb-2 font-semibold">
            Versa Visual · Acervo Digital
          </p>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-[#11161B] mb-2">
            {collection.title}
          </h2>
          <div className="w-8 h-0.5 bg-[#5E7F8C] mx-auto mt-4 rounded-full" />
        </div>

        <div className="my-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p id="expired-title" className="text-xs uppercase tracking-wider text-amber-800 font-semibold mb-1">
            Prazo de Exibição Encerrado
          </p>
          {formattedDate && (
            <p className="text-[11px] text-[#5A6872]">
              Disponibilidade finalizada em {formattedDate}
            </p>
          )}
        </div>

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#5A6872] leading-relaxed mb-8">
          Esta entrega fotográfica alcançou a data limite de hospedagem online. Para solicitar a reativação do link, estender o prazo ou requisitar um novo envio das fotografias em alta resolução, fale diretamente com o fotógrafo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=5522998634563&text=${encodeURIComponent(
              `Olá, Vinicius! Gostaria de consultar sobre a reativação da galeria "${collection.title}".`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm text-center"
          >
            Falar no WhatsApp
          </a>

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Ir para a página inicial
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#5A6872] hover:text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Acesso do Fotógrafo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
