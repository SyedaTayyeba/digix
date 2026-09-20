import { useEffect, useState } from 'react';

import SimpleCrudPage from '../components/SimpleCrudPage';
import StatusBadge from '../components/StatusBadge';

import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { FaqResource } from '../types';

import { apiGet } from '../../lib/api';

type FaqCategory = {
  id: number;
  name: string;
};

type FaqCategoriesResponse =
  | FaqCategory[]
  | {
      data?: FaqCategory[];
    };

const columns: ColumnConfig<FaqResource>[] = [
  {
    key: 'question',
    label: 'Question',
  },
  {
    key: 'category_name',
    label: 'Category',
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

export default function Faqs() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await apiGet<FaqCategoriesResponse>(
          '/admin/faq-categories'
        );

        if (!mounted) {
          return;
        }

        const payload = response;

        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setCategories(data);
      } catch (error) {
        console.error('Failed to load FAQ categories:', error);

        if (mounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const formFields: FieldConfig[] = [
    {
      name: 'question',
      label: 'Question',
      type: 'text',
      required: true,
      placeholder: 'What services do you offer?',
    },
    {
      name: 'answer',
      label: 'Answer',
      type: 'textarea',
      rows: 5,
      required: true,
      placeholder: 'Write the answer...',
    },
    {
      name: 'category_id',
      label: 'Category',
      type: 'select',
      required: true,
      options: categories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
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

  return (
    <SimpleCrudPage<FaqResource>
      resourceLabel="FAQ"
      resourceLabelPlural="FAQs"
      endpoint="/admin/faqs"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        question: '',
        answer: '',
        category_id: null,
        sort_order: 0,
        status: 'draft',
      }}
      searchPlaceholder="Search FAQs..."
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
