import { Cloud, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FileCard from "@/components/FileCard";
import Sidebar from "@/components/Sidebar";
import ToastHost from "@/components/ToastHost";
import TopBar from "@/components/TopBar";
import type { BadgeVariant, FileCardKind, FileCardModel, NavKey, ToastModel, ToastVariant } from "@/types/fileVault";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function randomBadge(): BadgeVariant {
  const variants: BadgeVariant[] = ["choredBlue", "sharedOrange", "choredPurple"];
  return variants[Math.floor(Math.random() * variants.length)] ?? "choredBlue";
}

function normalizeDriveUrl(url: string) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (!match) return url;
  const id = match[1];
  if (!id) return url;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

function makeInitialCards(): FileCardModel[] {
  const specs: Array<{
    kind: FileCardKind;
    name: string;
    sizeLabel: string;
    downloadUrl?: string;
    previewUrl?: string;
    previewFileName?: string;
  }> = [
    {
      kind: "document",
      name: "Vault Notes.doc",
      sizeLabel: "0.6 MB",
      downloadUrl: "https://drive.google.com/file/d/1kskjJS2DAULihQ7H7KGD61e9fabYVisJ/view",
      previewUrl: "/card-1.png",
      previewFileName: "card-1.png",
    },
    {
      kind: "document",
      name: "Security Brief.doc",
      sizeLabel: "0.3 MB",
      downloadUrl:
        "https://drive.google.com/file/d/1_7c9e_IsDADJ_Nxx2eB5veWMPH-RWIz2/view?usp=drive_link",
      previewUrl: "/card-2.png",
      previewFileName: "card-2.png",
    },
    { kind: "document", name: "Roadmap Q4.doc", sizeLabel: "2.1 MB", downloadUrl: "" },
    { kind: "figma", name: "FileVault UI.fig", sizeLabel: "14.8 MB", downloadUrl: "" },
    { kind: "figma", name: "Vault Flow.fig", sizeLabel: "9.3 MB", downloadUrl: "" },
    { kind: "figma", name: "Mobile Layout.fig", sizeLabel: "7.6 MB", downloadUrl: "" },
    { kind: "image", name: "Cover Image.png", sizeLabel: "3.4 MB", downloadUrl: "" },
    { kind: "image", name: "Landscape Shot.jpg", sizeLabel: "2.7 MB", downloadUrl: "" },
    { kind: "video", name: "Walkthrough.mp4", sizeLabel: "38.0 MB", downloadUrl: "" },
    { kind: "pdf", name: "Terms.pdf", sizeLabel: "1.9 MB", downloadUrl: "" },
  ];

  return specs.map((s) => ({
    id: createId(),
    kind: s.kind,
    name: s.name,
    sizeLabel: s.sizeLabel,
    storageType: "Decentralized",
    badgeVariant: randomBadge(),
    downloadUrl: s.downloadUrl,
    previewUrl: s.previewUrl,
    previewFileName: s.previewFileName,
  }));
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [cards, setCards] = useState<FileCardModel[]>(() => makeInitialCards());
  const [toasts, setToasts] = useState<ToastModel[]>([]);

  const objectUrlsRef = useRef<Map<string, string>>(new Map());
  const globalPickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      for (const url of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  const toastTimers = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      for (const t of timers.values()) window.clearTimeout(t);
      timers.clear();
    };
  }, []);

  const addToast = (message: string, variant: ToastVariant) => {
    const id = createId();
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, 2600);
    toastTimers.current.set(id, timer);
  };

  const dismissToast = (id: string) => {
    const t = toastTimers.current.get(id);
    if (t) window.clearTimeout(t);
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  const updateCard = (id: string, patch: Partial<FileCardModel>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const setCardPreview = (id: string, file: File) => {
    const nextUrl = URL.createObjectURL(file);
    const prevUrl = objectUrlsRef.current.get(id);
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    objectUrlsRef.current.set(id, nextUrl);

    updateCard(id, {
      previewUrl: nextUrl,
      previewFileName: file.name,
      sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
    addToast("File uploaded successfully", "success");
  };

  const triggerDownload = (card: FileCardModel) => {
    if (card.downloadUrl) {
      window.open(normalizeDriveUrl(card.downloadUrl), "_blank", "noopener,noreferrer");
      addToast("Opening Google Drive download", "info");
      return;
    }

    if (!card.previewUrl) {
      addToast("No file uploaded yet", "warning");
      return;
    }

    const a = document.createElement("a");
    a.href = card.previewUrl;
    a.download = card.previewFileName ?? card.name.split(" ").join("_");
    document.body.appendChild(a);
    a.click();
    a.remove();
    addToast("Download started", "info");
  };

  const onGlobalPick = (file: File) => {
    const id = createId();
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.set(id, url);

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setCards((prev) => [
      {
        id,
        kind: "image",
        name: baseName || "Untitled",
        sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        storageType: "Decentralized",
        badgeVariant: randomBadge(),
        previewUrl: url,
        previewFileName: file.name,
      },
      ...prev,
    ]);

    addToast("File uploaded successfully", "success");
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_35%),radial-gradient(circle_at_85%_40%,rgba(99,102,241,0.10),transparent_40%),radial-gradient(circle_at_40%_90%,rgba(236,72,153,0.06),transparent_45%)]" />

      <div className="flex min-h-screen">
        <Sidebar active={activeNav} onChange={setActiveNav} />

        <main className="flex-1">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
            <TopBar />

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
                <div className="mt-1 text-sm text-slate-400">Drived Wallets</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 backdrop-blur-xl transition-all duration-200 hover:border-sky-400/30 hover:bg-white/10"
                >
                  <Cloud className="h-4 w-4 text-slate-200/90" />
                  Google Drive sync
                </button>

                <button
                  type="button"
                  onClick={() => globalPickerRef.current?.click()}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/80 to-indigo-500/80 px-4 text-sm font-semibold text-slate-950 transition-all duration-200 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.99]"
                >
                  <Upload className="h-4 w-4" />
                  + Upload
                </button>

                <input
                  ref={globalPickerRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    onGlobalPick(f);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((c) => (
                <FileCard
                  key={c.id}
                  card={c}
                  onUploadPreview={(file) => setCardPreview(c.id, file)}
                  onChangeName={(name) => updateCard(c.id, { name })}
                  onDownload={() => triggerDownload(c)}
                />
              ))}
            </section>
          </div>
        </main>
      </div>

      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
