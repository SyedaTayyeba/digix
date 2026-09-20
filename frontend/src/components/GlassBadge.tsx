import type { ReactNode } from 'react';

interface GlassBadgeProps {
  children: ReactNode;
  className?: string;
}

/** Pill label used above hero and section headlines. */
export default function GlassBadge({ children, className = '' }: GlassBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-200 backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}
