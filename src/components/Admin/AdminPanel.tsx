import { useEffect, useMemo, useState } from 'react';
import type { CollectionVisibility, ExportRequest } from '../../types/gallery';
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
}

type Tab = 'config' | 'requests' | 'handoff';

export function AdminPanel({ initialSlug = 'modec-dia-das-criancas-2026', onClose, onSelectCollection }: AdminPanelProps) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(backendEnabled);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [requests, setRequests] = useState<ExportRequest[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('config');
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

  useEffect(() => {
    if (!backendEnabled) {
      setIsLoadingAuth(false);
      return;
    }
    void getAdminSession()
      .then((session) => setIsAuthenticated(Boolean(session)))
      .catch(() => setError('Não foi possível validar a sessão administrativa.'))
      .finally(() => setIsLoadingAuth(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [selected]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'requests') return;
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
    try {
      const updated = await updateAdminCollection(selected.slug, {
        title: title.trim(),
        visibility,
        passwordRequired,
        clientPassword: newPassword.trim() || undefined,
        clientEmails: clientEmails.split(',').map((value) => value.trim()).filter(Boolean),
        clientNotes: clientNotes.trim(),
        downloads: {
          enabled: downloadEnabled,
          requiresEmail,
          requiresPin,
          pin: newPin.trim() || undefined,
          directFolderUrl: directFolderUrl.trim() || undefined,
        },
      });
      setCollections((current) => current.map((item) => (item.slug === updated.slug ? updated : item)));
      setMessage('Configurações salvas no backend com sucesso.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const migrateLegacy = async () => {
    setError(null);
    try {
      const summary = await importLegacyBrowserData();
      setMessage(`Migração verificada: ${summary.collections} configuração(ões) e ${summary.requests} solicitação(ões).`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível migrar os dados locais.');
    }
  };

  const galleryUrl = `${window.location.origin}/g/${selectedSlug}`;
  const whatsappMessage = `Fala, ${clientNotes.trim() || 'Cliente'}! Tudo certo?\n\nA sua galeria já está no ar:\n📸 ${title}\n🔗 ${galleryUrl}${newPassword ? `\n🔑 Senha: ${newPassword}` : ''}${newPin ? `\n📥 PIN: ${newPin}` : ''}\n\nPode navegar, favoritar e baixar. Quando postar, marca @v1ncsc.`;

  if (!backendEnabled) {
    return (
      <PanelShell onClose={onClose}>
        <h2 className="text-xl font-bold">Backend seguro ainda não configurado</h2>
        <p className="mt-3 text-sm text-white/70">
          Crie o projeto Supabase, aplique a migration, configure as variáveis da Vercel e ative
          <code className="mx-1 text-[#85aab8]">VITE_API_ENABLED=true</code>. O painel local inseguro foi desativado.
        </p>
      </PanelShell>
    );
  }

  if (isLoadingAuth) return <PanelShell onClose={onClose}><p>Validando sessão segura…</p></PanelShell>;

  if (!isAuthenticated) {
    return (
      <PanelShell onClose={onClose}>
        <h2 className="text-xl font-bold">Painel do Fotógrafo</h2>
        <p className="mt-2 text-xs text-white/60">Acesso restrito por magic link.</p>
        <form onSubmit={sendMagicLink} className="mt-6 space-y-3">
          <label htmlFor="admin-email" className="block text-xs font-medium">E-mail autorizado</label>
          <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" />
          <button className="w-full rounded-lg bg-[#5E7F8C] py-2.5 text-xs font-bold uppercase tracking-wider">Enviar magic link</button>
        </form>
        <Feedback message={message} error={error} />
      </PanelShell>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050A0D] text-white font-['DM_Sans']">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <strong>VERSA / Painel seguro</strong>
        <div className="flex gap-2">
          <button onClick={() => void migrateLegacy()} className="rounded border border-white/15 px-3 py-1.5 text-xs">Migrar dados locais</button>
          <button onClick={() => void signOutAdmin().then(() => setIsAuthenticated(false))} className="rounded border border-white/15 px-3 py-1.5 text-xs">Sair</button>
          <button onClick={onClose} className="rounded border border-white/15 px-3 py-1.5 text-xs">Fechar</button>
        </div>
      </header>

      <nav className="flex items-center gap-4 border-b border-white/10 px-6">
        {(['config', 'handoff', 'requests'] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-xs ${activeTab === tab ? 'border-b-2 border-[#5E7F8C] text-white' : 'text-white/50'}`}>
            {tab === 'config' ? 'Configurações' : tab === 'handoff' ? 'WhatsApp' : 'Solicitações'}
          </button>
        ))}
        <select value={selectedSlug} onChange={(event) => { setSelectedSlug(event.target.value); onSelectCollection?.(event.target.value); }} className="ml-auto bg-[#0c1015] text-xs">
          {collections.map((collection) => <option key={collection.slug} value={collection.slug}>{collection.title}</option>)}
        </select>
      </nav>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-5">
          <Feedback message={message} error={error} />
          {activeTab === 'config' && selected && (
            <>
              <Section title="Acesso da galeria">
                <Field label="Título"><input value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
                <Field label="Visibilidade"><select value={visibility} onChange={(event) => setVisibility(event.target.value as CollectionVisibility)}><option value="public">Pública</option><option value="password">Protegida</option><option value="client-only">Cliente</option><option value="hidden">Oculta</option></select></Field>
                <Toggle label="Exigir senha" checked={passwordRequired} onChange={setPasswordRequired} />
                {passwordRequired && <Field label={selected.hasPassword ? 'Nova senha (vazio mantém a atual)' : 'Senha'}><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></Field>}
                <Field label="E-mails autorizados, separados por vírgula"><input value={clientEmails} onChange={(event) => setClientEmails(event.target.value)} /></Field>
              </Section>
              <Section title="Downloads">
                <Toggle label="Downloads ativos" checked={downloadEnabled} onChange={setDownloadEnabled} />
                <Toggle label="Exigir e-mail" checked={requiresEmail} onChange={setRequiresEmail} />
                <Toggle label="Exigir PIN" checked={requiresPin} onChange={setRequiresPin} />
                {requiresPin && <Field label={selected.hasDownloadPin ? 'Novo PIN (vazio mantém o atual)' : 'PIN'}><input type="password" value={newPin} onChange={(event) => setNewPin(event.target.value)} /></Field>}
                <Field label="Link direto da pasta"><input value={directFolderUrl} onChange={(event) => setDirectFolderUrl(event.target.value)} /></Field>
                <Field label="Nome/notas do cliente"><textarea value={clientNotes} onChange={(event) => setClientNotes(event.target.value)} /></Field>
                <button disabled={isSaving} onClick={() => void save()} className="rounded bg-[#5E7F8C] px-5 py-2 text-xs font-bold disabled:opacity-50">{isSaving ? 'Salvando…' : 'Salvar no backend'}</button>
              </Section>
            </>
          )}
          {activeTab === 'handoff' && <Section title="Mensagem WhatsApp"><pre className="whitespace-pre-wrap text-sm text-white/75">{whatsappMessage}</pre><button onClick={() => void navigator.clipboard.writeText(whatsappMessage).then(() => setMessage('Mensagem copiada.'))} className="rounded bg-[#5E7F8C] px-4 py-2 text-xs">Copiar</button><p className="text-[11px] text-amber-300/80">Senha e PIN nunca retornam do servidor. Eles aparecem somente quando definidos nesta sessão.</p></Section>}
          {activeTab === 'requests' && <Section title="Últimas solicitações">{requests.length === 0 ? <p className="text-sm text-white/50">Nenhuma solicitação.</p> : requests.map((request) => <div key={request.id} className="border-b border-white/10 py-3 text-xs"><strong>{request.collectionTitle}</strong> · {request.type} · {request.requestedSize}<br /><span className="text-white/50">{request.clientEmail || 'sem e-mail'} · {new Date(request.requestedAt).toLocaleString('pt-BR')}</span></div>)}</Section>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1015] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 text-sm rounded-lg transition-colors"
        >
          ✕
        </button>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold uppercase tracking-wider text-white transition-colors text-center"
        >
          Voltar para a galeria
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0c1015] p-5"><h3 className="font-semibold">{title}</h3>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-white/70">{label}<div className="mt-1 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:px-3 [&_input]:py-2 [&_select]:w-full [&_select]:bg-[#111418] [&_select]:p-2 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:bg-white/5 [&_textarea]:p-3">{children}</div></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center justify-between text-xs"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

function Feedback({ message, error }: { message: string | null; error: string | null }) {
  if (!message && !error) return null;
  return <p role={error ? 'alert' : 'status'} className={`rounded-lg border p-3 text-xs ${error ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>{error ?? message}</p>;
}
