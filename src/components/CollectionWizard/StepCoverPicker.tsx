import { useState } from 'react';
import { CoverFocalPicker } from '../Admin/CoverFocalPicker';

export interface CoverPickerData {
  coverUrl: string;
  coverFocalPoint: { x: number; y: number };
}

interface StepCoverPickerProps {
  collectionTitle: string;
  initialData: CoverPickerData;
  onNext: (data: CoverPickerData) => void;
  onBack: () => void;
}

const PRESET_COVERS = [
  {
    label: 'Noiva Clássica',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=2400&q=80',
    defaultFocal: { x: 50, y: 28 },
  },
  {
    label: 'Retrato Editorial',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=80',
    defaultFocal: { x: 50, y: 35 },
  },
  {
    label: 'Cena ao Ar Livre',
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=2400&q=80',
    defaultFocal: { x: 50, y: 40 },
  },
  {
    label: 'Preto & Branco Minimalista',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=80',
    defaultFocal: { x: 50, y: 30 },
  },
];

export function StepCoverPicker({
  collectionTitle,
  initialData,
  onNext,
  onBack,
}: StepCoverPickerProps) {
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || PRESET_COVERS[0].url);
  const [focalPoint, setFocalPoint] = useState(initialData.coverFocalPoint || PRESET_COVERS[0].defaultFocal);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleSelectPreset = (preset: (typeof PRESET_COVERS)[0]) => {
    setCoverUrl(preset.url);
    setFocalPoint(preset.defaultFocal);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setCoverUrl(customUrlInput.trim());
      setFocalPoint({ x: 50, y: 50 });
      setCustomUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      coverUrl,
      coverFocalPoint: focalPoint,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="step-cover-picker">
      <div>
        <h3 className="font-outfit text-xl font-semibold text-white tracking-tight">
          2. Capa Editorial & Ponto Focal
        </h3>
        <p className="font-dm-sans text-sm text-white/60 mt-1">
          A foto de abertura é a primeira impressão da galeria. Escolha uma imagem e posicione o foco central.
        </p>
      </div>

      {/* Galeria de Presets Rápidos */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-2 font-dm-sans">
          Capas Editoriais Sugeridas
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_COVERS.map((preset) => {
            const isSelected = coverUrl === preset.url;
            return (
              <button
                type="button"
                key={preset.label}
                onClick={() => handleSelectPreset(preset)}
                data-testid={`preset-cover-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`group relative rounded-lg overflow-hidden border aspect-[4/3] text-left transition-all ${
                  isSelected
                    ? 'border-[#5E7F8C] ring-2 ring-[#5E7F8C]/50 shadow-md'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/25'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-medium text-white font-dm-sans truncate">
                    {preset.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input de URL personalizada */}
      <div className="pt-1">
        <label htmlFor="custom-cover-url" className="block text-xs font-medium text-white/80 mb-1.5 font-dm-sans">
          Ou informe uma URL de imagem externa
        </label>
        <div className="flex gap-2">
          <input
            id="custom-cover-url"
            data-testid="input-custom-cover-url"
            type="url"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            placeholder="https://exemplo.com/minha-capa.jpg"
            className="flex-1 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all font-dm-sans"
          />
          <button
            type="button"
            onClick={handleApplyCustomUrl}
            disabled={!customUrlInput.trim()}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-medium text-white font-dm-sans transition-all"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Calibração do Ponto Focal */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
        <CoverFocalPicker
          coverUrl={coverUrl}
          focalPoint={focalPoint}
          onChange={setFocalPoint}
        />

        {/* Pré-visualização com tipografia editorial */}
        <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-white/10 shadow-lg">
          <img
            src={coverUrl}
            alt="Preview editorial"
            className="w-full h-full object-cover"
            style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
          />
          <div
            className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
            style={{
              background:
                'linear-gradient(transparent 0%, transparent 10%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)',
            }}
          >
            <span className="text-[10px] tracking-widest uppercase text-white/60 font-outfit">
              Versa Visual · @v1ncsc
            </span>
            <h4 className="text-sm sm:text-base font-outfit font-bold text-white truncate drop-shadow-md">
              {collectionTitle || 'Nome da Coleção'}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          data-testid="btn-back-step-2"
          className="px-4 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-colors"
        >
          Voltar aos Detalhes
        </button>

        <button
          type="submit"
          data-testid="btn-next-step-2"
          className="px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 bg-[#5E7F8C] text-white hover:bg-[#6c8f9d] shadow-lg shadow-[#5E7F8C]/20 transition-all"
        >
          <span>Avançar para Layout</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
