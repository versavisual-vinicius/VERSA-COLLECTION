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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F8F9] text-[#11161B] overflow-hidden select-none px-4"
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
        className="absolute inset-0 bg-gradient-to-b from-[#F6F8F9]/80 via-[#F6F8F9]/90 to-[#F6F8F9] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-white border border-[#5E7F8C]/15 shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-[#5E7F8C]/10 border border-[#5E7F8C]/20 flex items-center justify-center mx-auto mb-5">
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

        <p className="eyebrow text-[10px] tracking-[0.4em] uppercase text-[#5E7F8C] mb-2 font-semibold">
          Versa Visual · Privacidade do Acervo
        </p>

        <h1
          id="restricted-title"
          className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-[#11161B] mb-2"
        >
          {isClientOnly ? 'Acesso Restrito ao Cliente' : 'Galeria Oculta'}
        </h1>

        <p className="text-xs text-[#5E7F8C] font-semibold uppercase tracking-widest mb-4">
          {collection.title}
        </p>

        <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#5A6872] leading-relaxed mb-6">
          {isClientOnly
            ? 'Esta coleção é exclusiva para os contratantes cadastrados. Informe seu e-mail autorizado para liberar a visualização.'
            : 'Esta galeria encontra-se temporariamente recolhida pelo fotógrafo para curadoria ou manutenção de privacidade.'}
        </p>

        {isClientOnly && onAuthorizeEmail && (
          <form onSubmit={handleVerifyEmail} className="mb-6 space-y-3 text-left">
            <label htmlFor="restricted-email-input" className="block text-xs text-[#11161B]/80 font-medium">
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
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F6F8F9] border border-[#5E7F8C]/20 text-sm text-[#11161B] outline-none focus:border-[#5E7F8C]"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 rounded-xl bg-[#5E7F8C] hover:bg-[#4d6d79] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shadow-sm"
              >
                {isVerifying ? 'Validando…' : 'Liberar Acesso'}
              </button>
            </div>
            {errorMessage && (
              <p role="alert" className="text-xs text-red-600 mt-1">
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
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center shadow-sm"
          >
            Solicitar Liberação no WhatsApp
          </a>

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white/80 hover:bg-white text-[#11161B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Ir para a página inicial
          </button>
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

