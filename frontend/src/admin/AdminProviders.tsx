import { Outlet } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';

/**
 * Wraps the whole /admin subtree (login included) with auth + toast
 * context. Kept separate from the public site's providers so nothing
 * about the admin panel touches public page behavior.
 */
export default function AdminProviders() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  );
}
