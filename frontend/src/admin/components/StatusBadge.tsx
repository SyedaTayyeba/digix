const STYLES: Record<string, string> = {
  published: 'bg-brand/15 text-brand border-brand/30',
  draft: 'bg-white/10 text-white/70 border-white/20',
  archived: 'bg-white/5 text-white/40 border-white/15',
  // Lead stages
  New: 'bg-white/10 text-white/70 border-white/20',
  Contacted: 'bg-blue-400/10 text-blue-300 border-blue-400/30',
  Qualified: 'bg-brand/15 text-brand border-brand/30',
  'Meeting Booked': 'bg-purple-400/10 text-purple-300 border-purple-400/30',
  'Proposal Sent': 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Won: 'bg-green-400/10 text-green-300 border-green-400/30',
  Lost: 'bg-red-400/10 text-red-300 border-red-400/30',
  // Appointment statuses
  Pending: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Confirmed: 'bg-brand/15 text-brand border-brand/30',
  Rescheduled: 'bg-blue-400/10 text-blue-300 border-blue-400/30',
  Completed: 'bg-green-400/10 text-green-300 border-green-400/30',
  Cancelled: 'bg-red-400/10 text-red-300 border-red-400/30',
  'No Show': 'bg-red-400/10 text-red-300 border-red-400/30',
};

export default function StatusBadge({ value }: { value: string }) {
  const classes = STYLES[value] || 'bg-white/10 text-white/70 border-white/20';
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {value}
    </span>
  );
}
