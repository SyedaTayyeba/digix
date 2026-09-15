import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { PricingPackageResource } from '../types';

const columns: ColumnConfig<PricingPackageResource>[] = [
  {
    key: 'name',
    label: 'Package',
  },
  {
    key: 'price',
    label: 'Price',
    render: (row) => {
      const currency = String(row.currency ?? '').trim();
      const price = String(row.price ?? '').trim();

      return [currency, price].filter(Boolean).join(' ') || '—';
    },
  },
  {
    key: 'billing_period',
    label: 'Billing',
    render: (row) => row.billing_period || '—',
  },
  {
    key: 'is_popular',
    label: 'Popular',
    render: (row) => (row.is_popular ? 'Yes' : '—'),
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
    label: 'Package Name',
    type: 'text',
    required: true,
    placeholder: 'Starter',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'text',
    required: true,
    placeholder: 'Custom Quote or 2500',
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'text',
    placeholder: 'AED',
  },
  {
    name: 'billing_period',
    label: 'Billing Period',
    type: 'select',
    options: [
      {
        label: 'Monthly',
        value: 'month',
      },
      {
        label: 'Yearly',
        value: 'year',
      },
      {
        label: 'Per Project',
        value: 'project',
      },
    ],
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 3,
    placeholder: 'Short package description',
  },
  {
    name: 'features',
    label: 'Features',
    type: 'list',
    rows: 5,
    helperText: 'Enter one feature per line.',
  },
  {
    name: 'cta_text',
    label: 'CTA Button Text',
    type: 'text',
    placeholder: 'Book a Consultation',
  },
  {
    name: 'is_popular',
    label: 'Popular / Recommended',
    type: 'checkbox',
    placeholder: 'Highlight this package',
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
      {
        label: 'Draft',
        value: 'draft',
      },
      {
        label: 'Published',
        value: 'published',
      },
    ],
  },
];

export default function Pricing() {
  return (
    <SimpleCrudPage<PricingPackageResource>
      resourceLabel="Package"
      resourceLabelPlural="Pricing Packages"
      endpoint="/admin/pricing"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        name: '',
        price: 'Custom Quote',
        currency: 'AED',
        billing_period: 'month',
        description: '',
        features: [],
        cta_text: 'Book a Consultation',
        is_popular: false,
        sort_order: 0,
        status: 'draft',
      }}
      searchPlaceholder="Search pricing packages..."
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            {
              label: 'Draft',
              value: 'draft',
            },
            {
              label: 'Published',
              value: 'published',
            },
          ],
        },
      ]}
      hasStatusToggle
    />
  );
}