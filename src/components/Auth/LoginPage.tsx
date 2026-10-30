import { FormEvent, useId, useState } from 'react';
import { requestAdminMagicLink } from '../../lib/backend';

interface LoginPageProps {
  onNavigateHome: () => void;
}

type FormStatus =
  | { type: 'idle'; message: '' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

export function LoginPage({ onNavigateHome }: LoginPageProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      await requestAdminMagicLink(email);
      setStatus({
        type: 'success',
        message: 'Enviamos um link seguro para o seu e-mail. Ele estará disponível por tempo limitado.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível enviar o link agora. Tente novamente em instantes.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page" data-testid="login-page">
      <button className="login-brand" type="button" onClick={onNavigateHome} aria-label="Voltar para o início">
        <span className="login-brand-mark" aria-hidden="true">V</span>
        <span>Versa Collection</span>
      </button>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-heading">
          <p className="login-eyebrow">Área do fotógrafo</p>
          <h1 id="login-title">Bem-vindo de volta.</h1>
          <p>Acesse seu estúdio para criar, organizar e entregar histórias.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor={emailId}>E-mail profissional</label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@seudominio.com.br"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-describedby={status.message ? 'login-status' : undefined}
              aria-invalid={status.type === 'error'}
            />
          </div>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando link…' : 'Continuar com e-mail'}
            <span aria-hidden="true">→</span>
          </button>

          {status.message ? (
            <p
              id="login-status"
              className={`login-status login-status-${status.type}`}
              role={status.type === 'error' ? 'alert' : 'status'}
            >
              {status.message}
            </p>
          ) : null}
        </form>

        <div className="login-security-note">
          <span aria-hidden="true" />
          <p>Sem senha para lembrar. Você receberá um link de acesso seguro na sua caixa de entrada.</p>
        </div>
      </section>

      <footer className="login-footer">
        <span>© {new Date().getFullYear()} Versa Visual</span>
        <span>Macaé · RJ</span>
      </footer>
    </main>
  );
}
