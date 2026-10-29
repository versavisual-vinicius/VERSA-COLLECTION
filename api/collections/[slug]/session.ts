import { assertTrustedOrigin, apiError, json, methodNotAllowed, readJson, sessionCookie, cookieValue, sessionCookieName } from '../../_lib/http.js';
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
import { query } from '../../_lib/db.js';

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

    if (request.method === 'DELETE') {
      if (await hasGallerySession(request, slug, row.id)) {
        const token = cookieValue(request, sessionCookieName(slug));
        if (token) {
          await query(
            'UPDATE public.gallery_sessions SET revoked_at = NOW() WHERE token_hash = $1',
            [tokenHash(token)],
          );
        }
      }
      return json({ success: true }, 200, { 'set-cookie': sessionCookie(slug, '', 0) });
    }

    const input = await readJson<SessionInput>(request);
    const ipHash = clientIpHash(request);
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const retentionCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    await Promise.all([
      query('DELETE FROM public.login_attempts WHERE attempted_at < $1', [retentionCutoff]),
      query('DELETE FROM public.gallery_sessions WHERE expires_at < NOW()'),
    ]);

    const { rows: countRows } = await query<{ count: string }>(
      `SELECT count(*)::text AS count FROM public.login_attempts
       WHERE collection_id = $1 AND ip_hash = $2 AND succeeded = false AND attempted_at >= $3`,
      [row.id, ipHash, since],
    );
    const failedAttempts = parseInt(countRows[0]?.count ?? '0', 10);
    if (failedAttempts >= 5) {
      return apiError(429, 'RATE_LIMITED', 'Muitas tentativas. Aguarde 15 minutos.', {
        'retry-after': '900',
      });
    }

    const passwordOk = await verifySecret(input.password?.trim() ?? '', row.access_password_hash);
    const normalizedEmail = input.email?.trim().toLowerCase() ?? '';
    const emailOk = !row.access_email_required || row.client_emails.includes(normalizedEmail);

    if (!passwordOk || !emailOk) {
      await query(
        'INSERT INTO public.login_attempts (collection_id, ip_hash, succeeded) VALUES ($1, $2, false)',
        [row.id, ipHash],
      );
      return apiError(401, 'INVALID_CREDENTIALS', 'Senha ou e-mail incorreto.');
    }

    await query(
      'INSERT INTO public.login_attempts (collection_id, ip_hash, succeeded) VALUES ($1, $2, true)',
      [row.id, ipHash],
    );

    const token = newOpaqueToken();
    await query(
      `INSERT INTO public.gallery_sessions (collection_id, token_hash, client_email, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [row.id, tokenHash(token), normalizedEmail || null, sessionExpiry().toISOString()],
    );

    return json(
      { success: true },
      200,
      { 'set-cookie': sessionCookie(slug, token, SESSION_SECONDS) },
    );
  } catch (error) {
    console.error('collections.session.failed', error instanceof Error ? error.message : 'unknown');
    return apiError(503, 'TEMPORARILY_UNAVAILABLE', 'Falha ao autenticar na galeria.');
  }
}
