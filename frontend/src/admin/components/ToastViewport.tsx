import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const VARIANT_STYLES = {
  success: { icon: CheckCircle2, classes: 'border-brand/40 bg-brand/10 text-white' },
  error: { icon: XCircle, classes: 'border-red-400/40 bg-red-500/10 text-white' },
  info: { icon: Info, classes: 'border-white/20 bg-white/10 text-white' },
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const { icon: Icon, classes } = VARIANT_STYLES[toast.variant];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${classes}`}
          >
            <Icon size={16} className="shrink-0" />
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              className="ml-2 text-white/50 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
