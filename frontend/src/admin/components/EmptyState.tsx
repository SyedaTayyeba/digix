import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-16 text-center">
      <Inbox size={28} className="mb-1 text-white/30" />
      <p className="text-sm font-medium text-white/80">{title}</p>
      {description && <p className="max-w-sm text-sm text-white/50">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
