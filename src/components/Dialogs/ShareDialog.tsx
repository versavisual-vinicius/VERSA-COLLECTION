import React, { useEffect, useRef, useState } from 'react';

interface ShareDialogProps {
  isOpen: boolean;
  title: string;
  url: string;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

/**
 * ShareDialog (RF-012):
 * - Web Share API nativa quando suportada.
 * - Destinos sociais imediatos: WhatsApp, Facebook, X, Pinterest, E-mail.
 * - Botão de copiar link com confirmação acessível.
 */
export function ShareDialog({
  isOpen,
  title,
  url,
  onClose,
  onShowToast,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
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

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Fallback gracioso
    }
    setCopied(true);
    onShowToast?.('Link copiado para a área de transferência');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Usuário fechou ou cancelou
      }
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: '💬',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: '📘',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: '✖',
    },
    {
      name: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: '📌',
    },
    {
      name: 'E-mail',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: '✉',
    },
  ];

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
    >
      <div
        ref={modalRef}
        className="dialog-panel w-full max-w-md rounded-2xl bg-[#111418] border border-white/10 p-6 shadow-2xl text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="share-dialog-title" className="text-lg font-semibold">
            Compartilhar
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm"
            aria-label="Fechar diálogo de compartilhamento"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-white/60 mb-4 truncate">{title}</p>

        {/* Input de cópia de link */}
        <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 rounded-lg p-2">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent text-xs text-white/90 flex-1 outline-none truncate"
            aria-label="URL de compartilhamento"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Destinos Sociais Rápidos */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-wider text-white/40 mb-3 font-semibold">
            Enviar para:
          </p>
          <div className="grid grid-cols-5 gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-center"
                aria-label={`Compartilhar via ${social.name}`}
              >
                <span className="text-lg" aria-hidden="true">
                  {social.icon}
                </span>
                <span className="text-[10px] text-white/60 truncate w-full">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-lg border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Mais opções do dispositivo
          </button>
        )}
      </div>
    </div>
  );
}
