import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CollectionNotFoundScreen } from '../components/Feedback/CollectionNotFoundScreen';
import { GalleryLoadingScreen } from '../components/Feedback/GalleryLoadingScreen';
import { GalleryUnavailableScreen } from '../components/Feedback/GalleryUnavailableScreen';
import { CollectionRestrictedScreen } from '../components/Feedback/CollectionRestrictedScreen';
import { RateLimitLockout } from '../components/Security/RateLimitLockout';
import { GalleryPasswordGate } from '../components/Security/GalleryPasswordGate';
import { OfflineBanner } from '../components/Feedback/OfflineBanner';
import { PhotographerEmptyState } from '../components/Feedback/PhotographerEmptyState';
import { PhotographerHomePage } from '../components/PhotographerHomePage';
import { GalleryPage } from '../components/GalleryPage';
import { collectionFixture } from '../data/fixtures';

describe('Fase 12 — Estados de Página, Resiliência e Tratamento de Erros (Seção 9 & RF-001)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    localStorage.clear();
    sessionStorage.clear();
  });

  it('1. CollectionNotFoundScreen: exibe tela 404 para slug inexistente via GalleryPage', () => {
    render(<GalleryPage collectionSlug="colecao-inexistente-404" />);
    expect(screen.getByTestId('collection-not-found-screen')).toBeInTheDocument();
    expect(screen.getByText(/Galeria não encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/colecao-inexistente-404/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ir para a página inicial/i })).toBeInTheDocument();
  });

  it('1b. CollectionNotFoundScreen isolado: aciona callback de painel admin', () => {
    const onOpenAdmin = vi.fn();
    render(<CollectionNotFoundScreen slug="ensaio-secreto" onOpenAdmin={onOpenAdmin} />);
    const adminBtn = screen.getByRole('button', { name: /Acesso do Fotógrafo/i });
    fireEvent.click(adminBtn);
    expect(onOpenAdmin).toHaveBeenCalledTimes(1);
  });

  it('2. GalleryLoadingScreen: renderiza splash screen editorial de carregamento inicial', () => {
    render(<GalleryLoadingScreen title="Casamento Clara & Gabriel" />);
    expect(screen.getByTestId('gallery-loading-screen')).toBeInTheDocument();
    expect(screen.getByText(/Carregando galeria…/i)).toBeInTheDocument();
    expect(screen.getByText(/Casamento Clara & Gabriel/i)).toBeInTheDocument();
  });

  it('3. GalleryUnavailableScreen: exibe erro 500/503 e permite tentar novamente', () => {
    const onRetry = vi.fn();
    render(
      <GalleryUnavailableScreen
        message="Falha de comunicação com o servidor de mídia."
        onRetry={onRetry}
      />,
    );
    expect(screen.getByTestId('gallery-unavailable-screen')).toBeInTheDocument();
    expect(screen.getByText(/Serviço temporariamente indisponível/i)).toBeInTheDocument();
    expect(screen.getByText(/Falha de comunicação com o servidor de mídia/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Tentar carregar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('4. CollectionRestrictedScreen: bloqueia coleção oculta (hidden) e valida e-mail em client-only', async () => {
    const hiddenCollection = { ...collectionFixture, visibility: 'hidden' as const };
    const { rerender } = render(<CollectionRestrictedScreen collection={hiddenCollection} />);
    expect(screen.getByTestId('collection-restricted-screen')).toBeInTheDocument();
    expect(screen.getByText(/Galeria Oculta/i)).toBeInTheDocument();

    const clientOnlyCollection = { ...collectionFixture, visibility: 'client-only' as const };
    const onAuthorizeEmail = vi.fn().mockResolvedValue(true);
    rerender(
      <CollectionRestrictedScreen
        collection={clientOnlyCollection}
        onAuthorizeEmail={onAuthorizeEmail}
      />,
    );

    expect(screen.getByText(/Acesso Restrito ao Cliente/i)).toBeInTheDocument();
    const emailInput = screen.getByLabelText(/E-mail autorizado do cliente/i);
    fireEvent.change(emailInput, { target: { value: 'cliente@versa.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Liberar Acesso/i }));

    await waitFor(() => {
      expect(onAuthorizeEmail).toHaveBeenCalledWith('cliente@versa.com');
    });
  });

  it('5. RateLimitLockout & GalleryPasswordGate: bloqueia após 5 tentativas inválidas com cronômetro regressivo', async () => {
    const protectedCollection = {
      ...collectionFixture,
      id: 'col-lockout-test',
      passwordRequired: true,
    };
    const onUnlocked = vi.fn();
    const onAuthenticate = vi.fn().mockRejectedValue(new Error('Senha incorreta.'));

    render(
      <GalleryPasswordGate
        collection={protectedCollection}
        onAuthenticate={onAuthenticate}
        onUnlocked={onUnlocked}
      />,
    );

    const passwordInput = screen.getByPlaceholderText(/Digite a senha da galeria/i);
    const submitBtn = screen.getByRole('button', { name: /Entrar na Galeria/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.change(passwordInput, { target: { value: `senha-errada-${i}` } });
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(onAuthenticate).toHaveBeenCalledTimes(i + 1);
      });
    }

    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-lockout')).toBeInTheDocument();
    });
    expect(screen.getByText(/Acesso Temporariamente Bloqueado/i)).toBeInTheDocument();
    expect(screen.getByTestId('lockout-countdown')).toHaveTextContent('15:00');
    expect(onUnlocked).not.toHaveBeenCalled();
  });

  it('5b. RateLimitLockout isolado: decrementa contador e aciona onLockoutExpired ao zerar', () => {
    vi.useFakeTimers();
    const onLockoutExpired = vi.fn();
    render(
      <RateLimitLockout
        collectionTitle="Casamento Teste"
        initialRemainingSeconds={2}
        onLockoutExpired={onLockoutExpired}
      />,
    );

    expect(screen.getByTestId('lockout-countdown')).toHaveTextContent('00:02');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId('lockout-countdown')).toHaveTextContent('00:00');
    expect(onLockoutExpired).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('6. OfflineBanner: exibe aviso quando navegador fica offline e notifica ao reconectar', () => {
    const onReconnected = vi.fn();
    render(<OfflineBanner onReconnected={onReconnected} />);

    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByTestId('offline-banner')).toBeInTheDocument();
    expect(screen.getByText(/Modo Offline:/i)).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();
    expect(onReconnected).toHaveBeenCalledTimes(1);
  });

  it('7. PhotoNotFoundNotice (Deep Link Inválido ?photo=): limpa URL e exibe aviso não bloqueante', async () => {
    window.history.replaceState({}, '', '/?photo=foto-inexistente-999');

    render(<GalleryPage collectionSlug="fixture" isOwnerPreview={true} />);

    await waitFor(() => {
      expect(
        screen.getByText(/A fotografia solicitada não está disponível\. Exibindo acervo completo da coleção\./i),
      ).toBeInTheDocument();
    });

    expect(window.location.search).toBe('');
  });

  it('8. PhotographerEmptyState: exibe estado editorial vazio quando catálogo público não possui coleções', () => {
    render(
      <PhotographerHomePage
        collectionsOverride={[]}
        onSelectCollection={vi.fn()}
        onOpenAdmin={vi.fn()}
      />,
    );
    expect(screen.getByTestId('photographer-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/Novas entregas em preparação/i)).toBeInTheDocument();
  });

  it('8b. PhotographerEmptyState isolado: renderiza CTA de WhatsApp e botão Admin', () => {
    const onOpenAdmin = vi.fn();
    render(<PhotographerEmptyState onOpenAdmin={onOpenAdmin} />);
    expect(screen.getByRole('link', { name: /Solicitar link no WhatsApp/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Painel do Fotógrafo/i }));
    expect(onOpenAdmin).toHaveBeenCalledTimes(1);
  });
});
