
interface BrandingFooterProps {
  businessName: string;
  totalItems: number;
  onOpenAdmin?: () => void;
}

export function BrandingFooter({ businessName, totalItems, onOpenAdmin }: BrandingFooterProps) {
  return (
    <footer className="w-full py-12 px-4 border-t border-[#5E7F8C]/15 bg-[#EEF1F3] text-center text-xs text-[#5A6872] font-['DM_Sans']">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-[#11161B]">{businessName}</span>
          <span className="mx-2 text-[#5E7F8C]/40">•</span>
          <span>{totalItems} fotografias entregues</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-semibold tracking-wider text-[#11161B]">VERSA COLLECTION</span>
          {onOpenAdmin && (
            <>
              <span className="text-[#5E7F8C]/40">•</span>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-[#5A6872] hover:text-[#5E7F8C] transition-colors"
              >
                Painel do Fotógrafo
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
