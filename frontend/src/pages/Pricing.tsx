import { useEffect, useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import { api } from '../lib/api';

type PricingPackage = {
  id?: number;
  name: string;
  description?: string;
  price: string | number;
  interval?: string;
  highlighted?: boolean;
  features?: string[];
};

type PricingResponse =
  | PricingPackage[]
  | {
      data: PricingPackage[];
    };

export default function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPricing() {
      try {
        const response =
          await api.get<PricingResponse>('/pricing');

        const data = Array.isArray(response)
          ? response
          : response.data;

        setPackages(data ?? []);
      } catch (error) {
        console.error('Failed to load pricing:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Pricing"
        title="Packages that scale with you"
        description="A starting point for scoping — every package can be adjusted after a discovery call."
      />

      <section className="grid gap-6 px-5 py-14 sm:px-8 md:grid-cols-3 md:px-12">
        {loading ? (
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md"
            >
              <div className="h-5 w-32 animate-pulse rounded bg-white/10" />

              <div className="mt-3 h-4 w-48 animate-pulse rounded bg-white/10" />

              <div className="mt-6 h-9 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))
        ) : packages.length > 0 ? (
          packages.map((pkg) => (
            <div
              key={pkg.id ?? pkg.name}
              className={`flex flex-col rounded-2xl border p-6 backdrop-blur-md ${
                pkg.highlighted
                  ? 'border-brand bg-brand/10'
                  : 'border-white/15 bg-white/[0.06]'
              }`}
            >
              <h2 className="text-lg font-medium">
                {pkg.name}
              </h2>

              {pkg.description && (
                <p className="mt-1 text-sm text-white/60">
                  {pkg.description}
                </p>
              )}

              <p className="mt-5 text-3xl font-medium">
                {pkg.price}

                {pkg.interval === 'month' && (
                  <span className="text-base text-white/50">
                    {' '}
                    /mo
                  </span>
                )}
              </p>

              {pkg.features && pkg.features.length > 0 && (
                <ul className="mt-5 flex-1 space-y-2 text-sm text-white/80">
                  {pkg.features.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Check
                        size={14}
                        className="text-white/60"
                      />

                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/book-consultation"
                className={`mt-6 inline-flex items-center justify-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  pkg.highlighted
                    ? 'bg-brand text-black hover:bg-brand/85'
                    : 'border border-brand/40 bg-brand/10 text-white hover:bg-brand/20'
                }`}
              >
                Book a Strategy Call
                <ChevronRight size={14} />
              </Link>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 py-10 text-center">
            <p className="text-sm text-white/50">
              Pricing packages will be available soon.
            </p>

            <Link
              to="/book-consultation"
              className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
            >
              Book a Strategy Call
              <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
