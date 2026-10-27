import React from 'react';

interface BrandingFooterProps {
  businessName: string;
  totalItems: number;
}

export function BrandingFooter({ businessName, totalItems }: BrandingFooterProps) {
  return (
    <footer className="w-full py-12 px-4 border-t border-white/5 bg-[#08090b] text-center text-xs text-white/40">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-white/70">{businessName}</span>
          <span className="mx-2">•</span>
          <span>{totalItems} fotografias entregues</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-semibold tracking-wider text-white/60">VERSA COLLECTION</span>
        </div>
      </div>
    </footer>
  );
}
