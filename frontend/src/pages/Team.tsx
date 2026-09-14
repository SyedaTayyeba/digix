import { useEffect, useState } from 'react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type TeamMember = {
  id?: number;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  image?: string;
  social_links?: Record<string, string>;
};

type TeamResponse =
  | TeamMember[]
  | {
      data: TeamMember[];
    };

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const response =
          await api.get<TeamResponse>('/team');

        const data = Array.isArray(response)
          ? response
          : response.data;

        setTeam(data ?? []);
      } catch (error) {
        console.error(
          'Failed to load team:',
          error
        );

        setTeam([]);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Team"
        title="The people behind the work"
      />

      <section className="grid gap-5 px-5 py-14 sm:grid-cols-2 sm:px-8 md:px-12 lg:grid-cols-4">
        {loading ? (
          [1, 2, 3, 4].map((item) => (
            <GlassCard key={item}>
              <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-white/10" />

              <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-white/10" />
            </GlassCard>
          ))
        ) : team.length > 0 ? (
          team.map((member) => {
            const image =
              member.photo ?? member.image;

            return (
              <GlassCard
                key={
                  member.id ??
                  `${member.name}-${member.role ?? ''}`
                }
              >
                {image ? (
                  <img
                    src={image}
                    alt={member.name}
                    className="mb-4 h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="mb-4 h-16 w-16 rounded-full bg-white/10"
                    aria-hidden="true"
                  />
                )}

                <h2 className="text-sm font-medium">
                  {member.name}
                </h2>

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
            );
          })
        ) : (
          <div className="py-10 text-center sm:col-span-2 lg:col-span-4">
            <p className="text-sm text-white/50">
              Our team information will be available soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
