import { useEffect, useRef, useState } from 'react';
import type { GalleryPhoto, DownloadJobStatus } from '../../types/gallery';
import { saveExportRequest } from '../../lib/collectionSettings';
import { backendEnabled, createExportRequest } from '../../lib/backend';

interface DownloadDialogProps {
  isOpen: boolean;
  photo?: GalleryPhoto | null;
  collectionTitle: string;
  collectionSlug?: string;
  allowedSizes?: Array<'original' | '3600' | '2048' | '1024' | '640'>;
  requiresPin?: boolean;
  expectedPin?: string;
  requiresEmail?: boolean;
  directFolderUrl?: string;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

/**
 * DownloadDialog (RF-011):
 * - Máquina de estados do job: idle -> validating -> preparing -> ready -> expired / failed.
 * - Suporte a URL real da foto (Google Drive / CDN) e link direto de pasta.
 * - Registro em tempo real de solicitações de exportação no painel administrativo.
 * - Validação opcional de PIN / e-mail do cliente.
 */
export function DownloadDialog({
  isOpen,
  photo,
  collectionTitle,
  collectionSlug = 'default',
  allowedSizes = ['original', '2048', '1024', '640'],
  requiresPin = false,
  expectedPin,
  requiresEmail = false,
  directFolderUrl,
  onClose,
  onShowToast,
}: DownloadDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>(allowedSizes[0] ?? 'original');
  const [status, setStatus] = useState<DownloadJobStatus>('idle');
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setSignedUrl(null);
      setErrorMessage(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isIndividual = Boolean(photo);

  const startDownloadJob = async () => {
    if (requiresPin && !pinInput.trim()) {
      setErrorMessage('Por favor, informe o PIN de autorização.');
      return;
    }

    if (!backendEnabled && requiresPin && expectedPin && pinInput.trim() !== expectedPin.trim()) {
      setErrorMessage('PIN de autorização incorreto. Verifique os dados recebidos.');
      return;
    }

    if (requiresEmail && !emailInput.trim()) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setErrorMessage(null);
    setStatus('validating');

    if (backendEnabled) {
      try {
        const result = await createExportRequest({
          collectionSlug,
          type: photo ? 'single' : 'collection',
          photoId: photo?.id,
          clientEmail: emailInput.trim() || undefined,
          pin: pinInput.trim() || undefined,
          requestedSize: selectedSize,
        });
        setSignedUrl(result.downloadUrl);
        setStatus(result.downloadUrl ? 'ready' : 'preparing');
        onShowToast?.(result.downloadUrl ? 'Download autorizado com sucesso!' : 'Solicitação registrada.');
      } catch (reason) {
        setStatus('failed');
        setErrorMessage(reason instanceof Error ? reason.message : 'Não foi possível preparar o download.');
      }
      return;
    }

    // Transição determinística do job: validating -> preparing -> ready
    setTimeout(() => {
      setStatus('preparing');

      setTimeout(() => {
        const finalUrl = photo
          ? (() => {
          if (selectedSize === 'original') {
            return photo.downloadUrl || photo.sources[photo.sources.length - 1]?.url || '';
          }
          const targetWidth = parseInt(selectedSize, 10);
          const matched = photo.sources.find((s) => s.width === targetWidth);
          return matched?.url || photo.downloadUrl || photo.sources[0]?.url || '';
        })()
          : directFolderUrl ||
            `https://download.versa.gallery/dl/collection-all.zip?size=${selectedSize}&token=exp_${Date.now() + 15 * 60 * 1000}`;

        setSignedUrl(finalUrl);
        setStatus('ready');

        // Registra solicitação no feed de exportação
        saveExportRequest({
          collectionSlug,
          collectionTitle,
          type: photo ? 'single' : 'collection',
          photoId: photo?.id,
          photoFileName: photo?.fileName,
          clientEmail: emailInput.trim(),
          requestedSize: selectedSize,
          status: 'ready',
          downloadUrl: finalUrl,
        });

        onShowToast?.('Pacote de download preparado com sucesso!');
      }, 700);
    }, 400);
  };

  const handleSimulateExpiration = () => {
    setStatus('expired');
  };

  const handleDownloadClick = () => {
    onShowToast?.('Iniciando transferência...');
    // Se a foto tiver downloadUrl direto e navegável
    if (photo && signedUrl) {
      // Deixar navegação padrão do <a> com download attribute
    }
  };

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-dialog-title"
    >
      <div
        ref={modalRef}
        className="dialog-panel w-full max-w-md rounded-2xl bg-[#111418] border border-white/10 p-6 shadow-2xl text-white font-['DM_Sans']"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="download-dialog-title" className="text-lg font-semibold font-['Outfit']">
            {isIndividual ? 'Baixar Fotografia' : 'Baixar Coleção Completa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm"
            aria-label="Fechar diálogo de download"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-white/60 mb-4">
          {isIndividual
            ? `Fotografia ${photo?.position} (${photo?.fileName || 'alta fidelidade'}) da coleção ${collectionTitle}`
            : `Arquivo compactado contendo todo o acervo da coleção ${collectionTitle}`}
        </p>

        {status === 'idle' && (
          <>
            <div className="mb-5">
              <label className="block text-xs font-medium text-white/80 mb-2">
                Resolução desejada:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allowedSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                      selectedSize === size
                        ? 'border-white bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold uppercase">{size}</div>
                    <div className="text-[10px] text-white/50">
                      {size === 'original' ? 'Resolução total' : `${size}px no lado maior`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {requiresPin && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/80 mb-1">
                  PIN de Autorização:
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Digite o PIN de 4 dígitos"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/40"
                />
              </div>
            )}

            {requiresEmail && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Seu E-mail:
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/40"
                />
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-red-400 mb-4">{errorMessage}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={startDownloadJob}
                className="flex-1 py-2.5 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Preparar Arquivo
              </button>
            </div>
          </>
        )}

        {(status === 'validating' || status === 'preparing') && (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-white/80">
              {status === 'validating'
                ? 'Validando permissões e resolução...'
                : 'Processando e compactando imagens em alta fidelidade...'}
            </p>
            <span className="text-[11px] text-white/40">
              A preparação continua em segundo plano.
            </span>
          </div>
        )}

        {status === 'ready' && (
          <div className="py-4 text-center flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              ✓
            </div>
            <div>
              <p className="text-sm font-medium text-white">Arquivo pronto para download!</p>
              <p className="text-[11px] text-white/50 mt-1">
                Link assinado válido por 15 minutos.
              </p>
            </div>

            <div className="w-full space-y-2">
              <a
                href={signedUrl ?? '#'}
                download={isIndividual ? (photo?.fileName || `foto-${photo?.position}.jpg`) : `${collectionTitle}.zip`}
                target={isIndividual ? undefined : '_blank'}
                rel="noreferrer"
                onClick={handleDownloadClick}
                className="w-full block py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-lg shadow-emerald-500/20"
              >
                Baixar Agora
              </a>

              {directFolderUrl && !isIndividual && (
                <a
                  href={directFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block py-2 rounded-lg border border-white/15 hover:bg-white/10 text-white text-xs font-medium text-center transition-colors"
                >
                  Abrir Pasta Completa no Google Drive ↗
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={handleSimulateExpiration}
              className="text-[10px] text-white/30 hover:underline"
            >
              (Simular expiração do link)
            </button>
          </div>
        )}

        {status === 'expired' && (
          <div className="py-6 text-center flex flex-col items-center gap-3">
            <p className="text-xs text-amber-300">
              O link temporário expirou por segurança (validade de 15 minutos excedida).
            </p>
            <button
              type="button"
              onClick={startDownloadJob}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/20"
            >
              Preparar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
