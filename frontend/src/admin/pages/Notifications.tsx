import { useState } from 'react';
import { Check, Trash2, CheckCheck } from 'lucide-react';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCrudList } from '../hooks/useCrudList';
import { useToast } from '../hooks/useToast';
import { apiPost, apiDelete, type ApiError } from '../../lib/api';
import type { NotificationResource } from '../types';

const ENDPOINT = '/admin/notifications';

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { showToast } = useToast();

  const {
    data,
    currentPage,
    lastPage,
    total,
    loading,
    error,
    refetch,
  } = useCrudList<NotificationResource>(ENDPOINT, {
    page,
    filters: filter === 'unread' ? { read: 'false' } : {},
  });

  function handleFilterChange(nextFilter: 'all' | 'unread') {
    setFilter(nextFilter);
    setPage(1);
  }

  async function markAsRead(id: number) {
    try {
      await apiPost(`${ENDPOINT}/${id}/read`);

      showToast('Notification marked as read.');
      await refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    }
  }

  async function markAllRead() {
    try {
      await apiPost(`${ENDPOINT}/mark-all-read`);

      showToast('All notifications marked as read.');
      await refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    }
  }

  async function remove(id: number) {
    try {
      await apiDelete(`${ENDPOINT}/${id}`);

      showToast('Notification deleted.');
      await refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors duration-300 ${
                filter === f
                  ? 'border-brand bg-brand text-black'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
        >
          <CheckCheck size={14} />
          Mark all as read
        </button>
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message={error.message}
          onRetry={refetch}
        />
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState title="No notifications" />
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div className="divide-y divide-white/10 rounded-xl border border-white/10">
            {data.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between gap-3 px-4 py-3 ${
                  !notification.read_at ? 'bg-brand/5' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>

                  <p className="mt-0.5 text-sm text-white/60">
                    {notification.body}
                  </p>

                  <p className="mt-1 text-[11px] text-white/35">
                    {notification.created_at}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1">
                  {!notification.read_at && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                      aria-label="Mark as read"
                      title="Mark as read"
                    >
                      <Check size={15} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => remove(notification.id)}
                    className="rounded-md p-1.5 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Delete"
                    title="Delete notification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}