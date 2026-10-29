import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StepEventDetails } from '../components/CollectionWizard/StepEventDetails';
import { StepCoverPicker } from '../components/CollectionWizard/StepCoverPicker';
import { StepLayoutPreset } from '../components/CollectionWizard/StepLayoutPreset';
import { CollectionCreateWizard } from '../components/CollectionWizard/CollectionCreateWizard';
import * as backend from '../lib/backend';

describe('Fase 16: Collection Creation Wizard & Onboarding (Pixieset Parity)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Step 1: Event Details & Slug Autogeneration', () => {
    it('deve desabilitar botão de avançar quando título estiver vazio e gerar slug reativo', () => {
      const handleNext = vi.fn();
      const handleCancel = vi.fn();

      render(
        <StepEventDetails
          initialData={{ title: '', slug: '', eventDate: '', clientEmail: '' }}
          onNext={handleNext}
          onCancel={handleCancel}
        />,
      );

      const nextBtn = screen.getByTestId('btn-next-step-1');
      expect(nextBtn).toBeDisabled();

      const titleInput = screen.getByTestId('input-collection-title');
      const slugInput = screen.getByTestId('input-collection-slug');

      fireEvent.change(titleInput, { target: { value: 'Casamento Marina & Lucas 2026' } });
      expect(slugInput).toHaveValue('casamento-marina-lucas-2026');
      expect(nextBtn).not.toBeDisabled();

      fireEvent.click(nextBtn);
      expect(handleNext).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Casamento Marina & Lucas 2026',
          slug: 'casamento-marina-lucas-2026',
        }),
      );
    });

    it('deve permitir edição manual do slug sem sobrescrever ao alterar título posteriormente', () => {
      const handleNext = vi.fn();

      render(
        <StepEventDetails
          initialData={{ title: 'Ensaio', slug: '', eventDate: '', clientEmail: '' }}
          onNext={handleNext}
          onCancel={vi.fn()}
        />,
      );

      const titleInput = screen.getByTestId('input-collection-title');
      const slugInput = screen.getByTestId('input-collection-slug');

      fireEvent.change(slugInput, { target: { value: 'ensaio-personalizado' } });
      fireEvent.change(titleInput, { target: { value: 'Ensaio Completo da Noiva' } });

      // O slug manual deve ser mantido
      expect(slugInput).toHaveValue('ensaio-personalizado');
    });
  });

  describe('Step 2: Cover & Focal Point Calibration', () => {
    it('deve permitir seleção de preset e avançar para a etapa de layout', () => {
      const handleNext = vi.fn();
      const handleBack = vi.fn();

      render(
        <StepCoverPicker
          collectionTitle="Ensaio Exemplo"
          initialData={{
            coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
            coverFocalPoint: { x: 50, y: 30 },
          }}
          onNext={handleNext}
          onBack={handleBack}
        />,
      );

      expect(screen.getByText('Ensaio Exemplo')).toBeInTheDocument();

      const presetBtn = screen.getByTestId('preset-cover-retrato-editorial');
      fireEvent.click(presetBtn);

      const nextBtn = screen.getByTestId('btn-next-step-2');
      fireEvent.click(nextBtn);

      expect(handleNext).toHaveBeenCalledWith(
        expect.objectContaining({
          coverUrl: expect.stringContaining('1529139574466'),
        }),
      );
    });
  });

  describe('Step 3: Layout Preset, Privacy & Demo Seeding', () => {
    it('deve exigir senha válida quando visibilidade for protegida por senha', () => {
      const handleFinish = vi.fn();

      render(
        <StepLayoutPreset
          initialData={{
            layoutPreset: 'masonry',
            visibility: 'password',
            password: '',
            seedDemoPhotos: true,
          }}
          summary={{
            title: 'Coleção Protegida',
            slug: 'colecao-protegida',
            coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
          }}
          isLoading={false}
          onFinish={handleFinish}
          onBack={vi.fn()}
        />,
      );

      const finishBtn = screen.getByTestId('btn-finish-wizard');
      fireEvent.click(finishBtn);

      expect(screen.getByRole('alert')).toHaveTextContent(/pelo menos 4 caracteres/i);
      expect(handleFinish).not.toHaveBeenCalled();

      const pwdInput = screen.getByTestId('input-collection-password');
      fireEvent.change(pwdInput, { target: { value: 'senha123' } });
      fireEvent.click(finishBtn);

      expect(handleFinish).toHaveBeenCalledWith(
        expect.objectContaining({
          visibility: 'password',
          password: 'senha123',
          seedDemoPhotos: true,
        }),
      );
    });
  });

  describe('CollectionCreateWizard: Orquestração End-to-End', () => {
    it('deve completar os 3 passos e registrar a coleção no backend', async () => {
      const handleSuccess = vi.fn();
      const handleClose = vi.fn();

      vi.spyOn(backend, 'createCollection').mockResolvedValueOnce({
        success: true,
        collection: {
          id: 'col-novo-ensaio',
          slug: 'ensaio-floresta-2026',
          title: 'Ensaio Floresta 2026',
          totalItems: 8,
          createdAt: new Date().toISOString(),
        },
      });

      render(
        <CollectionCreateWizard
          isOpen={true}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />,
      );

      // Passo 1: Informar Título
      const titleInput = screen.getByTestId('input-collection-title');
      fireEvent.change(titleInput, { target: { value: 'Ensaio Floresta 2026' } });
      const nextBtn1 = screen.getByTestId('btn-next-step-1');
      fireEvent.click(nextBtn1);

      // Passo 2: Avançar Capa
      await waitFor(() => {
        expect(screen.getByTestId('btn-next-step-2')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('btn-next-step-2'));

      // Passo 3: Concluir
      await waitFor(() => {
        expect(screen.getByTestId('btn-finish-wizard')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('btn-finish-wizard'));

      await waitFor(() => {
        expect(backend.createCollection).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Ensaio Floresta 2026',
            slug: 'ensaio-floresta-2026',
            seedDemoPhotos: true,
          }),
        );
        expect(handleSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            slug: 'ensaio-floresta-2026',
          }),
        );
      });
    });

    it('deve exibir mensagem de erro clara caso o slug já esteja em uso', async () => {
      vi.spyOn(backend, 'createCollection').mockRejectedValueOnce(
        new Error('SLUG_ALREADY_EXISTS'),
      );

      render(
        <CollectionCreateWizard
          isOpen={true}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      // Passo 1
      fireEvent.change(screen.getByTestId('input-collection-title'), {
        target: { value: 'Casamento Duplicado' },
      });
      fireEvent.click(screen.getByTestId('btn-next-step-1'));

      // Passo 2
      await waitFor(() => screen.getByTestId('btn-next-step-2'));
      fireEvent.click(screen.getByTestId('btn-next-step-2'));

      // Passo 3
      await waitFor(() => screen.getByTestId('btn-finish-wizard'));
      fireEvent.click(screen.getByTestId('btn-finish-wizard'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/já está em uso por outra coleção/i);
      });
    });
  });
});
