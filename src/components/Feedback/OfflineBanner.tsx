import { useEffect, useState } from 'react';

interface OfflineBannerProps {
  isOfflineOverride?: boolean;
  onReconnected?: () => void;
}

/**
 * OfflineBanner (RF-010 & Resiliência de Rede)
 * Alerta discreto flutuante exibido quando o navegador perde conectividade (offline).
 */
export function OfflineBanner({ isOfflineOverride, onReconnected }: OfflineBannerProps) {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof isOfflineOverride === 'boolean') return isOfflineOverride;
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    if (typeof isOfflineOverride === 'boolean') {
      setIsOffline(isOfflineOverride);
      return;
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      onReconnected?.();
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isOfflineOverride, onReconnected]);

  if (!isOffline) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl px-4 py-3 rounded-xl bg-[#0c1015]/95 border border-amber-500/30 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs text-amber-100 select-none"
      role="status"
      aria-live="polite"
      data-testid="offline-banner"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <p className="font-['DM_Sans'] leading-snug">
        <strong className="font-semibold text-amber-300">Modo Offline:</strong> Você está sem conexão no momento. Fotos em cache e favoritos locais continuam funcionando e serão sincronizados ao reconectar.
      </p>
    </div>
  );
}

