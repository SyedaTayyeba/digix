import { useState, type FormEvent } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';

import DataTable, {
  type ColumnConfig,
} from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { useCrudList } from '../hooks/useCrudList';
import { useToast } from '../hooks/useToast';

import {
  apiGet,
  apiPatch,
  apiPost,
  apiDelete,
  type ApiError,
} from '../../lib/api';

import type {
  LeadResource,
  LeadStage,
} from '../types';

const ENDPOINT = '/admin/leads';

const STAGES: {
  value: LeadStage;
  label: string;
}[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  {
    value: 'meeting_booked',
    label: 'Meeting Booked',
  },
  {
    value: 'proposal_sent',
    label: 'Proposal Sent',
  },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function Leads() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] =
    useState('');
  const [sourceFilter, setSourceFilter] =
    useState('');

  const [selectedLead, setSelectedLead] =
    useState<LeadResource | null>(null);

  const [loadingDetail, setLoadingDetail] =
    useState(false);

  const [newActivity, setNewActivity] =
    useState('');

  const [savingActivity, setSavingActivity] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<LeadResource | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const { showToast } = useToast();

  const filters: Record<string, string> = {};

  if (stageFilter) {
    filters.stage = stageFilter;
  }

  if (sourceFilter.trim()) {
    filters.source = sourceFilter.trim();
  }

  const {
    data,
    currentPage,
    lastPage,
    total,
    loading,
    error,
    refetch,
  } = useCrudList<LeadResource>(
    ENDPOINT,
    {
      page,
      search,
      filters,
    },
  );

  async function openLead(
    lead: LeadResource,
  ) {
    setSelectedLead(lead);
    setLoadingDetail(true);

    try {
      const response =
        await apiGet<LeadResource>(
          `${ENDPOINT}/${lead.id}`,
        );

      setSelectedLead(response);
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to load lead.',
        'error',
      );
    } finally {
      setLoadingDetail(false);
    }
  }

  async function changeStage(
    stage: LeadStage,
  ) {
    if (
      !selectedLead ||
      selectedLead.stage === stage
    ) {
      return;
    }

    try {
      const updated =
        await apiPatch<LeadResource>(
          `${ENDPOINT}/${selectedLead.id}/stage`,
          { stage },
        );

      setSelectedLead(updated);

      showToast(
        `Stage updated to ${getStageLabel(stage)}.`,
      );

      refetch();
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to update stage.',
        'error',
      );
    }
  }

  async function markWhatsappEngagement() {
    if (!selectedLead) {
      return;
    }

    try {
      const updated =
        await apiPatch<LeadResource>(
          `${ENDPOINT}/${selectedLead.id}/whatsapp`,
          {},
        );

      setSelectedLead(updated);

      showToast(
        'WhatsApp engagement recorded.',
      );

      refetch();
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to record WhatsApp engagement.',
        'error',
      );
    }
  }

  async function handleAddActivity(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !selectedLead ||
      !newActivity.trim()
    ) {
      return;
    }

    setSavingActivity(true);

    try {
      const updated =
        await apiPost<LeadResource>(
          `${ENDPOINT}/${selectedLead.id}/activities`,
          {
            description:
              newActivity.trim(),
          },
        );

      setSelectedLead(updated);
      setNewActivity('');

      showToast('Activity added.');
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to add activity.',
        'error',
      );
    } finally {
      setSavingActivity(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await apiDelete(
        `${ENDPOINT}/${deleteTarget.id}`,
      );

      showToast('Lead deleted.');

      setDeleteTarget(null);
      setSelectedLead(null);

      refetch();
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to delete lead.',
        'error',
      );
    } finally {
      setDeleting(false);
    }
  }

  const columns: ColumnConfig<LeadResource>[] =
    [
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'email',
        label: 'Email',
        className: 'text-white/60',
      },
      {
        key: 'source',
        label: 'Source',
      },
      {
        key: 'stage',
        label: 'Stage',
        render: (row) => (
          <StatusBadge value={row.stage} />
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        className:
          'text-white/50 text-xs',
      },
    ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search leads..."
        />

        <select
          value={stageFilter}
          onChange={(event) => {
            setStageFilter(
              event.target.value,
            );
            setPage(1);
          }}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
        >
          <option value="">
            Stage: All
          </option>

          {STAGES.map((stage) => (
            <option
              key={stage.value}
              value={stage.value}
            >
              {stage.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={sourceFilter}
          onChange={(event) => {
            setSourceFilter(
              event.target.value,
            );
            setPage(1);
          }}
          placeholder="Source"
          className="w-36 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message={error.message}
          onRetry={refetch}
        />
      )}

      {!loading &&
        !error &&
        data.length === 0 && (
          <EmptyState
            title="No leads yet"
            description="New leads submitted from the website will appear here."
          />
        )}

      {!loading &&
        !error &&
        data.length > 0 && (
          <>
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(row) => row.id}
              actions={(row) => (
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      openLead(row)
                    }
                    className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget(row)
                    }
                    className="rounded-md p-1.5 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Delete"
                    title="Delete lead"
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

      <Modal
        open={Boolean(selectedLead)}
        onClose={() => {
          if (!loadingDetail) {
            setSelectedLead(null);
          }
        }}
        title={
          selectedLead?.name ?? 'Lead'
        }
        wide
      >
        {selectedLead && (
          <div className="space-y-5 text-sm">
            {loadingDetail ? (
              <LoadingState rows={2} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 text-white/75 sm:grid-cols-2">
                  <p>
                    <span className="text-white/40">
                      Email:
                    </span>{' '}
                    {selectedLead.email}
                  </p>

                  <p>
                    <span className="text-white/40">
                      Phone:
                    </span>{' '}
                    {selectedLead.phone ||
                      '—'}
                  </p>

                  <p>
                    <span className="text-white/40">
                      Company:
                    </span>{' '}
                    {selectedLead.company ||
                      '—'}
                  </p>

                  <p>
                    <span className="text-white/40">
                      Source:
                    </span>{' '}
                    {selectedLead.source ||
                      '—'}
                  </p>

                  <p>
                    <span className="text-white/40">
                      Est. Value:
                    </span>{' '}
                    {selectedLead.estimated_value ??
                      '—'}
                  </p>

                  <p>
                    <span className="text-white/40">
                      Created:
                    </span>{' '}
                    {selectedLead.created_at}
                  </p>
                </div>

                {selectedLead.message && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-white/40">
                      Message
                    </p>

                    <p className="rounded-md bg-white/5 p-3 text-white/80">
                      {selectedLead.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 text-white/70">
                    <MessageCircle
                      size={15}
                    />
                    WhatsApp engagement
                  </span>

                  <button
                    type="button"
                    onClick={
                      markWhatsappEngagement
                    }
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedLead.whatsapp_clicked_at
                        ? 'bg-brand/15 text-brand'
                        : 'bg-brand text-black hover:bg-brand/85'
                    }`}
                  >
                    {selectedLead.whatsapp_clicked_at
                      ? 'Engagement Recorded'
                      : 'Record Engagement'}
                  </button>
                </div>

                {selectedLead.whatsapp_clicked_at && (
                  <p className="-mt-3 text-xs text-white/40">
                    WhatsApp clicked:{' '}
                    {
                      selectedLead.whatsapp_clicked_at
                    }
                  </p>
                )}

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-white/40">
                    Pipeline Stage
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(
                      (stage) => (
                        <button
                          key={
                            stage.value
                          }
                          type="button"
                          onClick={() =>
                            changeStage(
                              stage.value,
                            )
                          }
                          className={`rounded-full border px-3 py-1 text-xs transition-colors duration-150 ${
                            selectedLead.stage ===
                            stage.value
                              ? 'border-brand bg-brand text-black'
                              : 'border-white/20 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {stage.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-white/40">
                    Activities
                  </p>

                  <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
                    {(selectedLead.activities ??
                      []).length === 0 && (
                      <p className="text-xs text-white/40">
                        No activity logged yet.
                      </p>
                    )}

                    {(
                      selectedLead.activities ??
                      []
                    ).map(
                      (activity) => (
                        <div
                          key={
                            activity.id
                          }
                          className="rounded-md bg-white/5 px-3 py-2 text-xs text-white/70"
                        >
                          <p>
                            {
                              activity.description
                            }
                          </p>

                          <p className="mt-1 text-white/35">
                            {activity.user_name
                              ? `${activity.user_name} · `
                              : ''}
                            {
                              activity.created_at
                            }
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  <form
                    onSubmit={
                      handleAddActivity
                    }
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={
                        newActivity
                      }
                      onChange={(
                        event,
                      ) =>
                        setNewActivity(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Add a note or call log..."
                      className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
                    />

                    <button
                      type="submit"
                      disabled={
                        savingActivity ||
                        !newActivity.trim()
                      }
                      className="rounded-md bg-brand px-3 py-2 text-xs font-medium text-black hover:bg-brand/85 disabled:opacity-60"
                    >
                      {savingActivity
                        ? 'Adding...'
                        : 'Add'}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Lead"
        message="This will permanently delete this lead and its activity history."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  );
}

function getStageLabel(
  stage: LeadStage,
): string {
  const match = STAGES.find(
    (item) => item.value === stage,
  );

  return match?.label ?? stage;
}