import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
