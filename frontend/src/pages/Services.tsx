import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { accentAt } from '../lib/accents';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

type Service = {
  id?: number;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  summary?: string | null;
  status?: string;
};

const cardClass =
  'surface-card surface-card-hover';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/services');

        const payload = response.data;

        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setServices(data);
      } catch (err) {
        console.error('Services API error:', err);

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
    <div className="overflow-hidden bg-transparent text-white">
      <PageOverlay/>
      <PageHero
        eyebrow="Services"
        title="What we do"
        highlightWords={['we do']}
        description="Pick one service or combine a few — every engagement is scoped around what your business actually needs next."
      />

      <section className="relative px-5 py-20 sm:px-8 md:px-6 lg:py-4">

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="eyebrow text-brand-300">
              What we offer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Services built around outcomes.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white">
              No unnecessary packages. Choose what your business needs and
              build from there.
            </p>
          </div>

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <GlassCard
                  key={item}
                  className={`${cardClass} p-6`}
                >
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

                  <div className="mt-7 h-5 w-32 animate-pulse rounded bg-white/10" />

                  <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />

                  <div className="mt-6 h-3 w-24 animate-pulse rounded bg-brand/10" />
                </GlassCard>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-8 text-center backdrop-blur-xl">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="rounded-2xl border border-brand/15 bg-ink-900/60 p-10 text-center backdrop-blur-xl">
              <p className="text-sm text-white">
                No services are currently available.
              </p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const accent = accentAt(index);

                return (
                <GlassCard
                  key={service.id ?? service.slug}
                  className={`group relative overflow-hidden p-6 ${cardClass} ${accent.hoverBorder}`}
                >
                  <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${accent.glow} blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xs font-bold ${accent.chip}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </div>

                    <h2 className="mt-7 text-xl font-extrabold tracking-tight text-white">
                      {service.title}
                    </h2>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-white">
                      {service.short_description ??
                        service.summary ??
                        service.description ??
                        'Service details will be available soon.'}
                    </p>

                    <div className="mt-6 border-t border-brand/15 pt-4">
                      <Link
                        to={`/services/${service.slug}`}
                        className={`inline-flex items-center gap-1 text-sm font-bold transition-colors hover:text-white ${accent.text}`}
                      >
                        View Details
                        <ChevronRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
