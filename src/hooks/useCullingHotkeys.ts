import { useEffect } from 'react';
import type { CullingFlag } from '../types/culling';

interface UseCullingHotkeysOptions {
  enabled?: boolean;
  onSetRating: (rating: number) => void;
  onSetFlag: (flag: CullingFlag) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  onToggleViewMode?: () => void;
}

export function useCullingHotkeys({
  enabled = true,
  onSetRating,
  onSetFlag,
  onNavigateNext,
  onNavigatePrev,
  onToggleViewMode,
}: UseCullingHotkeysOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o foco estiver em inputs de texto
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Teclas numéricas para Estrelas: 0 a 5
      if (['0', '1', '2', '3', '4', '5'].includes(e.key)) {
        onSetRating(parseInt(e.key, 10));
        return;
      }

      const keyUpper = e.key.toUpperCase();

      // Flags de Seleção: P (Pick), X (Reject), U (Unflag)
      if (keyUpper === 'P') {
        onSetFlag('pick');
        return;
      }
      if (keyUpper === 'X') {
        onSetFlag('reject');
        return;
      }
      if (keyUpper === 'U') {
        onSetFlag('none');
        return;
      }

      // Navegação direcional
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigateNext();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigatePrev();
        return;
      }

      // Alternar visualização (G = Grid / Loupe)
      if (keyUpper === 'G' && onToggleViewMode) {
        onToggleViewMode();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onSetRating, onSetFlag, onNavigateNext, onNavigatePrev, onToggleViewMode]);
}
