
interface BusinessSignatureProps {
  businessName: string;
  businessUrl?: string;
}

export function BusinessSignature({ businessName, businessUrl }: BusinessSignatureProps) {
  return (
    <p className="cover-subtitle font-sans font-normal text-[13px] md:text-[15px] tracking-wide text-[#5A6872] mt-3">
      por{' '}
      {businessUrl ? (
        <a
          href={businessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#11161B] font-medium tracking-normal hover:text-[#5E7F8C] transition-colors focus-visible:underline"
        >
          <strong>{businessName}</strong>
        </a>
      ) : (
        <strong className="text-[#11161B] font-medium">{businessName}</strong>
      )}
    </p>
  );
}
