import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { type FieldConfig } from '../components/FormField';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../hooks/useToast';
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  type ApiError,
} from '../../lib/api';
import type { AvailabilitySlot } from '../types';
import PageOverlay from '../../components/ui/PageOverlay';

const ENDPOINT = '/admin/availability';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const formFields: FieldConfig[] = [
  {
    name: 'day_of_week',
    label: 'Day',
    type: 'select',
    required: true,
    options: DAY_NAMES.map((day, index) => ({
      label: day,
      value: String(index),
    })),
  },
  {
    name: 'start_time',
    label: 'Start Time',
    type: 'text',
    placeholder: '09:00',
    required: true,
  },
  {
    name: 'end_time',
    label: 'End Time',
    type: 'text',
    placeholder: '18:00',
    required: true,
  },
  {
    name: 'slot_duration',
    label: 'Slot Duration (minutes)',
    type: 'number',
    required: true,
  },
  {
    name: 'buffer_time',
    label: 'Buffer Between Slots (minutes)',
    type: 'number',
  },
  {
    name: 'is_available',
    label: 'Available',
    type: 'checkbox',
    placeholder: 'Accept bookings during this time',
  },
];

export default function Availability() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<AvailabilitySlot | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchSlots() {
    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<AvailabilitySlot[]>(ENDPOINT);
      setSlots(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  function openCreate() {
    setEditingId(null);
    setFormErrors({});

    setFormValues({
      day_of_week: '0',
      start_time: '09:00',
      end_time: '18:00',
      slot_duration: 30,
      buffer_time: 0,
      is_available: true,
    });

    setModalOpen(true);
  }

  function openEdit(slot: AvailabilitySlot) {
    setEditingId(slot.id);
    setFormErrors({});

    setFormValues({
      day_of_week: String(slot.day_of_week),
      start_time: slot.start_time,
      end_time: slot.end_time,
      slot_duration: slot.slot_duration ?? 30,
      buffer_time: slot.buffer_time ?? 0,
      is_available: Boolean(slot.is_available),
    });

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  }

  async function handleSubmit() {
    setSaving(true);
    setFormErrors({});

    const payload = {
      day_of_week: Number(formValues.day_of_week),
      start_time: String(formValues.start_time ?? ''),
      end_time: String(formValues.end_time ?? ''),
      slot_duration: Number(formValues.slot_duration),
      buffer_time: Number(formValues.buffer_time ?? 0),
      is_available: Boolean(formValues.is_available),
    };

    try {
      if (editingId !== null) {
        await apiPut(`${ENDPOINT}/${editingId}`, payload);
        showToast('Availability slot updated.');
      } else {
        await apiPost(ENDPOINT, payload);
        showToast('Availability slot created.');
      }

      setModalOpen(false);
      setEditingId(null);
      await fetchSlots();
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.errors) {
        setFormErrors(apiError.errors);
      } else {
        showToast(apiError.message || 'Unable to save slot.', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(slot: AvailabilitySlot) {
    try {
      await apiPatch(`${ENDPOINT}/${slot.id}`, {
        is_available: !slot.is_available,
      });

      showToast(
        slot.is_available
          ? 'Availability disabled.'
          : 'Availability enabled.',
      );

      await fetchSlots();
    } catch (err) {
      showToast(
        (err as ApiError).message || 'Unable to update availability.',
        'error',
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await apiDelete(`${ENDPOINT}/${deleteTarget.id}`);

      showToast('Slot deleted.');
      setDeleteTarget(null);

      await fetchSlots();
    } catch (err) {
      showToast(
        (err as ApiError).message || 'Unable to delete slot.',
        'error',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
          Weekly availability used to generate booking slots on the public site.
        </p>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-fit items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-black transition hover:bg-brand/85"
        >
          <Plus size={15} />
          Add Slot
        </button>
      </div>

      {/* Loading */}
      {loading && <LoadingState />}

      {/* Error */}
      {!loading && error && (
        <ErrorState
          message={error.message}
          onRetry={fetchSlots}
        />
      )}

      {/* Empty */}
      {!loading && !error && slots.length === 0 && (
        <EmptyState
          title="No availability configured"
          description="Add a working-hours slot for each day you accept bookings."
        />
      )}

      {/* Slots */}
      {!loading && !error && slots.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/50">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Slot Length</th>
                <th className="px-4 py-3">Buffer</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr
                  key={slot.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-4 py-3 text-white/85">
                    {DAY_NAMES[slot.day_of_week] ?? 'Unknown'}
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    {slot.start_time} – {slot.end_time}
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    {slot.slot_duration ?? 0} min
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    {slot.buffer_time ?? 0} min
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(slot)}
                      className="rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
                      aria-label={
                        slot.is_available
                          ? 'Disable availability'
                          : 'Enable availability'
                      }
                      title={
                        slot.is_available
                          ? 'Disable availability'
                          : 'Enable availability'
                      }
                    >
                      {slot.is_available ? (
                        <ToggleRight
                          size={19}
                          className="text-brand"
                        />
                      ) : (
                        <ToggleLeft size={19} />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(slot)}
                        className="rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(slot)}
                        className="rounded-md p-1.5 text-white/50 transition hover:bg-red-500/10 hover:text-red-300"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId !== null ? 'Edit Slot' : 'Add Slot'}
      >
        <div className="space-y-4">
          {formFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formValues[field.name]}
              error={formErrors[field.name]}
              onChange={(name, value) =>
                setFormValues((prev) => ({
                  ...prev,
                  [name]: value,
                }))
              }
            />
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-black transition hover:bg-brand/85 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Slot"
        message="This will permanently remove this availability slot."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}