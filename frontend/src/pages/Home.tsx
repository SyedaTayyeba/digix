import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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

type HomepageApiResponse =
  | HomepageResponse
  | {
      data: HomepageResponse;
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

const FALLBACK_CTA = {
  title: "Find out what your marketing is actually returning.",
  description:
    "Book a 30-min call. We’ll inspect your accounts, tell you where money is leaking and if it is fixable. No deck. No pitch. No obligation.",
  button: "Book a Strategy Call",
};

const cardClass =
  "border-white/10 bg-black/25 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-black/35";

export default function Home() {
  const [homepage, setHomepage] = useState<HomepageResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    other_service: "",
  });

  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const [leadSuccess, setLeadSuccess] = useState(false);

  const [leadError, setLeadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHomepage() {
      try {
        const response = await api.get<HomepageApiResponse>("/homepage");

        if (!mounted) {
          return;
        }
        const payload = response.data;

        const data: HomepageResponse =
          "data" in payload ? payload.data : payload;

        setHomepage(data);
      } catch (error) {
        console.error("Failed to load homepage:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHomepage();

    return () => {
      mounted = false;
    };
  }, []);

  const hero = {
    ...FALLBACK_HERO,
    ...(homepage?.hero ?? {}),
  };

  const stats =
    homepage?.stats && homepage.stats.length > 0
      ? homepage.stats
      : FALLBACK_STATS;

  // Only the 3 services selected from the admin panel are shown.
  const homepageServices = Array.isArray(homepage?.services)
    ? homepage.services.slice(0, 3)
    : [];

  const testimonials = homepage?.testimonials ?? [];

  const cta = {
    ...FALLBACK_CTA,
    ...(homepage?.cta ?? {}),
  };

  const handleLeadChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setLeadForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "service" && value !== "Other" ? { other_service: "" } : {}),
    }));

    setLeadError("");
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (leadForm.service === "Other" && !leadForm.other_service.trim()) {
      setLeadError("Please tell us which service you need.");
      return;
    }

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
          other_service:
            leadForm.service === "Other" ? leadForm.other_service.trim() : "",
        },
      });

      setLeadSuccess(true);

      setLeadForm({
        name: "",
        phone: "",
        email: "",
        service: "",
        other_service: "",
      });
    } catch (error) {
      setLeadError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-viewport flex flex-col justify-center gap-8 px-5 pb-12 sm:px-8 md:px-12">
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
                  className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-5 py-2.5 text-sm text-white backdrop-blur-md transition-colors duration-300 hover:bg-brand/20"
                >
                  {hero.secondary_cta}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={300}>
            <GlassCard
              className={`w-full max-w-[360px] justify-self-end p-5 ${cardClass}`}
            >
              {!leadSuccess ? (
                <>
                  <div className="mb-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                      Start a conversation
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Let&apos;s talk about your growth.
                    </h2>

                    <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                      Tell us a little about your business.
                    </p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={leadForm.name}
                      onChange={handleLeadChange}
                      placeholder="Full name"
                      required
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={leadForm.phone}
                      onChange={handleLeadChange}
                      placeholder="Phone / WhatsApp"
                      required
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <input
                      type="email"
                      name="email"
                      value={leadForm.email}
                      onChange={handleLeadChange}
                      placeholder="Email address"
                      required
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                    />

                    <select
                      name="service"
                      value={leadForm.service}
                      onChange={handleLeadChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                    >
                      <option value="">Select a service</option>

                      {homepageServices.map((service) => (
                        <option
                          key={service.id ?? service.slug}
                          value={service.title}
                        >
                          {service.title}
                        </option>
                      ))}

                      <option value="Other">Other</option>
                    </select>

                    {leadForm.service === "Other" && (
                      <input
                        type="text"
                        name="other_service"
                        value={leadForm.other_service}
                        onChange={handleLeadChange}
                        placeholder="Which service do you need?"
                        required
                        autoFocus
                        className="w-full rounded-lg border border-brand/20 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
                      />
                    )}

                    {leadError && (
                      <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {leadError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-black transition-colors duration-300 hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {leadSubmitting ? "Sending..." : "Get Started →"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-xl text-brand">
                    ✓
                  </div>

                  <h3 className="mt-4 text-xl font-black text-white">
                    Thanks for reaching out!
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    We&apos;ve received your enquiry and will get back to you
                    shortly.
                  </p>
                </div>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <div>
        {/* Statistics */}
        <section className="border-t border-white/10 px-5 py-14 sm:px-8 md:px-12">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Reveal key={stat.label}>
                <div className={`${cardClass} rounded-2xl border p-6`}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Metric
                  </p>

                  <p className="mt-3 text-3xl font-black tracking-tight text-brand sm:text-4xl">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white/55">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  Services
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  What we do
                </h2>
              </div>

              <Link
                to="/services"
                className="text-sm font-bold text-brand transition-colors hover:text-white"
              >
                View all services →
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <GlassCard key={item} className={`${cardClass} p-6`}>
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

                    <div className="mt-6 h-5 w-40 animate-pulse rounded bg-white/10" />

                    <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/10" />

                    <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />

                    <div className="mt-6 h-3 w-24 animate-pulse rounded bg-brand/10" />
                  </GlassCard>
                ))}
              </div>
            ) : homepageServices.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {homepageServices.map((service, index) => (
                  <GlassCard
                    key={service.id ?? service.slug}
                    className={`group relative overflow-hidden p-6 ${cardClass}`}
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 font-mono text-xs font-bold text-brand">
                          0{index + 1}
                        </span>

                        <ChevronRight
                          size={18}
                          className="text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand"
                        />
                      </div>

                      <h3 className="mt-7 text-lg font-black text-white">
                        {service.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-white/55">
                        {service.summary ??
                          "Explore this service and see how we can help your business grow."}
                      </p>

                      <Link
                        to={`/services/${service.slug}`}
                        className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand transition-colors hover:text-white"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className={`${cardClass} p-8 text-center`}>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  Services
                </p>

                <h3 className="mt-3 text-xl font-black text-white">
                  Services coming soon
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
                  Our featured services will appear here once they are selected
                  from the admin panel.
                </p>

                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-5 py-2.5 text-sm font-bold text-brand transition-all duration-300 hover:bg-brand/20"
                >
                  Browse Services
                  <ChevronRight size={15} />
                </Link>
              </GlassCard>
            )}
          </div>
        </section>

        {/* Problem */}
        <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <GlassCard
              className={`relative overflow-hidden p-7 sm:p-10 ${cardClass}`}
            >
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand/10 blur-[90px]" />

              <div className="relative max-w-3xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  The problem
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  You’ve been sold reach before.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/55">
                  Impressions, reach and engagement aren’t P&L numbers. We
                  report spend and return, and we won’t run or bill a channel if
                  it isn’t tied to booked revenue.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Results */}
        <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Results
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Numbers that belong on the P&L.
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              <GlassCard className={`p-6 ${cardClass}`}>
                <p className="text-3xl font-black text-brand">AED 35M</p>

                <p className="mt-3 text-sm font-medium leading-6 text-white/55">
                  Booked revenue attributed to ad spend
                </p>
              </GlassCard>

              <GlassCard className={`p-6 ${cardClass}`}>
                <p className="text-3xl font-black text-brand">AED 50–200</p>

                <p className="mt-3 text-sm font-medium leading-6 text-white/55">
                  CPC on real estate campaigns
                </p>
              </GlassCard>

              <GlassCard className={`p-6 ${cardClass}`}>
                <p className="text-3xl font-black text-brand">5</p>

                <p className="mt-3 text-sm font-medium leading-6 text-white/55">
                  Client accounts currently under management
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              How we work
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Simple by design.
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Audit before pitch"],
                ["02", "Tracking first"],
                ["03", "Launch small and scale"],
                ["04", "One readable report"],
              ].map(([number, title]) => (
                <GlassCard
                  key={number}
                  className={`group relative overflow-hidden p-6 ${cardClass}`}
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative">
                    <p className="font-mono text-xs font-bold text-brand">
                      {number}
                    </p>

                    <h3 className="mt-4 text-lg font-black text-white">
                      {title}
                    </h3>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
            <div className="mx-auto max-w-6xl">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                Testimonials
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                What clients say
              </h2>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <GlassCard
                    key={testimonial.id ?? testimonial.name}
                    className={`relative overflow-hidden p-6 ${cardClass}`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />

                    <p className="relative text-sm leading-7 text-white/65">
                      “{testimonial.quote}”
                    </p>

                    <div className="relative mt-6 border-t border-white/10 pt-4">
                      <p className="text-sm font-black text-white">
                        {testimonial.name}
                      </p>

                      {(testimonial.role || testimonial.company) && (
                        <p className="mt-1 text-xs font-bold text-brand">
                          {testimonial.role}

                          {testimonial.role && testimonial.company ? ", " : ""}

                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="border-t border-white/10 px-5 py-20 sm:px-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  FAQs
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Common questions
                </h2>
              </div>

              <Link
                to="/faqs"
                className="text-sm font-bold text-brand transition-colors hover:text-white"
              >
                View all FAQs →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {faqs.slice(0, 4).map((faq) => (
                <GlassCard
                  key={faq.question}
                  className={`group p-6 ${cardClass}`}
                >
                  <h3 className="text-sm font-black text-white">
                    {faq.question}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {faq.answer}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-t border-white/10 px-5 py-24 text-center sm:px-8 md:px-12">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]" />

          <div className="relative mx-auto max-w-3xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Let&apos;s talk
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              {cta.title}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55">
              {cta.description}
            </p>

            <Link
              to="/book-consultation"
              className="mt-8 inline-flex items-center gap-1 rounded-full bg-brand px-6 py-3 text-sm font-black text-black shadow-[0_0_35px_rgba(47,188,186,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand/90"
            >
              {cta.button}
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
