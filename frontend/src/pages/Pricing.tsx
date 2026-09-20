import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ChevronRight } from 'lucide-react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { accentAt } from '../lib/accents';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

type PricingPackage = {
  id?: number;
  name: string;
  description?: string | null;
  price: string | number;
  currency?: string | null;
  billing_period?: string | null;
  interval?: string | null;
  is_popular?: boolean;
  highlighted?: boolean;
  features?: string[];
};

const WHATSAPP_NUMBER = '971521045088';

const cardClass =
  'surface-card surface-card-hover';

export default function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPricing() {
      try {
        setLoading(true);

        const response = await api.get('/pricing');

        const payload = response.data;

        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        const normalized = data.map((pkg: PricingPackage) => ({
          ...pkg,
          highlighted: pkg.highlighted ?? pkg.is_popular ?? false,
          interval: pkg.interval ?? pkg.billing_period ?? null,
          features: Array.isArray(pkg.features) ? pkg.features : [],
        }));

        setPackages(normalized);
      } catch (error) {
        console.error('Failed to load pricing:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, []);

  function openWhatsApp(packageName: string) {
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${packageName} package. I'd like to discuss the details.`
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className="overflow-hidden bg-transparent text-white">
      <PageOverlay />
      <PageHero
        eyebrow="Pricing"
        title="Packages that scale with you"
        highlightWords={['scale']}
        description="A starting point for scoping — every package can be adjusted after a discovery call."
      />

      <section className="relative px-5 py-20 sm:px-6 md:px-4 lg:py-2">

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="eyebrow text-brand-300">
              Investment
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Choose your starting point.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white">
              Transparent starting points, with room to shape the engagement
              around your actual goals.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <GlassCard
                  key={item}
                  className={`${cardClass} p-7`}
                >
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

                  <div className="mt-7 h-5 w-32 animate-pulse rounded bg-white/10" />

                  <div className="mt-3 h-3 w-48 animate-pulse rounded bg-white/10" />

                  <div className="mt-7 h-9 w-28 animate-pulse rounded bg-white/10" />

                  <div className="mt-7 space-y-3">
                    <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-4/6 animate-pulse rounded bg-white/10" />
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {packages.map((pkg, index) => {
                const isHighlighted = Boolean(pkg.highlighted);
                const accent = accentAt(index);

                const price =
                  pkg.price !== null &&
                  pkg.price !== undefined &&
                  pkg.price !== ''
                    ? pkg.price
                    : 'Custom Quote';

                const period = pkg.interval ?? pkg.billing_period ?? '';

                return (
                  <GlassCard
                    key={pkg.id ?? pkg.name}
                    className={`group relative flex flex-col overflow-hidden p-7 ${
                      isHighlighted
                        ? 'border-brand/60 bg-gradient-to-b from-brand/[0.2] to-ink-900/85 shadow-[0_0_60px_-12px_rgba(47,188,186,0.5)] md:-translate-y-2'
                        : cardClass
                    }`}
                  >
                    <div
                      className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 ${
                        isHighlighted
                          ? 'bg-brand/30 opacity-100'
                          : `${accent.glow} opacity-0 group-hover:opacity-100`
                      }`}
                    />

                    <div className="relative flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border font-mono text-xs font-bold ${
                          isHighlighted
                            ? 'border-brand/50 bg-brand/25 text-white'
                            : accent.chip
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {isHighlighted && (
                        <span className="rounded-full border border-coral/60 bg-coral/30 px-3 py-1 text-[11px] font-bold tracking-wide text-white">
                          Popular
                        </span>
                      )}

                      {!isHighlighted && (
                        <ArrowUpRight
                          size={18}
                          className="text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300"
                        />
                      )}
                    </div>

                    <div className="relative mt-7">
                      <h2 className="text-xl font-extrabold tracking-tight text-white">
                        {pkg.name}
                      </h2>

                      {pkg.description && (
                        <p className="mt-2 min-h-[48px] text-sm leading-6 text-white">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    <div className="relative mt-7 border-y border-brand/15 py-5">
                      <p
                        className={`text-3xl font-extrabold tracking-tight ${
                          isHighlighted ? 'text-gradient-brand' : 'text-white'
                        }`}
                      >
                        {pkg.currency && price !== 'Custom Quote'
                          ? `${pkg.currency} `
                          : ''}
                        {price}

                        {period === 'month' && (
                          <span className="ml-1 text-sm font-medium text-white">
                            /mo
                          </span>
                        )}

                        {period === 'year' && (
                          <span className="ml-1 text-sm font-medium text-white">
                            /yr
                          </span>
                        )}
                      </p>
                    </div>

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="relative mt-6 flex-1 space-y-3">
                        {pkg.features.map((feature, featureIndex) => (
                          <li
                            key={`${feature}-${featureIndex}`}
                            className="flex items-start gap-3 text-sm leading-5 text-white"
                          >
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${accent.chip}`}>
                              <Check size={11} />
                            </span>

                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      onClick={() => openWhatsApp(pkg.name)}
                      className={`relative mt-8 inline-flex w-full items-center justify-center gap-1 rounded-full px-5 py-3 text-sm ${isHighlighted ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      WhatsApp Us
                      <ChevronRight size={14} />
                    </button>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-brand/15 bg-ink-900/60 p-10 text-center backdrop-blur-xl">
              <p className="text-sm text-white">
                Pricing packages will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
