
interface CoverOverlayProps {
  opacity?: number;
}

/**
 * Overlay da Capa da Galeria (RF-003):
 * Preserva 100% da fotografia original, nitidez e cores autorais,
 * sem sobreposição de véus de cor ou gradientes sobre a foto de capa.
 */
export function CoverOverlay({ opacity: _opacity = 0.6 }: CoverOverlayProps) {
  return (
    <div
      className="cover-overlay absolute inset-0 pointer-events-none transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
