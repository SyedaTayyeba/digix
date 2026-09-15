import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import DataTable, { type ColumnConfig } from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCrudList } from '../hooks/useCrudList';
import type { ActivityLogResource } from '../types';

const ENDPOINT = '/admin/activity-logs';

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewing, setViewing] = useState<ActivityLogResource | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, moduleFilter, actionFilter, dateFilter]);

  const filters: Record<string, string> = {};

  if (moduleFilter) filters.module = moduleFilter;
  if (actionFilter) filters.action = actionFilter;
  if (dateFilter) filters.date = dateFilter;

  const {
    data,
    currentPage,
    lastPage,
    total,
    loading,
    error,
    refetch,
  } = useCrudList<ActivityLogResource>(ENDPOINT, {
    page,
    search,
    filters,
  });

  const columns: ColumnConfig<ActivityLogResource>[] = [
    {
      key: 'created_at',
      label: 'Timestamp',
      className: 'text-white/50 text-xs',
    },
    {
      key: 'user_name',
      label: 'User',
    },
    {
      key: 'module',
      label: 'Module',
    },
    {
      key: 'action',
      label: 'Action',
    },
    {
      key: 'ip_address',
      label: 'IP',
      className: 'text-white/50 text-xs',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search logs…"
        />

        <input
          type="text"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          placeholder="Module"
          className="w-32 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <input
          type="text"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          placeholder="Action"
          className="w-32 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
      </div>

      {/* Table */}
      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message={error.message}
          onRetry={refetch}
        />
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState title="No activity recorded" />
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data}
            rowKey={(row) => row.id}
            actions={(row) => (
              <button
                type="button"
                onClick={() => setViewing(row)}
                className="rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="View details"
                title="View details"
              >
                <Eye size={15} />
              </button>
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

      {/* Details Modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Activity Details"
        wide
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 text-white/70 sm:grid-cols-2">
              <p>
                <span className="text-white/40">User:</span>{' '}
                {viewing.user_name || '—'}
              </p>

              <p>
                <span className="text-white/40">Timestamp:</span>{' '}
                {viewing.created_at || '—'}
              </p>

              <p>
                <span className="text-white/40">Module:</span>{' '}
                {viewing.module || '—'}
              </p>

              <p>
                <span className="text-white/40">Action:</span>{' '}
                {viewing.action || '—'}
              </p>

              <p>
                <span className="text-white/40">IP Address:</span>{' '}
                {viewing.ip_address || '—'}
              </p>

              <p className="sm:col-span-2 break-all">
                <span className="text-white/40">User Agent:</span>{' '}
                {viewing.user_agent || '—'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-white/40">
                  Old Values
                </p>

                <pre className="max-h-56 overflow-auto rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  {JSON.stringify(viewing.old_values ?? {}, null, 2)}
                </pre>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-white/40">
                  New Values
                </p>

                <pre className="max-h-56 overflow-auto rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  {JSON.stringify(viewing.new_values ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}