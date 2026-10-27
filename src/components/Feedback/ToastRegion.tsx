import React from 'react';

interface ToastRegionProps {
  message: string | null;
}

export function ToastRegion({ message }: ToastRegionProps) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1e2229]/95 border border-white/20 text-white text-xs font-medium shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-200"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
