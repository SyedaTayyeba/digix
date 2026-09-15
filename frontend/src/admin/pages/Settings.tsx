import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../hooks/useToast';
import { apiGet, apiPut, type ApiError } from '../../lib/api';
import type { GlobalSettings } from '../types';

const ENDPOINT = '/admin/settings';

const inputClasses =
  'w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50';

export default function Settings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  async function fetchSettings() {
    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<GlobalSettings>(ENDPOINT);

      setSettings({
        ...res,
        social_links: Array.isArray(res.social_links)
          ? res.social_links
          : [],
      });
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;

    setSaving(true);

    try {
      await apiPut(ENDPOINT, settings);
      showToast('Settings saved.');
      await fetchSettings();
    } catch (err) {
      showToast((err as ApiError).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: keyof GlobalSettings, value: string) {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev,
    );
  }

  function addSocialLink() {
    if (!settings) return;

    setSettings({
      ...settings,
      social_links: [
        ...(settings.social_links ?? []),
        {
          platform: '',
          url: '',
        },
      ],
    });
  }

  function updateSocialLink(
    index: number,
    field: 'platform' | 'url',
    value: string,
  ) {
    if (!settings) return;

    const next = [...(settings.social_links ?? [])];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    setSettings({
      ...settings,
      social_links: next,
    });
  }

  function removeSocialLink(index: number) {
    if (!settings) return;

    setSettings({
      ...settings,
      social_links: (settings.social_links ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  if (loading) {
    return <LoadingState rows={6} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={fetchSettings}
      />
    );
  }

  if (!settings) {
    return null;
  }

  const field = (
    label: string,
    key: keyof GlobalSettings,
    type = 'text',
  ) => (
    <div>
      <label className="mb-1 block text-xs text-white/60">
        {label}
      </label>

      <input
        type={type}
        value={(settings[key] as string) ?? ''}
        onChange={(e) => updateField(key, e.target.value)}
        className={inputClasses}
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5 pb-10">
      {/* Agency Information */}
      <div className="rounded-xl border border-white/10 p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-white/60">
          Agency Information
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {field('Company Name', 'company_name')}
          {field('Tagline', 'tagline')}
          {field('Website URL', 'website_url')}
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border border-white/10 p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-white/60">
          Contact Information
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {field('Email', 'email')}
          {field('Phone', 'phone')}
          {field('WhatsApp', 'whatsapp')}
        </div>

        <div className="mt-3">
          {field('Address', 'address')}
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-white/10 p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-white/60">
          Social Links
        </h2>

        <div className="space-y-2">
          {(settings.social_links ?? []).map((link, index) => (
            <div
              key={index}
              className="flex gap-2"
            >
              <input
                type="text"
                value={link.platform ?? ''}
                placeholder="Platform (e.g. Instagram)"
                onChange={(e) =>
                  updateSocialLink(
                    index,
                    'platform',
                    e.target.value,
                  )
                }
                className={inputClasses}
              />

              <input
                type="text"
                value={link.url ?? ''}
                placeholder="URL"
                onChange={(e) =>
                  updateSocialLink(
                    index,
                    'url',
                    e.target.value,
                  )
                }
                className={inputClasses}
              />

              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="shrink-0 rounded-md p-2 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                aria-label="Remove social link"
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
          >
            <Plus size={13} />
            Add Social Link
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-black hover:bg-brand/85 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}