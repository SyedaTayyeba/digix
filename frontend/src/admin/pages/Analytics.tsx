import { useEffect, useState } from 'react';
import DataTable, { type ColumnConfig } from '../components/DataTable';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCrudList } from '../hooks/useCrudList';
import { apiGet, type ApiError } from '../../lib/api';
import type { AnalyticsSummary } from '../types';

interface AnalyticsEventRow {
  id: number;
  name: string;
  source: string;
  occurred_at: string;
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <p className="text-2xl font-medium text-white">{value}</p>
      <p className="mt-1 text-xs text-white/50">{label}</p>
    </div>
  );
}

function BreakdownList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
        {title}
      </h3>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-white/40">No data yet.</p>
        )}

        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-white/75">{item.label}</span>
            <span className="text-white/50">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<ApiError | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);

  async function fetchSummary() {
    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const res = await apiGet<AnalyticsSummary>(
        '/admin/analytics/summary',
        {
          params: {
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            event: eventFilter || undefined,
            source: sourceFilter || undefined,
          },
        }
      );

      setSummary(res);
    } catch (err) {
      setSummaryError(err as ApiError);
    } finally {
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    fetchSummary();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo, eventFilter, sourceFilter]);

  const filters: Record<string, string> = {};

  if (dateFrom) filters.date_from = dateFrom;
  if (dateTo) filters.date_to = dateTo;
  if (eventFilter) filters.event = eventFilter;
  if (sourceFilter) filters.source = sourceFilter;

  const {
    data,
    currentPage,
    lastPage,
    total,
    loading,
    error,
    refetch,
  } = useCrudList<AnalyticsEventRow>(
    '/admin/analytics/events',
    {
      page,
      filters,
    }
  );

  const columns: ColumnConfig<AnalyticsEventRow>[] = [
    {
      key: 'name',
      label: 'Event',
    },
    {
      key: 'source',
      label: 'Source',
    },
    {
      key: 'occurred_at',
      label: 'Occurred At',
      className: 'text-white/50 text-xs',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <input
          type="text"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          placeholder="Event name"
          className="w-36 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <input
          type="text"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          placeholder="Source"
          className="w-36 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
      </div>

      {/* Summary */}
      {summaryLoading && <LoadingState rows={2} />}

      {!summaryLoading && summaryError && (
        <ErrorState
          message={summaryError.message}
          onRetry={fetchSummary}
        />
      )}

      {!summaryLoading && !summaryError && summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Conversion Events"
              value={summary.total_events ?? 0}
            />

            <SummaryCard
              label="Unique Event Types"
              value={summary.by_name?.length ?? 0}
            />

            <SummaryCard
              label="Unique Sources"
              value={summary.by_source?.length ?? 0}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <BreakdownList
              title="Events by Name"
              items={
                summary.by_name?.map((event) => ({
                  label: event.name,
                  count: event.count,
                })) ?? []
              }
            />

            <BreakdownList
              title="Events by Source"
              items={
                summary.by_source?.map((source) => ({
                  label: source.source,
                  count: source.count,
                })) ?? []
              }
            />
          </div>
        </>
      )}

      {/* Event Log */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-white/70">
          Event Log
        </h3>

        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState
            message={error.message}
            onRetry={refetch}
          />
        )}

        {!loading && !error && data.length === 0 && (
          <EmptyState title="No events match these filters" />
        )}

        {!loading && !error && data.length > 0 && (
          <>
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(row) => row.id}
            />

            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}