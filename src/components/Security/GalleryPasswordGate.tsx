import { useState } from 'react';
import type { GalleryCollection } from '../../types/gallery';
import { verifyClientAccess, setClientSession } from '../../lib/collectionSettings';

interface GalleryPasswordGateProps {
  collection: GalleryCollection;
  onUnlocked: () => void | Promise<void>;
  onOpenAdmin?: () => void;
  requiresEmail?: boolean;
  onAuthenticate?: (password: string, email?: string) => Promise<void>;
}

export function GalleryPasswordGate({
  collection,
  onUnlocked,
  onOpenAdmin,
  requiresEmail: requiresEmailProp,
  onAuthenticate,
}: GalleryPasswordGateProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverSrc =
    collection.cover.sources[1]?.url ||
    collection.cover.sources[0]?.url ||
    '';

  const requiresEmail = requiresEmailProp ?? Boolean(
    collection.clientEmail || (collection.clientEmails && collection.clientEmails.length > 0),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await onUnlocked();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Acesso negado. Verifique os dados informados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050A0D] text-[#f5f5f4] overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {/* Imagem de Capa com Desfoque Profundo */}
      {coverSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${coverSrc})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradiente Vinheta Escuro */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#050A0D]/90 via-[#050A0D]/80 to-[#050A0D] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-[#0c1015]/90 border border-white/10 shadow-2xl backdrop-blur-md">
        {/* Marca & Identidade */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#5E7F8C] uppercase block mb-1">
            VERSA VISUAL • GALERIA PRIVADA
          </span>
          <h1 id="gate-title" className="text-2xl font-bold tracking-tight text-white font-['Outfit']">
            {collection.title}
          </h1>
          <p className="text-xs text-white/60 mt-2 font-['DM_Sans']">
            Esta coleção é protegida por senha. Digite as credenciais fornecidas pelo estúdio para
            acessar as fotografias.
          </p>
        </div>

        {/* Formulário de Acesso */}
        <form onSubmit={handleSubmit} className="space-y-4 font-['DM_Sans']">
          {requiresEmail && (
            <div>
              <label htmlFor="gate-email" className="block text-xs font-medium text-white/80 mb-1.5">
                E-mail cadastrado
              </label>
              <input
                id="gate-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@cliente.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="gate-password" className="block text-xs font-medium text-white/80">
                Senha de acesso
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors"
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
              />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2"
              role="alert"
            >
              <span className="text-red-400 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-[#5E7F8C]/20 disabled:opacity-50 flex items-center justify-center gap-2"
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

        {/* Rodapé do Gate */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <a
            href="https://instagram.com/v1ncsc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
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

