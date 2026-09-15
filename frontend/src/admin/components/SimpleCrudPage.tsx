import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable, { type ColumnConfig } from './DataTable';
import Pagination from './Pagination';
import SearchInput from './SearchInput';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import FormField, { type FieldConfig } from './FormField';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useCrudList } from '../hooks/useCrudList';
import { useToast } from '../hooks/useToast';
import { apiPost, apiPut, apiDelete, apiPatch, type ApiError } from '../../lib/api';
import type { BaseResource } from '../types';

export interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface SimpleCrudPageProps<T extends BaseResource> {
  resourceLabel: string;
  resourceLabelPlural: string;
  endpoint: string;
  columns: ColumnConfig<T>[];
  formFields: FieldConfig[];
  defaultFormValues: Partial<T>;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  /** Show a publish/unpublish toggle that PATCHes { status }. */
  hasStatusToggle?: boolean;
}

export default function SimpleCrudPage<T extends BaseResource>({
  resourceLabel,
  resourceLabelPlural,
  endpoint,
  columns,
  formFields,
  defaultFormValues,
  searchPlaceholder,
  filters = [],
  hasStatusToggle = false,
}: SimpleCrudPageProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const { data, currentPage, lastPage, total, loading, error, refetch } = useCrudList<T>(endpoint, {
    page,
    search,
    filters: activeFilters,
  });

  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(defaultFormValues as Record<string, unknown>);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditingId(null);
    setFormValues(defaultFormValues as Record<string, unknown>);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditingId(row.id);
    setFormValues(row as unknown as Record<string, unknown>);
    setFormErrors({});
    setModalOpen(true);
  }

  function handleFieldChange(name: string, value: unknown) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setFormErrors({});
    try {
      if (editingId) {
        await apiPut(`${endpoint}/${editingId}`, formValues);
        showToast(`${resourceLabel} updated.`);
      } else {
        await apiPost(endpoint, formValues);
        showToast(`${resourceLabel} created.`);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.errors) {
        setFormErrors(apiError.errors);
      } else {
        showToast(apiError.message, 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`${endpoint}/${deleteTarget.id}`);
      showToast(`${resourceLabel} deleted.`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleStatus(row: T) {
    const current = (row as unknown as { status?: string }).status;
    const next = current === 'published' ? 'draft' : 'published';
    try {
      await apiPatch(`${endpoint}/${row.id}`, { status: next });
      showToast(`${resourceLabel} ${next === 'published' ? 'published' : 'unpublished'}.`);
      refetch();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder ?? `Search ${resourceLabelPlural.toLowerCase()}…`} />
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] ?? ''}
              onChange={(e) =>
                setActiveFilters((prev) => {
                  const next = { ...prev };
                  if (e.target.value) next[filter.key] = e.target.value;
                  else delete next[filter.key];
                  return next;
                })
              }
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
            >
              <option value="">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-black hover:bg-brand/85"
        >
          <Plus size={15} /> Add {resourceLabel}
        </button>
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error.message} onRetry={refetch} />}
      {!loading && !error && data.length === 0 && (
        <EmptyState
          title={`No ${resourceLabelPlural.toLowerCase()} yet`}
          description={`Create your first ${resourceLabel.toLowerCase()} to see it here.`}
        />
      )}
      {!loading && !error && data.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data}
            rowKey={(row) => row.id}
            actions={(row) => (
              <div className="flex justify-end gap-1">
                {hasStatusToggle && (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(row)}
                    className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                    aria-label="Toggle publish status"
                    title={(row as unknown as { status?: string }).status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {(row as unknown as { status?: string }).status === 'published' ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  className="rounded-md p-1.5 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          />
          <Pagination currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? `Edit ${resourceLabel}` : `Add ${resourceLabel}`}
        wide
      >
        <div className="space-y-4">
          {formFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formValues[field.name]}
              error={formErrors[field.name]}
              onChange={handleFieldChange}
            />
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-black hover:bg-brand/85 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${resourceLabel}`}
        message={`This will permanently delete this ${resourceLabel.toLowerCase()}. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
