interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

/**
 * The FRS's "simple UX rules" call for clear headings and plain language
 * on every page, not just the home hero. This is the shared banner every
 * inner page opens with, so headings stay visually consistent site-wide.
 */
export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="border-b border-white/10 px-5 py-14 sm:px-8 md:px-12 md:py-20">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-white/50">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight drop-shadow-md sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 drop-shadow-sm">{description}</p>
      )}
    </div>
  );
}
