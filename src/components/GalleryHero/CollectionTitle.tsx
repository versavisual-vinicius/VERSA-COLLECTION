
interface CollectionTitleProps {
  title: string;
  headingFont?: string;
}

/**
 * Título editorial conforme RF-002 e Diretrizes Versa Visual:
 * - Desktop: 52px com escala Outfit ExtraBold
 * - Mobile: 39px
 * - Alinhamento centralizado com tracking refinado
 */
export function CollectionTitle({
  title,
  headingFont = 'Outfit, sans-serif',
}: CollectionTitleProps) {
  return (
    <h1
      className="cover-title font-heading font-extrabold text-[39px] md:text-[46px] lg:text-[52px] leading-[0.92] tracking-[-0.035em] text-[#11161B] text-center my-0 select-none"
      style={{ fontFamily: headingFont }}
    >
      {title}
    </h1>
  );
}
