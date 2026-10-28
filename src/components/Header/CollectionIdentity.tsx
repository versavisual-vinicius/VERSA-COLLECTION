
interface CollectionIdentityProps {
  collectionTitle?: string;
  onClickBrand?: () => void;
}

export function CollectionIdentity({ collectionTitle, onClickBrand }: CollectionIdentityProps) {
  return (
    <div
      className="brand-block cursor-pointer select-none"
      onClick={onClickBrand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClickBrand?.();
        }
      }}
      aria-label="Ir para o topo da galeria"
    >
      <span className="brand-kicker">VERSA</span>
      <span className="brand-name">COLLECTION</span>
      {collectionTitle && (
        <span className="sr-only">— {collectionTitle}</span>
      )}
    </div>
  );
}
