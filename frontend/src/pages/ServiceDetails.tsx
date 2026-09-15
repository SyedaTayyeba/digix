import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Layers3,
  Workflow,
} from 'lucide-react';
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

  const [service, setService] = useState<Service | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Service not found.');
      return;
    }

    const serviceSlug = slug;

    async function fetchService() {
      try {
        setLoading(true);
        setError('');
        setService(null);

        const response = await api.get(
          `/services/${encodeURIComponent(serviceSlug)}`
        );

        const payload = response.data;

        const data =
          payload &&
          typeof payload === 'object' &&
          'data' in payload
            ? payload.data
            : payload;

        if (!data || typeof data !== 'object') {
          setError('Service not found.');
          return;
        }

        setService(data as Service);
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

  const cardClass =
    'border-white/10 bg-black/25 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-black/35';

  if (loading) {
    return (
      <div>
        <PageHero
          eyebrow="Services"
          title="Loading..."
          description="Loading service details."
        />

        <section className="grid gap-6 px-5 pb-16 sm:px-8 md:grid-cols-2 md:px-12">
          {[1, 2].map((item) => (
            <GlassCard
              key={item}
              className={cardClass}
            >
              <div className="h-11 w-11 animate-pulse rounded-xl bg-white/10" />

              <div className="mt-6 h-5 w-40 animate-pulse rounded bg-white/10" />

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />
            </GlassCard>
          ))}
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
          highlightWords={['not found']}
        />

        <section className="px-5 pb-16 sm:px-8 md:px-12">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/25 p-8 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
              <Layers3 size={24} />
            </div>

            <p className="mt-5 text-sm leading-6 text-white/60">
              We could not find the service you are looking
              for.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:bg-brand/85"
            >
              View Services
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const features = Array.isArray(service.features)
    ? service.features
    : [];

  const processSteps = Array.isArray(service.processSteps)
    ? service.processSteps
    : Array.isArray(service.process)
      ? service.process
      : [];

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
        highlightWords={
          service.title
            ? service.title.split(' ').slice(0, 1)
            : []
        }
      />

      {service.description && (
        <section className="px-5 pb-8 sm:px-8 md:px-12">
          <GlassCard
            className={`${cardClass} mx-auto max-w-5xl`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <Layers3 size={21} />
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  Overview
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  About this service
                </h2>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-white/65">
              {service.description}
            </p>
          </GlassCard>
        </section>
      )}

      <section className="grid gap-6 px-5 py-8 sm:px-8 md:grid-cols-2 md:px-12">
        <GlassCard className={cardClass}>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <Check size={21} />
            </div>

            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                Included
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                What's included
              </h2>
            </div>
          </div>

          {features.length > 0 ? (
            <ul className="mt-7 space-y-3">
              {features.map((feature, index) => {
                const text = getFeatureText(feature);

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
                    className="flex items-start gap-3 text-sm leading-6 text-white/65"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Check size={12} />
                    </span>

                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-white/50">
              Service details will be available soon.
            </p>
          )}
        </GlassCard>

        <GlassCard className={cardClass}>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <Workflow size={21} />
            </div>

            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                Process
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                How it works
              </h2>
            </div>
          </div>

          {processSteps.length > 0 ? (
            <ol className="mt-7 space-y-4">
              {processSteps.map((step, index) => {
                const text = getProcessText(step);

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
                    className="flex gap-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand/10 font-mono text-[11px] font-bold text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <p className="pt-1 text-sm leading-6 text-white/65">
                      {text}
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-6 text-sm text-white/50">
              Process details will be available soon.
            </p>
          )}
        </GlassCard>
      </section>

      <section className="relative overflow-hidden px-5 py-14 sm:px-8 md:px-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/30 px-6 py-10 text-center backdrop-blur-xl sm:px-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            Let's work together
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Ready to talk about{' '}
            <span className="text-brand">
              {service.title.toLowerCase()}
            </span>
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
            Let's discuss your goals and build the right
            strategy for your business.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand/85"
            >
              Book a Strategy Call
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/80 backdrop-blur-md transition-all duration-300 hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
            >
              Contact Us
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
