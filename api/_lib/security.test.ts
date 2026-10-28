import { describe, expect, it } from 'vitest';
import { cookieValue, sessionCookie, sessionCookieName } from './http.js';
import { hashSecret, newOpaqueToken, tokenHash, verifySecret } from './security.js';

describe('backend security primitives', () => {
  it('hashes secrets with a unique salt and verifies without exposing plaintext', async () => {
    const first = await hashSecret('galeria-segura');
    const second = await hashSecret('galeria-segura');

    expect(first).not.toBe(second);
    expect(first).not.toContain('galeria-segura');
    await expect(verifySecret('galeria-segura', first)).resolves.toBe(true);
    await expect(verifySecret('senha-incorreta', first)).resolves.toBe(false);
  });

  it('creates opaque session tokens and stores only deterministic hashes', () => {
    const token = newOpaqueToken();
    expect(token.length).toBeGreaterThan(32);
    expect(tokenHash(token)).toHaveLength(64);
    expect(tokenHash(token)).toBe(tokenHash(token));
  });

  it('serializes gallery cookies with browser security attributes', () => {
    const header = sessionCookie('cliente-2026', 'opaque-token', 3600);
    expect(header).toContain('HttpOnly');
    expect(header).toContain('Secure');
    expect(header).toContain('SameSite=Lax');
    expect(sessionCookieName('cliente-2026')).toBe('__Host-versa_gallery_cliente-2026');

    const request = new Request('https://galeria.example/api', {
      headers: { cookie: 'other=1; __Host-versa_gallery_cliente-2026=opaque-token' },
    });
    expect(cookieValue(request, '__Host-versa_gallery_cliente-2026')).toBe('opaque-token');
  });
});
