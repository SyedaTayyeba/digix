import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Reveal from "../components/Reveal";
import GlassBadge from "../components/GlassBadge";
import GlassCard from "../components/ui/GlassCard";
import { api } from "../lib/api";
import { faqs } from "../data/content";

type HomepageService = {
  id?: number;
  slug: string;
  title: string;
  summary?: string;
};

type HomepageTestimonial = {
  id?: number;
  name: string;
  quote: string;
  role?: string;
  company?: string;
};

type HomepageResponse = {
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primary_cta?: string;
    secondary_cta?: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  services?: HomepageService[];
  testimonials?: HomepageTestimonial[];
  cta?: {
    title?: string;
    description?: string;
    button?: string;
  };
};

const FALLBACK_HERO = {
  eyebrow: "Digital Agency · Dubai",
  title: "We report revenue. Not impressions.",
  description:
    "Digital marketing agency in Dubai — paid advertising, web development and lead generation.",
  primary_cta: "Book a Strategy Call",
  secondary_cta: "See the Numbers",
};

const FALLBACK_STATS = [
  {
    value: "AED 1M+",
    label: "Ad spend managed",
  },
  {
    value: "29",
    label: "Clients across UAE & GCC",
  },
  {
    value: "5",
    label: "Years in this market",
  },
];

const FALLBACK_SERVICES: HomepageService[] = [
  {
    slug: "google-ads",
    title: "Google Ads",
    summary:
      "Search, PMax and remarketing campaigns measured against cost per booked client.",
  },
  {
    slug: "social-advertising",
    title: "Social Advertising",
    summary:
      "Meta and Instagram campaigns built, tested and scaled against a clear revenue target.",
  },
  {
    slug: "web-development",
    title: "Web Development",
    summary: "Fast, structured websites designed to convert visitors and rank.",
  },
  {
    slug: "shopify-development",
    title: "Shopify Development",
    summary:
      "Conversion-first Shopify stores with better themes, speed, checkout and tracking.",
  },
  {
    slug: "lead-generation",
    title: "Lead Generation",
    summary:
      "Ads, landing pages, forms, WhatsApp routing and follow-up that turn leads into calls.",
  },
];

const FALLBACK_CTA = {
  title: "Find out what your marketing is actually returning.",
  description:
    "Book a 30-min call. We’ll inspect your accounts, tell you where money is leaking and if it is fixable. No deck. No pitch. No obligation.",
  button: "Book a Strategy Call",
};

export default function Home() {
  const [homepage, setHomepage] = useState<HomepageResponse | null>(null);

  const [loading, setLoading] = useState(true);

  // ONLY FORM STATE — NOTHING ELSE CHANGED
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  useEffect(() => {
    async function loadHomepage() {
      try {
        const response = await api.get<
          | HomepageResponse
          | {
              data: HomepageResponse;
            }
        >("/homepage");

        const data = "data" in response ? response.data : response;

        setHomepage(data);
      } catch (error) {
        console.error("Failed to load homepage:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  const hero = {
    ...FALLBACK_HERO,
    ...(homepage?.hero ?? {}),
  };

  const stats =
    homepage?.stats && homepage.stats.length > 0
      ? homepage.stats
      : FALLBACK_STATS;

  const homepageServices =
    homepage?.services && homepage.services.length > 0
      ? homepage.services
      : FALLBACK_SERVICES;

  const testimonials = homepage?.testimonials ?? [];

  const cta = {
    ...FALLBACK_CTA,
    ...(homepage?.cta ?? {}),
  };

  // ONLY FORM HANDLER
  const handleLeadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLeadForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    setLeadError("");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLeadSubmitting(true);
    setLeadError("");

    try {
      await api.post("/leads", {
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        source: "homepage_hero",
        stage: "new",
        form_data: {
          service: leadForm.service,
        },
      });

      setLeadSuccess(true);

      setLeadForm({
        name: "",
        phone: "",
        email: "",
        service: "",
      });
    } catch (error) {
      setLeadError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-viewport flex flex-col justify-center gap-8 px-5 pb-12 sm:px-8 md:px-12">

        {/* EXISTING HERO — SAME, ONLY WRAPPED FOR RIGHT FORM */}
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">

          <div>
            <Reveal delayMs={100}>
              <GlassBadge>{hero.eyebrow}</GlassBadge>
            </Reveal>

            <Reveal delayMs={220} className="max-w-3xl">
              <h1 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                We report revenue
                <br />
                Not <span className="impressions-highlight">impressions</span>
              </h1>
            </Reveal>

            <Reveal delayMs={340} className="max-w-lg">
              <p className="text-lg leading-relaxed text-white/85 drop-shadow-md">
                {hero.description}
              </p>
            </Reveal>

            <Reveal delayMs={440}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/book-consultation"
                  className="inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
                >
                  {hero.primary_cta}
                  <ChevronRight size={16} />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-5 py-2.5 text-sm backdrop-blur-md transition-colors duration-300 hover:bg-brand/20"
                >
                  {hero.secondary_cta}
                </Link>
              </div>
            </Reveal>
          </div>

          {/* ==================================================
              ONLY NEW PART — SMALL HERO LEAD FORM
          ================================================== */}
          <Reveal delayMs={300}>

            <GlassCard className="w-full max-w-[360px] justify-self-end p-5">

              {!leadSuccess ? (
                <>
                  <div className="mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand">
                      Start a conversation
                    </p>

                    <h2 className="mt-2 text-xl font-medium">
                      Let&apos;s talk about your growth.
                    </h2>

                    <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                      Tell us a little about your business.
                    </p>
                  </div>

                  <form
                    onSubmit={handleLeadSubmit}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      name="name"
                      value={leadForm.name}
                      onChange={handleLeadChange}
                      placeholder="Full name"
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={leadForm.phone}
                      onChange={handleLeadChange}
                      placeholder="Phone / WhatsApp"
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <input
                      type="email"
                      name="email"
                      value={leadForm.email}
                      onChange={handleLeadChange}
                      placeholder="Email address"
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <select
                      name="service"
                      value={leadForm.service}
                      onChange={handleLeadChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                    >
                      <option value="">Select a service</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Social Advertising">
                        Social Advertising
                      </option>
                      <option value="Web Development">
                        Web Development
                      </option>
                      <option value="Shopify Development">
                        Shopify Development
                      </option>
                      <option value="Lead Generation">
                        Lead Generation
                      </option>
                      <option value="Other">Other</option>
                    </select>

                    {leadError && (
                      <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {leadError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {leadSubmitting ? "Sending..." : "Get Started →"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-xl text-brand">
                    ✓
                  </div>

                  <h3 className="mt-4 text-xl font-medium">
                    Thanks for reaching out!
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    We&apos;ve received your enquiry and will get back to
                    you shortly.
                  </p>

                </div>
              )}

            </GlassCard>

          </Reveal>

        </div>
      </section>

      <div>
        {/* Statistics */}
        <section className="grid grid-cols-2 gap-6 border-t border-white/10 px-5 py-12 sm:px-8 md:grid-cols-3 md:px-12">
          {stats.map((stat) => (
            <Reveal key={stat.label}>
              <div>
                <p className="text-3xl font-medium text-white drop-shadow-md sm:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-white/60 drop-shadow-sm">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Services */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-medium drop-shadow-md sm:text-3xl">
              What we do
            </h2>

            <Link
              to="/services"
              className="text-sm text-white/60 drop-shadow-sm hover:text-brand"
            >
              View all services →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <GlassCard key={item}>
                  <div className="h-5 w-40 animate-pulse rounded bg-white/10" />

                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />

                  <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {homepageServices.slice(0, 3).map((service) => (
                <GlassCard key={service.slug}>
                  <h3 className="text-lg font-medium">{service.title}</h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {service.summary}
                  </p>

                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm text-brand hover:underline"
                  >
                    View Details
                    <ChevronRight size={14} />
                  </Link>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* Problem */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              The problem
            </p>

            <h2 className="mt-3 text-2xl font-medium drop-shadow-md sm:text-3xl">
              You’ve been sold reach before.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Impressions, reach and engagement aren’t P&L numbers. We report
              spend and return, and we won’t run or bill a channel if it isn’t
              tied to booked revenue.
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              Results
            </p>

            <h2 className="mt-3 text-2xl font-medium drop-shadow-md sm:text-3xl">
              Numbers that belong on the P&L.
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <GlassCard>
                <p className="text-2xl font-medium">AED 35M</p>

                <p className="mt-2 text-sm text-white/60">
                  Booked revenue attributed to ad spend
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-2xl font-medium">AED 50–200</p>

                <p className="mt-2 text-sm text-white/60">
                  CPC on real estate campaigns
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-2xl font-medium">5</p>

                <p className="mt-2 text-sm text-white/60">
                  Client accounts currently under management
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
            How we work
          </p>

          <h2 className="mt-3 text-2xl font-medium drop-shadow-md sm:text-3xl">
            Simple by design.
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Audit before pitch"],
              ["02", "Tracking first"],
              ["03", "Launch small and scale"],
              ["04", "One readable report"],
            ].map(([number, title]) => (
              <GlassCard key={number}>
                <p className="font-mono text-xs text-white/40">{number}</p>

                <h3 className="mt-3 text-lg font-medium">{title}</h3>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
            <h2 className="mb-8 text-2xl font-medium drop-shadow-md sm:text-3xl">
              What clients say
            </h2>

            <div className="grid gap-5 sm:grid-cols-3">
              {testimonials.map((testimonial) => (
                <GlassCard key={testimonial.id ?? testimonial.name}>
                  <p className="text-sm leading-relaxed text-white/80">
                    “{testimonial.quote}”
                  </p>

                  <p className="mt-4 text-sm font-medium">
                    {testimonial.name}
                  </p>

                  {(testimonial.role || testimonial.company) && (
                    <p className="text-xs text-white/50">
                      {testimonial.role}

                      {testimonial.role && testimonial.company ? ", " : ""}

                      {testimonial.company}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:px-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-medium drop-shadow-md sm:text-3xl">
              Common questions
            </h2>

            <Link
              to="/faqs"
              className="text-sm text-white/60 drop-shadow-sm hover:text-brand"
            >
              View all FAQs →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {faqs.slice(0, 4).map((faq) => (
              <GlassCard key={faq.question}>
                <h3 className="text-sm font-medium">{faq.question}</h3>

                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {faq.answer}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 px-5 py-16 text-center sm:px-8 md:px-12">
          <h2 className="text-2xl font-medium drop-shadow-md sm:text-3xl">
            {cta.title}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 drop-shadow-sm">
            {cta.description}
          </p>

          <Link
            to="/book-consultation"
            className="mt-6 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
          >
            {cta.button}
            <ChevronRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
