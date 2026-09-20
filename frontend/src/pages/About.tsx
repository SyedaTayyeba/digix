import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import PageHero from "../components/ui/PageHero";
import GlassCard from "../components/ui/GlassCard";
import { accentAt } from '../lib/accents';
import { api } from "../lib/api";
import PageOverlay from "../components/ui/PageOverlay";

type TeamMember = {
  id?: number;
  name: string;
  role?: string;
  bio?: string;
};

type TeamResponse =
  | TeamMember[]
  | {
      data: TeamMember[];
    };

const cardClass =
  'surface-card surface-card-hover';

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await api.get<TeamResponse>("/team");

        const payload = response.data;

        const members = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setTeam(members);
      } catch (error) {
        console.error("Failed to load team:", error);
        setTeam([]);
      } finally {
        setLoadingTeam(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <div className="overflow-hidden bg-transparent text-white">
      <PageOverlay />
      {/* Hero */}
      <PageHero
        eyebrow="About"
        title="A small team that explains what it's doing."
        description="We're a Dubai-based digital agency. We plan, design, build, and run the marketing behind growing businesses — and we'd rather explain a decision plainly than hide it behind jargon."
      />

      {/* Approach */}
      <section className="relative px-5 py-20 sm:px-6 md:px-4 lg:py-28">

        <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {/* Approach Card */}
          <GlassCard
            className={`group relative overflow-hidden p-7 md:p-9 ${cardClass}`}
          >
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand/20 blur-3xl transition-all duration-500 group-hover:bg-brand/20" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand-300 transition-all duration-300 group-hover:border-brand/40 group-hover:bg-brand/15">
                  <Sparkles size={19} />
                </div>

                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  01
                </span>
              </div>

              <p className="mt-8 eyebrow text-brand-300">
                Our approach
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Clear thinking before busy work.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white">
                Every engagement starts with a short discovery call, not a
                template. From there we recommend the smallest set of services
                that will actually move the number you care about — and report
                on it in language anyone on your team can read.
              </p>

              <div className="mt-7 h-px w-full bg-gradient-to-r from-brand/40 via-white/10 to-transparent transition-all duration-300 group-hover:from-brand/70" />
            </div>
          </GlassCard>

          {/* Clients Card */}
          <GlassCard
            className={`group relative overflow-hidden p-7 md:p-9 ${cardClass}`}
          >
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-iris/25 blur-3xl transition-all duration-500 group-hover:bg-iris/35" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-iris/40 bg-iris/20 text-iris-200 transition-all duration-300 group-hover:border-iris/60">
                  <ArrowUpRight size={19} />
                </div>

                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  02
                </span>
              </div>

              <p className="mt-8 eyebrow text-iris-300">
                Who we work with
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Ambitious businesses without the noise.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white">
                Mostly small and mid-sized businesses across the UAE who need a
                website, a marketing channel, or both, run properly without an
                in-house team.
              </p>

              <div className="mt-7 h-px w-full bg-gradient-to-r from-iris/50 via-white/10 to-transparent transition-all duration-300 group-hover:from-iris/80" />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Team */}
      <section className="relative border-t border-brand/15 px-5 py-20 sm:px-8 md:px-12 lg:py-28">

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-brand-300">
                The people
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                A team built around execution.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white">
                Strategy, design, development and marketing working together
                instead of sitting in separate silos.
              </p>
            </div>

            <Link
              to="/team"
              className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-300 transition-colors duration-300 hover:text-white"
            >
              Meet the full team

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Loading */}
          {loadingTeam ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <GlassCard
                  key={item}
                  className={`p-6 ${cardClass}`}
                >
                  <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />

                  <div className="mt-6 h-4 w-28 animate-pulse rounded bg-white/10" />

                  <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />

                  <div className="mt-5 h-3 w-full animate-pulse rounded bg-white/10" />

                  <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />

                  <div className="mt-2 h-3 w-4/6 animate-pulse rounded bg-white/10" />
                </GlassCard>
              ))}
            </div>
          ) : team.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.slice(0, 4).map((member, index) => {
                const accent = accentAt(index);

                return (
                <GlassCard
                  key={member.id ?? member.name}
                  className={`group relative overflow-hidden p-6 ${cardClass}`}
                >
                  <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-70 transition-all duration-300 group-hover:opacity-100 ${accent.glow}`} />

                  <div className="relative flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border font-bold ${accent.chip}`}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="font-mono text-[10px] text-white">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="relative mt-7">
                    <h3 className="text-base font-bold text-white">
                      {member.name}
                    </h3>

                    {member.role && (
                      <p className={`mt-1 text-xs font-bold ${accent.text}`}>
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-4 text-sm leading-6 text-white">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </GlassCard>
                );
              })}
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-8 text-center ${cardClass}`}
            >
              <p className="text-sm text-white">
                Our team information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-brand/15 px-5 py-24 text-center sm:px-8 md:px-12 lg:py-32">

        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow text-brand-300">
            Let&apos;s talk
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Have a project worth building?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white">
            Tell us what you&apos;re trying to achieve and we&apos;ll help you
            figure out the smartest next step.
          </p>

          <Link
            to="/book-consultation"
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
          >
            Book a Strategy Call
            <ChevronRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}