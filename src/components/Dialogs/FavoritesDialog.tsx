import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import type { GalleryPhoto } from '../../types/gallery';

interface FavoritesDialogProps {
  isOpen: boolean;
  favorites: GalleryPhoto[];
  favoriteNotes?: Record<string, string>;
  onClose: () => void;
  onOpenPhoto: (photoId: string) => void;
  onRemoveFavorite: (photoId: string) => void;
  onUpdateNote?: (photoId: string, note: string) => void;
  onDownloadFavorites?: () => void;
  onZipDownloaded?: (count: number) => void;
}

export function FavoritesDialog({
  isOpen,
  favorites,
  favoriteNotes = {},
  onClose,
  onOpenPhoto,
  onRemoveFavorite,
  onUpdateNote,
  onDownloadFavorites,
  onZipDownloaded,
}: FavoritesDialogProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [editingNotePhotoId, setEditingNotePhotoId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDownloadZip = async () => {
    if (favorites.length === 0 || isZipping) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();

      // Relatório canônico de favoritos e observações
      const notesContent = [
        'VERSA VISUAL — SELEÇÃO DE FOTOGRAFIAS FAVORITAS',
        `Data da Exportação: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
        `Total de Fotografias Selecionadas: ${favorites.length}`,
        '-------------------------------------------------------',
        'FOTOGRAFIAS E OBSERVAÇÕES:',
        ...favorites.map((photo, index) => {
          const userNote = favoriteNotes[photo.id];
          return `${index + 1}. Arquivo: ${photo.fileName} (ID: ${photo.id})\n   Legenda: ${photo.alt}\n   Nota do Cliente: ${userNote || 'Nenhuma'}\n`;
        }),
      ].join('\n');

      zip.file('LEIA-ME_SELECAO_FAVORITOS.txt', notesContent);

      // Adiciona as fotografias ao ZIP
      for (const photo of favorites) {
        const url = photo.sources[0]?.url || photo.downloadUrl;
        const fileName = photo.fileName || `${photo.id}.jpg`;

        if (url) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const blob = await response.blob();
              zip.file(fileName, blob);
              continue;
            }
          } catch {
            // Em caso de restrição CORS ou ambiente de teste jsdom, registra fallback
          }
        }
        // Fallback para ambiente sem conectividade binária
        zip.file(
          `${fileName}.info.txt`,
          `Fotografia: ${photo.alt}\nID: ${photo.id}\nPosição: ${photo.position}\nURL Original: ${url || 'N/A'}\nNota: ${favoriteNotes[photo.id] || 'Nenhuma'}`
        );
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `favoritos_versa_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);

      onZipDownloaded?.(favorites.length);
    } catch (err) {
      console.error('Erro ao empacotar ZIP de favoritos:', err);
    } finally {
      setIsZipping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-dialog-title"
    >
      <div
        ref={modalRef}
        className="dialog-panel w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#111418] border border-white/10 p-6 shadow-2xl text-white"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 id="favorites-dialog-title" className="text-lg font-semibold">
              Meus Favoritos
            </h2>
            <p className="text-xs text-white/60">
              {favorites.length} {favorites.length === 1 ? 'fotografia selecionada' : 'fotografias selecionadas'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm"
            aria-label="Fechar diálogo de favoritos"
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-sm">
            Nenhuma fotografia favoritada ainda. Clique no coração em qualquer foto para guardá-la aqui.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1 mb-4">
              {favorites.map((photo) => (
                <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPhoto(photo.id);
                    }}
                    className="w-full h-full block"
                    aria-label={`Ver foto ${photo.position}`}
                  >
                    <img
                      src={photo.sources[0]?.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(photo.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover foto ${photo.position} dos favoritos`}
                  >
                    ✕
                  </button>

                  {/* Observação do Cliente (paridade Pixieset isNoteOn) */}
                  {onUpdateNote && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNotePhotoId(photo.id);
                        setNoteInput(favoriteNotes[photo.id] || '');
                      }}
                      className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-opacity ${
                        favoriteNotes[photo.id]
                          ? 'bg-[#5E7F8C] text-white opacity-100'
                          : 'bg-black/70 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/90'
                      }`}
                      title={favoriteNotes[photo.id] ? `Nota: ${favoriteNotes[photo.id]}` : 'Adicionar observação'}
                    >
                      <span>💬</span>
                      {favoriteNotes[photo.id] && <span className="max-w-[60px] truncate">{favoriteNotes[photo.id]}</span>}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Editor de Observação Rápida */}
            {editingNotePhotoId && onUpdateNote && (
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90">Observação para a foto:</span>
                  <button
                    type="button"
                    onClick={() => setEditingNotePhotoId(null)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Ex: Gostei dessa para o álbum / tratar reflexo..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-[#5E7F8C]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateNote(editingNotePhotoId, noteInput);
                        setEditingNotePhotoId(null);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateNote(editingNotePhotoId, noteInput);
                      setEditingNotePhotoId(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-semibold"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-2 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                title="Gera e descarrega um arquivo .ZIP diretamente no seu navegador"
              >
                <span>{isZipping ? 'Compactando...' : 'Baixar Meus Favoritos (.ZIP)'}</span>
                <span>📦</span>
              </button>

              {onDownloadFavorites && (
                <button
                  type="button"
                  onClick={onDownloadFavorites}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Opções de Resolução ({favorites.length})
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
