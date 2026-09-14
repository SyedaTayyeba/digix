import { useEffect, useMemo, useState } from 'react';

import PageHero from '../components/ui/PageHero';
import Accordion from '../components/ui/Accordion';
import { api } from '../lib/api';

type FAQ = {
  id?: number;
  question: string;
  answer: string;
  category?: string;
  sort_order?: number;
};

type FAQResponse =
  | FAQ[]
  | {
      data: FAQ[];
    };

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFAQs() {
      try {
        const response =
          await api.get<FAQResponse>('/faqs');

        const data = Array.isArray(response)
          ? response
          : response.data;

        setFaqs(data ?? []);
      } catch (error) {
        console.error(
          'Failed to load FAQs:',
          error
        );

        setFaqs([]);
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          faqs.map(
            (faq) => faq.category || 'General'
          )
        )
      ),
    [faqs]
  );

  const matches = (faq: FAQ) =>
    !query.trim() ||
    faq.question
      .toLowerCase()
      .includes(query.toLowerCase()) ||
    faq.answer
      .toLowerCase()
      .includes(query.toLowerCase());

  return (
    <div>
      <PageHero
        eyebrow="FAQs"
        title="Common questions"
      />

      <div className="px-5 pt-8 sm:px-8 md:px-12">
        <input
          type="search"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search questions…"
          className="w-full max-w-sm rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
      </div>

      <div className="flex flex-col gap-10 px-5 py-10 sm:px-8 md:px-12">
        {loading ? (
          [1, 2, 3].map((item) => (
            <section key={item}>
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-white/10" />

              <div className="space-y-3">
                <div className="h-12 w-full animate-pulse rounded bg-white/10" />
                <div className="h-12 w-full animate-pulse rounded bg-white/10" />
              </div>
            </section>
          ))
        ) : faqs.length > 0 ? (
          categories.map((category) => {
            const items = faqs.filter(
              (faq) =>
                (faq.category || 'General') ===
                  category && matches(faq)
            );

            if (items.length === 0) {
              return null;
            }

            return (
              <section key={category}>
                <h2 className="mb-4 text-lg font-medium">
                  {category}
                </h2>

                <Accordion
                  items={items.map((faq) => ({
                    question: faq.question,
                    answer: faq.answer,
                  }))}
                />
              </section>
            );
          })
        ) : (
          <p className="text-sm text-white/50">
            FAQs will be available soon.
          </p>
        )}

        {!loading &&
          faqs.length > 0 &&
          query.trim() &&
          !faqs.some(matches) && (
            <p className="text-sm text-white/50">
              No questions found matching your search.
            </p>
          )}
      </div>
    </div>
  );
}
