import React from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

/**
 * Thin wrapper around useReveal for the common case: one block, one delay.
 * Keeps every section's markup free of repeated observer boilerplate.
 */
export default function Reveal({ children, delayMs = 0, className = '' }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
