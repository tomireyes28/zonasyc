"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zonasyc-dark flex items-center justify-center p-4">
      {/* Tarjeta de Login (Bento-style) */}
      <div className="bg-zonasyc-card w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-700/50">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            ZONA<span className="text-zonasyc-red">SYC</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
            PANEL DE REDACCIÓN V2.0
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zonasyc-red focus:ring-1 focus:ring-zonasyc-red transition-all"
              placeholder="redactor@zonasyc.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zonasyc-red focus:ring-1 focus:ring-zonasyc-red transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zonasyc-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
          >
            Ingresar al CMS
          </button>
        </form>
      </div>
    </div>
  );
}