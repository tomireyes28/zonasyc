import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              ZONASYC
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              El portal de cultura pop, cine, series y gaming con velocidad extrema y sin distracciones.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros" className="text-sm text-slate-500 dark:text-slate-400 hover:text-zonasyc-red transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-slate-500 dark:text-slate-400 hover:text-zonasyc-red transition-colors">
                  Políticas de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Mini Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contacto Sutil
            </h4>
            <form className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden focus-within:border-zonasyc-red transition-colors duration-300">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="bg-transparent w-full px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              />
              <button 
                type="button"
                className="bg-slate-100 dark:bg-slate-800 hover:text-zonasyc-red px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors border-l border-slate-200 dark:border-slate-700"
              >
                Enviar
              </button>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Zonasyc. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {/* Íconos sociales (Ejemplo visual con texto para mantener limpieza) */}
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-zonasyc-red transition-colors">X (Twitter)</a>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-zonasyc-red transition-colors">Instagram</a>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-zonasyc-red transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}