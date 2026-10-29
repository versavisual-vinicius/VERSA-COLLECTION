import { useState, useMemo, useCallback, useEffect } from 'react';
import { availableCollections, getCollectionData } from '../../data/collectionsRegistry';
import { useCullingHotkeys } from '../../hooks/useCullingHotkeys';
import {
  loadCullingState,
  updatePhotoCulling,
  generateCullingReport,
} from '../../lib/cullingStorage';
import { CullingToolbar, type CullingFilterType } from './CullingToolbar';
import { CullingCanvas } from './CullingCanvas';
import { FilmstripBar } from './FilmstripBar';
import { StylePresetPanel } from './StylePresetPanel';
import { EDITORIAL_STYLES, type CullingFlag, type EditorialStyleId } from '../../types/culling';

export interface PhotoEditorPageProps {
  initialSlug?: string;
  onNavigateHome?: () => void;
  onNavigateDashboard?: () => void;
}

export function PhotoEditorPage({
  initialSlug,
  onNavigateHome,
  onNavigateDashboard,
}: PhotoEditorPageProps) {
  const collectionKeys = Object.keys(availableCollections);
  const defaultSlug =
    initialSlug && availableCollections[initialSlug]
      ? initialSlug
      : collectionKeys[0] || 'modec-dia-das-criancas-2026';

  const [currentSlug, setCurrentSlug] = useState(defaultSlug);
  const collectionData = useMemo(() => getCollectionData(currentSlug), [currentSlug]);

  const allPhotos = collectionData.photos || [];

  // Estado de Culling persistido no LocalStorage
  const [cullingState, setCullingState] = useState(() => loadCullingState(currentSlug));

  useEffect(() => {
    setCullingState(loadCullingState(currentSlug));
    setActivePhotoIndex(0);
  }, [currentSlug]);

  // Filtros de Culling
  const [activeFilter, setActiveFilter] = useState<CullingFilterType>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Painel de Estilos
  const [isStylesOpen, setIsStylesOpen] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState<EditorialStyleId>('none');

  // Modal de Exportação
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Filtragem das fotos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const record = cullingState[photo.id];
      const flag = record?.flag || 'none';
      const rating = record?.rating || 0;

      if (activeFilter === 'picks') return flag === 'pick';
      if (activeFilter === 'unrejected') return flag !== 'reject';
      if (activeFilter === 'rated') return rating > 0;
      return true;
    });
  }, [allPhotos, cullingState, activeFilter]);

  // Foto Ativa
  const safeIndex = Math.min(Math.max(0, activePhotoIndex), Math.max(0, filteredPhotos.length - 1));
  const activePhoto = filteredPhotos[safeIndex] || null;

  // Contadores
  const picksCount = useMemo(() => {
    return allPhotos.filter((p) => cullingState[p.id]?.flag === 'pick').length;
  }, [allPhotos, cullingState]);

  const rejectsCount = useMemo(() => {
    return allPhotos.filter((p) => cullingState[p.id]?.flag === 'reject').length;
  }, [allPhotos, cullingState]);

  // Handlers de Culling
  const handleSetFlag = useCallback(
    (flag: CullingFlag) => {
      if (!activePhoto) return;
      const nextState = updatePhotoCulling(currentSlug, cullingState, activePhoto.id, { flag });
      setCullingState(nextState);

      // Auto-advance suave para a próxima foto ao marcar Pick ou Reject
      if (flag !== 'none' && safeIndex < filteredPhotos.length - 1) {
        setActivePhotoIndex((prev) => prev + 1);
      }
    },
    [activePhoto, currentSlug, cullingState, safeIndex, filteredPhotos.length],
  );

  const handleSetRating = useCallback(
    (rating: number) => {
      if (!activePhoto) return;
      const nextState = updatePhotoCulling(currentSlug, cullingState, activePhoto.id, { rating });
      setCullingState(nextState);
    },
    [activePhoto, currentSlug, cullingState],
  );

  const handleNavigateNext = useCallback(() => {
    setActivePhotoIndex((prev) => Math.min(filteredPhotos.length - 1, prev + 1));
  }, [filteredPhotos.length]);

  const handleNavigatePrev = useCallback(() => {
    setActivePhotoIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Hotkeys Hook
  useCullingHotkeys({
    enabled: !isExportModalOpen,
    onSetFlag: handleSetFlag,
    onSetRating: handleSetRating,
    onNavigateNext: handleNavigateNext,
    onNavigatePrev: handleNavigatePrev,
  });

  const activeStylePreset = EDITORIAL_STYLES.find((s) => s.id === activeStyleId);

  const handleCopyFilenames = () => {
    const report = generateCullingReport(allPhotos, cullingState);
    const filenames = report.picks.map((p) => p.fileName).join(', ');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(filenames);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const collectionsList = useMemo(() => {
    return Object.entries(availableCollections).map(([slug, data]) => ({
      slug,
      title: data.collection?.title || slug,
    }));
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-[#050A0D] text-white overflow-hidden"
      data-testid="photo-editor-page"
    >
      {/* Barra de Ferramentas Superior */}
      <CullingToolbar
        collectionTitle={collectionData.collection.title}
        collectionsList={collectionsList}
        currentSlug={currentSlug}
        onSelectCollection={setCurrentSlug}
        activeFilter={activeFilter}
        onChangeFilter={(f) => {
          setActiveFilter(f);
          setActivePhotoIndex(0);
        }}
        totalCount={allPhotos.length}
        filteredCount={filteredPhotos.length}
        picksCount={picksCount}
        rejectsCount={rejectsCount}
        isStylesOpen={isStylesOpen}
        onToggleStyles={() => setIsStylesOpen((prev) => !prev)}
        onExportReport={() => setIsExportModalOpen(true)}
        onBackToHub={onNavigateDashboard || onNavigateHome || (() => {})}
      />

      {/* Área Central: Canvas de Culling + Painel Lateral de Estilos */}
      <div className="flex-1 flex min-h-0 relative">
        <CullingCanvas
          photo={activePhoto}
          cullingRecord={activePhoto ? cullingState[activePhoto.id] : undefined}
          activeStyleFilter={activeStylePreset?.cssFilter || 'none'}
          onSetRating={handleSetRating}
          onSetFlag={handleSetFlag}
        />

        <StylePresetPanel
          isOpen={isStylesOpen}
          activeStyleId={activeStyleId}
          previewImageUrl={activePhoto?.sources?.[0]?.url}
          onSelectStyle={setActiveStyleId}
          onClose={() => setIsStylesOpen(false)}
        />
      </div>

      {/* Filmstrip Inferior com Miniaturas */}
      <FilmstripBar
        photos={filteredPhotos}
        activeIndex={safeIndex}
        cullingState={cullingState}
        onSelectIndex={setActivePhotoIndex}
      />

      {/* Modal de Exportação da Seleção */}
      {isExportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          data-testid="culling-export-modal"
        >
          <div className="relative w-full max-w-md bg-[#050A0D] border border-white/10 rounded-2xl p-6 shadow-2xl font-dm-sans">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-outfit font-bold text-white">
                Exportar Relatório de Triagem
              </h3>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                data-testid="btn-close-export-modal"
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Total de fotos analisadas:</span>
                  <span className="font-semibold text-white">{allPhotos.length}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Fotos Escolhidas (Picks):</span>
                  <span className="font-semibold">{picksCount}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Fotos Rejeitadas (Rejects):</span>
                  <span className="font-semibold">{rejectsCount}</span>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed">
                Você pode copiar a lista de nomes dos arquivos aprovados para colar diretamente na barra de filtro do Adobe Lightroom Classic ou exportar os metadados.
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleCopyFilenames}
                data-testid="btn-copy-filenames"
                className="flex-1 px-4 py-2 rounded-lg bg-[#5E7F8C] hover:bg-[#6c8f9d] text-xs font-semibold text-white shadow-md transition-all"
              >
                {copyFeedback ? 'Copiado!' : 'Copiar Nomes (Lightroom)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
