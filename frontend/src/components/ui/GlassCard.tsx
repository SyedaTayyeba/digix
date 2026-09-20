import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  // Default padding only when the caller hasn't chosen one, so p-5 / p-7 /
  // p-9 on the call site always win regardless of stylesheet order.
  const hasPadding = /(^|\s)p-\d/.test(className);

  return (
    <div className={`surface-card ${hasPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}
