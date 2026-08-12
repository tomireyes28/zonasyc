import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-zonasyc-card border-r border-slate-700/50 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <span className="text-xl font-black text-white tracking-tighter">
          ZONA<span className="text-zonasyc-red">SYC</span>
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
          Tablero Kanban
        </Link>
        <Link href="/admin/articles/new" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
          Nueva Nota
        </Link>
      </nav>
    </aside>
  );
}