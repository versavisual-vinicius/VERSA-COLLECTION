import { EDITORIAL_STYLES, type EditorialStyleId } from '../../types/culling';

interface StylePresetPanelProps {
  isOpen: boolean;
  activeStyleId: EditorialStyleId;
  previewImageUrl?: string;
  onSelectStyle: (styleId: EditorialStyleId) => void;
  onClose: () => void;
}

export function StylePresetPanel({
  isOpen,
  activeStyleId,
  previewImageUrl,
  onSelectStyle,
  onClose,
}: StylePresetPanelProps) {
  if (!isOpen) return null;

  const sampleImg =
    previewImageUrl ||
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80';

  return (
    <aside
      className="w-80 bg-[#070e12] border-l border-white/10 flex flex-col shrink-0 select-none z-30 shadow-2xl font-dm-sans"
      data-testid="style-preset-panel"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-widest uppercase text-[#5E7F8C] font-outfit font-semibold">
            Versa Styles
          </span>
          <h3 className="text-sm font-outfit font-bold text-white">Estilos Editoriais de IA</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          data-testid="btn-close-styles"
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {EDITORIAL_STYLES.map((style) => {
          const isSelected = activeStyleId === style.id;
          return (
            <button
              type="button"
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              data-testid={`preset-style-${style.id}`}
              className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 items-center ${
                isSelected
                  ? 'bg-[#5E7F8C]/15 border-[#5E7F8C] ring-1 ring-[#5E7F8C] shadow-md'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img
                  src={sampleImg}
                  alt={style.name}
                  className="w-full h-full object-cover"
                  style={{ filter: style.cssFilter }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white font-outfit flex items-center justify-between">
                  <span>{style.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#5E7F8C]" />}
                </div>
                <p className="text-[11px] text-white/60 leading-tight mt-0.5 line-clamp-2">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
