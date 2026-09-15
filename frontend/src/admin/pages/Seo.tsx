import SimpleCrudPage from '../components/SimpleCrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { SeoEntryResource } from '../types';

const ENTITY_TYPE_OPTIONS = [
  { label: 'Service', value: 'service' },
  { label: 'Static Page', value: 'page' },
];

const columns: ColumnConfig<SeoEntryResource>[] = [
  {
    key: 'entity_type',
    label: 'Type',
  },
  {
    key: 'path',
    label: 'Path / Slug',
    className: 'text-white/50 font-mono text-xs',
  },
  {
    key: 'meta_title',
    label: 'Meta Title',
  },
];

const formFields: FieldConfig[] = [
  {
    name: 'entity_type',
    label: 'Entity Type',
    type: 'select',
    required: true,
    options: ENTITY_TYPE_OPTIONS,
  },
  {
    name: 'path',
    label: 'Path / Slug',
    type: 'text',
    required: true,
    placeholder: '/services/google-ads',
  },
  {
    name: 'meta_title',
    label: 'Meta Title',
    type: 'text',
    required: true,
  },
  {
    name: 'meta_description',
    label: 'Meta Description',
    type: 'textarea',
    rows: 2,
    required: true,
  },
  {
    name: 'keywords',
    label: 'Keywords',
    type: 'text',
    placeholder: 'comma, separated, keywords',
  },
  {
    name: 'og_title',
    label: 'OG Title',
    type: 'text',
  },
  {
    name: 'og_description',
    label: 'OG Description',
    type: 'textarea',
    rows: 2,
  },
  {
    name: 'og_image_url',
    label: 'OG Image URL',
    type: 'text',
  },
  {
    name: 'canonical_url',
    label: 'Canonical URL',
    type: 'text',
  },
  {
    name: 'robots',
    label: 'Robots',
    type: 'text',
    placeholder: 'index, follow',
  },
  {
    name: 'schema_json',
    label: 'Schema JSON-LD',
    type: 'textarea',
    rows: 4,
    placeholder: '{ "@context": "https://schema.org", ... }',
  },
];

export default function Seo() {
  return (
    <SimpleCrudPage<SeoEntryResource>
      resourceLabel="SEO Entry"
      resourceLabelPlural="SEO Entries"
      endpoint="/admin/seo"
      columns={columns}
      formFields={formFields}
      defaultFormValues={{
        entity_type: 'page',
        path: '',
        meta_title: '',
        meta_description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        og_image_url: '',
        canonical_url: '',
        robots: 'index, follow',
        schema_json: '',
      }}
      filters={[
        {
          key: 'entity_type',
          label: 'Type',
          options: ENTITY_TYPE_OPTIONS,
        },
      ]}
    />
  );
}