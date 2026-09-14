import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type Testimonial = {
  id?: number;
  name: string;
  quote: string;
  role?: string;
  company?: string;
  rating?: number;
};

type TestimonialsResponse =
  | Testimonial[]
  | {
      data: Testimonial[];
    };

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response =
          await api.get<TestimonialsResponse>(
            '/testimonials'
          );

        const data = Array.isArray(response)
          ? response
          : response.data;

        setTestimonials(data ?? []);
      } catch (error) {
        console.error(
          'Failed to load testimonials:',
          error
        );

        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Testimonials"
        title="What clients say"
      />

      <section className="grid gap-5 px-5 py-14 sm:grid-cols-2 sm:px-8 md:px-12 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((item) => (
            <GlassCard key={item}>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-3.5 w-3.5 animate-pulse rounded bg-white/10"
                    />
                  )
                )}
              </div>

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />

              <div className="mt-5 h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/10" />
            </GlassCard>
          ))
        ) : testimonials.length > 0 ? (
          testimonials.map((testimonial) => {
            const rating = Math.min(
              5,
              Math.max(0, testimonial.rating ?? 5)
            );

            return (
              <GlassCard
                key={
                  testimonial.id ??
                  `${testimonial.name}-${testimonial.quote}`
                }
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={
                          index < rating
                            ? 'fill-white text-white'
                            : 'text-white/25'
                        }
                      />
                    )
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  “{testimonial.quote}”
                </p>

                <p className="mt-4 text-sm font-medium">
                  {testimonial.name}
                </p>

                {(testimonial.role ||
                  testimonial.company) && (
                  <p className="text-xs text-white/50">
                    {testimonial.role}

                    {testimonial.role &&
                      testimonial.company
                      ? ', '
                      : ''}

                    {testimonial.company}
                  </p>
                )}
              </GlassCard>
            );
          })
        ) : (
          <div className="py-10 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-sm text-white/50">
              Testimonials will be available soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
