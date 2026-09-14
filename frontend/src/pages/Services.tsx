import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type Service = {
  id?: number;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  summary?: string | null;
  status?: string;
};

type ServicesResponse = {
  data?: Service[];
};

export default function Services() {
  const [services, setServices] = useState<Service[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError('');

        const result = await api.get<
          ServicesResponse | Service[]
        >('/services');

        const data = Array.isArray(result)
          ? result
          : result.data ?? [];

        setServices(data);
      } catch (err) {
        console.error(
          'Services API error:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load services right now.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="What we do"
        description="Pick one service or combine a few — every engagement is scoped around what your business actually needs next."
      />

      <section className="grid gap-5 px-5 py-14 sm:grid-cols-2 sm:px-8 md:px-12 lg:grid-cols-3">
        {loading && (
          <>
            {[1, 2, 3, 4, 5].map((item) => (
              <GlassCard key={item}>
                <div className="h-5 w-32 animate-pulse rounded bg-white/10" />

                <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />

                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />

                <div className="mt-5 h-4 w-24 animate-pulse rounded bg-white/10" />
              </GlassCard>
            ))}
          </>
        )}

        {!loading && error && (
          <div className="col-span-full py-10 text-center">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="col-span-full py-10 text-center">
              <p className="text-sm text-white/60">
                No services are currently available.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          services.map((service) => (
            <GlassCard
              key={service.id ?? service.slug}
            >
              <h2 className="text-lg font-medium">
                {service.title}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {service.short_description ??
                  service.summary ??
                  service.description ??
                  'Service details will be available soon.'}
              </p>

              <Link
                to={`/services/${service.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                View Details
                <ChevronRight size={14} />
              </Link>
            </GlassCard>
          ))}
      </section>
    </div>
  );
}
