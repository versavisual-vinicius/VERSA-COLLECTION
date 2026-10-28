
interface CoverOverlayProps {
  opacity?: number;
}

/**
 * Overlay de gradiente conforme RF-003 da especificação:
 * background-color: rgba(0, 0, 0, 0.2);
 * background-image: linear-gradient(
 *   transparent 0%,
 *   transparent 5%,
 *   rgba(0, 0, 0, 0.08) 45%,
 *   rgba(0, 0, 0, 0.5) 90%,
 *   rgba(0, 0, 0, 0.7) 100%
 * );
 */
export function CoverOverlay({ opacity = 0.6 }: CoverOverlayProps) {
  return (
    <div
      className="cover-overlay absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundImage: `linear-gradient(
          transparent 0%,
          transparent 5%,
          rgba(0, 0, 0, 0.08) 45%,
          rgba(0, 0, 0, 0.5) 90%,
          rgba(0, 0, 0, 0.7) 100%
        )`,
        opacity: Math.max(0, Math.min(1, opacity)),
      }}
    />
  );
}
