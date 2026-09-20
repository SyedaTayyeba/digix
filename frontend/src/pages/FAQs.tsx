import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import PageHero from '../components/ui/PageHero';
import Accordion from '../components/ui/Accordion';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

type FAQ = {
  id?: number;
  question: string;
  answer: string;
  category?: string | null;
  category_id?: number | null;
  category_name?: string | null;
  sort_order?: number;
  status?: string;
};

type FAQCategory = {
  id?: number;
  name?: string;
};

const cardClass =
  'surface-card surface-card-hover';

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFAQs() {
      try {
        setLoading(true);

        const response = await api.get('/faqs');

        const payload = response.data;

        const rawData = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        const normalized = rawData.map((faq: FAQ) => {
          const categoryValue = faq.category;

          let categoryName = faq.category_name ?? '';

          if (typeof categoryValue === 'string') {
            categoryName = categoryValue;
          } else if (
            categoryValue &&
            typeof categoryValue === 'object'
          ) {
            const categoryObject =
              categoryValue as unknown as FAQCategory;

            categoryName = categoryObject.name ?? '';
          }

          return {
            ...faq,
            category_name: categoryName || 'General',
          };
        });

        setFaqs(normalized);
      } catch (error) {
        console.error('Failed to load FAQs:', error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        faqs.map(
          (faq) => faq.category_name || 'General'
        )
      )
    );
  }, [faqs]);

  const matches = (faq: FAQ) => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      faq.question.toLowerCase().includes(search) ||
      faq.answer.toLowerCase().includes(search) ||
      (faq.category_name ?? '')
        .toLowerCase()
        .includes(search)
    );
  };

  const hasSearchResults =
    !query.trim() || faqs.some(matches);

  return (
    <div className="overflow-hidden bg-transparent text-white">
      <PageOverlay />
      <PageHero
        eyebrow="FAQs"
        title="Common questions"
        highlightWords={['questions']}
        description="Clear answers to the things clients usually want to know before getting started."
      />

      <section className="relative px-5 py-4 sm:px-6 md:px-4 lg:py-2">

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="eyebrow text-brand-300">
              Need to know
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Answers before you ask.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white">
              Search through our most common questions or browse them by
              category.
            </p>
          </div>

          <div className="mb-12 max-w-xl">
            <div
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cardClass}`}
            >
              <Search
                size={17}
                className="shrink-0 text-brand-300"
              />

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#b5d0d3]"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="shrink-0 text-xs font-medium text-white transition-colors hover:text-brand-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border p-6 ${cardClass}`}
                >
                  <div className="mb-5 h-4 w-28 animate-pulse rounded bg-white/10" />

                  <div className="space-y-3">
                    <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
                    <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : faqs.length > 0 ? (
            <div className="space-y-10">
              {categories.map((category) => {
                const items = faqs.filter(
                  (faq) =>
                    (faq.category_name || 'General') ===
                      category && matches(faq)
                );

                if (items.length === 0) {
                  return null;
                }

                return (
                  <section
                    key={category}
                    className={`rounded-2xl border p-6 sm:p-7 ${cardClass}`}
                  >
                    <div className="mb-6 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_rgba(47,188,186,0.6)]" />

                      <h2 className="text-lg font-extrabold text-white">
                        {category}
                      </h2>

                      <span className="font-mono text-[10px] font-bold text-brand/70">
                        {String(items.length).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-brand/15 bg-ink-900/60">
                      <Accordion
                        items={items.map((faq) => ({
                          question: faq.question,
                          answer: faq.answer,
                        }))}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-10 text-center ${cardClass}`}
            >
              <p className="text-sm text-white">
                FAQs will be available soon.
              </p>
            </div>
          )}

          {!loading &&
            faqs.length > 0 &&
            query.trim() &&
            !hasSearchResults && (
              <div
                className={`mt-8 rounded-2xl border p-8 text-center ${cardClass}`}
              >
                <p className="text-sm font-bold text-white">
                  No questions found.
                </p>

                <p className="mt-2 text-xs text-white">
                  Try searching with different keywords.
                </p>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
