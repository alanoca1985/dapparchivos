import {
  Cloud,
  FileText,
  LayoutDashboard,
  Settings,
  Share2,
  Trash2,
} from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/types/fileVault";

const navItems: Array<{ key: NavKey; label: string; icon: ComponentType<{ className?: string }> }> =
  [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "files", label: "Files", icon: FileText },
    { key: "driveSync", label: "Drive Sync", icon: Cloud },
    { key: "shared", label: "Shared", icon: Share2 },
    { key: "trash", label: "Trash", icon: Trash2 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

export default function Sidebar({
  active,
  onChange,
}: {
  active: NavKey;
  onChange: (key: NavKey) => void;
}) {
  return (
    <aside className="relative flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#1a1d2e]/40 px-4 py-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20 ring-1 ring-white/10">
          <div className="text-sm font-semibold tracking-wide text-slate-100">FV</div>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-100">FileVault DApp</div>
          <div className="text-xs text-slate-400">Decentralized Vault</div>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-all duration-200",
                "hover:bg-white/5 hover:text-slate-100",
                isActive
                  ? "bg-white/10 text-slate-100 ring-1 ring-white/10"
                  : "text-slate-300",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  isActive ? "text-sky-300" : "text-slate-400 group-hover:text-slate-200",
                )}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Network</span>
          <span className="font-medium text-slate-200">Testnet</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-sky-400/60 to-indigo-500/60" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-400">Encrypted</span>
          <span className="text-slate-200">On</span>
        </div>
      </div>
    </aside>
  );
}
