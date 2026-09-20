interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  highlightWords?: string[];
}

export default function PageHero({
  eyebrow,
  title,
  description,
  highlightWords = [],
}: PageHeroProps) {
  const renderTitle = () => {
    if (!highlightWords.length) {
      return title;
    }

    const escapedWords = highlightWords.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const regex = new RegExp(
      `(${escapedWords.join('|')})`,
      'gi'
    );

    const parts = title.split(regex);

    return parts.map((part, index) => {
      const isHighlighted = highlightWords.some(
        (word) =>
          word.toLowerCase() === part.toLowerCase()
      );

      return isHighlighted ? (
        <span key={index} className="text-gradient-brand">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };

  return (
    <div className="relative px-5 pb-6 pt-12 sm:px-8 md:px-12 md:pb-10 md:pt-20">
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="eyebrow mb-4 text-brand-300">
            {eyebrow}
          </p>
        )}

        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl">
          {renderTitle()}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
