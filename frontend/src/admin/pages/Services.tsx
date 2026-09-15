import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { ServiceResource } from '../types';

const columns: ColumnConfig<ServiceResource>[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'slug',
    label: 'Slug',
    className: 'text-white/50 font-mono text-xs',
  },
  {
    key: 'sort_order',
    label: 'Order',
    className: 'w-16',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const formFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Google Ads',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'google-ads',
  },
  {
    name: 'short_description',
    label: 'Short Description',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'Short description of the service',
  },
  {
    name: 'description',
    label: 'Full Description',
    type: 'textarea',
    rows: 6,
    required: true,
    placeholder: 'Detailed service description',
  },
  {
    name: 'features',
    label: 'Features',
    type: 'list',
    rows: 5,
    helperText: 'Enter one feature per line.',
  },
  {
    name: 'process_steps',
    label: 'Process Steps',
    type: 'list',
    rows: 5,
    helperText: 'Enter one process step per line, in order.',
  },
  {
    name: 'sort_order',
    label: 'Sort Order',
    type: 'number',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ],
  },
];

export default function Services() {
  return (
    <SimpleCrudPage<ServiceResource>
      resourceLabel="Service"
      resourceLabelPlural="Services"
      endpoint="/admin/services"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        title: '',
        slug: '',
        short_description: '',
        description: '',
        features: [],
        process_steps: [],
        status: 'draft',
        sort_order: 0,
      }}
      searchPlaceholder="Search services..."
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        },
      ]}
      hasStatusToggle
    />
  );
}