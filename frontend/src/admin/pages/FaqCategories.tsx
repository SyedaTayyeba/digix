import SimpleCrudPage from '../components/SimpleCrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { FaqCategoryResource } from '../types';

const columns: ColumnConfig<FaqCategoryResource>[] = [
  {
    key: 'name',
    label: 'Name',
  },
];

const formFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Category Name',
    type: 'text',
    required: true,
    placeholder: 'General',
  },
];

export default function FaqCategories() {
  return (
    <SimpleCrudPage<FaqCategoryResource>
      resourceLabel="Category"
      resourceLabelPlural="FAQ Categories"
      endpoint="/admin/faqs/categories"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        name: '',
      }}
      searchPlaceholder="Search FAQ categories..."
    />
  );
}
