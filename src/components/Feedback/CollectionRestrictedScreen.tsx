import { useState } from 'react';
import type { GalleryCollection } from '../../types/gallery';

interface CollectionRestrictedScreenProps {
  collection: GalleryCollection;
  onAuthorizeEmail?: (email: string) => boolean | Promise<boolean>;
  onGoHome?: () => void;
  onOpenAdmin?: () => void;
}

/**
 * CollectionRestrictedScreen (RF-001 — estado separado para coleção oculta / restrita)
 * Distingue restrição de privacidade (visibility: 'hidden' ou 'client-only') de erro 404.
 */
export function CollectionRestrictedScreen({
  collection,
  onAuthorizeEmail,
  onGoHome,
  onOpenAdmin,
}: CollectionRestrictedScreenProps) {
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const coverSrc =
    collection.cover?.sources?.[1]?.url ||
    collection.cover?.sources?.[0]?.url ||
    '';

  const isClientOnly = collection.visibility === 'client-only';

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !onAuthorizeEmail) return;
    setErrorMessage(null);
    setIsVerifying(true);
    try {
      const ok = await onAuthorizeEmail(emailInput.trim().toLowerCase());
      if (!ok) {
        setErrorMessage('Este e-mail não consta na lista de convidados autorizados desta coleção.');
      }
    } catch {
      setErrorMessage('Não foi possível validar o e-mail informado.');
    } finally {
      setIsVerifying(false);
    }
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050A0D] text-[#f5f5f4] overflow-hidden select-none px-4"
      role="alert"
      aria-labelledby="restricted-title"
      data-testid="collection-restricted-screen"
    >
      {coverSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${coverSrc})` }}
          aria-hidden="true"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-[#050A0D]/95 via-[#050A0D]/85 to-[#050A0D] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#0c1015]/90 border border-white/10 shadow-2xl backdrop-blur-md text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-5 h-5 text-[#5E7F8C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-white/50 mb-2">
          Versa Visual · Privacidade do Acervo
        </p>

        <h1
          id="restricted-title"
          className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
        >
          {isClientOnly ? 'Acesso Restrito ao Cliente' : 'Galeria Oculta'}
        </h1>

        <p className="text-xs text-[#5E7F8C] font-semibold uppercase tracking-widest mb-4">
          {collection.title}
        </p>

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
          {isClientOnly
            ? 'Esta coleção é exclusiva para os contratantes cadastrados. Informe seu e-mail autorizado para liberar a visualização.'
            : 'Esta galeria encontra-se temporariamente recolhida pelo fotógrafo para curadoria ou manutenção de privacidade.'}
        </p>

        {isClientOnly && onAuthorizeEmail && (
          <form onSubmit={handleVerifyEmail} className="mb-6 space-y-3 text-left">
            <label htmlFor="restricted-email-input" className="block text-xs text-white/70">
              E-mail autorizado do cliente
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="restricted-email-input"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="seu-email@exemplo.com"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white outline-none focus:border-[#5E7F8C]"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 rounded-xl bg-[#5E7F8C] hover:bg-[#6f94a3] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
              >
                {isVerifying ? 'Validando…' : 'Liberar Acesso'}
              </button>
            </div>
            {errorMessage && (
              <p role="alert" className="text-xs text-red-300 mt-1">
                {errorMessage}
              </p>
            )}
          </form>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=5522998634563&text=${encodeURIComponent(
              `Olá, Vinicius! Gostaria de solicitar autorização de acesso para a galeria "${collection.title}".`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center"
          >
            Solicitar Liberação no WhatsApp
          </a>

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-white/15 hover:bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Ir para a página inicial
          </button>
        </div>

        {onOpenAdmin && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[11px] uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors"
            >
              Acesso do Fotógrafo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

