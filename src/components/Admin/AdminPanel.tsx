import { useEffect, useMemo, useState } from 'react';
import type { CollectionVisibility, ExportRequest, GalleryPhoto, GallerySet } from '../../types/gallery';
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
  getAdminSessionSync,
  importLegacyBrowserData,
  loginAdmin,
  signOutAdmin,
  updateAdminCollection,
  type AdminCollection,
} from '../../lib/backend';

interface AdminPanelProps {
  initialSlug?: string;
  onClose: () => void;
  onNavigateDashboard?: () => void;
  onSelectCollection?: (slug: string) => void;
  onCollectionUpdated?: () => void;
}

type Tab = 'config' | 'editorial' | 'sets' | 'handoff' | 'requests';

function buildLocalAdminCollections(): AdminCollection[] {
  return Object.keys(availableCollections)
    .filter((slug) => slug === 'fixture' || (availableCollections[slug]?.photos?.length ?? 0) > 0)
    .map((slug) => {
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
  onNavigateDashboard,
  onSelectCollection,
  onCollectionUpdated,
}: AdminPanelProps) {
  const initialSession = getAdminSessionSync();
  const [isLoadingAuth, setIsLoadingAuth] = useState(backendEnabled && !initialSession);
  const [isAuthenticated, setIsAuthenticated] = useState(!backendEnabled || Boolean(initialSession));
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<AdminCollection[]>(() => buildLocalAdminCollections());
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [requests, setRequests] = useState<ExportRequest[]>(() =>
    backendEnabled ? [] : getAllExportRequests(),
  );
  // Seção isolada por rota/aba (elimina empilhamento de 6 cards simultâneos)
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado do Gerenciador Visual de Fotos dentro do Set (useMoveCopyPhotos)
  const [activeSetFilter, setActiveSetFilter] = useState<string>('all');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());

  const selected = useMemo(
    () => collections.find((collection) => collection.slug === selectedSlug) ?? collections[0],
    [collections, selectedSlug],
  );

  const collectionPhotos: GalleryPhoto[] = useMemo(() => {
    if (!selected?.slug) return [];
    return getCollectionData(selected.slug).photos ?? [];
  }, [selected?.slug]);

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
  const [customCoverUrl, setCustomCoverUrl] = useState<string>('');

  // Valida sessão apenas 1 vez na montagem (nunca derruba sessão ao trocar selectedSlug)
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

    const syncSession = getAdminSessionSync();
    if (syncSession) {
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return;
    }

    void getAdminSession()
      .then((session) => setIsAuthenticated(Boolean(session)))
      .catch(() => setError('Não foi possível validar a sessão administrativa.'))
      .finally(() => setIsLoadingAuth(false));
  }, []);

  useEffect(() => {
    if (!backendEnabled || !isAuthenticated) return;
    void fetchAdminCollections()
      .then((items) => {
        if (items.length > 0) {
          setCollections(items);
          if (!items.some((item) => item.slug === selectedSlug) && items[0]) {
            setSelectedSlug(items[0].slug);
          }
        }
      })
      .catch(() => {
        // Fallback resiliente para coleções locais caso o banco esteja indisponível
        const localItems = buildLocalAdminCollections();
        setCollections(localItems);
      });
  }, [isAuthenticated]);

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
    setCustomCoverUrl(selected.coverUrl ?? '');
    setActiveSetFilter('all');
    setSelectedPhotoIds(new Set());
  }, [selected]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'requests') return;
    if (!backendEnabled) {
      setRequests(getAllExportRequests());
      return;
    }
    void fetchAdminExportRequests()
      .then(setRequests)
      .catch(() => setRequests(getAllExportRequests()));
  }, [activeTab, isAuthenticated]);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await loginAdmin(email);
      setIsAuthenticated(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Senha master / ADMIN_TOKEN inválida.');
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const assignSelectedPhotosToSet = (targetSetId: string) => {
    if (!targetSetId || selectedPhotoIds.size === 0) return;
    setSets((prev) =>
      prev.map((s) => {
        const existing = new Set(s.photoIds ?? []);
        if (s.id === targetSetId) {
          selectedPhotoIds.forEach((id) => existing.add(id));
        } else {
          selectedPhotoIds.forEach((id) => existing.delete(id));
        }
        const nextIds = Array.from(existing);
        return { ...s, photoIds: nextIds, photoCount: nextIds.length };
      }),
    );
    setSelectedPhotoIds(new Set());
    setMessage('Fotografias movidas para o conjunto selecionado. Clique em Salvar Configurações para publicar.');
  };

  const visibleSetPhotos = useMemo(() => {
    if (activeSetFilter === 'all') return collectionPhotos;
    const targetSet = sets.find((s) => s.id === activeSetFilter);
    if (!targetSet) return collectionPhotos;
    const ids = new Set(targetSet.photoIds ?? []);
    return collectionPhotos.filter((p) => ids.has(p.id) || p.setId === targetSet.id);
  }, [collectionPhotos, activeSetFilter, sets]);

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
      clientEmails: clientEmails
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      clientNotes: clientNotes.trim(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      coverFocalPoint: focalPoint,
      theme: {
        ...(selected.theme ?? {
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'DM Sans, sans-serif',
          foreground: '#f5f5f4',
          background: '#050A0D',
          gridGapDesktop: 8,
          gridGapMobile: 4,
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
      // Sempre persiste também no storage local para sincronia imediata da capa/visual no navegador
      saveCollectionConfig(selected.slug, updatePayload);

      if (!backendEnabled) {
        const refreshed = buildLocalAdminCollections();
        setCollections(refreshed);
        onCollectionUpdated?.();
        setMessage('Configurações salvas localmente e aplicadas na galeria.');
        return;
      }

      const updated = await updateAdminCollection(selected.slug, updatePayload);
      setCollections((current) =>
        current.map((item) => (item.slug === updated.slug ? updated : item)),
      );
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
      setMessage(
        `Migração verificada: ${summary.collections} configuração(ões) e ${summary.requests} solicitação(ões).`,
      );
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
        <p className="mt-2 text-xs text-[#5A6872]">
          Acesso restrito por Senha Master / ADMIN_TOKEN.
        </p>
        <form onSubmit={handleAdminLogin} className="mt-6 space-y-3">
          <label htmlFor="admin-token" className="block text-xs font-medium text-[#5A6872]">
            Senha Master / ADMIN_TOKEN
          </label>
          <input
            id="admin-token"
            type="password"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#5E7F8C]/20 bg-white px-3 py-2 text-sm text-[#11161B] shadow-2xs outline-none focus:border-[#5E7F8C]"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors"
          >
            Entrar no Painel
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
      {/* Topbar Unificada (Padrão Pixieset: Breadcrumb + Seletor de Coleção à esquerda, Único CTA de Galeria à direita) */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-800 bg-[#050A0D] text-stone-100 px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onNavigateDashboard || onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#5E7F8C] hover:text-white transition-colors"
          >
            Studio Hub
          </button>
          <span className="text-stone-600">/</span>
          <strong className="font-['Outfit'] font-bold text-stone-100 truncate">
            VERSA / Painel do Fotógrafo
          </strong>
          <span className="hidden sm:inline-block rounded-full bg-[#5E7F8C]/15 border border-[#5E7F8C]/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5E7F8C]">
            {backendEnabled ? 'Cloud Sync' : 'Estúdio Local'}
          </span>

          <span className="text-stone-600 hidden md:inline">/</span>

          {/* Seletor da Coleção Ativa Integrado na Hierarquia do Header */}
          <select
            aria-label="Selecionar coleção"
            value={selectedSlug}
            onChange={(event) => {
              setSelectedSlug(event.target.value);
            }}
            className="bg-[#0d1418] border border-stone-700 text-stone-100 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#5E7F8C] outline-none max-w-[240px] truncate"
          >
            {collections.map((collection) => (
              <option key={collection.slug} value={collection.slug}>
                {collection.title}
              </option>
            ))}
          </select>

          <span className="hidden lg:inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            {visibility === 'public' ? 'Publicada' : visibility}
          </span>
        </div>

        {/* Único CTA de visualização externa (sem duplicidade "Abrir Galeria" / "Voltar para a galeria") */}
        <div className="flex items-center gap-2.5">
          {backendEnabled && (
            <>
              <button
                type="button"
                onClick={() => void migrateLegacy()}
                className="hidden md:inline-flex rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 px-3 py-1.5 text-xs font-medium text-stone-200 transition-colors"
              >
                Migrar dados locais
              </button>
              <button
                type="button"
                onClick={() => void signOutAdmin().then(() => setIsAuthenticated(false))}
                className="rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors"
              >
                Sair
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (selectedSlug && onSelectCollection) {
                onSelectCollection(selectedSlug);
              }
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 px-3.5 py-1.5 text-xs font-semibold text-stone-100 transition-colors"
          >
            <span>Abrir Galeria</span>
            <span aria-hidden="true" className="text-[#5E7F8C]">↗</span>
          </button>
        </div>
      </header>

      {/* Corpo do Workspace: Sidebar Vertical Colapsável (<aside>) + Área Principal Isolada (<main>) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          aria-label="Menu da coleção"
          className={`${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } shrink-0 border-r border-[#5E7F8C]/15 bg-white flex flex-col justify-between transition-all duration-200`}
        >
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-[#5E7F8C]/10">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5A6872]">
                  Módulos da Coleção
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label="Recolher barra lateral"
                className="p-1 rounded hover:bg-[#F6F8F9] text-[#5A6872] hover:text-[#11161B] text-xs"
              >
                {isSidebarCollapsed ? '→' : '←'}
              </button>
            </div>

            {(
              [
                { id: 'config', label: 'Configurações', icon: '⚙' },
                { id: 'editorial', label: 'Capa & Visual', icon: '◐' },
                { id: 'sets', label: 'Conjuntos (Sets)', icon: '⊞' },
                { id: 'handoff', label: 'WhatsApp', icon: '✉' },
                { id: 'requests', label: 'Solicitações', icon: '↓' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#050A0D] text-white font-bold shadow-xs'
                    : 'text-[#5A6872] hover:bg-[#F6F8F9] hover:text-[#11161B] font-medium'
                }`}
              >
                <span aria-hidden="true" className="text-sm">{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {!isSidebarCollapsed && (
            <div className="p-4 border-t border-[#5E7F8C]/10 text-[11px] text-[#5A6872]">
              <p className="font-semibold text-[#11161B] truncate">{selected?.title}</p>
              <p className="mt-0.5">{collectionPhotos.length} fotografias sincronizadas</p>
            </div>
          )}
        </aside>

        {/* Área Principal Isolada (<main>) */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className={activeTab === 'sets' ? 'mx-auto max-w-6xl space-y-6' : 'mx-auto max-w-[760px] space-y-6'}>
            <Feedback message={message} error={error} />

            {selected && activeTab === 'config' && (
              <div className="space-y-6">
                <Section
                  title="Acesso da galeria"
                  subtitle="Privacidade, expiração e controle de acesso"
                  badge={visibility.toUpperCase()}
                >
                  <Field label="Título">
                    <input value={title} onChange={(event) => setTitle(event.target.value)} />
                  </Field>
                  <Field label="Visibilidade">
                    <select
                      value={visibility}
                      onChange={(event) => setVisibility(event.target.value as CollectionVisibility)}
                    >
                      <option value="public">Pública</option>
                      <option value="password">Protegida</option>
                      <option value="client-only">Cliente</option>
                      <option value="hidden">Oculta</option>
                    </select>
                  </Field>
                  <Toggle
                    label="Exigir senha"
                    checked={passwordRequired}
                    onChange={setPasswordRequired}
                  />
                  {passwordRequired && (
                    <Field
                      label={selected.hasPassword ? 'Nova senha (vazio mantém a atual)' : 'Senha'}
                    >
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                      />
                    </Field>
                  )}
                  <Field label="E-mails autorizados, separados por vírgula">
                    <input
                      value={clientEmails}
                      onChange={(event) => setClientEmails(event.target.value)}
                    />
                  </Field>
                  <Field label="Data limite de expiração da galeria">
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(event) => setExpiresAt(event.target.value)}
                    />
                  </Field>
                </Section>

                <Section title="Downloads" subtitle="Políticas de entrega e PIN de segurança">
                  <Toggle
                    label="Downloads ativos"
                    checked={downloadEnabled}
                    onChange={setDownloadEnabled}
                  />
                  <Toggle
                    label="Exigir e-mail"
                    checked={requiresEmail}
                    onChange={setRequiresEmail}
                  />
                  <Toggle label="Exigir PIN" checked={requiresPin} onChange={setRequiresPin} />
                  {requiresPin && (
                    <Field label={selected.hasDownloadPin ? 'Novo PIN (vazio mantém o atual)' : 'PIN'}>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(event) => setNewPin(event.target.value)}
                      />
                    </Field>
                  )}
                  <Field label="Link direto da pasta">
                    <input
                      value={directFolderUrl}
                      onChange={(event) => setDirectFolderUrl(event.target.value)}
                    />
                  </Field>
                  <Field label="Nome/notas do cliente">
                    <textarea
                      value={clientNotes}
                      onChange={(event) => setClientNotes(event.target.value)}
                    />
                  </Field>
                </Section>

                {/* Único Botão de Ação Primária na Visão Ativa */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void save()}
                    className="rounded-lg bg-[#050A0D] hover:bg-[#11161B] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Salvando…' : 'Salvar Configurações'}
                  </button>
                </div>
              </div>
            )}

            {selected && activeTab === 'editorial' && (
              <div className="space-y-6">
                <Section
                  title="Capa & Visual Editorial"
                  subtitle="Ponto focal sincronizado e contraste automático do Hero"
                >
                  <CoverFocalPicker
                    coverUrl={
                      customCoverUrl ||
                      selected.coverUrl ||
                      'https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w1024'
                    }
                    focalPoint={focalPoint}
                    onChange={setFocalPoint}
                  />

                  <div className="pt-2 space-y-3">
                    <Field label="Fonte dos Títulos">
                      <select
                        value={headingFont}
                        onChange={(e) => setHeadingFont(e.target.value)}
                      >
                        <option value="Outfit, sans-serif">
                          Outfit (Padrão Oficial Versa Visual)
                        </option>
                        <option value="Righteous, cursive">Righteous (Display de Destaque)</option>
                        <option value="DM Sans, sans-serif">DM Sans (Minimalista)</option>
                      </select>
                    </Field>

                    <Field
                      label={`Opacidade do Gradiente Escuro (${Math.round(overlayOpacity * 100)}%)`}
                    >
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
                </Section>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void save()}
                    className="rounded-lg bg-[#050A0D] hover:bg-[#11161B] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Salvando…' : 'Salvar Configurações'}
                  </button>
                </div>
              </div>
            )}

            {selected && activeTab === 'sets' && (
              <div className="space-y-6">
                <Section
                  title="Conjuntos (Sets) & Gerenciador Visual de Fotos"
                  subtitle="Crie conjuntos, selecione fotos na grade e mova entre sub-galerias (useMoveCopyPhotos)"
                >
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Nome do novo conjunto (ex: Destaques, Cerimônia, Recepção)..."
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                      className="flex-1 rounded-lg border border-[#5E7F8C]/20 bg-white px-3 py-2 text-xs text-[#11161B] outline-none focus:border-[#5E7F8C] shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!newSetName.trim()) return;
                          const slug = newSetName
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '');
                          const newId = `set-${Date.now()}`;
                          setSets((prev) => [
                            ...prev,
                            { id: newId, title: newSetName.trim(), slug, photoIds: [] },
                          ]);
                          setNewSetName('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSetName.trim()) return;
                        const slug = newSetName
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/[^\w-]/g, '');
                        const newId = `set-${Date.now()}`;
                        setSets((prev) => [
                          ...prev,
                          { id: newId, title: newSetName.trim(), slug, photoIds: [] },
                        ]);
                        setNewSetName('');
                      }}
                      className="rounded-lg bg-[#5E7F8C] hover:bg-[#5E7F8C]/90 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs transition-colors"
                    >
                      + Novo Conjunto
                    </button>
                  </div>

                  {/* Barra de Abas dos Sets Criados */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#5E7F8C]/10">
                    <button
                      type="button"
                      onClick={() => setActiveSetFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeSetFilter === 'all'
                          ? 'bg-[#050A0D] text-white'
                          : 'bg-[#F6F8F9] text-[#5A6872] hover:text-[#11161B]'
                      }`}
                    >
                      Todas as Fotos ({collectionPhotos.length})
                    </button>

                    {sets.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                          activeSetFilter === s.id
                            ? 'bg-[#5E7F8C] text-white border-[#5E7F8C]'
                            : 'bg-white text-[#11161B] border-[#5E7F8C]/20'
                        }`}
                      >
                        <button type="button" onClick={() => setActiveSetFilter(s.id)}>
                          {s.title} ({s.photoIds?.length ?? 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeSetFilter === s.id) setActiveSetFilter('all');
                            setSets((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="ml-1 opacity-70 hover:opacity-100 text-[10px]"
                          title="Remover conjunto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Barra de Ações em Lote (useMoveCopyPhotos) */}
                  {selectedPhotoIds.size > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#050A0D] text-white px-4 py-2.5 text-xs">
                      <span className="font-semibold">
                        {selectedPhotoIds.size} fotografia(s) selecionada(s)
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          aria-label="Mover fotos selecionadas para conjunto"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              assignSelectedPhotosToSet(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="rounded bg-stone-800 border border-stone-700 px-2.5 py-1 text-xs text-white"
                        >
                          <option value="" disabled>
                            Mover selecionadas para conjunto...
                          </option>
                          {sets.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoIds(new Set())}
                          className="px-2.5 py-1 rounded border border-stone-700 hover:bg-stone-800 text-stone-300"
                        >
                          Limpar seleção
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grade Visual de Fotos da Coleção */}
                  {visibleSetPhotos.length === 0 ? (
                    <p className="text-xs text-[#5A6872] italic py-8 text-center">
                      Nenhuma fotografia neste conjunto. Selecione fotos na aba &ldquo;Todas as Fotos&rdquo; para movê-las para cá.
                    </p>
                  ) : (
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 max-h-[540px] overflow-y-auto pr-1"
                      data-testid="admin-set-photo-grid"
                    >
                      {visibleSetPhotos.slice(0, 120).map((photo) => {
                        const thumbUrl = photo.sources?.[0]?.url ?? '';
                        const isSelected = selectedPhotoIds.has(photo.id);
                        const isCover = customCoverUrl && photo.sources?.some((s) => s.url === customCoverUrl);

                        return (
                          <div
                            key={photo.id}
                            onClick={() => togglePhotoSelection(photo.id)}
                            className={`group relative cursor-pointer border bg-[#F6F8F9] transition-all ${
                              isSelected
                                ? 'border-[#050A0D] ring-2 ring-[#050A0D]'
                                : 'border-[#5E7F8C]/20 hover:border-[#5E7F8C]'
                            }`}
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden bg-[#E5E9EC]">
                              <img
                                src={thumbUrl}
                                alt={photo.alt}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-between px-2 py-1.5 bg-white text-[11px]">
                              <span className="truncate font-mono text-[#11161B]">
                                {photo.fileName || `#${photo.position}`}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextCover = photo.sources?.[1]?.url || photo.sources?.[0]?.url || '';
                                  setCustomCoverUrl(nextCover);
                                  setMessage(`Foto ${photo.fileName || photo.position} definida como capa.`);
                                }}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-opacity ${
                                  isCover
                                    ? 'bg-emerald-100 text-emerald-800 opacity-100'
                                    : 'bg-[#F6F8F9] text-[#5E7F8C] opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                {isCover ? 'Capa' : 'Usar na Capa'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Section>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void save()}
                    className="rounded-lg bg-[#050A0D] hover:bg-[#11161B] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Salvando…' : 'Salvar Configurações'}
                  </button>
                </div>
              </div>
            )}

            {selected && activeTab === 'handoff' && (
              <Section title="Mensagem Pronta de WhatsApp" subtitle="Disparo direto com minuta">
                <pre className="whitespace-pre-wrap rounded-xl bg-[#F6F8F9] border border-[#5E7F8C]/15 p-4 text-xs font-mono text-[#11161B]">
                  {whatsappMessage}
                </pre>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      void navigator.clipboard
                        .writeText(whatsappMessage)
                        .then(() => setMessage('Mensagem copiada para a área de transferência.'))
                    }
                    className="flex-1 rounded-lg bg-[#050A0D] hover:bg-[#11161B] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors text-center"
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

            {selected && activeTab === 'requests' && (
              <Section title="Últimas solicitações de exportação" subtitle="Histórico de downloads">
                {requests.length === 0 ? (
                  <p className="text-xs text-[#5A6872] py-4 text-center">
                    Nenhuma solicitação registrada até o momento.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="border-b border-[#5E7F8C]/15 py-2.5 text-xs text-[#11161B]"
                      >
                        <strong>{request.collectionTitle}</strong> · {request.type} ·{' '}
                        {request.requestedSize}
                        <br />
                        <span className="text-[#5A6872]">
                          {request.clientEmail || 'sem e-mail'} ·{' '}
                          {new Date(request.requestedAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>
        </main>
      </div>
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
    <section
      className={`space-y-4 rounded-xl border border-[#5E7F8C]/15 bg-white p-6 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#5E7F8C]/10 pb-3">
        <div>
          <h3 className="font-['Outfit'] font-bold text-sm tracking-wide text-[#11161B] uppercase">
            {title}
          </h3>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
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
