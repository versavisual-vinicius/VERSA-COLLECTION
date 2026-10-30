import { useRef } from 'react';

interface CoverFocalPickerProps {
  coverUrl: string;
  focalPoint: { x: number; y: number };
  onChange: (focalPoint: { x: number; y: number }) => void;
}

/**
 * CoverFocalPicker
 * Permite ao fotógrafo calibrar interativamente o ponto focal (X/Y) da foto de capa.
 * Previne cortes acidentais de rostos e véus em diferentes viewports e aspectos.
 */
export function CoverFocalPicker({ coverUrl, focalPoint, onChange }: CoverFocalPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
    onChange({ x, y });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#5A6872]">
        <span>Ponto focal da capa (clique na imagem para ajustar)</span>
        <span className="font-mono text-[11px] text-[#5E7F8C] font-semibold">
          X: {focalPoint.x}% · Y: {focalPoint.y}%
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative w-full aspect-[16/9] max-w-md rounded-xl overflow-hidden cursor-crosshair border border-[#5E7F8C]/20 select-none bg-[#F6F8F9] group shadow-inner"
        title="Clique para reposicionar o ponto focal"
      >
        <img
          src={coverUrl}
          alt="Pré-visualização do ponto focal"
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
        />

        {/* Linhas de Guia (Terços) */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Pin indicador do ponto focal */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#5E7F8C]/80 shadow-lg flex items-center justify-center pointer-events-none transition-transform duration-75"
          style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

