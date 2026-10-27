/**
 * Módulo de Telemetria Segura — VERSA-COLLECTION
 * Conforme Seção 15 da especificação canônica:
 * - Eventos técnicos mínimos sem dados sensíveis (zero e-mail, PIN, senha ou nome de arquivo bruto).
 * - Identificadores técnicos, hash de visitante e timestamp.
 * - Suporte a desativação de coleta por privacidade.
 */

export type TelemetryEventName =
  | 'gallery_viewed'
  | 'gallery_entered'
  | 'gallery_batch_loaded'
  | 'photo_opened'
  | 'photo_navigated'
  | 'photo_favorited'
  | 'photo_unfavorited'
  | 'photo_download_started'
  | 'collection_download_started'
  | 'share_opened'
  | 'share_completed'
  | 'slideshow_started'
  | 'slideshow_paused'
  | 'gallery_error';

export interface TelemetryEvent {
  eventName: TelemetryEventName;
  schemaVersion: '1.0.0';
  collectionId: string;
  photoId?: string;
  visitorIdHash: string;
  deviceClass: 'desktop' | 'mobile' | 'tablet';
  inputMethod: 'mouse' | 'touch' | 'keyboard';
  source?: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

// Chave para persistência do visitante anônimo
const VISITOR_STORAGE_KEY = 'versa_gallery_visitor_id';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';

  try {
    let id = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!id) {
      id = `vis_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      localStorage.setItem(VISITOR_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return 'ephemeral_visitor';
  }
}

export function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16)}`;
}

export function detectDeviceClass(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 600) return 'mobile';
  if (width < 900) return 'tablet';
  return 'desktop';
}

class TelemetryService {
  private events: TelemetryEvent[] = [];
  private enabled = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public track(
    eventName: TelemetryEventName,
    payload: {
      collectionId: string;
      photoId?: string;
      inputMethod?: 'mouse' | 'touch' | 'keyboard';
      source?: string;
      metadata?: Record<string, string | number | boolean>;
    },
  ): TelemetryEvent | null {
    if (!this.enabled) return null;

    const visitorId = getOrCreateVisitorId();
    const visitorIdHash = hashString(visitorId);
    const deviceClass = detectDeviceClass();

    // Sanitização estrita: remove qualquer campo sensível caso tenha sido passado em metadata
    const sanitizedMetadata: Record<string, string | number | boolean> = {};
    if (payload.metadata) {
      for (const [key, val] of Object.entries(payload.metadata)) {
        const lowerKey = key.toLowerCase();
        if (
          !lowerKey.includes('email') &&
          !lowerKey.includes('pin') &&
          !lowerKey.includes('pass') &&
          !lowerKey.includes('filename') &&
          !lowerKey.includes('name')
        ) {
          sanitizedMetadata[key] = val;
        }
      }
    }

    const event: TelemetryEvent = {
      eventName,
      schemaVersion: '1.0.0',
      collectionId: payload.collectionId,
      photoId: payload.photoId,
      visitorIdHash,
      deviceClass,
      inputMethod: payload.inputMethod ?? 'mouse',
      source: payload.source,
      timestamp: new Date().toISOString(),
      metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : undefined,
    };

    this.events.push(event);
    return event;
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }
}

export const telemetry = new TelemetryService();
