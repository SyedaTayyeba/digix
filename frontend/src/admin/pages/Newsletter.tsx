import { useState } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable, { type ColumnConfig } from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCrudList } from '../hooks/useCrudList';
import { useToast } from '../hooks/useToast';
import { apiPatch, apiDelete, type ApiError } from '../../lib/api';
import type { NewsletterSubscriberResource } from '../types';
import PageOverlay from '../../components/ui/PageOverlay';

const ENDPOINT = '/admin/newsletter';

const STATUS_OPTIONS = [
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
];

export default function Newsletter() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [deleteTarget, setDeleteTarget] =
    useState<NewsletterSubscriberResource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const {
    data,
    currentPage,
    lastPage,
    total,
    loading,
    error,
    refetch,
  } = useCrudList<NewsletterSubscriberResource>(ENDPOINT, {
    page,
    search,
    filters: statusFilter ? { status: statusFilter } : {},
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  async function toggleSubscription(row: NewsletterSubscriberResource) {
    const newStatus =
      row.status === 'subscribed' ? 'unsubscribed' : 'subscribed';

    try {
      await apiPatch(`${ENDPOINT}/${row.id}`, {
        status: newStatus,
      });

      showToast(
        newStatus === 'subscribed'
          ? 'Marked as subscribed.'
          : 'Marked as unsubscribed.',
      );

      await refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await apiDelete(`${ENDPOINT}/${deleteTarget.id}`);

      showToast('Subscriber deleted.');
      setDeleteTarget(null);

      await refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: ColumnConfig<NewsletterSubscriberResource>[] = [
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={
            row.status === 'subscribed'
              ? 'text-brand'
              : 'text-white/40'
          }
        >
          {row.status === 'subscribed'
            ? 'Subscribed'
            : 'Unsubscribed'}
        </span>
      ),
    },
    {
      key: 'subscribed_at',
      label: 'Subscribed On',
      className: 'text-white/50 text-xs',
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by email…"
        />

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        >
          <option value="">Status: All</option>

          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState message={error.message} onRetry={refetch} />
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState title="No subscribers yet" />
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data}
            rowKey={(row) => row.id}
            actions={(row) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => toggleSubscription(row)}
                  className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label="Toggle subscription"
                  title={
                    row.status === 'subscribed'
                      ? 'Mark unsubscribed'
                      : 'Mark subscribed'
                  }
                >
                  {row.status === 'subscribed' ? (
                    <ToggleRight size={16} />
                  ) : (
                    <ToggleLeft size={16} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  className="rounded-md p-1.5 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                  aria-label="Delete"
                  title="Delete subscriber"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          />

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Subscriber"
        message="This will permanently remove this subscriber from your list."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}