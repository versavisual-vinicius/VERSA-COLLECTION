import { useState } from 'react';
import type { GalleryCollection } from '../../types/gallery';
import { verifyClientAccess, setClientSession } from '../../lib/collectionSettings';
import { BackendError } from '../../lib/backend';
import { RateLimitLockout } from './RateLimitLockout';

interface GalleryPasswordGateProps {
  collection: GalleryCollection;
  onUnlocked: () => void | Promise<void>;
  onOpenAdmin?: () => void;
  requiresEmail?: boolean;
  initialRateLimited?: boolean;
  onAuthenticate?: (password: string, email?: string) => Promise<void>;
}

export function GalleryPasswordGate({
  collection,
  onUnlocked,
  onOpenAdmin,
  requiresEmail: requiresEmailProp,
  initialRateLimited = false,
  onAuthenticate,
}: GalleryPasswordGateProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(initialRateLimited);

  const coverSrc =
    collection.cover?.sources?.[1]?.url ||
    collection.cover?.sources?.[0]?.url ||
    '';

  const requiresEmail = requiresEmailProp ?? Boolean(
    collection.clientEmail || (collection.clientEmails && collection.clientEmails.length > 0),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;
    setError(null);
    setIsSubmitting(true);

    try {
      if (onAuthenticate) {
        await onAuthenticate(password, requiresEmail ? email : undefined);
      } else {
        const result = verifyClientAccess(collection, password, requiresEmail ? email : undefined);
        if (!result.success) throw new Error(result.error || 'Acesso negado.');
        setClientSession(collection.id, email || undefined);
      }
      setFailedAttempts(0);
      await onUnlocked();
    } catch (reason) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (
        (reason instanceof BackendError && (reason.status === 429 || reason.code === 'RATE_LIMITED')) ||
        nextAttempts >= 5
      ) {
        setIsRateLimited(true);
        setError('Muitas tentativas. Aguarde 15 minutos.');
      } else {
        setError(reason instanceof Error ? reason.message : 'Acesso negado. Verifique os dados informados.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F8F9] text-[#11161B] overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
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

      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-white/95 border border-[#5E7F8C]/20 shadow-2xl backdrop-blur-md">
        {/* Marca & Identidade */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#5E7F8C] uppercase block mb-1">
            VERSA VISUAL • GALERIA PRIVADA
          </span>
          <h1 id="gate-title" className="text-2xl font-bold tracking-tight text-[#11161B] font-['Outfit']">
            {collection.title}
          </h1>
          <p className="text-xs text-[#5A6872] mt-2 font-['DM_Sans']">
            Esta coleção é protegida por senha. Digite as credenciais fornecidas pelo estúdio para
            acessar as fotografias.
          </p>
        </div>

        {/* Formulário de Acesso ou Bloqueio de Força Bruta */}
        {isRateLimited ? (
          <RateLimitLockout
            collectionTitle={collection.title}
            onLockoutExpired={() => {
              setIsRateLimited(false);
              setFailedAttempts(0);
              setError(null);
            }}
          />
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-['DM_Sans']">
          {requiresEmail && (
            <div>
              <label htmlFor="gate-email" className="block text-xs font-medium text-[#11161B]/80 mb-1.5">
                E-mail cadastrado
              </label>
              <input
                id="gate-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@cliente.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6F8F9] border border-[#5E7F8C]/20 text-[#11161B] text-xs outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="gate-password" className="block text-xs font-medium text-[#11161B]/80">
                Senha de acesso
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#5A6872] hover:text-[#11161B] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? 'Ocultar' : 'Exibir'}
              </button>
            </div>
            <div className="relative">
              <input
                id="gate-password"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha da galeria"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6F8F9] border border-[#5E7F8C]/20 text-[#11161B] text-xs outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
              />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-start gap-2"
              role="alert"
            >
              <span className="text-red-500 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#4d6d79] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <span>Entrar na Galeria</span>
            )}
          </button>
        </form>
        )}

        {/* Rodapé do Gate */}
        <div className="mt-6 pt-4 border-t border-[#5E7F8C]/15 flex items-center justify-between text-[11px] text-[#5A6872]">
          <a
            href="https://instagram.com/v1ncsc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#11161B] transition-colors"
          >
            Dúvidas? Fale com @v1ncsc
          </a>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-[#5E7F8C] transition-colors"
            >
              Acesso Fotógrafo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

