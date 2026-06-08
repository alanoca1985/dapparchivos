import { Download, FileText, Figma, Image as ImageIcon, PlayCircle } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { BadgeVariant, FileCardModel } from "@/types/fileVault";

function badgeConfig(variant: BadgeVariant) {
  if (variant === "sharedOrange") {
    return {
      label: "♦ Shared",
      className: "border-orange-400/25 bg-orange-400/10 text-orange-200",
    };
  }
  if (variant === "choredPurple") {
    return {
      label: "♦ Chored",
      className: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200",
    };
  }
  return {
    label: "♦ Chored",
    className: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  };
}

function kindIcon(kind: FileCardModel["kind"]) {
  if (kind === "figma") return Figma;
  if (kind === "image") return ImageIcon;
  if (kind === "video") return PlayCircle;
  return FileText;
}

function kindLabel(kind: FileCardModel["kind"]) {
  if (kind === "figma") return ".fig";
  if (kind === "pdf") return "PDF";
  if (kind === "video") return "VIDEO";
  if (kind === "image") return "IMAGE";
  return "DOC";
}

export default function FileCard({
  card,
  onUploadPreview,
  onChangeName,
  onDownload,
}: {
  card: FileCardModel;
  onUploadPreview: (file: File) => void;
  onChangeName: (name: string) => void;
  onDownload: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Icon = kindIcon(card.kind);
  const badge = badgeConfig(card.badgeVariant);

  return (
    <div
      className={cn(
        "group rounded-[16px] border border-white/10 bg-white/5 backdrop-blur-xl",
        "transition-all duration-200 hover:border-sky-400/30 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.28),0_22px_70px_rgba(0,0,0,0.55)]",
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative block h-40 w-full overflow-hidden rounded-[16px] border-b border-white/10"
      >
        {card.previewUrl ? (
          <img
            src={card.previewUrl}
            alt={card.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 via-white/0 to-indigo-500/10">
            {card.kind === "image" ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <ImageIcon className="h-4 w-4 text-slate-200/80" />
                <span>Landscape preview</span>
              </div>
            ) : card.kind === "video" ? (
              <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <PlayCircle className="h-8 w-8 text-slate-100/90" />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    card.kind === "figma" ? "text-fuchsia-300" : "text-slate-200/80",
                  )}
                />
                <span>{kindLabel(card.kind)}</span>
              </div>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/25 group-hover:opacity-100">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-100 backdrop-blur-xl">
            Click to upload preview
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            onUploadPreview(f);
            e.target.value = "";
          }}
        />
      </button>

      <div className="px-4 pb-4 pt-3">
        <input
          value={card.name}
          onChange={(e) => onChangeName(e.target.value)}
          className="w-full rounded-xl bg-transparent text-sm font-semibold text-slate-100 outline-none ring-1 ring-transparent transition-all duration-200 placeholder:text-slate-500 focus:bg-white/5 focus:ring-white/10"
        />

        <div className="mt-2 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0 truncate text-slate-400">
            {card.sizeLabel} · {card.storageType}
          </div>
          <div
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              badge.className,
            )}
          >
            {badge.label}
          </div>
        </div>

        <button
          type="button"
          onClick={onDownload}
          className={cn(
            "mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl",
            "border border-white/15 bg-white/0 text-sm font-semibold text-slate-100",
            "transition-all duration-200 hover:border-sky-400/30 hover:bg-white/5 active:scale-[0.99]",
          )}
        >
          <Download className="h-4 w-4 text-slate-200/90" />
          Download
        </button>
      </div>
    </div>
  );
}

