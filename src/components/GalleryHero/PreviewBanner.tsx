import React from 'react';

interface PreviewBannerProps {
  isVisible?: boolean;
}

/**
 * PreviewBanner conforme Seção 5 e Seção 16:
 * Renderizado apenas em sessão autenticada de proprietário (22px de altura).
 * Ocupa o topo da janela antes da capa editorial.
 */
export function PreviewBanner({ isVisible = false }: PreviewBannerProps) {
  if (!isVisible) return null;

  return (
    <aside
      className="preview-banner w-full h-[22px] bg-[#d97706] text-black text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center px-4 select-none z-50 fixed top-0 inset-x-0"
      role="status"
      aria-label="Modo de pré-visualização do proprietário"
    >
      <span>Modo de Pré-visualização — Visualização restrita do fotógrafo</span>
    </aside>
  );
}
