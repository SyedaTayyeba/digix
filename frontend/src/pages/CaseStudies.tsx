import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { caseStudies } from '../data/content';

/** P-05: list/grid with "simple categories/filters." */
export default function CaseStudies() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(caseStudies.map((c) => c.category)))],
    []
  );
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? caseStudies : caseStudies.filter((c) => c.category === active);

  return (
    <div>
      <PageHero
        eyebrow="Case Studies"
        title="Results, not just process"
        description="A sample of recent projects, with the numbers behind them."
      />

      <div className="flex flex-wrap gap-2 px-5 pb-2 pt-8 sm:px-8 md:px-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300 ${
              active === cat
                ? 'border-brand bg-brand text-black'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="grid gap-5 px-5 py-10 sm:grid-cols-2 sm:px-8 md:px-12 lg:grid-cols-3">
        {filtered.map((cs) => (
          <GlassCard key={cs.slug}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              {cs.category}
            </p>
            <h2 className="mt-2 text-lg font-medium">{cs.client}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{cs.summary}</p>
            <Link
              to={`/case-studies/${cs.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm text-brand hover:underline"
            >
              Read case study <ChevronRight size={14} />
            </Link>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
