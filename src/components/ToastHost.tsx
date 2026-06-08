import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastModel } from "@/types/fileVault";

function toastStyles(variant: ToastModel["variant"]) {
  if (variant === "success") {
    return {
      icon: CheckCircle2,
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_60px_rgba(0,0,0,0.45)]",
      iconClass: "text-emerald-300",
    };
  }
  if (variant === "warning") {
    return {
      icon: TriangleAlert,
      className:
        "border-orange-400/20 bg-orange-400/10 text-orange-50 shadow-[0_0_0_1px_rgba(251,146,60,0.18),0_18px_60px_rgba(0,0,0,0.45)]",
      iconClass: "text-orange-300",
    };
  }
  return {
    icon: Info,
    className:
      "border-sky-400/20 bg-sky-400/10 text-sky-50 shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_18px_60px_rgba(0,0,0,0.45)]",
    iconClass: "text-sky-300",
  };
}

export default function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastModel[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[320px] flex-col gap-3">
      {toasts.map((t) => {
        const styles = toastStyles(t.variant);
        const Icon = styles.icon;
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all duration-200",
              styles.className,
            )}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", styles.iconClass)} />
            <div className="flex-1 text-sm leading-snug">{t.message}</div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="grid size-7 place-items-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

