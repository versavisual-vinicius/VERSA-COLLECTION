const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

export function apiError(
  status: number,
  code: string,
  message: string,
  headers: HeadersInit = {},
  details?: unknown,
): Response {
  return json(
    {
      error: {
        code,
        message,
        details,
        requestId: crypto.randomUUID(),
      },
    },
    status,
    headers,
  );
}

export function methodNotAllowed(allowed: string[]): Response {
  return apiError(405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', {
    allow: allowed.join(', '),
  });
}

export async function readJson<T>(request: Request): Promise<T> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('INVALID_CONTENT_TYPE');
  }
  return (await request.json()) as T;
}

export function assertTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV !== 'production';

  const requestOrigin = new URL(request.url).origin;
  const configured = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return origin === requestOrigin || configured.includes(origin);
}

export function cookieValue(request: Request, name: string): string | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (rawName === name) return decodeURIComponent(rawValue.join('='));
  }
  return null;
}

export function sessionCookieName(slug: string): string {
  return `__Host-versa_gallery_${slug.replace(/[^a-z0-9_-]/gi, '_')}`;
}

export function sessionCookie(slug: string, token: string, maxAge: number): string {
  return `${sessionCookieName(slug)}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
