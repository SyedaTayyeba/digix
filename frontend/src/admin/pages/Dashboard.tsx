import { useEffect, useState } from 'react';

import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import StatusBadge from '../components/StatusBadge';
import SimpleBarChart from '../components/SimpleBarChart';

import { apiGet, type ApiError } from '../../lib/api';
import type { DashboardStats } from '../types';

const ENDPOINT = '/admin/dashboard';

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">

      <p className="text-2xl font-medium text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/50">
        {label}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<ApiError | null>(null);

  async function fetchStats() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await apiGet<DashboardStats>(ENDPOINT);

      setStats(response);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState rows={6} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={fetchStats}
      />
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* =========================
          STATISTICS
      ========================== */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

        <StatCard
          label="Total Leads"
          value={stats.total_leads ?? 0}
        />

        <StatCard
          label="New Leads"
          value={stats.new_leads ?? 0}
        />

        <StatCard
          label="Qualified Leads"
          value={stats.qualified_leads ?? 0}
        />

        <StatCard
          label="Won Leads"
          value={stats.won_leads ?? 0}
        />

        <StatCard
          label="Lost Leads"
          value={stats.lost_leads ?? 0}
        />

        <StatCard
          label="Total Appointments"
          value={stats.total_appointments ?? 0}
        />

        <StatCard
          label="Pending Appointments"
          value={stats.pending_appointments ?? 0}
        />

        <StatCard
          label="Published Services"
          value={stats.published_services ?? 0}
        />

        <StatCard
          label="Testimonials"
          value={stats.testimonials_count ?? 0}
        />

        <StatCard
          label="Team Members"
          value={stats.team_members_count ?? 0}
        />

      </div>

      {/* =========================
          LEAD CHARTS
      ========================== */}
    
      {/* <div className="grid gap-4 lg:grid-cols-3"> */}

        {/* Leads by Stage */}
        {/* <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Leads by Stage
          </h3>

          <SimpleBarChart
            data={(stats.leads_by_stage ?? []).map(
              (item) => ({
                label: item.stage,
                value: item.count,
              })
            )}
          />

        </div> */}

        {/* Leads by Source */}
        {/* <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Leads by Source
          </h3>

          <SimpleBarChart
            data={(stats.leads_by_source ?? []).map(
              (item) => ({
                label: item.source,
                value: item.count,
              })
            )}
          />

        </div> */}

        {/* Leads Over Time */}
        {/* <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Leads Over Time
          </h3>

          <SimpleBarChart
            data={(stats.leads_over_time ?? []).map(
              (item) => ({
                label: item.date,
                value: item.count,
              })
            )}
          />

        </div> */}

      {/* </div> */}

      {/* =========================
          CONVERSION EVENTS
      ========================== */}
      <div className="rounded-xl border border-white/10 p-4">

        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
          Conversion Events Summary
        </h3>

        <SimpleBarChart
          data={(stats.conversions ?? []).map(
            (item) => ({
              label: item.name,
              value: item.count,
            })
          )}
        />

      </div>

      {/* =========================
          RECENT DATA
      ========================== */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent Leads */}
        <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Recent Leads
          </h3>

          <div className="space-y-2">

            {(stats.recent_leads ?? []).length === 0 && (
              <p className="text-xs text-white/40">
                No recent leads.
              </p>
            )}

            {(stats.recent_leads ?? []).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/80">
                  {lead.name}
                </span>

                <StatusBadge value={lead.stage} />
              </div>
            ))}

          </div>

        </div>

        {/* Recent Appointments */}
        <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Recent Appointments
          </h3>

          <div className="space-y-2">

            {(stats.recent_appointments ?? []).length === 0 && (
              <p className="text-xs text-white/40">
                No recent appointments.
              </p>
            )}

            {(stats.recent_appointments ?? []).map(
              (appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/80">
                    {appointment.name}
                  </span>

                  <StatusBadge
                    value={appointment.status}
                  />
                </div>
              )
            )}

          </div>

        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-white/10 p-4">

          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
            Recent Activity
          </h3>

          <div className="space-y-2">

            {(stats.recent_activity ?? []).length === 0 && (
              <p className="text-xs text-white/40">
                No recent activity.
              </p>
            )}

            {(stats.recent_activity ?? []).map((log) => (
              <div
                key={log.id}
                className="text-sm text-white/70"
              >
                <span className="text-white/85">
                  {log.user_name}
                </span>{' '}

                {log.action} in {log.module}

                <span className="ml-1 text-xs text-white/40">
                  · {log.created_at}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
