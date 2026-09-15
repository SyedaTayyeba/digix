import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { Plus, Trash2 } from 'lucide-react';

import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { useToast } from '../hooks/useToast';
import {
  apiGet,
  apiPut,
  type ApiError,
} from '../../lib/api';

import type { HomepageSettings } from '../types';

const ENDPOINT = '/admin/homepage';

const inputClasses =
  'w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50';

const selectClasses =
  'w-full rounded-md border border-white/15 bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50';

type HomepageService = {
  id: number;
  slug: string;
  title: string;
  status?: string;
};

type HomepageServicesSection = {
  heading?: string;
  subheading?: string;
  selected_service_ids?: number[];
};

type HomepageSettingsState = Omit<
  HomepageSettings,
  'services_section'
> & {
  services_section: HomepageServicesSection;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-white/60">
        {title}
      </h2>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/60">
        {label}
      </label>

      {textarea ? (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={inputClasses}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={inputClasses}
        />
      )}
    </div>
  );
}

function normalizeSettings(
  source: HomepageSettings,
): HomepageSettingsState {
  return {
    ...source,

    hero: {
      ...source.hero,
      eyebrow: source.hero?.eyebrow ?? '',
      heading: source.hero?.heading ?? '',
      subheading:
        source.hero?.subheading ?? '',
      cta_text:
        source.hero?.cta_text ?? '',
    },

    about: {
      ...source.about,
      heading:
        source.about?.heading ?? '',
      body:
        source.about?.body ?? '',
    },

    services_section: {
      ...source.services_section,
      heading:
        source.services_section?.heading ?? '',
      subheading:
        source.services_section?.subheading ??
        '',
      selected_service_ids:
        Array.isArray(
          (
            source.services_section as
              HomepageServicesSection | undefined
          )?.selected_service_ids
        )
          ? (
              source.services_section as
                HomepageServicesSection
            ).selected_service_ids?.map(
              Number,
            ) ?? []
          : [],
    },

    testimonials_section: {
      ...source.testimonials_section,
      heading:
        source.testimonials_section
          ?.heading ?? '',
    },

    cta_section: {
      ...source.cta_section,
      heading:
        source.cta_section?.heading ?? '',
      body:
        source.cta_section?.body ?? '',
      button_text:
        source.cta_section?.button_text ?? '',
    },

    statistics: Array.isArray(
      source.statistics,
    )
      ? source.statistics.map((stat) => ({
          ...stat,
          label: stat.label ?? '',
          value: stat.value ?? '',
        }))
      : [],
  };
}

export default function Homepage() {
  const [settings, setSettings] =
    useState<HomepageSettingsState | null>(
      null,
    );

  const [services, setServices] = useState<
    HomepageService[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<ApiError | null>(null);

  const [saving, setSaving] =
    useState(false);

  const { showToast } = useToast();

  async function fetchServices() {
    try {
      const response =
        await apiGet<HomepageService[]>(
          '/services',
        );

      setServices(
        Array.isArray(response)
          ? response
          : [],
      );
    } catch (err) {
      console.error(
        'Failed to load homepage services:',
        err,
      );

      setServices([]);
    }
  }

  async function fetchSettings() {
    setLoading(true);
    setError(null);

    try {
      const [homepageResponse] =
        await Promise.all([
          apiGet<HomepageSettings>(
            ENDPOINT,
          ),
          fetchServices(),
        ]);

      setSettings(
        normalizeSettings(
          homepageResponse,
        ),
      );
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
    if (!settings) {
      return;
    }

    const selectedIds =
      settings.services_section
        .selected_service_ids ?? [];

    if (selectedIds.length !== 3) {
      showToast(
        'Please select exactly 3 homepage services.',
        'error',
      );
      return;
    }

    const uniqueIds = [
      ...new Set(selectedIds),
    ];

    if (uniqueIds.length !== 3) {
      showToast(
        'Please select 3 different services.',
        'error',
      );
      return;
    }

    setSaving(true);

    try {
      const payload: HomepageSettingsState = {
        ...settings,
        services_section: {
          ...settings.services_section,
          selected_service_ids:
            uniqueIds,
        },
      };

      await apiPut(
        ENDPOINT,
        payload,
      );

      setSettings(payload);

      showToast(
        'Homepage content saved successfully.',
      );
    } catch (err) {
      showToast(
        (err as ApiError).message ||
          'Failed to save homepage content.',
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState rows={8} />;
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

  const statistics =
    settings.statistics ?? [];

  const selectedServiceIds =
    settings.services_section
      .selected_service_ids ?? [];

  function updateSettings(
    updater: (
      current: HomepageSettingsState,
    ) => HomepageSettingsState,
  ) {
    setSettings((current) =>
      current
        ? updater(current)
        : current,
    );
  }

  function updateSelectedService(
    index: number,
    value: string,
  ) {
    const nextIds = [
      ...selectedServiceIds,
    ];

    nextIds[index] = Number(value);

    updateSettings((current) => ({
      ...current,
      services_section: {
        ...current.services_section,
        selected_service_ids:
          nextIds,
      },
    }));
  }

  return (
    <div className="space-y-5 pb-10">

      {/* Hero */}
      <Section title="Hero">
        <Field
          label="Eyebrow"
          value={settings.hero?.eyebrow}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              hero: {
                ...current.hero,
                eyebrow: value,
              },
            }))
          }
        />

        <Field
          label="Heading"
          value={settings.hero?.heading}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              hero: {
                ...current.hero,
                heading: value,
              },
            }))
          }
        />

        <Field
          label="Subheading"
          textarea
          value={settings.hero?.subheading}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              hero: {
                ...current.hero,
                subheading: value,
              },
            }))
          }
        />

        <Field
          label="CTA Text"
          value={settings.hero?.cta_text}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              hero: {
                ...current.hero,
                cta_text: value,
              },
            }))
          }
        />
      </Section>

      {/* About */}
      <Section title="About">
        <Field
          label="Heading"
          value={settings.about?.heading}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              about: {
                ...current.about,
                heading: value,
              },
            }))
          }
        />

        <Field
          label="Body"
          textarea
          value={settings.about?.body}
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              about: {
                ...current.about,
                body: value,
              },
            }))
          }
        />
      </Section>

      {/* Services */}
      <Section title="Services Section">
        <Field
          label="Heading"
          value={
            settings.services_section.heading
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              services_section: {
                ...current.services_section,
                heading: value,
              },
            }))
          }
        />

        <Field
          label="Subheading"
          value={
            settings.services_section
              .subheading
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              services_section: {
                ...current.services_section,
                subheading: value,
              },
            }))
          }
        />

        <div className="mt-5 rounded-lg border border-brand/15 bg-brand/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand">
            Homepage Services
          </p>

          <p className="mt-1 text-xs leading-5 text-white/50">
            Select exactly 3 services to
            display on the homepage. These
            services come from the database.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const selectedId =
              selectedServiceIds[index];

            return (
              <div key={index}>
                <label className="mb-1 block text-xs text-white/60">
                  Service {index + 1}
                </label>

                <select
                  value={
                    selectedId
                      ? String(selectedId)
                      : ''
                  }
                  onChange={(event) =>
                    updateSelectedService(
                      index,
                      event.target.value,
                    )
                  }
                  className={selectClasses}
                >
                  <option
                    value=""
                    className="bg-[#1f1f1f] text-white"
                  >
                    Select service
                  </option>

                  {services.map((service) => {
                    const alreadySelected =
                      selectedServiceIds.includes(
                        service.id,
                      );

                    const isCurrent =
                      selectedId ===
                      service.id;

                    return (
                      <option
                        key={service.id}
                        value={service.id}
                        disabled={
                          alreadySelected &&
                          !isCurrent
                        }
                        className="bg-[#1f1f1f] text-white"
                      >
                        {service.title}
                        {service.status
                          ? ` · ${service.status}`
                          : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <p className="rounded-md bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
            No services are available. Add
            services from the Services admin
            section first.
          </p>
        )}

        {selectedServiceIds.length !==
          3 && (
          <p className="text-xs text-yellow-300">
            Select all 3 homepage service
            slots before saving.
          </p>
        )}
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials Section">
        <Field
          label="Heading"
          value={
            settings.testimonials_section
              ?.heading
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              testimonials_section: {
                ...current.testimonials_section,
                heading: value,
              },
            }))
          }
        />
      </Section>

      {/* CTA */}
      <Section title="CTA">
        <Field
          label="Heading"
          value={
            settings.cta_section?.heading
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              cta_section: {
                ...current.cta_section,
                heading: value,
              },
            }))
          }
        />

        <Field
          label="Body"
          textarea
          value={
            settings.cta_section?.body
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              cta_section: {
                ...current.cta_section,
                body: value,
              },
            }))
          }
        />

        <Field
          label="Button Text"
          value={
            settings.cta_section
              ?.button_text
          }
          onChange={(value) =>
            updateSettings((current) => ({
              ...current,
              cta_section: {
                ...current.cta_section,
                button_text: value,
              },
            }))
          }
        />
      </Section>

      {/* Statistics */}
      <Section title="Statistics">
        <div className="space-y-2">
          {statistics.map(
            (stat, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={stat.value ?? ''}
                  placeholder="Value"
                  onChange={(event) => {
                    updateSettings(
                      (current) => {
                        const next =
                          current.statistics.map(
                            (
                              item,
                              itemIndex,
                            ) =>
                              itemIndex ===
                              index
                                ? {
                                    ...item,
                                    value:
                                      event
                                        .target
                                        .value,
                                  }
                                : item,
                          );

                        return {
                          ...current,
                          statistics: next,
                        };
                      },
                    );
                  }}
                  className={inputClasses}
                />

                <input
                  type="text"
                  value={stat.label ?? ''}
                  placeholder="Label"
                  onChange={(event) => {
                    updateSettings(
                      (current) => {
                        const next =
                          current.statistics.map(
                            (
                              item,
                              itemIndex,
                            ) =>
                              itemIndex ===
                              index
                                ? {
                                    ...item,
                                    label:
                                      event
                                        .target
                                        .value,
                                  }
                                : item,
                          );

                        return {
                          ...current,
                          statistics: next,
                        };
                      },
                    );
                  }}
                  className={inputClasses}
                />

                <button
                  type="button"
                  onClick={() =>
                    updateSettings(
                      (current) => ({
                        ...current,
                        statistics:
                          current.statistics.filter(
                            (
                              _,
                              itemIndex,
                            ) =>
                              itemIndex !==
                              index,
                          ),
                      }),
                    )
                  }
                  className="shrink-0 rounded-md p-2 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                  aria-label="Remove statistic"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              updateSettings((current) => ({
                ...current,
                statistics: [
                  ...current.statistics,
                  {
                    label: '',
                    value: '',
                  },
                ],
              }))
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
          >
            <Plus size={13} />
            Add Statistic
          </button>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={
            saving ||
            selectedServiceIds.length !== 3
          }
          onClick={handleSave}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-black hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? 'Saving…'
            : 'Save Homepage Content'}
        </button>
      </div>
    </div>
  );
}