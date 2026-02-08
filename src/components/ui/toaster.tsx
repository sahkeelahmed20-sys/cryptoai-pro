import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 px-4 py-3 rounded-xl min-w-[300px] max-w-[400px]
            animate-in slide-in-from-right-full duration-300
            ${toast.variant === 'destructive' 
              ? 'bg-red-500/10 border border-red-500/30 text-red-500' 
              : 'bg-[#d0ff59]/10 border border-[#d0ff59]/30 text-[#d0ff59]'
            }
          `}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className="w-5 h-5 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-medium text-sm">{toast.title}</p>
            {toast.description && (
              <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
