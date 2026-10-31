interface CollectionTitleProps {
  title: string;
  headingFont?: string;
  lightText?: boolean;
}

/**
 * Título editorial conforme RF-002 e Auditoria 3.1.1:
 * - Quando sobre imagem de capa ou opacidade >= 30%, força token #FFFFFF e text-shadow editorial.
 */
export function CollectionTitle({
  title,
  headingFont = 'Outfit, sans-serif',
  lightText = true,
}: CollectionTitleProps) {
  return (
    <h1
      className="cover-title font-heading font-extrabold text-[39px] md:text-[46px] lg:text-[52px] leading-[0.95] tracking-[-0.02em] text-center my-0 select-none"
      style={{
        fontFamily: headingFont,
        color: lightText ? '#FFFFFF' : '#11161B',
        textShadow: lightText ? '0 2px 16px rgba(0, 0, 0, 0.55)' : 'none',
      }}
    >
      {title}
    </h1>
  );
}
