import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { AppointmentResource } from '../types';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Rescheduled', value: 'rescheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no_show' },
];

const MEETING_TYPE_OPTIONS = [
  { label: 'Phone Call', value: 'phone_call' },
  { label: 'Video Call', value: 'video_call' },
  { label: 'In Person', value: 'in_person' },
];

const columns: ColumnConfig<AppointmentResource>[] = [
  { key: 'name', label: 'Name' },
  {
    key: 'service_title',
    label: 'Service',
    className: 'text-white/60',
  },
  {
    key: 'appointment_date',
    label: 'Date & Time',
    render: (row) => `${row.appointment_date} ${row.appointment_time}`,
  },
  {
    key: 'meeting_type',
    label: 'Type',
    className: 'text-white/60',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const formFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
  },
  {
    name: 'service',
    label: 'Service',
    type: 'text',
  },
  {
    name: 'appointment_date',
    label: 'Date',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    required: true,
  },
  {
    name: 'appointment_time',
    label: 'Time',
    type: 'text',
    placeholder: '10:00 AM',
    required: true,
  },
  {
    name: 'time_preference',
    label: 'Time Preference',
    type: 'text',
  },
  {
    name: 'meeting_type',
    label: 'Meeting Type',
    type: 'select',
    options: MEETING_TYPE_OPTIONS,
  },
  {
    name: 'message',
    label: 'Client Message',
    type: 'textarea',
    rows: 2,
  },
  {
    name: 'admin_notes',
    label: 'Admin Notes',
    type: 'textarea',
    rows: 2,
  },
  {
    name: 'meeting_link',
    label: 'Meeting Link',
    type: 'text',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: STATUS_OPTIONS,
  },
];

export default function Appointments() {
  return (
    <SimpleCrudPage<AppointmentResource>
      resourceLabel="Appointment"
      resourceLabelPlural="Appointments"
      endpoint="/admin/appointments"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        name: '',
        email: '',
        phone: '',
        service: '',
        appointment_date: '',
        appointment_time: '',
        time_preference: '',
        meeting_type: 'phone_call',
        message: '',
        admin_notes: '',
        meeting_link: '',
        status: 'pending',
      }}
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: STATUS_OPTIONS,
        },
      ]}
    />
  );
}