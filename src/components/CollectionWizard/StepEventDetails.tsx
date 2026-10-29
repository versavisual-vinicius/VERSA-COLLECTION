import { useState, useEffect } from 'react';

export interface EventDetailsData {
  title: string;
  slug: string;
  eventDate?: string;
  clientEmail?: string;
}

interface StepEventDetailsProps {
  initialData: EventDetailsData;
  onNext: (data: EventDetailsData) => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function StepEventDetails({ initialData, onNext, onCancel }: StepEventDetailsProps) {
  const [title, setTitle] = useState(initialData.title);
  const [slug, setSlug] = useState(initialData.slug);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData.slug));
  const [eventDate, setEventDate] = useState(initialData.eventDate || '');
  const [clientEmail, setClientEmail] = useState(initialData.clientEmail || '');
  const [error, setError] = useState<string | null>(null);

  // Autogera o slug quando o usuário digita o título, a não ser que tenha editado manualmente o slug
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, isSlugManuallyEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 2) {
      setError('O título da coleção deve ter no mínimo 2 caracteres.');
      return;
    }
    const cleanSlug = slug.trim();
    if (!cleanSlug || cleanSlug.length < 2) {
      setError('O identificador (slug) deve ter no mínimo 2 caracteres.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      setError('O slug deve conter apenas letras minúsculas, números e hífens.');
      return;
    }
    if (clientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setError('Informe um e-mail válido para o cliente.');
      return;
    }

    setError(null);
    onNext({
      title: title.trim(),
      slug: cleanSlug,
      eventDate: eventDate || undefined,
      clientEmail: clientEmail.trim() || undefined,
    });
  };

  const isFormValid = title.trim().length >= 2 && slug.trim().length >= 2 && /^[a-z0-9-]+$/.test(slug.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="step-event-details">
      <div>
        <h3 className="font-outfit text-xl font-semibold text-white tracking-tight">
          1. Detalhes do Evento & Coleção
        </h3>
        <p className="font-dm-sans text-sm text-white/60 mt-1">
          Defina o título principal e as informações de contato para identificar a galeria.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-dm-sans"
        >
          {error}
        </div>
      )}

      <div className="space-y-4 font-dm-sans text-sm">
        <div>
          <label htmlFor="collection-title" className="block text-xs font-medium text-white/80 mb-1.5">
            Título da Coleção <span className="text-[#5E7F8C]">*</span>
          </label>
          <input
            id="collection-title"
            data-testid="input-collection-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Casamento Marina & Lucas"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="collection-slug" className="block text-xs font-medium text-white/80">
              Identificador URL (Slug) <span className="text-[#5E7F8C]">*</span>
            </label>
            <span className="text-[11px] text-white/40 font-mono">
              versavisual.com/g/<strong>{slug || '...'}</strong>
            </span>
          </div>
          <input
            id="collection-slug"
            data-testid="input-collection-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="casamento-marina-lucas"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="collection-date" className="block text-xs font-medium text-white/80 mb-1.5">
              Data do Evento
            </label>
            <input
              id="collection-date"
              data-testid="input-collection-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
            />
          </div>

          <div>
            <label htmlFor="collection-email" className="block text-xs font-medium text-white/80 mb-1.5">
              E-mail do Cliente (Opcional)
            </label>
            <input
              id="collection-email"
              data-testid="input-collection-email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@exemplo.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#5E7F8C] focus:ring-1 focus:ring-[#5E7F8C] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          data-testid="btn-next-step-1"
          disabled={!isFormValid}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 transition-all ${
            isFormValid
              ? 'bg-[#5E7F8C] text-white hover:bg-[#6c8f9d] shadow-lg shadow-[#5E7F8C]/20'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <span>Avançar para Capa</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
