
interface PreviewBannerProps {
  isVisible?: boolean;
}

/**
 * PreviewBanner: Desativado a pedido editorial (remover aviso).
 * Preserva interface para compatibilidade sem poluir visualmente a capa da galeria.
 */
export function PreviewBanner({ isVisible: _isVisible = false }: PreviewBannerProps) {
  return null;
}

