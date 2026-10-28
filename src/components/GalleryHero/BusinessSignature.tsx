
interface BusinessSignatureProps {
  businessName: string;
  businessUrl?: string;
}

export function BusinessSignature({ businessName, businessUrl }: BusinessSignatureProps) {
  return (
    <p className="cover-subtitle">
      por{' '}
      {businessUrl ? (
        <a
          href={businessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline focus-visible:underline"
        >
          <strong>{businessName}</strong>
        </a>
      ) : (
        <strong>{businessName}</strong>
      )}
    </p>
  );
}
