
interface CollectionTitleProps {
  title: string;
  headingFont?: string;
}

/**
 * Título editorial conforme RF-002:
 * - Desktop (1154x875): 52px
 * - Mobile (390x844): 39px
 * - Alinhamento centralizado
 */
export function CollectionTitle({
  title,
  headingFont = 'Cormorant Garamond, Georgia, serif',
}: CollectionTitleProps) {
  return (
    <h1
      className="cover-title text-[39px] md:text-[46px] lg:text-[52px] leading-[0.95] tracking-[-0.04em] text-white text-center font-normal my-0 select-none"
      style={{ fontFamily: headingFont }}
    >
      {title}
    </h1>
  );
}
