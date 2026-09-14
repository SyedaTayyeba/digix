import type { ReactNode } from 'react';

interface GlassBadgeProps {
  children: ReactNode;
  className?: string;
}

/** The left-accent frosted label used above both hero and section-two headlines. */
export default function GlassBadge({ children, className = '' }: GlassBadgeProps) {
  return (
    <span
      className={`inline-block border-l-2 border-brand bg-brand/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}
