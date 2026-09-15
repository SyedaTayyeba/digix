import { Star } from 'lucide-react';
import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { TestimonialResource } from '../types';

const columns: ColumnConfig<TestimonialResource>[] = [
  {
    key: 'client_name',
    label: 'Client',
  },
  {
    key: 'company',
    label: 'Company',
  },
  {
    key: 'rating',
    label: 'Rating',
    render: (row) => {
      const rating = Math.min(5, Math.max(0, Number(row.rating ?? 0)));

      return (
        <span
          className="inline-flex items-center gap-0.5"
          aria-label={`Rating ${rating} out of 5`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={12}
              className={
                index < rating
                  ? 'fill-brand text-brand'
                  : 'text-white/20'
              }
            />
          ))}
        </span>
      );
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const formFields: FieldConfig[] = [
  {
    name: 'client_name',
    label: 'Client Name',
    type: 'text',
    required: true,
    placeholder: 'Client name',
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Company name',
  },
  {
    name: 'position',
    label: 'Position',
    type: 'text',
    placeholder: 'CEO, Marketing Manager, etc.',
  },
  {
    name: 'content',
    label: 'Testimonial',
    type: 'textarea',
    rows: 5,
    required: true,
    placeholder: 'Client testimonial...',
  },
  {
    name: 'rating',
    label: 'Rating (1-5)',
    type: 'number',
    required: true,
    placeholder: '5',
  },
  {
    name: 'avatar_url',
    label: 'Avatar URL',
    type: 'text',
    placeholder: 'https://...',
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

export default function Testimonials() {
  return (
    <SimpleCrudPage<TestimonialResource>
      resourceLabel="Testimonial"
      resourceLabelPlural="Testimonials"
      endpoint="/admin/testimonials"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        client_name: '',
        company: '',
        position: '',
        content: '',
        rating: 5,
        avatar_url: '',
        status: 'draft',
      }}
      searchPlaceholder="Search testimonials..."
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