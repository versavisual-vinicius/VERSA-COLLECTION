import { assertTrustedOrigin, apiError, json, methodNotAllowed, readJson, sessionCookie } from '../../_lib/http.js';
import { getCollectionRow } from '../../_lib/collections.js';
import {
  clientIpHash,
  hasGallerySession,
  newOpaqueToken,
  sessionExpiry,
  SESSION_SECONDS,
  tokenHash,
  verifySecret,
} from '../../_lib/security.js';
import { getSupabaseAdmin } from '../../_lib/supabase.js';

interface SessionInput {
  password?: string;
  email?: string;
}

function slugFrom(request: Request): string {
  const parts = new URL(request.url).pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts.at(-2) ?? '');
}

export default async function handler(request: Request): Promise<Response> {
  if (!['POST', 'DELETE'].includes(request.method)) return methodNotAllowed(['POST', 'DELETE']);
  if (!assertTrustedOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Origem não autorizada.');

  try {
    const slug = slugFrom(request);
    const row = await getCollectionRow(slug);
    if (!row || row.visibility === 'hidden') return apiError(404, 'NOT_FOUND', 'Coleção não encontrada.');
    const supabase = getSupabaseAdmin();

    if (request.method === 'DELETE') {
      if (await hasGallerySession(request, slug, row.id)) {
        const cookie = request.headers.get('cookie') ?? '';
        const token = cookie
          .split(';')
          .map((part) => part.trim())
          .find((part) => part.startsWith(`versa_gallery_${slug}=`))
          ?.split('=')
          .slice(1)
          .join('=');
        if (token) {
          await supabase
            .from('gallery_sessions')
            .update({ revoked_at: new Date().toISOString() })
            .eq('token_hash', tokenHash(decodeURIComponent(token)));
        }
      }
      return json({ success: true }, 200, { 'set-cookie': sessionCookie(slug, '', 0) });
    }

    const input = await readJson<SessionInput>(request);
    const ipHash = clientIpHash(request);
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const retentionCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [{ error: attemptsCleanupError }, { error: sessionsCleanupError }] = await Promise.all([
      supabase.from('login_attempts').delete().lt('attempted_at', retentionCutoff),
      supabase.from('gallery_sessions').delete().lt('expires_at', new Date().toISOString()),
    ]);
    if (attemptsCleanupError) throw attemptsCleanupError;
    if (sessionsCleanupError) throw sessionsCleanupError;
    const { count, error: countError } = await supabase
      .from('login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('collection_id', row.id)
      .eq('ip_hash', ipHash)
      .eq('succeeded', false)
      .gte('attempted_at', since);
    if (countError) throw countError;
    if ((count ?? 0) >= 5) {
      return apiError(429, 'RATE_LIMITED', 'Muitas tentativas. Aguarde 15 minutos.', {
        'retry-after': '900',
      });
    }

    const passwordOk = await verifySecret(input.password?.trim() ?? '', row.access_password_hash);
    const normalizedEmail = input.email?.trim().toLowerCase() ?? '';
    const emailOk = !row.access_email_required || row.client_emails.includes(normalizedEmail);
    const succeeded = passwordOk && emailOk;

    const { error: attemptError } = await supabase.from('login_attempts').insert({
      collection_id: row.id,
      ip_hash: ipHash,
      succeeded,
    });
    if (attemptError) throw attemptError;

    if (!succeeded) {
      return apiError(401, 'INVALID_PASSWORD', 'Credenciais inválidas.');
    }

    const token = newOpaqueToken();
    const { error: sessionError } = await supabase.from('gallery_sessions').insert({
      collection_id: row.id,
      token_hash: tokenHash(token),
      client_email: normalizedEmail || null,
      expires_at: sessionExpiry().toISOString(),
    });
    if (sessionError) throw sessionError;

    return json({ success: true }, 200, {
      'set-cookie': sessionCookie(slug, token, SESSION_SECONDS),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CONTENT_TYPE') {
      return apiError(415, 'INVALID_CONTENT_TYPE', 'Envie JSON.');
    }
    console.error('gallery.session.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Não foi possível validar o acesso.');
  }
}
