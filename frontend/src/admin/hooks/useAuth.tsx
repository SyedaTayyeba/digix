import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiGet, apiPost, getStoredToken, setStoredToken, registerUnauthorizedHandler, type ApiError } from '../../lib/api';
import type { AdminUser } from '../types';

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface AuthContextValue {
  user: AdminUser | null;
  /** True while the initial /api/auth/me check is running on load. */
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Wraps the whole admin section. On mount, if a token is already stored,
 * it calls GET /api/auth/me to restore the session — this is what keeps
 * the admin logged in across page navigation/reloads, since the token
 * itself doesn't carry the user's name/permissions.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a 401 ever comes back from any request, drop the session so
    // ProtectedAdminRoute redirects to /admin/login rather than the UI
    // silently continuing to show stale/authenticated-looking screens.
    registerUnauthorizedHandler(() => setUser(null));

    async function restoreSession() {
      if (!getStoredToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await apiGet<AdminUser>('/auth/me');
        setUser(me);
      } catch {
        setStoredToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // async function login(payload: LoginPayload) {
  //   const res = await apiPost<{ token: string; user: AdminUser }>('/auth/login', payload);
  //   setStoredToken(res.token);
  //   setUser(res.user);
  // }

async function login(payload: LoginPayload) {
  const res = await apiPost<{
    success: boolean;
    message: string;
    data: {
      user: AdminUser;
      token: string;
    };
  }>('/auth/login', payload);

  console.log('LOGIN API RESPONSE:', res);

  const token = res.data?.token;
  const user = res.data?.user;

  if (!token) {
    throw new Error(
      'Login succeeded but no token was returned.'
    );
  }

  if (!user) {
    throw new Error(
      'Login succeeded but no user data was returned.'
    );
  }

  setStoredToken(token);
  setUser(user);

  console.log(
    'TOKEN SAVED:',
    getStoredToken()
  );
}

  async function logout() {
    try {
      await apiPost('/auth/logout');
    } catch {
      // Even if the API call fails (e.g. token already invalid), still
      // clear local state so the UI reflects "logged out" immediately.
    }
    setStoredToken(null);
    setUser(null);
  }

  function hasPermission(permission: string) {
    // No permission data from the backend yet = don't hide anything;
    // absence of data isn't the same as absence of access. Backend
    // authorization (403 handling) remains the real security boundary.
    if (!user?.permissions) return true;
    return user.permissions.includes(permission);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export type { ApiError };
