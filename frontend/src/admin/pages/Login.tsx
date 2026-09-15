import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import type { ApiError } from '../../lib/api';

export default function Login() {
  const { user, loading, login } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * If the user is already authenticated,
   * don't show the login page.
   */
  if (!loading && user) {
    const state = location.state as
      | { from?: { pathname?: string } }
      | null;

    const redirectTo =
      state?.from?.pathname || '/admin/dashboard';

    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log('LOGIN BUTTON CLICKED');

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setSubmitting(true);

    console.log('CALLING LOGIN...');

    try {
      await login({
        email: cleanEmail,
        password,
        remember,
      });

      console.log('LOGIN SUCCESS');

      /*
       * Full navigation makes the browser reload the admin app.
       * AuthProvider will read the stored token and call /auth/me.
       */
      window.location.href = '/admin/dashboard';
    } catch (err) {
      console.error('LOGIN ERROR:', err);

      const apiError = err as ApiError;

      setError(
        apiError.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <Hexagon
            size={22}
            strokeWidth={1.5}
          />

          <span className="text-base font-medium tracking-tight">
            Admin Panel
          </span>
        </div>

        <h1 className="mb-1 text-xl font-medium">
          Sign in
        </h1>

        <p className="mb-6 text-sm text-white/50">
          Admin access only.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs text-white/60"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={submitting}
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
              placeholder="abc@company.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs text-white/60"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={submitting}
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              disabled={submitting}
              className="h-4 w-4 rounded border-white/30 bg-white/5 accent-[#2fbcba]"
            />

            Remember me
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Signing in…'
              : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
