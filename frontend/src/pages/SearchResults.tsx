import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type SearchResult = {
  id?: number;
  type: string;
  title: string;
  description?: string;
  href: string;
};

type SearchResponse =
  | SearchResult[]
  | {
      data: SearchResult[];
    };

export default function SearchResults() {
  const [params, setParams] = useSearchParams();

  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const activeQuery = params.get('q') || '';

  useEffect(() => {
    setQuery(activeQuery);

    if (!activeQuery.trim()) {
      setResults([]);
      return;
    }

    async function search() {
      try {
        setLoading(true);

        const response =
          await api.get<SearchResponse>(
            `/search?q=${encodeURIComponent(activeQuery)}`
          );

        const data = Array.isArray(response)
          ? response
          : response.data;

        setResults(data ?? []);
      } catch (error) {
        console.error(
          'Failed to search:',
          error
        );

        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [activeQuery]);

  function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    setParams(
      trimmedQuery
        ? { q: trimmedQuery }
        : {}
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Search"
        title="Search the site"
      />

      <form
        onSubmit={handleSubmit}
        className="px-5 pt-8 sm:px-8 md:px-12"
      >
        <input
          type="search"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search services, FAQs…"
          className="w-full max-w-lg rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
      </form>

      <section className="px-5 py-10 sm:px-8 md:px-12">
        {activeQuery && !loading && (
          <p className="mb-6 text-sm text-white/50">
            {results.length} result
            {results.length === 1 ? '' : 's'} for “
            {activeQuery}”
          </p>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <GlassCard key={item}>
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />

                <div className="mt-3 h-5 w-48 animate-pulse rounded bg-white/10" />

                <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
              </GlassCard>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((result, index) => (
                <Link
                  key={
                    result.id ??
                    `${result.href}-${index}`
                  }
                  to={result.href}
                >
                  <GlassCard>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                      {result.type}
                    </p>

                    <h2 className="mt-2 text-base font-medium">
                      {result.title}
                    </h2>

                    {result.description && (
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {result.description}
                      </p>
                    )}
                  </GlassCard>
                </Link>
              ))}
            </div>

            {activeQuery &&
              results.length === 0 && (
                <p className="text-sm text-white/50">
                  No results. Try a different search
                  term.
                </p>
              )}
          </>
        )}
      </section>
    </div>
  );
}
