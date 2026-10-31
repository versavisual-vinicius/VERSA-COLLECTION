interface BusinessSignatureProps {
  businessName: string;
  businessUrl?: string;
  lightText?: boolean;
}

export function BusinessSignature({
  businessName,
  businessUrl,
  lightText = true,
}: BusinessSignatureProps) {
  const baseTextColor = lightText ? 'text-white/80' : 'text-[#5A6872]';
  const strongColor = lightText
    ? 'text-white hover:text-white/90'
    : 'text-[#11161B] hover:text-[#5E7F8C]';

  return (
    <p
      className={`cover-subtitle font-sans font-normal text-[13px] md:text-[15px] tracking-wide ${baseTextColor} mt-3`}
      style={lightText ? { textShadow: '0 1px 8px rgba(0, 0, 0, 0.45)' } : undefined}
    >
      por{' '}
      {businessUrl ? (
        <a
          href={businessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${strongColor} font-medium tracking-normal transition-colors focus-visible:underline`}
        >
          <strong>{businessName}</strong>
        </a>
      ) : (
        <strong className={`${strongColor} font-medium`}>{businessName}</strong>
      )}
    </p>
  );
}
