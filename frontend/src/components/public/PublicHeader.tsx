"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { name: "Cine", href: "/categoria/cine" },
  { name: "Series", href: "/categoria/series" },
  { name: "Gaming", href: "/categoria/gaming" },
  { name: "Música", href: "/categoria/musica" },
];

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Solo necesitamos theme y setTheme, chau useEffect y chau mounted
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-zonasyc-red transition-colors duration-300">
                ZONASYC
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 relative group overflow-hidden"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-zonasyc-red transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </Link>
            ))}
            
            {/* Botón Tema: Usamos CSS para ocultar/mostrar el Sol o la Luna */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {/* Ícono de Sol (Se muestra solo en Dark Mode) */}
              <svg className="hidden dark:block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {/* Ícono de Luna (Se muestra solo en Light Mode) */}
              <svg className="block dark:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-500"
            >
              <span className="hidden dark:inline">🌞</span>
              <span className="inline dark:hidden">🌙</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-zonasyc-red transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-zonasyc-red hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}