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
        <span key={index} className="text-brand">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };

  return (
    <div className="px-5 py-4 sm:px-8 sm:py-4 md:px-12 md:py-14">
      {eyebrow && (
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </p>
      )}

      <h1 className="max-w-4xl text-3xl font-black leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
        {renderTitle()}
      </h1>

      {description && (
  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 drop-shadow-sm sm:text-base">
    {description}
  </p>
)}
    </div>
  );
}
