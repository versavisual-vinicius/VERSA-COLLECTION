import { useState } from 'react';
import { StepEventDetails, type EventDetailsData } from './StepEventDetails';
import { StepCoverPicker, type CoverPickerData } from './StepCoverPicker';
import { StepLayoutPreset, type LayoutPresetData } from './StepLayoutPreset';
import { createCollection } from '../../lib/backend';
import type { CreateCollectionResponse } from '../../types/gallery';

interface CollectionCreateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (collection: CreateCollectionResponse['collection']) => void;
}

export function CollectionCreateWizard({ isOpen, onClose, onSuccess }: CollectionCreateWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [eventDetails, setEventDetails] = useState<EventDetailsData>({
    title: '',
    slug: '',
    eventDate: '',
    clientEmail: '',
  });

  const [coverData, setCoverData] = useState<CoverPickerData>({
    coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=2400&q=80',
    coverFocalPoint: { x: 50, y: 28 },
  });

  const [layoutData, setLayoutData] = useState<LayoutPresetData>({
    layoutPreset: 'masonry',
    visibility: 'public',
    password: '',
    seedDemoPhotos: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStep1Next = (data: EventDetailsData) => {
    setEventDetails(data);
    setCurrentStep(2);
  };

  const handleStep2Next = (data: CoverPickerData) => {
    setCoverData(data);
    setCurrentStep(3);
  };

  const handleFinish = async (data: LayoutPresetData) => {
    setLayoutData(data);
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const response = await createCollection({
        title: eventDetails.title,
        slug: eventDetails.slug,
        eventDate: eventDetails.eventDate,
        clientEmail: eventDetails.clientEmail,
        coverUrl: coverData.coverUrl,
        coverFocalPoint: coverData.coverFocalPoint,
        layoutPreset: data.layoutPreset,
        visibility: data.visibility,
        password: data.password,
        seedDemoPhotos: data.seedDemoPhotos,
      });

      if (response.success && response.collection) {
        onSuccess(response.collection);
      } else {
        throw new Error('Falha ao registrar coleção no backend.');
      }
    } catch (err) {
      console.error('Wizard submission error:', err);
      const message =
        err instanceof Error
          ? err.message === 'SLUG_ALREADY_EXISTS'
            ? 'O identificador (slug) informado já está em uso por outra coleção. Altere o slug no passo 1.'
            : err.message
          : 'Erro inesperado ao criar coleção.';
      setGlobalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      data-testid="collection-create-wizard-modal"
    >
      <div className="relative w-full max-w-2xl bg-[#050A0D] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-[#5E7F8C] font-outfit font-semibold">
              Onboarding & Criação · Versa Visual
            </span>
            <h2 className="text-xl sm:text-2xl font-outfit font-bold text-white tracking-tight">
              Criar Nova Coleção
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-testid="btn-close-wizard"
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Fechar assistente"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Indicador de Passos (Stepper) */}
        <div className="py-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#5E7F8C] transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {[
              { step: 1, label: 'Detalhes' },
              { step: 2, label: 'Capa' },
              { step: 3, label: 'Layout' },
            ].map((s) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div key={s.step} className="flex flex-col items-center gap-1.5 relative z-10 bg-[#050A0D] px-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-outfit transition-all ${
                      isPassed
                        ? 'bg-[#5E7F8C] text-white'
                        : isCurrent
                        ? 'bg-[#5E7F8C] text-white ring-4 ring-[#5E7F8C]/20 shadow-lg'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {isPassed ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.step
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-dm-sans transition-colors ${
                      isCurrent ? 'text-white font-medium' : isPassed ? 'text-white/80' : 'text-white/40'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {globalError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-dm-sans flex items-start gap-2.5"
          >
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <strong>Atenção:</strong> {globalError}
            </div>
          </div>
        )}

        {/* Conteúdo Dinâmico por Etapa */}
        {currentStep === 1 && (
          <StepEventDetails
            initialData={eventDetails}
            onNext={handleStep1Next}
            onCancel={onClose}
          />
        )}

        {currentStep === 2 && (
          <StepCoverPicker
            collectionTitle={eventDetails.title}
            initialData={coverData}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <StepLayoutPreset
            initialData={layoutData}
            summary={{
              title: eventDetails.title,
              slug: eventDetails.slug,
              coverUrl: coverData.coverUrl,
            }}
            isLoading={isSubmitting}
            onFinish={handleFinish}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}
