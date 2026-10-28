import React from 'react';

interface BrandingFooterProps {
  businessName: string;
  totalItems: number;
  onOpenAdmin?: () => void;
}

export function BrandingFooter({ businessName, totalItems, onOpenAdmin }: BrandingFooterProps) {
  return (
    <footer className="w-full py-12 px-4 border-t border-white/5 bg-[#08090b] text-center text-xs text-white/40 font-['DM_Sans']">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-white/70">{businessName}</span>
          <span className="mx-2">•</span>
          <span>{totalItems} fotografias entregues</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-semibold tracking-wider text-white/60">VERSA COLLECTION</span>
          {onOpenAdmin && (
            <>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-white/30 hover:text-[#5E7F8C] transition-colors"
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
