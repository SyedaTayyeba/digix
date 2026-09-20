import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Reveal from "../components/Reveal";
import { accentAt } from "../lib/accents";
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
  { value: "AED 1M+", label: "Ad spend managed" },
  { value: "29", label: "Clients across UAE & GCC" },
  { value: "5", label: "Years in this market" },
];

const FALLBACK_CTA = {
  title: "Find out what your marketing is actually returning.",
  description:
    "Book a 30-min call. We’ll inspect your accounts, tell you where money is leaking and if it is fixable. No deck. No pitch. No obligation.",
  button: "Book a Strategy Call",
};

const VIDEO_BACKGROUND =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

const darkCard = "surface-card";

export default function Home() {
  const [homepage, setHomepage] = useState<HomepageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  /*
  |--------------------------------------------------------------------------
  | Scroll Controlled Background Video
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let animationFrame = 0;

    const updateVideoFromScroll = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        if (!video.duration || !Number.isFinite(video.duration)) {
          return;
        }

        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll <= 0) {
          video.currentTime = 0;
          return;
        }

        const scrollProgress = Math.min(
          Math.max(window.scrollY / maxScroll, 0),
          1
        );

        video.currentTime = scrollProgress * video.duration;
      });
    };

    const handleLoadedMetadata = () => {
      updateVideoFromScroll();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    window.addEventListener("scroll", updateVideoFromScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateVideoFromScroll);

    updateVideoFromScroll();

    return () => {
      cancelAnimationFrame(animationFrame);

      video.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      window.removeEventListener("scroll", updateVideoFromScroll);
      window.removeEventListener("resize", updateVideoFromScroll);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Homepage API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadHomepage = async () => {
      try {
        const response = await api.get<HomepageApiResponse>(
          "/homepage"
        );

        if (!mounted) return;

        const payload =
          "data" in response.data
            ? response.data.data
            : response.data;

        setHomepage(payload);
      } catch {
        if (mounted) {
          setHomepage(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHomepage();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Homepage Data
  |--------------------------------------------------------------------------
  */

  const hero = {
    ...FALLBACK_HERO,
    ...(homepage?.hero ?? {}),
  };

  const stats =
    homepage?.stats && homepage.stats.length > 0
      ? homepage.stats
      : FALLBACK_STATS;

  // Services are loaded from the backend.
  const services = homepage?.services ?? [];

  const testimonials = homepage?.testimonials ?? [];

  const cta = {
    ...FALLBACK_CTA,
    ...(homepage?.cta ?? {}),
  };

  /*
  |--------------------------------------------------------------------------
  | Lead Form
  |--------------------------------------------------------------------------
  */

  const handleLeadChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setLeadForm((current) => ({
      ...current,
      [name]: value,

      // Clear custom service when user switches away from Other.
      ...(name === "service" && value !== "Other"
        ? { other_service: "" }
        : {}),
    }));

    setLeadError("");
  };

  const handleLeadSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!leadForm.service) {
      setLeadError("Please select a service.");
      return;
    }

    if (
      leadForm.service === "Other" &&
      !leadForm.other_service.trim()
    ) {
      setLeadError("Please specify the service you need.");
      return;
    }

    setLeadSubmitting(true);
    setLeadError("");

    try {
      /*
      |--------------------------------------------------------------------------
      | Create Lead
      |--------------------------------------------------------------------------
      */

      await api.post("/leads", {
        name: leadForm.name.trim(),
        phone: leadForm.phone.trim(),
        email: leadForm.email.trim(),
        source: "homepage_hero",
        stage: "new",

        form_data: {
          service: leadForm.service,

          other_service:
            leadForm.service === "Other"
              ? leadForm.other_service.trim()
              : "",
        },
      });

      /*
      |--------------------------------------------------------------------------
      | Reset Form
      |--------------------------------------------------------------------------
      */

      setLeadForm({
        name: "",
        phone: "",
        email: "",
        service: "",
        other_service: "",
      });

      setLeadSuccess(true);
    } catch {
      setLeadError(
        "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071A24] text-white">
      {/* =====================================================
          FULL PAGE VIDEO BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_BACKGROUND}
          muted
          playsInline
          preload="metadata"
        />

        {/* Light global overlay */}
        <div className="absolute inset-0 bg-[#071A24]/25" />

        {/* Subtle navy tint */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,36,0.38)_0%,rgba(7,26,36,0.30)_45%,rgba(7,26,36,0.52)_100%)]" />

        {/* Readability gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,36,0.55)_0%,rgba(7,26,36,0.20)_45%,rgba(7,26,36,0.28)_100%)]" />
      </div>

      {/* =====================================================
          CONTENT LAYER
      ===================================================== */}

      <div className="relative z-10">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative min-h-[92vh] overflow-hidden">
          <div className="section-viewport relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 md:px-12 lg:px-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
              {/* Hero Content */}
              <Reveal>
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <GlassBadge>
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(47,188,186,0.9)]" />
                      {hero.eyebrow}
                    </GlassBadge>
                  </div>

                  <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
                    {hero.title?.split("impressions")[0]}

                    <span className="text-gradient-brand">
                      impressions
                    </span>
                    .
                  </h1>

                  <p className="mt-7 max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8">
                    {hero.description}
                  </p>

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/book-consultation"
                      className="btn-primary min-h-12"
                    >
                      {hero.primary_cta}

                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>

                    <a
                      href="#results"
                      className="btn-ghost min-h-12"
                    >
                      {hero.secondary_cta}
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Lead Form */}
              <Reveal>
                <div
                  className={`${darkCard} rounded-3xl p-6 shadow-[0_30px_80px_-30px_rgba(47,188,186,0.4)] sm:p-8`}
                >
                  {!leadSuccess ? (
                    <>
                      <div className="mb-7">
                        <p className="eyebrow text-brand-300">
                          Start a conversation
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                          Tell us what you need.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-white">
                          We’ll get back to you with the next step.
                        </p>
                      </div>

                      <form
                        onSubmit={handleLeadSubmit}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-semibold text-white"
                          >
                            Name
                          </label>

                          <input
                            id="name"
                            name="name"
                            value={leadForm.name}
                            onChange={handleLeadChange}
                            required
                            className="field"
                            placeholder="Your name"
                          />
                        </div>

                        {/* Phone + Email */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="phone"
                              className="mb-2 block text-sm font-semibold text-white"
                            >
                              Phone
                            </label>

                            <input
                              id="phone"
                              name="phone"
                              value={leadForm.phone}
                              onChange={handleLeadChange}
                              required
                              className="field"
                              placeholder="+971..."
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="mb-2 block text-sm font-semibold text-white"
                            >
                              Email
                            </label>

                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={leadForm.email}
                              onChange={handleLeadChange}
                              className="field"
                              placeholder="you@company.com"
                            />
                          </div>
                        </div>

                        {/* Service */}
                        <div>
                          <label
                            htmlFor="service"
                            className="mb-2 block text-sm font-semibold text-white"
                          >
                            Service
                          </label>

                          <select
                            id="service"
                            name="service"
                            value={leadForm.service}
                            onChange={handleLeadChange}
                            required
                            className="field"
                          >
                            <option value="">
                              {services.length > 0
                                ? "Select a service"
                                : "No services available"}
                            </option>

                            {/* Backend Services */}
                            {services.map((service) => (
                              <option
                                key={
                                  service.id ??
                                  service.slug
                                }
                                value={service.title}
                              >
                                {service.title}
                              </option>
                            ))}

                            {/* Always available custom option */}
                            <option value="Other">
                              Other
                            </option>
                          </select>
                        </div>

                        {/* Other Service */}
                        {leadForm.service === "Other" && (
                          <div>
                            <label
                              htmlFor="other_service"
                              className="mb-2 block text-sm font-semibold text-white"
                            >
                              Tell us more
                            </label>

                            <input
                              id="other_service"
                              name="other_service"
                              value={leadForm.other_service}
                              onChange={handleLeadChange}
                              required
                              className="field"
                              placeholder="What do you need help with?"
                            />
                          </div>
                        )}

                        {/* Error */}
                        {leadError && (
                          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                            {leadError}
                          </div>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={leadSubmitting}
                          className="btn-primary w-full !py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {leadSubmitting
                            ? "Sending..."
                            : "Book a Strategy Call"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand/40 bg-brand/20 text-brand-200 shadow-[0_0_40px_rgba(47,188,186,0.35)]">
                        <svg
                          className="h-7 w-7"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12l4 4L19 6" />
                        </svg>
                      </div>

                      <h2 className="mt-6 text-2xl font-semibold text-white">
                        Thank you.
                      </h2>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-white">
                        Your request has been received. We’ll be in touch
                        shortly.
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section
          id="results"
          className="band px-5 py-16 sm:px-8 md:px-12"
        >
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {stats.map((stat, index) => {
              const accent = accentAt(index);

              return (
                <Reveal key={`${stat.label}-${index}`}>
                  <div className="surface-card relative overflow-hidden p-6">
                    <div
                      className={`absolute inset-x-0 top-0 h-1 ${accent.solid}`}
                    />

                    <div
                      className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${accent.glow}`}
                    />

                    <p
                      className={`relative text-4xl font-extrabold tracking-tight sm:text-5xl ${accent.text}`}
                    >
                      {stat.value}
                    </p>

                    <p className="relative mt-2 text-sm font-medium text-white">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section className="band-alt px-5 py-24 sm:px-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="max-w-2xl">
                <p className="eyebrow text-brand-300">
                  What we do
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Services built around measurable growth.
                </h2>

                <p className="mt-4 text-base leading-7 text-white">
                  Strategy, execution and optimisation designed to move
                  commercial numbers.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.length > 0 ? (
                services.map((service, index) => {
                  const accent = accentAt(index);

                  return (
                    <Reveal key={service.id ?? service.slug}>
                      <div
                        className={`${darkCard} surface-card-hover group relative h-full overflow-hidden rounded-2xl p-6 ${accent.hoverBorder}`}
                      >
                        <div
                          className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${accent.glow}`}
                        />

                        <div className="relative">
                          <div className="mb-6 flex items-center justify-between">
                            <span
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold ${accent.chip}`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <ChevronRight
                              className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${accent.text}`}
                            />
                          </div>

                          <h3 className="text-xl font-bold text-white">
                            {service.title}
                          </h3>

                          {service.summary && (
                            <p className="mt-3 text-sm leading-6 text-white">
                              {service.summary}
                            </p>
                          )}

                          <Link
                            to={`/services/${service.slug}`}
                            className={`mt-6 inline-flex items-center text-sm font-bold hover:text-white ${accent.text}`}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })
              ) : (
                <Reveal>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Link
                      to="/services"
                      className="btn-ghost"
                    >
                      Browse Services
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="mt-10">
              <Link
                to="/services"
                className="inline-flex items-center text-sm font-bold text-brand-300 hover:text-white"
              >
                View all services

                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROBLEM / RESULTS
        ===================================================== */}

        <section className="px-5 py-24 sm:px-8 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <p className="eyebrow text-brand-300">
                  The problem
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Marketing should be accountable to revenue.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-white">
                  Too many businesses are left with dashboards full of
                  impressions, clicks and vanity metrics without knowing what
                  actually turned into revenue.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div
                className={`${darkCard} relative overflow-hidden rounded-3xl border-brand/30 p-7 sm:p-9`}
              >
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-coral/20 blur-3xl" />

                <p className="eyebrow text-brand-300">
                  The result
                </p>

                <h3 className="relative mt-3 text-2xl font-extrabold text-white">
                  Clearer decisions. Better acquisition.
                </h3>

                <p className="mt-4 text-sm leading-7 text-white">
                  We connect campaigns, websites and lead generation into one
                  measurable growth system.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            HOW WE WORK
        ===================================================== */}

        <section className="band px-5 py-24 text-white sm:px-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow text-brand-300">
                How we work
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Simple process. Serious execution.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Understand",
                  text: "We identify the commercial goals, current performance and gaps.",
                },
                {
                  number: "02",
                  title: "Build",
                  text: "We create the campaigns, pages and systems required to move forward.",
                },
                {
                  number: "03",
                  title: "Optimise",
                  text: "We measure what matters and continuously improve the system.",
                },
              ].map((item, index) => {
                const accent = accentAt(index);

                return (
                  <Reveal key={item.number}>
                    <div
                      className={`${darkCard} surface-card-hover relative h-full overflow-hidden rounded-2xl p-7 ${accent.hoverBorder}`}
                    >
                      <div
                        className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${accent.glow}`}
                      />

                      <span
                        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold ${accent.chip}`}
                      >
                        {item.number}
                      </span>

                      <h3 className="relative mt-5 text-xl font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="relative mt-3 text-sm leading-6 text-white">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            TESTIMONIALS
        ===================================================== */}

        {testimonials.length > 0 && (
          <section className="band-alt px-5 py-24 sm:px-8 md:px-12">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className="eyebrow text-brand-300">
                  Client perspective
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  What our clients say.
                </h2>
              </Reveal>

              <div className="mt-12 grid gap-5 md:grid-cols-2">
                {testimonials.map((testimonial, index) => {
                  const accent = accentAt(index + 1);

                  return (
                    <Reveal key={testimonial.id ?? testimonial.name}>
                      <div
                        className={`${darkCard} relative h-full overflow-hidden rounded-2xl p-7`}
                      >
                        <div
                          className={`absolute inset-y-0 left-0 w-1 ${accent.solid}`}
                        />

                        <p className="text-lg leading-8 text-white">
                          “{testimonial.quote}”
                        </p>

                        <div className="mt-7 border-t border-brand/15 pt-5">
                          <p className="font-bold text-white">
                            {testimonial.name}
                          </p>

                          {(testimonial.role ||
                            testimonial.company) && (
                            <p className="mt-1 text-sm text-white">
                              {[
                                testimonial.role,
                                testimonial.company,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="px-5 py-24 sm:px-8 md:px-12">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="eyebrow text-brand-300">
                FAQ
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Questions, answered.
              </h2>
            </Reveal>

            <div className="mt-10 space-y-3">
              {faqs.slice(0, 5).map((faq, index) => (
                <Reveal key={index}>
                  <details className="faq surface-card px-5 py-4 open:!border-brand/40 open:!bg-brand/[0.07]">
                    <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-white sm:text-base">
                      {faq.question}
                    </summary>

                    <p className="mt-3 pr-6 text-sm leading-6 text-white">
                      {faq.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/faqs"
                className="inline-flex items-center text-sm font-bold text-brand-300 hover:text-white"
              >
                View all FAQs

                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-12">
          <div className="surface-card relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-brand/30 bg-gradient-to-br from-brand/[0.16] to-ink-900/85 px-6 py-14 text-center sm:px-12">
            <Reveal>
              <p className="eyebrow text-brand-300">
                Ready to talk?
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {cta.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white">
                {cta.description}
              </p>

              <Link
                to="/book-consultation"
                className="btn-primary mt-8 !px-7 !py-3.5"
              >
                {cta.button}

                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </div>

      {loading && (
        <div className="fixed bottom-5 right-5 z-50 rounded-full border border-brand/25 bg-ink-900/90 px-4 py-2 text-xs text-white shadow-xl backdrop-blur-md">
          Loading...
        </div>
      )}
    </main>
  );
}