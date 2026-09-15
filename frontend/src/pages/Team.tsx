import { useEffect, useState } from 'react';

import PageHero from '../components/ui/PageHero';
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

const cardClass =
  'rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-black/35 sm:p-7';

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const response =
          await api.get<TeamResponse>('/team');

        const payload = response.data;

        const data: TeamMember[] = Array.isArray(payload)
          ? payload
          : payload.data;

        setTeam(data);
      } catch (error) {
        console.error('Failed to load team:', error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Team"
        title="The people behind the work"
        highlightWords={['people']}
      />

      <section className="px-5 py-12 sm:px-6 sm:py-6 md:px-4 lg:py-2">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div key={item} className={cardClass}>
                <div className="mb-5 h-20 w-20 animate-pulse rounded-full bg-white/10" />

                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />

                <div className="mt-5 h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-4/6 animate-pulse rounded bg-white/10" />
              </div>
            ))
          ) : team.length > 0 ? (
            team.map((member) => {
              const image = member.photo ?? member.image;

              return (
                <div
                  key={
                    member.id ??
                    `${member.name}-${member.role ?? ''}`
                  }
                  className={cardClass}
                >
                  <div className="mb-5">
                    {image ? (
                      <img
                        src={image}
                        alt={member.name}
                        className="h-20 w-20 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-medium text-white/60"
                        aria-hidden="true"
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h2 className="text-base font-medium text-white">
                    {member.name}
                  </h2>

                  {member.role && (
                    <p className="mt-1 text-xs font-medium text-brand">
                      {member.role}
                    </p>
                  )}

                  {member.bio && (
                    <p className="mt-4 text-sm leading-7 text-white/65">
                      {member.bio}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-center backdrop-blur-xl sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-white/50">
                Our team information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}