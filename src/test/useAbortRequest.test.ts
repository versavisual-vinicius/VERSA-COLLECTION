import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAbortRequest } from '../hooks/useAbortRequest';

describe('Hook useAbortRequest (Pixieset Parity)', () => {
  it('deve gerar um novo AbortSignal ativo', () => {
    const { result } = renderHook(() => useAbortRequest());
    const signal = result.current.getSignal();

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal.aborted).toBe(false);
  });

  it('deve abortar automaticamente o sinal anterior ao invocar getSignal() novamente', () => {
    const { result } = renderHook(() => useAbortRequest());
    let signal1!: AbortSignal;
    let signal2!: AbortSignal;

    act(() => {
      signal1 = result.current.getSignal();
    });
    expect(signal1.aborted).toBe(false);

    act(() => {
      signal2 = result.current.getSignal();
    });

    expect(signal1.aborted).toBe(true);
    expect(signal2.aborted).toBe(false);
  });

  it('deve abortar o sinal ativo ao invocar abort() explicitamente', () => {
    const { result } = renderHook(() => useAbortRequest());
    let signal!: AbortSignal;

    act(() => {
      signal = result.current.getSignal();
      result.current.abort();
    });

    expect(signal.aborted).toBe(true);
  });

  it('deve identificar erros de cancelamento via isAbortedError', () => {
    const { result } = renderHook(() => useAbortRequest());

    const abortError = new DOMException('The user aborted a request.', 'AbortError');
    const genericError = new Error('Falha de rede');

    expect(result.current.isAbortedError(abortError)).toBe(true);
    expect(result.current.isAbortedError(genericError)).toBe(false);
    expect(result.current.isAbortedError(null)).toBe(false);
  });

  it('wrapAsync deve retornar null sem lançar exceção quando a operação for abortada', async () => {
    const { result } = renderHook(() => useAbortRequest());

    const pendingPromise = result.current.wrapAsync(async (signal) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Request aborted', 'AbortError'));
        });
      });
    });

    // Dispara nova busca, cancelando a anterior
    act(() => {
      result.current.getSignal();
    });

    const output = await pendingPromise;
    expect(output).toBeNull();
  });

  it('deve abortar o sinal ativo ao desmontar o componente', () => {
    const { result, unmount } = renderHook(() => useAbortRequest());
    let signal!: AbortSignal;

    act(() => {
      signal = result.current.getSignal();
    });

    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
