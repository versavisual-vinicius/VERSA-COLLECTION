import type { GalleryCollection } from '../../types/gallery';

interface ExpiredCollectionScreenProps {
  collection: GalleryCollection;
  onOpenAdmin?: () => void;
}

/**
 * ExpiredCollectionScreen
 * Renderizado quando uma galeria ultrapassa a data limite configurada em `expiresAt`.
 * Estética editorial sofisticada com preservação do branding Versa Visual.
 */
export function ExpiredCollectionScreen({ collection, onOpenAdmin }: ExpiredCollectionScreenProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050A0D] text-[#f5f5f4] overflow-hidden select-none"
      role="alert"
      aria-labelledby="expired-title"
      data-testid="expired-collection-screen"
    >
      {/* Imagem de Capa com Desfoque Profundo */}
      {coverSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${coverSrc})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradiente Vinheta Escuro */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#050A0D]/95 via-[#050A0D]/85 to-[#050A0D] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg mx-4 p-8 sm:p-10 rounded-2xl bg-[#0c1015]/90 border border-white/10 shadow-2xl backdrop-blur-md text-center">
        {/* Marca & Identidade */}
        <div className="mb-6">
          <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-white/50 mb-2">
            Versa Visual · Acervo Digital
          </p>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {collection.title}
          </h2>
          <div className="w-8 h-0.5 bg-[#5E7F8C] mx-auto mt-4 rounded-full" />
        </div>

        <div className="my-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p id="expired-title" className="text-xs uppercase tracking-wider text-amber-200/90 font-semibold mb-1">
            Prazo de Exibição Encerrado
          </p>
          {formattedDate && (
            <p className="text-[11px] text-white/50">
              Disponibilidade finalizada em {formattedDate}
            </p>
          )}
        </div>

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-white/70 leading-relaxed mb-8">
          Esta entrega fotográfica alcançou a data limite de hospedagem online. Para solicitar a reativação do link, estender o prazo ou requisitar um novo envio das fotografias em alta resolução, fale diretamente com o fotógrafo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=5522998634563&text=${encodeURIComponent(
              `Olá, Vinicius! Gostaria de consultar sobre a reativação da galeria "${collection.title}".`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#6f94a3] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-[#5E7F8C]/20 text-center"
          >
            Falar no WhatsApp
          </a>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-white/15 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Acesso do Fotógrafo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
