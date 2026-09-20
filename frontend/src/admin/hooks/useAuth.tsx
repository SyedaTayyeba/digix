import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  apiGet,
  apiPost,
  getStoredToken,
  setStoredToken,
  registerUnauthorizedHandler,
  type ApiError,
} from '../../lib/api';

import type { AdminUser } from '../types';

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * ------------------------------------------------------------------
   * Restore existing login session
   * ------------------------------------------------------------------
   */
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setStoredToken(null);
      setUser(null);
    });

    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await apiGet<AdminUser>('/auth/me');

        console.log('AUTH ME RESPONSE:', me);

        setUser(me);
      } catch (error) {
        console.error('AUTH RESTORE ERROR:', error);

        setStoredToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  /*
   * ------------------------------------------------------------------
   * Login
   * ------------------------------------------------------------------
   */
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

    /*
     * Save token first.
     */
    setStoredToken(token);

    /*
     * Store authenticated user.
     */
    setUser(user);

    console.log(
      'TOKEN SAVED:',
      getStoredToken()
    );
  }

  /*
   * ------------------------------------------------------------------
   * Logout
   * ------------------------------------------------------------------
   */
  async function logout() {
    try {
      await apiPost('/auth/logout');
    } catch (error) {
      console.warn(
        'Backend logout failed:',
        error
      );
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }

  /*
   * ------------------------------------------------------------------
   * Permissions
   * ------------------------------------------------------------------
   */
  function hasPermission(permission: string) {
    if (!user?.permissions) {
      return true;
    }

    return user.permissions.includes(permission);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}

export type { ApiError };
