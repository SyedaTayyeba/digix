import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { TeamMemberResource } from '../types';

const columns: ColumnConfig<TeamMemberResource>[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'position',
    label: 'Position',
    className: 'text-white/60',
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
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Team member name',
  },
  {
    name: 'position',
    label: 'Position',
    type: 'text',
    required: true,
    placeholder: 'Managing Director',
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    rows: 4,
    placeholder: 'Short biography...',
  },
  {
    name: 'image_url',
    label: 'Photo URL',
    type: 'text',
    placeholder: 'https://...',
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

export default function Team() {
  return (
    <SimpleCrudPage<TeamMemberResource>
      resourceLabel="Team Member"
      resourceLabelPlural="Team Members"
      endpoint="/admin/team"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        name: '',
        position: '',
        bio: '',
        image_url: '',
        sort_order: 0,
        status: 'draft',
      }}
      searchPlaceholder="Search team members..."
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
