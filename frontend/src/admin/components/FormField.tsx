export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'list';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helperText?: string;
  rows?: number;
}

interface FormFieldProps {
  field: FieldConfig;
  value: unknown;
  error?: string[];
  onChange: (name: string, value: unknown) => void;
}

export default function FormField({
  field,
  value,
  error,
  onChange,
}: FormFieldProps) {
  const baseInputClasses =
    'w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50';

  const numberInputClasses =
    `${baseInputClasses} [appearance:textfield] ` +
    '[&::-webkit-inner-spin-button]:appearance-none ' +
    '[&::-webkit-outer-spin-button]:appearance-none';

  /*
   * List fields can come from the API in two formats:
   *
   * Features:
   *   [{ title: "Google Ads" }]
   *
   * Process steps:
   *   [{ title: "Audit account", description: "..." }]
   *
   * They can also temporarily be simple strings while typing.
   *
   * For display in the textarea, we only need the title.
   */
  function getListDisplayValue(value: unknown): string {
    if (!Array.isArray(value)) {
      return '';
    }

    return value
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (
          item &&
          typeof item === 'object' &&
          'title' in item
        ) {
          return String(
            (item as { title?: unknown }).title ?? ''
          );
        }

        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  /*
   * Convert textarea lines into the structure expected
   * by the Laravel Service API.
   *
   * Features:
   *   [{ title: "Feature 1" }]
   *
   * Process steps:
   *   [{ title: "Step 1", description: null }]
   */
  function handleListChange(
    name: string,
    rawValue: string,
  ) {
    const items = rawValue
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (name === 'features') {
      onChange(
        name,
        items.map((title) => ({
          title,
        })),
      );

      return;
    }

    if (name === 'process_steps') {
      onChange(
        name,
        items.map((title) => ({
          title,
          description: null,
        })),
      );

      return;
    }

    /*
     * Keep the generic list behavior for any other
     * list field used elsewhere in the admin panel.
     */
    onChange(name, items);
  }

  return (
    <div>
      <label
        htmlFor={field.name}
        className="mb-1 block text-xs text-white/60"
      >
        {field.label}
        {field.required && (
          <span className="text-brand"> *</span>
        )}
      </label>

      {field.type === 'textarea' && (
        <textarea
          id={field.name}
          rows={field.rows ?? 4}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(field.name, e.target.value)
          }
          className={baseInputClasses}
        />
      )}

      {field.type === 'list' && (
        <>
          <textarea
            id={field.name}
            rows={field.rows ?? 4}
            value={getListDisplayValue(value)}
            placeholder={field.placeholder}
            onChange={(e) =>
              handleListChange(
                field.name,
                e.target.value,
              )
            }
            className={baseInputClasses}
          />

          {field.helperText && (
            <p className="mt-1 text-[11px] text-white/40">
              {field.helperText}
            </p>
          )}
        </>
      )}

      {field.type === 'select' && (
        <select
          id={field.name}
          value={(value as string) ?? ''}
          onChange={(e) =>
            onChange(field.name, e.target.value)
          }
          className={`${baseInputClasses} text-black`}
        >
          <option
            value=""
            disabled
            className="text-black"
          >
            Select…
          </option>

          {field.options?.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-black"
            >
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            id={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) =>
              onChange(
                field.name,
                e.target.checked,
              )
            }
            className="h-4 w-4 rounded border-white/30 bg-white/5 accent-[#2fbcba]"
          />

          {field.placeholder}
        </label>
      )}

      {(field.type === 'text' ||
        field.type === 'number') && (
        <input
          id={field.name}
          type={field.type}
          value={
            (value as string | number) ?? ''
          }
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(
              field.name,
              field.type === 'number'
                ? Number(e.target.value)
                : e.target.value,
            )
          }
          className={
            field.type === 'number'
              ? numberInputClasses
              : baseInputClasses
          }
        />
      )}

      {error && error.length > 0 && (
        <p className="mt-1 text-xs text-red-300">
          {error[0]}
        </p>
      )}
    </div>
  );
}
