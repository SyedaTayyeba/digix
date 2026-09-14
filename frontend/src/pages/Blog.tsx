import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { blogPosts } from '../data/content';

/** P-10: listing with search, categories and tags. */
export default function Blog() {
  const [query, setQuery] = useState('');
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))],
    []
  );
  const [category, setCategory] = useState('All');

  const filtered = blogPosts.filter((p) => {
    const matchesQuery =
      !query.trim() ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <PageHero eyebrow="Blog" title="Notes from recent projects" />

      <div className="flex flex-col gap-4 px-5 pt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-12">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full max-w-sm rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300 ${
                category === cat
                  ? 'border-brand bg-brand text-black'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-5 px-5 py-10 sm:grid-cols-2 sm:px-8 md:px-12 lg:grid-cols-3">
        {filtered.map((post) => (
          <GlassCard key={post.slug}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              {post.category} · {new Date(post.date).toLocaleDateString()}
            </p>
            <h2 className="mt-2 text-lg font-medium">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-brand hover:underline">
              Read more →
            </Link>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-white/50">No articles match that search yet.</p>
        )}
      </section>
    </div>
  );
}
