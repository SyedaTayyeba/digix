import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
        const response =
          await api.get<TeamResponse>('/team');

        const members =
          Array.isArray(response)
            ? response
            : response.data;

        setTeam(members ?? []);
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
    <div>
      <PageHero
        eyebrow="About"
        title="A small team that explains what it's doing."
        description="We're a Dubai-based digital agency. We plan, design, build, and run the marketing behind growing businesses — and we'd rather explain a decision plainly than hide it behind jargon."
      />

      {/* Our approach */}
      <section className="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:px-12">
        <div>
          <h2 className="text-xl font-medium">
            Our approach
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Every engagement starts with a short discovery call,
            not a template. From there we recommend the smallest
            set of services that will actually move the number you
            care about — and report on it in language anyone on
            your team can read.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">
            Who we work with
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Mostly small and mid-sized businesses across the UAE
            who need a website, a marketing channel, or both,
            run properly without an in-house team.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/10 px-5 py-14 sm:px-8 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-xl font-medium">
            Team preview
          </h2>

          <Link
            to="/team"
            className="text-sm text-white/60 hover:text-brand"
          >
            Meet the full team →
          </Link>
        </div>

        {loadingTeam ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <GlassCard key={item}>
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />

                <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />

                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />

                <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />
              </GlassCard>
            ))}
          </div>
        ) : team.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member) => (
              <GlassCard
                key={member.id ?? member.name}
              >
                <h3 className="text-sm font-medium">
                  {member.name}
                </h3>

                {member.role && (
                  <p className="mt-1 text-xs text-white/50">
                    {member.role}
                  </p>
                )}

                {member.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {member.bio}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/50">
            Our team information will be available soon.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-5 py-14 text-center sm:px-8 md:px-12">
        <h2 className="text-xl font-medium">
          Want to talk through your project?
        </h2>

        <Link
          to="/book-consultation"
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-brand/85"
        >
          Book a Strategy Call
          <ChevronRight size={16} />
        </Link>
      </section>
    </div>
  );
}
