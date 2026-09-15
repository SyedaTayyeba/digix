import { useEffect, useState } from 'react';
import { apiGet, normalizePaginated, type PaginatedResponse } from '../../lib/api';
import type { NotificationResource } from '../types';

/**
 * Polls the unread notification count for the sidebar/navbar badge.
 * Uses the same list endpoint as the Notifications page (filtered to
 * unread, per_page=1) rather than assuming a separate count endpoint
 * exists — trims to the pagination `total` either way.
 */
export function useUnreadNotificationsCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await apiGet<PaginatedResponse<NotificationResource>>('/admin/notifications', {
          params: { read: 'false', per_page: 1 },
        });
        if (!cancelled) setCount(normalizePaginated(res).total);
      } catch {
        // Silently ignore — a failed badge count shouldn't disrupt the UI.
      }
    }

    poll();
    const interval = window.setInterval(poll, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return count;
}
