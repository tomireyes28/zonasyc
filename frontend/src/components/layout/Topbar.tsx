export function Topbar() {
  return (
    <header className="h-16 bg-zonasyc-card border-b border-slate-700/50 flex items-center justify-between px-6">
      <h2 className="text-slate-200 font-semibold">CMS v2.0</h2>
      <div className="flex items-center gap-4">
        {/* Placeholder para el Avatar del usuario en el futuro */}
        <div className="w-8 h-8 rounded-full bg-zonasyc-red flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-700 transition-colors">
          Z
        </div>
      </div>
    </header>
  );
}