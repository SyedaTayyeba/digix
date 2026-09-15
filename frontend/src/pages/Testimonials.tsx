import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

import PageHero from '../components/ui/PageHero';
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

const cardClass =
  'rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-black/35 sm:p-7';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response =
          await api.get<TestimonialsResponse>(
            '/testimonials'
          );

        const payload = response.data;

        const data: Testimonial[] =
          Array.isArray(payload)
            ? payload
            : payload.data;

        setTestimonials(data);
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
    <div className="min-h-screen">
      <PageHero
        eyebrow="Testimonials"
        title="What clients say"
        highlightWords={['clients']}
      />

      <section className="px-5 py-12 sm:px-6 sm:py-6 md:px-4 lg:py-2">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className={cardClass}
              >
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

                <div className="mt-5 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />

                <div className="mt-6 h-4 w-24 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/10" />
              </div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial) => {
              const rating = Math.min(
                5,
                Math.max(
                  0,
                  testimonial.rating ?? 5
                )
              );

              return (
                <article
                  key={
                    testimonial.id ??
                    `${testimonial.name}-${testimonial.quote}`
                  }
                  className={cardClass}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({
                        length: 5,
                      }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className={
                            index < rating
                              ? 'fill-brand text-brand'
                              : 'text-white/20'
                          }
                        />
                      ))}
                    </div>

                    <Quote
                      size={22}
                      strokeWidth={1.5}
                      className="text-brand/50"
                    />
                  </div>

                  <p className="mt-5 text-sm leading-7 text-white/75">
                    “{testimonial.quote}”
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-sm font-medium text-white">
                      {testimonial.name}
                    </p>

                    {(testimonial.role ||
                      testimonial.company) && (
                      <p className="mt-1 text-xs text-white/45">
                        {testimonial.role}

                        {testimonial.role &&
                          testimonial.company
                          ? ', '
                          : ''}

                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-center backdrop-blur-xl sm:col-span-2 lg:col-span-3">
              <p className="text-sm text-white/50">
                Testimonials will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}