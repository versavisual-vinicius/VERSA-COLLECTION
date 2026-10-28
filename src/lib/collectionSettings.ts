import type { CollectionConfigUpdate, ExportRequest, GalleryCollection } from '../types/gallery';

const SETTINGS_PREFIX = 'versa_col_config_';
const EXPORT_REQUESTS_KEY = 'versa_export_requests_v1';
const CLIENT_SESSION_PREFIX = 'versa_client_session_';

/**
 * Recupera configurações customizadas de uma coleção salvas no navegador
 */
export function getStoredCollectionConfig(slug: string): CollectionConfigUpdate | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${SETTINGS_PREFIX}${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as CollectionConfigUpdate;
  } catch (err) {
    console.error(`Erro ao carregar configurações da coleção ${slug}:`, err);
    return null;
  }
}

/**
 * Salva ou atualiza configurações da coleção no localStorage
 */
export function saveCollectionConfig(slug: string, update: CollectionConfigUpdate): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCollectionConfig(slug) || {};
    const merged: CollectionConfigUpdate = {
      ...current,
      ...update,
      downloads: {
        ...(current.downloads || {}),
        ...(update.downloads || {}),
      },
    };
    localStorage.setItem(`${SETTINGS_PREFIX}${slug}`, JSON.stringify(merged));
  } catch (err) {
    console.error(`Erro ao salvar configurações da coleção ${slug}:`, err);
  }
}

/**
 * Restaura configurações padrão da coleção removendo customizações locais
 */
export function resetCollectionConfig(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${SETTINGS_PREFIX}${slug}`);
  } catch (err) {
    console.error(`Erro ao resetar coleção ${slug}:`, err);
  }
}

/**
 * Aplica configurações dinâmicas sobre uma instância de GalleryCollection
 */
export function applyCollectionSettings(collection: GalleryCollection): GalleryCollection {
  const custom = getStoredCollectionConfig(collection.slug);
  if (!custom) return collection;

  return {
    ...collection,
    title: custom.title ?? collection.title,
    visibility: custom.visibility ?? collection.visibility,
    passwordRequired: custom.passwordRequired ?? collection.passwordRequired,
    clientPassword: custom.clientPassword ?? collection.clientPassword,
    clientEmail: custom.clientEmail ?? collection.clientEmail,
    clientEmails: custom.clientEmails ?? collection.clientEmails,
    clientNotes: custom.clientNotes ?? collection.clientNotes,
    downloads: {
      ...collection.downloads,
      ...(custom.downloads || {}),
    },
  };
}

/**
 * Gerenciamento de sessão de acesso do cliente à galeria
 */
export function hasClientSession(collectionId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(`${CLIENT_SESSION_PREFIX}${collectionId}`) === 'granted';
  } catch {
    return false;
  }
}

export function setClientSession(collectionId: string, email?: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`${CLIENT_SESSION_PREFIX}${collectionId}`, 'granted');
    if (email) {
      sessionStorage.setItem(`${CLIENT_SESSION_PREFIX}${collectionId}_email`, email);
    }
  } catch (err) {
    console.error('Erro ao salvar sessão de cliente:', err);
  }
}

export function clearClientSession(collectionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(`${CLIENT_SESSION_PREFIX}${collectionId}`);
    sessionStorage.removeItem(`${CLIENT_SESSION_PREFIX}${collectionId}_email`);
  } catch (err) {
    console.error('Erro ao limpar sessão de cliente:', err);
  }
}

/**
 * Validação de acesso do cliente
 */
export function verifyClientAccess(
  collection: GalleryCollection,
  passwordAttempt: string,
  emailAttempt?: string,
): { success: boolean; error?: string } {
  // Se a coleção não requer senha, acesso liberado
  if (!collection.passwordRequired) {
    return { success: true };
  }

  const expectedPassword = collection.clientPassword;
  if (expectedPassword && passwordAttempt.trim() !== expectedPassword.trim()) {
    return { success: false, error: 'Senha incorreta. Verifique os dados fornecidos pelo estúdio.' };
  }

  // Validação de e-mail restrito caso configurado
  if (collection.clientEmail || (collection.clientEmails && collection.clientEmails.length > 0)) {
    if (!emailAttempt || !emailAttempt.trim()) {
      return { success: false, error: 'Por favor, informe seu e-mail cadastrado.' };
    }
    const cleanAttempt = emailAttempt.trim().toLowerCase();
    const authorized = [
      collection.clientEmail?.toLowerCase(),
      ...(collection.clientEmails || []).map((e) => e.toLowerCase()),
    ].filter(Boolean);

    if (!authorized.includes(cleanAttempt)) {
      return {
        success: false,
        error: 'Este endereço de e-mail não possui autorização para esta galeria.',
      };
    }
  }

  return { success: true };
}

/**
 * Histórico de solicitações de exportação / download
 */
export function getAllExportRequests(): ExportRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EXPORT_REQUESTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExportRequest[];
  } catch (err) {
    console.error('Erro ao ler solicitações de exportação:', err);
    return [];
  }
}

export function saveExportRequest(
  data: Omit<ExportRequest, 'id' | 'requestedAt'>,
): ExportRequest {
  const newRequest: ExportRequest = {
    ...data,
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    requestedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const all = getAllExportRequests();
      const updated = [newRequest, ...all].slice(0, 100); // mantém as últimas 100 solicitações
      localStorage.setItem(EXPORT_REQUESTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao persistir solicitação de exportação:', err);
    }
  }

  return newRequest;
}

export function clearExportRequests(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(EXPORT_REQUESTS_KEY);
  } catch (err) {
    console.error('Erro ao limpar solicitações:', err);
  }
}

