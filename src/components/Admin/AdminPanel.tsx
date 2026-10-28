import React, { useEffect, useState } from 'react';
import type { CollectionConfigUpdate, ExportRequest, GalleryCollection } from '../../types/gallery';
import {
  availableCollections,
  getCollectionData,
} from '../../data/collectionsRegistry';
import {
  getStoredCollectionConfig,
  saveCollectionConfig,
  resetCollectionConfig,
  getAllExportRequests,
  clearExportRequests,
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminPassword,
} from '../../lib/collectionSettings';

interface AdminPanelProps {
  initialSlug?: string;
  onClose: () => void;
  onSelectCollection?: (slug: string) => void;
}

export function AdminPanel({
  initialSlug = 'modec-dia-das-criancas-2026',
  onClose,
  onSelectCollection,
}: AdminPanelProps) {
  // Estado de Autenticação do Vini
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminAuthenticated());
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Aba ativa: 'config' | 'requests' | 'handoff'
  const [activeTab, setActiveTab] = useState<'config' | 'requests' | 'handoff'>('config');

  // Slug da coleção sendo gerenciada
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);

  // Dados da coleção ativa
  const activeData = getCollectionData(selectedSlug);
  const baseCol = activeData.collection;

  // Estados locais do formulário de configuração
  const [title, setTitle] = useState(baseCol.title);
  const [passwordRequired, setPasswordRequired] = useState(baseCol.passwordRequired);
  const [clientPassword, setClientPassword] = useState(baseCol.clientPassword || '');
  const [clientEmail, setClientEmail] = useState(baseCol.clientEmail || '');
  const [visibility, setVisibility] = useState(baseCol.visibility);
  const [downloadEnabled, setDownloadEnabled] = useState(baseCol.downloads.enabled);
  const [requiresPin, setRequiresPin] = useState(baseCol.downloads.requiresPin);
  const [downloadPin, setDownloadPin] = useState(baseCol.downloads.pin || '');
  const [requiresEmail, setRequiresEmail] = useState(baseCol.downloads.requiresEmail);
  const [directFolderUrl, setDirectFolderUrl] = useState(baseCol.downloads.directFolderUrl || '');
  const [clientNotes, setClientNotes] = useState(baseCol.clientNotes || '');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Solicitações de exportação
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);

  // Carregar dados salvos ao trocar de coleção
  useEffect(() => {
    const data = getCollectionData(selectedSlug);
    const col = data.collection;
    setTitle(col.title);
    setPasswordRequired(col.passwordRequired);
    setClientPassword(col.clientPassword || '');
    setClientEmail(col.clientEmail || '');
    setVisibility(col.visibility);
    setDownloadEnabled(col.downloads.enabled);
    setRequiresPin(col.downloads.requiresPin);
    setDownloadPin(col.downloads.pin || '');
    setRequiresEmail(col.downloads.requiresEmail);
    setDirectFolderUrl(col.downloads.directFolderUrl || '');
    setClientNotes(col.clientNotes || '');
  }, [selectedSlug]);

  useEffect(() => {
    setExportRequests(getAllExportRequests());
  }, [activeTab]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(adminPasswordInput)) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Senha de administrador incorreta (padrão: versa2026).');
    }
  };

  const handleSaveConfig = () => {
    const update: CollectionConfigUpdate = {
      title,
      passwordRequired,
      clientPassword: clientPassword.trim(),
      clientEmail: clientEmail.trim(),
      visibility,
      clientNotes,
      downloads: {
        enabled: downloadEnabled,
        requiresPin,
        pin: downloadPin.trim(),
        requiresEmail,
        directFolderUrl: directFolderUrl.trim(),
      },
    };

    saveCollectionConfig(selectedSlug, update);
    setSaveToast('Configurações salvas com sucesso!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetConfig = () => {
    if (window.confirm(`Deseja restaurar as configurações originais da coleção "${selectedSlug}"?`)) {
      resetCollectionConfig(selectedSlug);
      const data = getCollectionData(selectedSlug);
      const col = data.collection;
      setTitle(col.title);
      setPasswordRequired(col.passwordRequired);
      setClientPassword('');
      setClientEmail('');
      setVisibility(col.visibility);
      setDownloadEnabled(col.downloads.enabled);
      setRequiresPin(col.downloads.requiresPin);
      setDownloadPin('');
      setRequiresEmail(col.downloads.requiresEmail);
      setDirectFolderUrl('');
      setClientNotes('');
      setSaveToast('Configurações restauradas para o padrão.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Gerador de mensagem WhatsApp padronizada (Versa Visual)
  const galleryUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?collection=${selectedSlug}`
      : `https://versa.gallery/?collection=${selectedSlug}`;

  const clientName = clientNotes?.trim() || 'Cliente';
  const whatsappMessage = `Fala, ${clientName}! Tudo certo?

A sua galeria já está no ar com todas as fotos selecionadas e tratadas:
📸 ${title}
🔗 ${galleryUrl}
${passwordRequired && clientPassword ? `🔑 Senha de acesso: ${clientPassword}\n` : ''}${requiresPin && downloadPin ? `📥 PIN para download: ${downloadPin}\n` : ''}
Pode navegar, favoritar as preferidas e baixar em alta resolução. Quando postar, não esquece de marcar @v1ncsc! Qualquer dúvida, estou por aqui.`;

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setSaveToast('Mensagem pronta copiada para a área de transferência!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Se não autenticado como Vini, exibe tela de login de admin
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050A0D] text-white p-4 font-['DM_Sans']">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0c1015] border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#5E7F8C] uppercase block mb-1">
              VERSA VISUAL
            </span>
            <h2 className="text-xl font-bold font-['Outfit']">Painel do Fotógrafo</h2>
            <p className="text-xs text-white/50 mt-1">Acesso restrito ao operador</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Senha de Operador
              </label>
              <input
                type="password"
                autoFocus
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Digite a senha mestra"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C]"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Acessar Painel
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              Voltar para a Galeria
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050A0D] text-[#f5f5f4] overflow-hidden font-['DM_Sans'] select-none">
      {/* Barra de Notificação Toast */}
      {saveToast && (
        <div className="absolute top-4 right-4 z-50 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-medium shadow-xl border border-emerald-400/30 flex items-center gap-2 animate-fade-in">
          <span>✓</span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Superior do Painel */}
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-[#090D11] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-[0.25em] text-[#5E7F8C] uppercase font-['Outfit']">
            VERSA
          </span>
          <span className="text-white/20">/</span>
          <span className="text-sm font-semibold text-white font-['Outfit']">
            Painel do Vini — Gestão de Galerias
          </span>
        </div>

        {/* Seletor de Coleção Ativa */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="col-select" className="text-xs text-white/50">
              Coleção:
            </label>
            <select
              id="col-select"
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                onSelectCollection?.(e.target.value);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C]"
            >
              {Object.keys(availableCollections).map((slug) => (
                <option key={slug} value={slug} className="bg-[#0c1015] text-white">
                  {availableCollections[slug]?.collection.title || slug}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-xs text-white/80 hover:text-white transition-colors"
          >
            Visualizar Galeria ↗
          </button>
        </div>
      </header>

      {/* Abas de Navegação */}
      <div className="px-6 border-b border-white/10 bg-[#090D11]/60 flex gap-4 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-[#5E7F8C] text-white'
              : 'border-transparent text-white/50 hover:text-white/80'
          }`}
        >
          ⚙ Configurações de Acesso & Download
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('handoff')}
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'handoff'
              ? 'border-[#5E7F8C] text-white'
              : 'border-transparent text-white/50 hover:text-white/80'
          }`}
        >
          💬 Mensagem WhatsApp do Cliente
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'border-[#5E7F8C] text-white'
              : 'border-transparent text-white/50 hover:text-white/80'
          }`}
        >
          <span>📥 Registro de Downloads & Exportações</span>
          {exportRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#5E7F8C]/30 text-[#85aab8] text-[10px] font-bold">
              {exportRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo Principal com Rolagem */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#050A0D]">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ABA 1: CONFIGURAÇÃO */}
          {activeTab === 'config' && (
            <>
              {/* Card 1: Acesso e Senha do Cliente */}
              <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white font-['Outfit']">
                      Segurança & Acesso do Cliente
                    </h3>
                    <p className="text-xs text-white/50">
                      Controle de exibição, senha de entrada e restrição por e-mail.
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${
                      passwordRequired
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {passwordRequired ? '🔒 Protegida por Senha' : '🌐 Pública'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1.5">
                      Título da Galeria
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1.5">
                      Visibilidade da Galeria
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C]"
                    >
                      <option value="public">Pública (Livre)</option>
                      <option value="password">Protegida por Senha</option>
                      <option value="client-only">Exclusiva do Cliente (Senha + E-mail)</option>
                      <option value="hidden">Oculta / Privada</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-white block">
                        Exigir Senha de Acesso
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Exibe o desafio de senha antes de carregar as fotografias
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passwordRequired}
                        onChange={(e) => setPasswordRequired(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5E7F8C]"></div>
                    </label>
                  </div>

                  {passwordRequired && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          Senha do Cliente
                        </label>
                        <input
                          type="text"
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="Ex: modec2026"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-[#5E7F8C]"
                        />
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Senha que o cliente digitará na tela de entrada.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          E-mail do Cliente Autorizado (Opcional)
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="cliente@empresa.com"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-[#5E7F8C]"
                        />
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Se preenchido, apenas este e-mail poderá acessar.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Políticas de Exportação & Download */}
              <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white font-['Outfit']">
                      Políticas de Download & Exportação Solicitada
                    </h3>
                    <p className="text-xs text-white/50">
                      Regras de liberação de arquivos, PIN de download e link direto de entrega.
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${
                      downloadEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {downloadEnabled ? 'Downloads Ativos' : 'Downloads Desativados'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-white block">
                        Permitir Downloads aos Visitantes
                      </span>
                      <span className="text-[11px] text-white/50 block">
                        Habilita os botões de baixar fotos individuais e pacote completo
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={downloadEnabled}
                        onChange={(e) => setDownloadEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5E7F8C]"></div>
                    </label>
                  </div>

                  {downloadEnabled && (
                    <div className="pt-2 border-t border-white/5 space-y-4">
                      {/* Exigir PIN */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-white block">
                            Exigir PIN de 4 Dígitos para Download
                          </span>
                          <span className="text-[11px] text-white/50 block">
                            Trava o download de alta resolução para quem não tiver o PIN do contrato
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={requiresPin}
                            onChange={(e) => setRequiresPin(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5E7F8C]"></div>
                        </label>
                      </div>

                      {requiresPin && (
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">
                            PIN de Download
                          </label>
                          <input
                            type="text"
                            maxLength={8}
                            value={downloadPin}
                            onChange={(e) => setDownloadPin(e.target.value)}
                            placeholder="Ex: 2026 ou 1234"
                            className="w-48 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-[#5E7F8C]"
                          />
                        </div>
                      )}

                      {/* Exigir E-mail */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-white block">
                            Exigir E-mail no Formulário de Download
                          </span>
                          <span className="text-[11px] text-white/50 block">
                            Captura e audita quem realizou o download das imagens
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={requiresEmail}
                            onChange={(e) => setRequiresEmail(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5E7F8C]"></div>
                        </label>
                      </div>

                      {/* Link Direto de Pasta */}
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          Link Direto da Pasta do Drive / Nuvem (Para entrega alternativa)
                        </label>
                        <input
                          type="url"
                          value={directFolderUrl}
                          onChange={(e) => setDirectFolderUrl(e.target.value)}
                          placeholder="https://drive.google.com/drive/folders/..."
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-[#5E7F8C]"
                        />
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Quando preenchido, o cliente pode acessar diretamente os arquivos brutos.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="px-4 py-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-300 text-xs font-medium transition-colors"
                >
                  Restaurar Padrões da Coleção
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-6 py-2.5 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#5E7F8C]/20"
                >
                  Salvar Configurações
                </button>
              </div>
            </>
          )}

          {/* ABA 2: MENSAGEM WHATSAPP */}
          {activeTab === 'handoff' && (
            <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white font-['Outfit']">
                    Alinhamento & Envio ao Cliente (WhatsApp / E-mail)
                  </h3>
                  <p className="text-xs text-white/50">
                    Mensagem pronta formatada para envio imediato ao cliente contratante.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="px-4 py-2 rounded-lg bg-[#5E7F8C] hover:bg-[#6e919f] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Copiar Mensagem
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Nome do Cliente / Empresa
                </label>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ex: Equipe MODEC ou Mariana"
                  className="w-full max-w-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5E7F8C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Texto Final Pronto
                </label>
                <textarea
                  readOnly
                  rows={9}
                  value={whatsappMessage}
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono leading-relaxed outline-none focus:border-[#5E7F8C] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <span>Abrir no WhatsApp Web ↗</span>
                </a>
              </div>
            </div>
          )}

          {/* ABA 3: SOLICITAÇÕES DE EXPORTAÇÃO */}
          {activeTab === 'requests' && (
            <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white font-['Outfit']">
                    Registro de Solicitações de Download & Exportações
                  </h3>
                  <p className="text-xs text-white/50">
                    Auditoria de clientes que geraram downloads ou solicitaram pacotes de imagem.
                  </p>
                </div>
                {exportRequests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Deseja limpar todo o histórico de solicitações?')) {
                        clearExportRequests();
                        setExportRequests([]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-300 text-xs transition-colors"
                  >
                    Limpar Histórico
                  </button>
                )}
              </div>

              {exportRequests.length === 0 ? (
                <div className="py-12 text-center text-white/40 space-y-2">
                  <p className="text-sm">Nenhuma solicitação de download registrada até o momento.</p>
                  <p className="text-xs text-white/30">
                    Quando visitantes ou clientes baixarem fotos com e-mail informado, os dados
                    aparecerão aqui em tempo real.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50">
                        <th className="py-2.5 px-3">Data / Hora</th>
                        <th className="py-2.5 px-3">Coleção</th>
                        <th className="py-2.5 px-3">E-mail do Cliente</th>
                        <th className="py-2.5 px-3">Tipo</th>
                        <th className="py-2.5 px-3">Resolução</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {exportRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 text-white/70">
                            {new Date(req.requestedAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-2.5 px-3 text-white font-medium">
                            {req.collectionTitle}
                          </td>
                          <td className="py-2.5 px-3 text-white/90 font-mono">
                            {req.clientEmail || 'Não informado'}
                          </td>
                          <td className="py-2.5 px-3 text-white/70">
                            {req.type === 'single'
                              ? `Foto (${req.photoFileName || req.photoId})`
                              : 'Coleção Completa'}
                          </td>
                          <td className="py-2.5 px-3 uppercase text-[11px] text-[#85aab8]">
                            {req.requestedSize}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

