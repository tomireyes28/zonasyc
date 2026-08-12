"use client";

import { useState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Llamamos a la acción segura del servidor
    const result = await loginAction(email, password);

    // Si devuelve un error (ej: Credenciales inválidas), lo mostramos
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zonasyc-dark flex items-center justify-center p-4">
      <div className="bg-zonasyc-card w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-700/50">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            ZONA<span className="text-zonasyc-red">SYC</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
            PANEL DE REDACCIÓN V2.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Caja de error visual */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zonasyc-red focus:ring-1 focus:ring-zonasyc-red transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zonasyc-red hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 flex justify-center items-center"
          >
            {isLoading ? "Validando..." : "Ingresar al CMS"}
          </button>
        </form>
      </div>
    </div>
  );
}