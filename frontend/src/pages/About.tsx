import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

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

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await api.get<TeamResponse>('/team');

        const payload = response.data;

        const members = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setTeam(members);
      } catch (error) {
        console.error('Failed to load team:', error);
        setTeam([]);
      } finally {
        setLoadingTeam(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <div className="overflow-hidden bg-transparent text-white">
      <PageHero
        eyebrow="About"
        title="A small team that explains what it's doing."
        description="We're a Dubai-based digital agency. We plan, design, build, and run the marketing behind growing businesses — and we'd rather explain a decision plainly than hide it behind jargon."
      />

      {/* Approach */}
      <section className="relative px-5 py-20 sm:px-6 md:px-4 lg:py-2">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <GlassCard className="group border-white/10 bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:border-brand/30 hover:bg-black/35 md:p-9">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <Sparkles size={19} />
              </div>

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                01
              </span>
            </div>

            <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              Our approach
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Clear thinking before busy work.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
              Every engagement starts with a short discovery call,
              not a template. From there we recommend the smallest
              set of services that will actually move the number you
              care about — and report on it in language anyone on
              your team can read.
            </p>

            <div className="mt-7 h-px w-full bg-gradient-to-r from-brand/40 via-white/10 to-transparent" />
          </GlassCard>

          <GlassCard className="group border-white/10 bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:border-brand/30 hover:bg-black/35 md:p-9">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <ArrowUpRight size={19} />
              </div>

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                02
              </span>
            </div>

            <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              Who we work with
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Ambitious businesses without the noise.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
              Mostly small and mid-sized businesses across the UAE
              who need a website, a marketing channel, or both,
              run properly without an in-house team.
            </p>

            <div className="mt-7 h-px w-full bg-gradient-to-r from-brand/40 via-white/10 to-transparent" />
          </GlassCard>
        </div>
      </section>

      {/* Team */}
      <section className="relative border-t border-white/10 px-5 py-20 sm:px-8 md:px-12 lg:py-28">
        <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-brand/10 blur-[110px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                The people
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                A team built around execution.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Strategy, design, development and marketing working together
                instead of sitting in separate silos.
              </p>
            </div>

            <Link
              to="/team"
              className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-white"
            >
              Meet the full team
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {loadingTeam ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <GlassCard
                  key={item}
                  className="border-white/10 bg-black/20 p-6"
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
              {team.slice(0, 4).map((member, index) => (
                <GlassCard
                  key={member.id ?? member.name}
                  className="group relative overflow-hidden border-white/10 bg-black/25 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-black/35"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 font-bold text-brand">
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="font-mono text-[10px] text-white/25">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="relative mt-7">
                    <h3 className="text-base font-black text-white">
                      {member.name}
                    </h3>

                    {member.role && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-4 text-sm leading-6 text-white/55">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
              <p className="text-sm text-white/45">
                Our team information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 px-5 py-24 text-center sm:px-8 md:px-12 lg:py-32">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]" />

        <div className="relative mx-auto max-w-3xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            Let&apos;s talk
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Have a project worth building?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55">
            Tell us what you're trying to achieve and we'll help you figure
            out the smartest next step.
          </p>

          <Link
            to="/book-consultation"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-black text-black shadow-[0_0_35px_rgba(47,188,186,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-[0_0_45px_rgba(47,188,186,0.3)]"
          >
            Book a Strategy Call
            <ChevronRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
