
interface CoverOverlayProps {
  opacity?: number;
}

/**
 * Overlay de gradiente autoral Versa Visual (RF-003):
 * Transição orgânica da fotografia para o fundo claro editorial (#F6F8F9) da galeria,
 * mantendo o terço superior translúcido para preservar o olhar e enquadramento da foto.
 */
export function CoverOverlay({ opacity = 0.6 }: CoverOverlayProps) {
  return (
    <div
      className="cover-overlay absolute inset-0 pointer-events-none transition-opacity duration-700"
      aria-hidden="true"
      style={{
        backgroundColor: 'rgba(246, 248, 249, 0.12)',
        backgroundImage: `linear-gradient(
          to bottom,
          rgba(246, 248, 249, 0) 0%,
          transparent 20%,
          rgba(246, 248, 249, 0.15) 45%,
          rgba(246, 248, 249, 0.8) 80%,
          #F6F8F9 100%
        )`,
        opacity: Math.max(0, Math.min(1, opacity)),
      }}
    />
  );
}
