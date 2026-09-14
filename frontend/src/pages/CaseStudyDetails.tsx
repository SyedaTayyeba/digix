import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { getCaseStudyBySlug, getServiceBySlug } from '../data/content';

/**
 * P-06: "Problem/challenge, strategy, execution/timeline, results/ROI,
 * relevant visuals, related services, and CTA." FR-06 also calls for
 * JSON-LD structured data on this page for search engines.
 */
export default function CaseStudyDetails() {
  const { slug } = useParams();
  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!caseStudy) {
    return (
      <PageHero
        eyebrow="Case Studies"
        title="Case study not found"
        description="That project may have been archived. Take a look at the full list instead."
      />
    );
  }

  const relatedService = getServiceBySlug(caseStudy.relatedServiceSlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.client,
    about: caseStudy.category,
    description: caseStudy.summary,
  };

  return (
    <div>
      {/* FR-06: structured data for search engines */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <PageHero eyebrow={caseStudy.category} title={caseStudy.client} description={caseStudy.summary} />

      <section className="grid gap-6 px-5 py-14 sm:px-8 md:grid-cols-3 md:px-12">
        <GlassCard>
          <h2 className="text-sm font-medium uppercase tracking-wide text-white/60">Challenge</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{caseStudy.challenge}</p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-sm font-medium uppercase tracking-wide text-white/60">Strategy</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{caseStudy.strategyText}</p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-sm font-medium uppercase tracking-wide text-white/60">Execution</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{caseStudy.execution}</p>
        </GlassCard>
      </section>

      <section className="border-t border-white/10 px-5 py-14 sm:px-8 md:px-12">
        <h2 className="text-xl font-medium">Results</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {caseStudy.results.map((r) => (
            <li key={r} className="rounded-xl border border-white/15 bg-white/[0.06] p-4 text-sm text-white/85">
              {r}
            </li>
          ))}
        </ul>
      </section>

      {relatedService && (
        <section className="border-t border-white/10 px-5 py-14 sm:px-8 md:px-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-white/60">Related service</h2>
          <Link
            to={`/services/${relatedService.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-brand hover:underline"
          >
            {relatedService.title} <ChevronRight size={14} />
          </Link>
        </section>
      )}

      <section className="border-t border-white/10 px-5 py-14 text-center sm:px-8 md:px-12">
        <h2 className="text-xl font-medium">Want results like this?</h2>
        <Link
          to="/book-consultation"
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
        >
          Book a Consultation
          <ChevronRight size={16} />
        </Link>
      </section>
    </div>
  );
}
