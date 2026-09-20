import { useEffect, useState } from 'react';

import PageHero from '../components/ui/PageHero';
import { accentAt } from '../lib/accents';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

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
  'surface-card surface-card-hover p-6 sm:p-7';

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
      <PageOverlay />
      <PageHero
        eyebrow="Team"
        title="The people behind the work"
        highlightWords={['people']}
      />

      <section className="px-5 py-12 sm:px-6 sm:py-6 md:px-4 lg:py-2">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            team.map((member, index) => {
              const accent = accentAt(index);
              const image = member.photo ?? member.image;

              return (
                <div
                  key={
                    member.id ??
                    `${member.name}-${member.role ?? ''}`
                  }
                  className={`${cardClass} group relative overflow-hidden`}
                >
                  <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-60 ${accent.glow}`} />
                  <div className="relative mb-5">
                    {image ? (
                      <img
                        src={image}
                        alt={member.name}
                        className="h-20 w-20 rounded-full border border-brand/15 object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-full border text-2xl font-bold ${accent.chip}`}
                        aria-hidden="true"
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h2 className="relative text-base font-bold text-white">
                    {member.name}
                  </h2>

                  {member.role && (
                    <p className={`relative mt-1 text-xs font-bold ${accent.text}`}>
                      {member.role}
                    </p>
                  )}

                  {member.bio && (
                    <p className="relative mt-4 text-sm leading-7 text-white">
                      {member.bio}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-brand/15 bg-ink-900/60 px-6 py-12 text-center backdrop-blur-xl sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-white">
                Our team information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}