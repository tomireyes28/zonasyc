"use client"; 

export default function NewsletterBlock() {
  return (
    <section className="py-20 mt-12 bg-slate-950 text-center relative overflow-hidden">
      {/* Círculo de fondo sutil para dar textura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-zonasyc-red/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <span className="inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest text-zonasyc-red bg-red-950/30 rounded-full border border-red-900/50">
          Zonasyc Insider
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          Lo mejor de la cultura pop, <br className="hidden md:block" />
          directo en tu correo.
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Sumate a nuestra comunidad y recibí un resumen semanal con las noticias y reseñas que realmente importan. Sin spam, garantizado.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            required
            className="flex-1 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-zonasyc-red focus:ring-1 focus:ring-zonasyc-red transition-all"
          />
          <button 
            type="submit"
            className="bg-zonasyc-red hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors duration-300"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}