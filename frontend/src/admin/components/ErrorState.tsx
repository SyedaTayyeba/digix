import { AlertTriangle, RotateCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-400/20 bg-red-500/5 py-14 text-center">
      <AlertTriangle size={24} className="text-red-300" />
      <p className="max-w-sm text-sm text-white/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
        >
          <RotateCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}
