import { useState } from 'react';

export interface LayoutPresetData {
  layoutPreset: 'masonry' | 'justified';
  visibility: 'public' | 'password';
  password?: string;
  seedDemoPhotos: boolean;
}

interface StepLayoutPresetProps {
  initialData: LayoutPresetData;
  summary: {
    title: string;
    slug: string;
    coverUrl: string;
  };
  isLoading: boolean;
  onFinish: (data: LayoutPresetData) => void;
  onBack: () => void;
}

export function StepLayoutPreset({
  initialData,
  summary,
  isLoading,
  onFinish,
  onBack,
}: StepLayoutPresetProps) {
  const [layoutPreset, setLayoutPreset] = useState<'masonry' | 'justified'>(
    initialData.layoutPreset || 'masonry',
  );
  const [visibility, setVisibility] = useState<'public' | 'password'>(
    initialData.visibility || 'public',
  );
  const [password, setPassword] = useState(initialData.password || '');
  const [seedDemoPhotos, setSeedDemoPhotos] = useState(
    initialData.seedDemoPhotos !== undefined ? initialData.seedDemoPhotos : true,
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visibility === 'password') {
      if (!password || password.trim().length < 4) {
        setPasswordError('A senha de acesso deve ter pelo menos 4 caracteres.');
        return;
      }
    }
    setPasswordError(null);
    onFinish({
      layoutPreset,
      visibility,
      password: visibility === 'password' ? password.trim() : undefined,
      seedDemoPhotos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="step-layout-preset">
      <div>
        <h3 className="font-outfit text-xl font-semibold text-white tracking-tight">
          3. Layout, Privacidade & Inicialização
        </h3>
        <p className="font-dm-sans text-sm text-white/60 mt-1">
          Escolha a disposição visual das fotografias e defina se a galeria será pública ou com senha.
        </p>
      </div>

      {passwordError && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-dm-sans"
        >
          {passwordError}
        </div>
      )}

      {/* Preset de Grade */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-2 font-dm-sans">
          Estilo de Grade (Grid Preset)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-dm-sans">
          <label
            data-testid="preset-grid-masonry"
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              layoutPreset === 'masonry'
                ? 'bg-[#5E7F8C]/15 border-[#5E7F8C] ring-1 ring-[#5E7F8C]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name="layoutPreset"
              checked={layoutPreset === 'masonry'}
              onChange={() => setLayoutPreset('masonry')}
              className="mt-1 accent-[#5E7F8C]"
            />
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Masonry Editorial</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5E7F8C]/30 text-[#8cb2bf] font-medium">
                  Recomendado
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                Cálculo balanceado determinístico com colunas dinâmicas (4 desktop / 2 mobile), preservando a proporção de cada fotografia.
              </p>
            </div>
          </label>

          <label
            data-testid="preset-grid-justified"
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              layoutPreset === 'justified'
                ? 'bg-[#5E7F8C]/15 border-[#5E7F8C] ring-1 ring-[#5E7F8C]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name="layoutPreset"
              checked={layoutPreset === 'justified'}
              onChange={() => setLayoutPreset('justified')}
              className="mt-1 accent-[#5E7F8C]"
            />
            <div>
              <div className="text-xs font-semibold text-white">Linhas Justificadas</div>
              <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                Fileiras horizontais com alturas padronizadas e recorte adaptativo para alinhamento uniforme.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Privacidade */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-2 font-dm-sans">
          Controle de Acesso
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-dm-sans">
          <label
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              visibility === 'public'
                ? 'bg-[#5E7F8C]/15 border-[#5E7F8C] ring-1 ring-[#5E7F8C]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name="visibility"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
              className="mt-1 accent-[#5E7F8C]"
            />
            <div>
              <div className="text-xs font-semibold text-white">Pública</div>
              <p className="text-[11px] text-white/60 mt-0.5">
                Visível no catálogo do estúdio e acessível diretamente por link.
              </p>
            </div>
          </label>

          <label
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              visibility === 'password'
                ? 'bg-[#5E7F8C]/15 border-[#5E7F8C] ring-1 ring-[#5E7F8C]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name="visibility"
              checked={visibility === 'password'}
              onChange={() => setVisibility('password')}
              className="mt-1 accent-[#5E7F8C]"
            />
            <div>
              <div className="text-xs font-semibold text-white">Protegida por Senha</div>
              <p className="text-[11px] text-white/60 mt-0.5">
                Exige senha alfanumérica para liberar a visualização das fotos.
              </p>
            </div>
          </label>
        </div>

        {visibility === 'password' && (
          <div className="mt-3">
            <label htmlFor="collection-password" className="block text-xs font-medium text-white/80 mb-1 font-dm-sans">
              Senha de Acesso para o Cliente
            </label>
            <input
              id="collection-password"
              data-testid="input-collection-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha da galeria"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all font-dm-sans"
            />
          </div>
        )}
      </div>

      {/* Opção Onboarding: Criar com fotos de exemplo */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#5E7F8C]/20 to-transparent border border-[#5E7F8C]/30 flex items-start gap-3.5">
        <input
          id="seed-demo-photos"
          data-testid="checkbox-seed-demo"
          type="checkbox"
          checked={seedDemoPhotos}
          onChange={(e) => setSeedDemoPhotos(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-white/20 accent-[#5E7F8C] cursor-pointer"
        />
        <label htmlFor="seed-demo-photos" className="cursor-pointer">
          <div className="text-xs font-semibold text-white font-dm-sans flex items-center gap-1.5">
            <span>Comece com fotos de exemplo</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/80">
              Pixieset Onboarding Parity
            </span>
          </div>
          <p className="text-[11px] text-white/70 mt-1 leading-relaxed font-dm-sans">
            Injeta imediatamente 8 fotografias autorais em alta resolução na coleção criada para que você teste o Masonry, o Lightbox e os downloads sem precisar fazer uploads manuais.
          </p>
        </label>
      </div>

      {/* Resumo da Coleção */}
      <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center gap-3">
        <img
          src={summary.coverUrl}
          alt={summary.title}
          className="w-12 h-12 rounded object-cover border border-white/10"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white font-outfit truncate">{summary.title}</div>
          <div className="text-[11px] text-white/40 font-mono truncate">versavisual.com/g/{summary.slug}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          data-testid="btn-back-step-3"
          className="px-4 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-colors disabled:opacity-40"
        >
          Voltar para Capa
        </button>

        <button
          type="submit"
          disabled={isLoading}
          data-testid="btn-finish-wizard"
          className="px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 bg-[#5E7F8C] text-white hover:bg-[#6c8f9d] shadow-lg shadow-[#5E7F8C]/20 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Criando Coleção...</span>
            </>
          ) : (
            <>
              <span>Concluir & Criar Coleção</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
