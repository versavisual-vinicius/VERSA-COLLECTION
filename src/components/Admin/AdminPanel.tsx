import { useEffect, useMemo, useState } from 'react';
import type { CollectionVisibility, ExportRequest, GallerySet } from '../../types/gallery';
import { availableCollections, getCollectionData } from '../../data/collectionsRegistry';
import {
  getAllExportRequests,
  getStoredCollectionConfig,
  saveCollectionConfig,
} from '../../lib/collectionSettings';
import { CoverFocalPicker } from './CoverFocalPicker';
import {
  backendEnabled,
  fetchAdminCollections,
  fetchAdminExportRequests,
  getAdminSession,
  importLegacyBrowserData,
  requestAdminMagicLink,
  signOutAdmin,
  updateAdminCollection,
  type AdminCollection,
} from '../../lib/backend';

interface AdminPanelProps {
  initialSlug?: string;
  onClose: () => void;
  onSelectCollection?: (slug: string) => void;
  onCollectionUpdated?: () => void;
}

type Tab = 'widgets' | 'config' | 'editorial' | 'sets' | 'handoff' | 'requests';

function buildLocalAdminCollections(): AdminCollection[] {
  return Object.keys(availableCollections).map((slug) => {
    const resolved = getCollectionData(slug).collection;
    const stored = getStoredCollectionConfig(slug);
    const coverSrc =
      resolved.cover?.sources?.[1]?.url ||
      resolved.cover?.sources?.[0]?.url ||
      '';

    return {
      id: resolved.id,
      slug: resolved.slug || slug,
      title: resolved.title,
      visibility: resolved.visibility,
      passwordRequired: resolved.passwordRequired,
      hasPassword: Boolean(stored?.clientPassword || resolved.clientPassword),
      clientEmails: resolved.clientEmails ?? (resolved.clientEmail ? [resolved.clientEmail] : []),
      downloads: resolved.downloads,
      hasDownloadPin: Boolean(stored?.downloads?.pin || resolved.downloads?.pin),
      clientNotes: resolved.clientNotes ?? '',
      updatedAt: new Date().toISOString(),
      expiresAt: resolved.expiresAt,
      coverFocalPoint: resolved.coverFocalPoint ?? { x: 50, y: 50 },
      theme: resolved.theme,
      coverUrl: coverSrc,
      sets: resolved.sets ?? [],
    };
  });
}

export function AdminPanel({
  initialSlug = 'modec-dia-das-criancas-2026',
  onClose,
  onSelectCollection,
  onCollectionUpdated,
}: AdminPanelProps) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(backendEnabled);
  const [isAuthenticated, setIsAuthenticated] = useState(!backendEnabled);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<AdminCollection[]>(() =>
    backendEnabled ? [] : buildLocalAdminCollections(),
  );
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [requests, setRequests] = useState<ExportRequest[]>(() =>
    backendEnabled ? [] : getAllExportRequests(),
  );
  const [activeTab, setActiveTab] = useState<Tab>('widgets');
  const [isSaving, setIsSaving] = useState(false);

  const selected = useMemo(
    () => collections.find((collection) => collection.slug === selectedSlug) ?? collections[0],
    [collections, selectedSlug],
  );

  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState<CollectionVisibility>('public');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [clientEmails, setClientEmails] = useState('');
  const [downloadEnabled, setDownloadEnabled] = useState(true);
  const [requiresEmail, setRequiresEmail] = useState(false);
  const [requiresPin, setRequiresPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [directFolderUrl, setDirectFolderUrl] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [headingFont, setHeadingFont] = useState('Outfit, sans-serif');
  const [overlayOpacity, setOverlayOpacity] = useState(0.65);
  const [sets, setSets] = useState<GallerySet[]>([]);
  const [newSetName, setNewSetName] = useState('');

  useEffect(() => {
    if (!backendEnabled) {
      setIsLoadingAuth(false);
      setIsAuthenticated(true);
      const localItems = buildLocalAdminCollections();
      setCollections(localItems);
      if (!localItems.some((item) => item.slug === selectedSlug) && localItems[0]) {
        setSelectedSlug(localItems[0].slug);
      }
      return;
    }
    void getAdminSession()
      .then((session) => setIsAuthenticated(Boolean(session)))
      .catch(() => setError('Não foi possível validar a sessão administrativa.'))
      .finally(() => setIsLoadingAuth(false));
  }, [selectedSlug]);

  useEffect(() => {
    if (!backendEnabled || !isAuthenticated) return;
    void fetchAdminCollections()
      .then((items) => {
        setCollections(items);
        if (!items.some((item) => item.slug === selectedSlug) && items[0]) setSelectedSlug(items[0].slug);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar coleções.'));
  }, [isAuthenticated, selectedSlug]);

  useEffect(() => {
    if (!selected) return;
    setTitle(selected.title);
    setVisibility(selected.visibility);
    setPasswordRequired(selected.passwordRequired);
    setNewPassword('');
    setClientEmails(selected.clientEmails.join(', '));
    setDownloadEnabled(selected.downloads.enabled);
    setRequiresEmail(selected.downloads.requiresEmail);
    setRequiresPin(selected.downloads.requiresPin);
    setNewPin('');
    setDirectFolderUrl(selected.downloads.directFolderUrl ?? '');
    setClientNotes(selected.clientNotes);
    setExpiresAt(selected.expiresAt ? selected.expiresAt.slice(0, 10) : '');
    setFocalPoint(selected.coverFocalPoint ?? { x: 50, y: 50 });
    setHeadingFont(selected.theme?.headingFont ?? 'Outfit, sans-serif');
    setOverlayOpacity(selected.theme?.coverOverlayOpacity ?? 0.65);
    setSets(selected.sets ?? []);
  }, [selected]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'requests') return;
    if (!backendEnabled) {
      setRequests(getAllExportRequests());
      return;
    }
    void fetchAdminExportRequests()
      .then(setRequests)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar solicitações.'));
  }, [activeTab, isAuthenticated]);

  const sendMagicLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await requestAdminMagicLink(email);
      setMessage('Magic link enviado. Abra o e-mail neste navegador para concluir o acesso.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível enviar o magic link.');
    }
  };

  const save = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const updatePayload = {
      title: title.trim(),
      visibility,
      passwordRequired,
      clientPassword: newPassword.trim() || undefined,
      clientEmails: clientEmails.split(',').map((value) => value.trim()).filter(Boolean),
      clientNotes: clientNotes.trim(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      coverFocalPoint: focalPoint,
      theme: {
        ...(selected.theme ?? {
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'DM Sans, sans-serif',
          foreground: '#f5f5f4',
          background: '#050A0D',
          gridGapDesktop: 16,
          gridGapMobile: 8,
          coverOverlayOpacity: 0.65,
        }),
        headingFont,
        coverOverlayOpacity: overlayOpacity,
      },
      sets,
      downloads: {
        ...selected.downloads,
        enabled: downloadEnabled,
        requiresEmail,
        requiresPin,
        pin: newPin.trim() || undefined,
        directFolderUrl: directFolderUrl.trim() || undefined,
      },
    };

    try {
      if (!backendEnabled) {
        saveCollectionConfig(selected.slug, updatePayload);
        const refreshed = buildLocalAdminCollections();
        setCollections(refreshed);
        onCollectionUpdated?.();
        setMessage('Configurações salvas localmente e aplicadas na galeria.');
        return;
      }

      const updated = await updateAdminCollection(selected.slug, updatePayload);
      setCollections((current) => current.map((item) => (item.slug === updated.slug ? updated : item)));
      onCollectionUpdated?.();
      setMessage('Configurações salvas no backend com sucesso.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const migrateLegacy = async () => {
    setError(null);
    if (!backendEnabled) {
      setMessage('Modo local ativo: as configurações já estão sincronizadas neste navegador.');
      return;
    }
    try {
      const summary = await importLegacyBrowserData();
      setMessage(`Migração verificada: ${summary.collections} configuração(ões) e ${summary.requests} solicitação(ões).`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível migrar os dados locais.');
    }
  };

  const galleryUrl = `${window.location.origin}/?collection=${encodeURIComponent(selectedSlug)}`;
  const whatsappMessage = `Fala, ${clientNotes.trim() || 'Cliente'}! Tudo certo?\n\nA sua galeria já está no ar:\n📸 ${title}\n🔗 ${galleryUrl}${newPassword ? `\n🔑 Senha: ${newPassword}` : ''}${newPin ? `\n📥 PIN: ${newPin}` : ''}\n\nPode navegar, favoritar e baixar. Quando postar, marca @v1ncsc.`;

  if (isLoadingAuth) {
    return (
      <PanelShell onClose={onClose}>
        <p>Validando sessão segura…</p>
      </PanelShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PanelShell onClose={onClose}>
        <h2 className="text-xl font-bold font-['Outfit'] text-[#11161B]">Painel do Fotógrafo</h2>
        <p className="mt-2 text-xs text-[#5A6872]">Acesso restrito por magic link.</p>
        <form onSubmit={sendMagicLink} className="mt-6 space-y-3">
          <label htmlFor="admin-email" className="block text-xs font-medium text-[#5A6872]">E-mail autorizado</label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#5E7F8C]/20 bg-white px-3 py-2 text-sm text-[#11161B] shadow-2xs outline-none focus:border-[#5E7F8C]"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors"
          >
            Enviar magic link
          </button>
        </form>
        <Feedback message={message} error={error} />
      </PanelShell>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F6F8F9] text-[#11161B] font-['DM_Sans']"
      role="dialog"
      aria-label="Painel do Fotógrafo"
      data-testid="admin-panel"
    >
      <header className="flex h-16 items-center justify-between border-b border-[#5E7F8C]/15 bg-[#F6F8F9]/90 backdrop-blur-md px-6">
        <div className="flex items-center gap-3">
          <strong className="font-['Outfit'] font-bold text-[#11161B]">VERSA / Painel do Fotógrafo</strong>
          <span className="rounded-full bg-[#5E7F8C]/10 border border-[#5E7F8C]/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5E7F8C]">
            {backendEnabled ? 'Cloud Sync' : 'Estúdio Local'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {backendEnabled && (
            <>
              <button
                type="button"
                onClick={() => void migrateLegacy()}
                className="rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white hover:bg-[#F6F8F9] px-3.5 py-1.5 text-xs font-semibold text-[#11161B] shadow-xs transition-colors"
              >
                Migrar dados locais
              </button>
              <button
                type="button"
                onClick={() => void signOutAdmin().then(() => setIsAuthenticated(false))}
                className="rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white hover:bg-[#F6F8F9] px-3.5 py-1.5 text-xs font-semibold text-[#11161B] shadow-xs transition-colors"
              >
                Sair
              </button>
            </>
          )}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void save()}
            className="rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-4 py-1.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Salvando…' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedSlug && onSelectCollection) {
                onSelectCollection(selectedSlug);
              }
              onClose();
            }}
            className="rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white hover:bg-[#F6F8F9] px-3.5 py-1.5 text-xs font-semibold text-[#11161B] shadow-xs transition-colors"
          >
            Abrir Galeria
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white hover:bg-[#F6F8F9] px-3.5 py-1.5 text-xs font-semibold text-[#11161B] shadow-xs transition-colors"
          >
            Voltar para a galeria
          </button>
        </div>
      </header>

      <nav className="flex items-center gap-2 border-b border-[#5E7F8C]/15 px-6 bg-white/60 backdrop-blur-xs overflow-x-auto">
        {(
          [
            { id: 'widgets', label: 'Widgets' },
            { id: 'config', label: 'Configurações' },
            { id: 'editorial', label: 'Capa & Visual' },
            { id: 'sets', label: 'Conjuntos (Sets)' },
            { id: 'handoff', label: 'WhatsApp' },
            { id: 'requests', label: 'Solicitações' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`py-3 px-2 text-xs whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'border-b-2 border-[#5E7F8C] text-[#11161B] font-bold'
                : 'text-[#5A6872] hover:text-[#11161B]'
            }`}
          >
            {t.label}
          </button>
        ))}
        <select
          aria-label="Selecionar coleção"
          value={selectedSlug}
          onChange={(event) => {
            setSelectedSlug(event.target.value);
            onSelectCollection?.(event.target.value);
          }}
          className="ml-auto bg-white border border-[#5E7F8C]/20 text-[#11161B] rounded-lg px-2.5 py-1 text-xs shadow-xs focus:border-[#5E7F8C] outline-none"
        >
          {collections.map((collection) => (
            <option key={collection.slug} value={collection.slug}>
              {collection.title}
            </option>
          ))}
        </select>
      </nav>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <Feedback message={message} error={error} />

          {selected && (
            <div className={activeTab === 'widgets' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start' : 'max-w-3xl mx-auto space-y-5'}>
              {(activeTab === 'widgets' || activeTab === 'config') && (
                <>
                  <Section title="Acesso da galeria" subtitle="Privacidade e proteção" badge={visibility.toUpperCase()}>
                    <Field label="Título"><input value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
                    <Field label="Visibilidade">
                      <select value={visibility} onChange={(event) => setVisibility(event.target.value as CollectionVisibility)}>
                        <option value="public">Pública</option>
                        <option value="password">Protegida</option>
                        <option value="client-only">Cliente</option>
                        <option value="hidden">Oculta</option>
                      </select>
                    </Field>
                    <Toggle label="Exigir senha" checked={passwordRequired} onChange={setPasswordRequired} />
                    {passwordRequired && (
                      <Field label={selected.hasPassword ? 'Nova senha (vazio mantém a atual)' : 'Senha'}>
                        <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                      </Field>
                    )}
                    <Field label="E-mails autorizados, separados por vírgula">
                      <input value={clientEmails} onChange={(event) => setClientEmails(event.target.value)} />
                    </Field>
                    <Field label="Data limite de expiração da galeria">
                      <input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
                    </Field>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void save()}
                      className="w-full mt-2 rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? 'Salvando…' : 'Salvar Configurações'}
                    </button>
                  </Section>

                  <Section title="Downloads" subtitle="Políticas de entrega">
                    <Toggle label="Downloads ativos" checked={downloadEnabled} onChange={setDownloadEnabled} />
                    <Toggle label="Exigir e-mail" checked={requiresEmail} onChange={setRequiresEmail} />
                    <Toggle label="Exigir PIN" checked={requiresPin} onChange={setRequiresPin} />
                    {requiresPin && (
                      <Field label={selected.hasDownloadPin ? 'Novo PIN (vazio mantém o atual)' : 'PIN'}>
                        <input type="password" value={newPin} onChange={(event) => setNewPin(event.target.value)} />
                      </Field>
                    )}
                    <Field label="Link direto da pasta">
                      <input value={directFolderUrl} onChange={(event) => setDirectFolderUrl(event.target.value)} />
                    </Field>
                    <Field label="Nome/notas do cliente">
                      <textarea value={clientNotes} onChange={(event) => setClientNotes(event.target.value)} />
                    </Field>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void save()}
                      className="w-full mt-2 rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? 'Salvando…' : 'Salvar Downloads'}
                    </button>
                  </Section>
                </>
              )}

              {(activeTab === 'widgets' || activeTab === 'editorial') && (
                <Section title="Capa & Visual Editorial" subtitle="Ponto focal e tipografia">
                  <CoverFocalPicker
                    coverUrl={selected.coverUrl || 'https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w1024'}
                    focalPoint={focalPoint}
                    onChange={setFocalPoint}
                  />

                  <div className="pt-2 space-y-3">
                    <Field label="Fonte dos Títulos">
                      <select value={headingFont} onChange={(e) => setHeadingFont(e.target.value)}>
                        <option value="Outfit, sans-serif">Outfit (Padrão Oficial Versa Visual)</option>
                        <option value="Righteous, cursive">Righteous (Display de Destaque)</option>
                        <option value="DM Sans, sans-serif">DM Sans (Minimalista)</option>
                      </select>
                    </Field>

                    <Field label={`Opacidade do Gradiente Escuro (${Math.round(overlayOpacity * 100)}%)`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0.1"
                          max="0.95"
                          step="0.05"
                          value={overlayOpacity}
                          onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                          className="flex-1 accent-[#5E7F8C]"
                        />
                        <span className="text-xs font-mono text-[#5A6872] w-12 text-right">
                          {Math.round(overlayOpacity * 100)}%
                        </span>
                      </div>
                    </Field>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void save()}
                    className="w-full mt-2 rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Salvando…' : 'Salvar Estilo Visual'}
                  </button>
                </Section>
              )}

              {(activeTab === 'widgets' || activeTab === 'sets') && (
                <Section title="Conjuntos (Sets)" subtitle="Organização de sub-galerias">
                  <p className="text-xs text-[#5A6872]">
                    Organize as fotografias em seções (ex: Destaques, Cerimônia, Recepção).
                  </p>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Nome do novo conjunto..."
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                      className="flex-1 rounded-lg border border-[#5E7F8C]/20 bg-white px-3 py-2 text-xs text-[#11161B] outline-none focus:border-[#5E7F8C] shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!newSetName.trim()) return;
                          const slug = newSetName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                          setSets((prev) => [
                            ...prev,
                            { id: `set-${Date.now()}`, title: newSetName.trim(), slug, photoIds: [] },
                          ]);
                          setNewSetName('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSetName.trim()) return;
                        const slug = newSetName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                        setSets((prev) => [
                          ...prev,
                          { id: `set-${Date.now()}`, title: newSetName.trim(), slug, photoIds: [] },
                        ]);
                        setNewSetName('');
                      }}
                      className="rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                    {sets.length === 0 ? (
                      <p className="text-xs text-[#5A6872]/60 italic py-2">
                        Nenhum conjunto configurado. Todas as fotos são exibidas juntas na galeria principal.
                      </p>
                    ) : (
                      sets.map((set, idx) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#F6F8F9] border border-[#5E7F8C]/15 text-xs"
                        >
                          <div>
                            <strong className="text-[#11161B]">{set.title}</strong>
                            <span className="ml-2 font-mono text-[10px] text-[#5A6872]">slug: {set.slug}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSets((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:text-red-700 p-1 text-xs font-medium transition-colors"
                            title="Remover conjunto"
                          >
                            ✕ Excluir
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void save()}
                    className="w-full mt-2 rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Salvando…' : 'Salvar Conjuntos'}
                  </button>
                </Section>
              )}

              {(activeTab === 'widgets' || activeTab === 'handoff') && (
                <Section title="Mensagem Pronta de WhatsApp" subtitle="Disparo direto com minuta">
                  <pre className="whitespace-pre-wrap rounded-xl bg-[#F6F8F9] border border-[#5E7F8C]/15 p-4 text-xs font-mono text-[#11161B]">
                    {whatsappMessage}
                  </pre>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(whatsappMessage).then(() => setMessage('Mensagem copiada para a área de transferência.'))}
                      className="flex-1 rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors text-center"
                    >
                      Copiar Mensagem
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg border border-[#5E7F8C]/20 hover:border-[#5E7F8C]/40 bg-white hover:bg-[#F6F8F9] px-4 py-2 text-xs font-semibold text-[#11161B] shadow-xs transition-colors text-center"
                    >
                      Abrir no WhatsApp
                    </a>
                  </div>
                  <p className="text-[11px] text-amber-700/90 font-medium">
                    Senha e PIN aparecem na minuta quando definidos nesta sessão.
                  </p>
                </Section>
              )}

              {(activeTab === 'widgets' || activeTab === 'requests') && (
                <Section title="Últimas solicitações de exportação" subtitle="Histórico de downloads">
                  {requests.length === 0 ? (
                    <p className="text-xs text-[#5A6872] py-4 text-center">Nenhuma solicitação registrada até o momento.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {requests.map((request) => (
                        <div key={request.id} className="border-b border-[#5E7F8C]/15 py-2.5 text-xs text-[#11161B]">
                          <strong>{request.collectionTitle}</strong> · {request.type} · {request.requestedSize}
                          <br />
                          <span className="text-[#5A6872]">
                            {request.clientEmail || 'sem e-mail'} · {new Date(request.requestedAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PanelShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-[#11161B]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#5E7F8C]/20 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="absolute top-4 right-4 text-[#5A6872] hover:text-[#11161B] p-1 text-sm rounded-lg transition-colors"
        >
          ✕
        </button>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-2.5 px-4 rounded-lg border border-[#5E7F8C]/20 bg-white hover:bg-[#F6F8F9] text-xs font-semibold uppercase tracking-wider text-[#11161B] transition-colors text-center shadow-xs"
        >
          Voltar para a galeria
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  badge,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`space-y-4 rounded-2xl border border-[#5E7F8C]/15 bg-white p-5 shadow-xs transition-shadow hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between border-b border-[#5E7F8C]/10 pb-3">
        <div>
          <h3 className="font-['Outfit'] font-bold text-sm tracking-wide text-[#11161B] uppercase">{title}</h3>
          {subtitle && <p className="text-[11px] text-[#5A6872] mt-0.5">{subtitle}</p>}
        </div>
        {badge && (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#5E7F8C]/10 text-[#5E7F8C] border border-[#5E7F8C]/20">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[#5A6872]">
      {label}
      <div className="mt-1.5 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#5E7F8C]/20 [&_input]:bg-white [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-[#11161B] [&_input]:shadow-2xs [&_input]:outline-none [&_input:focus]:border-[#5E7F8C] [&_input:focus]:ring-1 [&_input:focus]:ring-[#5E7F8C] [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#5E7F8C]/20 [&_select]:bg-white [&_select]:p-2 [&_select]:text-sm [&_select]:text-[#11161B] [&_select]:shadow-2xs [&_select]:outline-none [&_select:focus]:border-[#5E7F8C] [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#5E7F8C]/20 [&_textarea]:bg-white [&_textarea]:p-3 [&_textarea]:text-sm [&_textarea]:text-[#11161B] [&_textarea]:shadow-2xs [&_textarea]:outline-none [&_textarea:focus]:border-[#5E7F8C]">
        {children}
      </div>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-xs font-medium text-[#11161B] cursor-pointer py-1">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="w-4 h-4 rounded border-[#5E7F8C]/30 text-[#5E7F8C] focus:ring-[#5E7F8C] cursor-pointer"
      />
    </label>
  );
}

function Feedback({ message, error }: { message: string | null; error: string | null }) {
  if (!message && !error) return null;
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`rounded-xl border p-3.5 text-xs font-medium ${
        error
          ? 'border-red-500/20 bg-red-50 text-red-700'
          : 'border-emerald-500/20 bg-emerald-50 text-emerald-800'
      }`}
    >
      {error ?? message}
    </p>
  );
}
