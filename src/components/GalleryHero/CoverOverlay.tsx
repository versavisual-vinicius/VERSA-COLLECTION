interface CoverOverlayProps {
  opacity?: number;
}

/**
 * Overlay da Capa da Galeria (RF-003 e Auditoria 3.1.1 / 3.1.2):
 * - Aplica a opacidade configurada pelo fotógrafo no /admin (ex: 65%).
 * - Garante proteção superior para a logo VERSA COLLECTION e contraste WCAG para o título.
 */
export function CoverOverlay({ opacity = 0.65 }: CoverOverlayProps) {
  const clamped = Math.min(Math.max(opacity, 0), 0.95);
  const topStop = Math.max(0.48, clamped * 0.85);
  const midStop = Math.max(0.25, clamped * 0.65);
  const bottomStop = Math.max(0.55, clamped);

  return (
    <div
      className="cover-overlay absolute inset-0 pointer-events-none transition-opacity duration-700"
      style={{
        background: `linear-gradient(180deg, rgba(0,0,0,${topStop.toFixed(2)}) 0%, rgba(0,0,0,${midStop.toFixed(2)}) 45%, rgba(0,0,0,${bottomStop.toFixed(2)}) 100%)`,
      }}
      aria-hidden="true"
    />
  );
}
