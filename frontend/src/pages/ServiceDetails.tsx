import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type ServiceFeature = {
  id?: number;
  title?: string;
  name?: string;
  feature?: string;
};

type ServiceProcessStep = {
  id?: number;
  title?: string;
  name?: string;
  description?: string;
  step?: string;
  step_number?: number;
};

type Service = {
  id?: number;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  summary?: string | null;
  status?: string;
  features?: ServiceFeature[] | string[];
  processSteps?: ServiceProcessStep[] | string[];
  process?: ServiceProcessStep[] | string[];
};

type ServiceResponse = {
  data?: Service;
};

function getFeatureText(
  feature: ServiceFeature | string
): string {
  if (typeof feature === 'string') {
    return feature;
  }

  return (
    feature.title ??
    feature.name ??
    feature.feature ??
    ''
  );
}

function getProcessText(
  step: ServiceProcessStep | string
): string {
  if (typeof step === 'string') {
    return step;
  }

  return (
    step.title ??
    step.name ??
    step.description ??
    step.step ??
    ''
  );
}

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [service, setService] =
    useState<Service | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Service not found.');
      return;
    }

    const serviceSlug: string = slug;

    async function fetchService() {
      try {
        setLoading(true);
        setError('');
        setService(null);

        const result =
          await api.get<ServiceResponse>(
            `/services/${encodeURIComponent(serviceSlug)}`
          );

        const data = result.data;

        if (!data) {
          setError('Service not found.');
          return;
        }

        setService(data);
      } catch (err) {
        console.error(
          'Service details API error:',
          err
        );

        setError(
          err instanceof Error &&
          err.message
            .toLowerCase()
            .includes('not found')
            ? 'Service not found.'
            : 'Unable to load this service right now.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <PageHero
          eyebrow="Services"
          title="Loading..."
          description="Loading service details."
        />

        <section className="grid gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:px-12">
          <GlassCard>
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />

            <div className="mt-5 h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />
          </GlassCard>

          <GlassCard>
            <div className="h-5 w-32 animate-pulse rounded bg-white/10" />

            <div className="mt-5 h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />
          </GlassCard>
        </section>
      </div>
    );
  }

  if (!service || error) {
    return (
      <div>
        <PageHero
          eyebrow="Services"
          title="Service not found"
          description="That service may have been unpublished or moved. Take a look at the full list instead."
        />

        <section className="px-5 pb-14 text-center sm:px-8 md:px-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black hover:bg-brand/85"
          >
            View Services
            <ChevronRight size={16} />
          </Link>
        </section>
      </div>
    );
  }

  const features = service.features ?? [];

  const processSteps =
    service.processSteps ??
    service.process ??
    [];

  const description =
    service.short_description ??
    service.summary ??
    service.description ??
    'Service details will be available soon.';

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title={service.title}
        description={description}
      />

      {service.description &&
        service.short_description && (
          <section className="px-5 pt-14 sm:px-8 md:px-12">
            <GlassCard className="mx-auto max-w-4xl">
              <h2 className="text-lg font-medium">
                About this service
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">
                {service.description}
              </p>
            </GlassCard>
          </section>
        )}

      <section className="grid gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:px-12">
        <GlassCard>
          <h2 className="text-lg font-medium">
            What's included
          </h2>

          {features.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {features.map((feature, index) => {
                const text =
                  getFeatureText(feature);

                if (!text) {
                  return null;
                }

                return (
                  <li
                    key={
                      typeof feature === 'string'
                        ? `${feature}-${index}`
                        : feature.id ??
                          `${text}-${index}`
                    }
                  >
                    • {text}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              Service details will be available soon.
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-medium">
            How it works
          </h2>

          {processSteps.length > 0 ? (
            <ol className="mt-3 space-y-2 text-sm text-white/75">
              {processSteps.map((step, index) => {
                const text =
                  getProcessText(step);

                if (!text) {
                  return null;
                }

                return (
                  <li
                    key={
                      typeof step === 'string'
                        ? `${step}-${index}`
                        : step.id ??
                          `${text}-${index}`
                    }
                  >
                    {index + 1}. {text}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              Process details will be available soon.
            </p>
          )}
        </GlassCard>
      </section>

      <section className="border-t border-white/10 px-5 py-14 text-center sm:px-8 md:px-12">
        <h2 className="text-xl font-medium">
          Ready to talk about{' '}
          {service.title.toLowerCase()}?
        </h2>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/book-consultation"
            className="inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
          >
            Book a Strategy Call
            <ChevronRight size={16} />
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-5 py-2.5 text-sm backdrop-blur-md transition-colors duration-300 hover:bg-brand/20"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
