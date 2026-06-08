import { Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-4 focus:ring-sky-400/10"
          placeholder="Connect Wallet"
        />
      </div>

      <div className="hidden w-[260px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:block">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Storage</span>
          <span className="text-slate-200">45.3 GB / 100 GB</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[45.3%] rounded-full bg-gradient-to-r from-sky-400/70 to-indigo-500/70" />
        </div>
      </div>

      <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-sm font-semibold text-slate-100">
        F
      </div>
    </header>
  );
}

