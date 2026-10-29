import type { GalleryPhoto } from '../../types/gallery';
import type { CullingRecord, CullingFlag } from '../../types/culling';

interface CullingCanvasProps {
  photo: GalleryPhoto | null;
  cullingRecord?: CullingRecord;
  activeStyleFilter?: string;
  onSetRating: (rating: number) => void;
  onSetFlag: (flag: CullingFlag) => void;
}

export function CullingCanvas({
  photo,
  cullingRecord,
  activeStyleFilter = 'none',
  onSetRating,
  onSetFlag,
}: CullingCanvasProps) {
  if (!photo) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white/40 font-dm-sans"
        data-testid="culling-canvas-empty"
      >
        <svg className="w-12 h-12 mb-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">Nenhuma foto selecionada para triagem.</p>
      </div>
    );
  }

  const currentFlag = cullingRecord?.flag || 'none';
  const currentRating = cullingRecord?.rating || 0;
  const bestSrc = photo.sources?.[0]?.url || photo.shareUrl;

  return (
    <div
      className="relative flex-1 flex flex-col items-center justify-center bg-[#050A0D] overflow-hidden select-none p-4"
      data-testid="culling-canvas"
    >
      {/* Contêiner da Imagem com Aspect Ratio Nativo */}
      <div className="relative max-w-full max-h-[calc(100vh-230px)] flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-white/10 group">
        <img
          src={bestSrc}
          alt={photo.alt || photo.fileName}
          className="max-h-[calc(100vh-240px)] w-auto object-contain transition-all duration-200"
          style={{
            filter: activeStyleFilter,
            objectPosition: photo.focalPoint ? `${photo.focalPoint.x}% ${photo.focalPoint.y}%` : 'center',
          }}
          data-testid="culling-canvas-image"
        />

        {/* Selo Visual de Culling no Topo Esquerdo */}
        {currentFlag === 'pick' && (
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/90 text-white font-outfit text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm"
            data-testid="badge-culling-pick"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span>Escolhida (P)</span>
          </div>
        )}

        {currentFlag === 'reject' && (
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600/90 text-white font-outfit text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm"
            data-testid="badge-culling-reject"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Rejeitada (X)</span>
          </div>
        )}

        {/* Estrelas no Topo Direito */}
        {currentRating > 0 && (
          <div
            className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-black/75 text-amber-400 shadow-lg backdrop-blur-sm"
            data-testid="badge-culling-rating"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < currentRating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
      </div>

      {/* Barra de Ações Rápidas de Triagem Flutuante */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg font-dm-sans text-xs">
        {/* Flags P / U / X */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSetFlag('pick')}
            data-testid="btn-flag-pick"
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
              currentFlag === 'pick'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Marcar como Escolhida (Atalho: P)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Pick (P)</span>
          </button>

          <button
            type="button"
            onClick={() => onSetFlag('none')}
            data-testid="btn-flag-unflag"
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              currentFlag === 'none'
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title="Remover marcação (Atalho: U)"
          >
            Unflag (U)
          </button>

          <button
            type="button"
            onClick={() => onSetFlag('reject')}
            data-testid="btn-flag-reject"
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
              currentFlag === 'reject'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Marcar como Rejeitada (Atalho: X)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Reject (X)</span>
          </button>
        </div>

        <div className="h-4 w-px bg-white/15" />

        {/* Avaliação em Estrelas (0-5) */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onSetRating(currentRating === star ? 0 : star)}
              data-testid={`btn-star-${star}`}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title={`Atribuir ${star} estrelas (Atalho: ${star})`}
            >
              <svg
                className={`w-4 h-4 ${
                  star <= currentRating ? 'text-amber-400 fill-amber-400' : 'text-white/25 hover:text-white/60'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {currentRating > 0 && (
            <button
              type="button"
              onClick={() => onSetRating(0)}
              className="ml-1 text-[11px] text-white/40 hover:text-white/70"
              title="Limpar estrelas (Atalho: 0)"
            >
              (0)
            </button>
          )}
        </div>

        <div className="h-4 w-px bg-white/15" />

        {/* Metadados da Imagem */}
        <div className="text-[11px] text-white/50 font-mono truncate max-w-[200px]">
          {photo.fileName} ({photo.width}×{photo.height})
        </div>
      </div>
    </div>
  );
}
