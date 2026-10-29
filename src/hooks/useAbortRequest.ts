import { useCallback, useEffect, useRef } from 'react';

export interface UseAbortRequestReturn {
  getSignal: () => AbortSignal;
  abort: () => void;
  isAbortedError: (err: unknown) => boolean;
  wrapAsync: <T>(fn: (signal: AbortSignal) => Promise<T>) => Promise<T | null>;
}

/**
 * Hook de cancelamento resiliente de requisições concorrentes.
 * Paridade com o padrão `useAbortRequest` da Pixieset Photo Library.
 */
export function useAbortRequest(): UseAbortRequestReturn {
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  const getSignal = useCallback(() => {
    // Aborta qualquer requisição anterior que ainda esteja em trânsito
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const next = new AbortController();
    controllerRef.current = next;
    return next.signal;
  }, []);

  const isAbortedError = useCallback((err: unknown): boolean => {
    if (!err) return false;
    if (err instanceof DOMException && err.name === 'AbortError') return true;
    if (err instanceof Error && err.name === 'AbortError') return true;
    return false;
  }, []);

  const wrapAsync = useCallback(
    async <T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T | null> => {
      const signal = getSignal();
      try {
        const result = await fn(signal);
        return result;
      } catch (err) {
        if (isAbortedError(err)) {
          return null;
        }
        throw err;
      }
    },
    [getSignal, isAbortedError],
  );

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

  return {
    getSignal,
    abort,
    isAbortedError,
    wrapAsync,
  };
}
