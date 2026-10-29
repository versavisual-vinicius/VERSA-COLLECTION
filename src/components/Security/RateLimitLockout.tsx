import { useEffect, useState } from 'react';

interface RateLimitLockoutProps {
  collectionTitle: string;
  initialRemainingSeconds?: number;
  onLockoutExpired?: () => void;
}

/**
 * RateLimitLockout (Seção 7 & RF-001 — Proteção contra força bruta HTTP 429 / 5 falhas em 15 min)
 * Exibe bloqueio visual com temporizador regressivo de 15 minutos após excesso de tentativas.
 */
export function RateLimitLockout({
  collectionTitle,
  initialRemainingSeconds = 15 * 60,
  onLockoutExpired,
}: RateLimitLockoutProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemainingSeconds);

  useEffect(() => {
    setRemainingSeconds(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onLockoutExpired?.();
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onLockoutExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds, onLockoutExpired]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center space-y-4 font-['DM_Sans']"
      role="alert"
      data-testid="rate-limit-lockout"
    >
      <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto">
        <svg
          className="w-5 h-5 text-amber-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div>
        <h2 className="font-['Outfit'] text-base font-bold text-amber-200 uppercase tracking-wider">
          Acesso Temporariamente Bloqueado
        </h2>
        <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
          Por segurança e proteção de privacidade do acervo, novas tentativas de senha foram pausadas após 5 tentativas sem sucesso.
        </p>
      </div>

      <div className="py-2.5 px-4 rounded-lg bg-black/50 border border-white/10 inline-block">
        <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
          Novas tentativas liberadas em
        </span>
        <span
          className="font-mono text-xl font-bold text-amber-300 tracking-wider"
          data-testid="lockout-countdown"
        >
          {formattedTimer}
        </span>
      </div>

      <div className="pt-1">
        <a
          href={`https://api.whatsapp.com/send?phone=5522998634563&text=${encodeURIComponent(
            `Olá, Vinicius! Precisei de ajuda com a senha de acesso da galeria "${collectionTitle}".`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-semibold text-[#5E7F8C] hover:text-white underline underline-offset-4 transition-colors"
        >
          Esqueceu a senha? Solicite ajuda no WhatsApp
        </a>
      </div>
    </div>
  );
}

