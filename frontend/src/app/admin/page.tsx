"use client";

// Datos estáticos (Mock) solo para poder diseñar hoy. 
// En el Día 11, esto va a desaparecer y vendrá de NestJS.
const MOCK_COLUMNS = [
  { 
    id: "IDEA", 
    title: "💡 Ideas", 
    borderColor: "border-slate-500", 
    cards: [
      { id: '1', title: 'Review de Deadpool & Wolverine', author: 'Redacción', date: '12 Ago' }
    ] 
  },
  { 
    id: "DRAFT", 
    title: "✍️ En Redacción", 
    borderColor: "border-yellow-500", 
    cards: [
      { id: '2', title: 'Anuncio de la nueva PS6', author: 'IA Virtual', date: '12 Ago' },
      { id: '3', title: 'Top 10 Series de 2026', author: 'Redacción', date: '11 Ago' }
    ] 
  },
  { 
    id: "REVIEW", 
    title: "🔎 Aprobación", 
    borderColor: "border-purple-500", 
    cards: [] 
  },
  { 
    id: "PUBLISHED", 
    title: "🚀 Publicados", 
    borderColor: "border-zonasyc-red", 
    cards: [
      { id: '4', title: 'Análisis: El final de The Boys', author: 'Redacción', date: '10 Ago' }
    ] 
  },
];

export default function AdminDashboard() {
  return (
    <div className="h-full flex flex-col">
      {/* Cabecera del Tablero */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tablero Editorial</h1>
          <p className="text-slate-400 mt-1">Gestioná el flujo de publicación de las notas.</p>
        </div>
        <button className="bg-zonasyc-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-500/20">
          + Nueva Nota
        </button>
      </div>

      {/* Grilla Kanban */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {MOCK_COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            {/* Título de la Columna */}
            <div className={`border-t-2 ${col.borderColor} pt-2 mb-4 flex items-center justify-between`}>
              <h2 className="text-slate-200 font-semibold">{col.title}</h2>
              <span className="bg-slate-800 text-slate-400 text-xs py-1 px-2 rounded-full font-medium">
                {col.cards.length}
              </span>
            </div>

            {/* Zona de Tarjetas (Cards) */}
            <div className="flex-1 space-y-3 min-h-50">
              {col.cards.map((card) => (
                <div 
                  key={card.id} 
                  className="bg-zonasyc-card border border-slate-700/50 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors group"
                >
                  <h3 className="text-white font-medium mb-3 leading-snug group-hover:text-zonasyc-red transition-colors">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${card.author === 'IA Virtual' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                      {card.author}
                    </span>
                    <span>{card.date}</span>
                  </div>
                </div>
              ))}
              
              {/* Mensaje de columna vacía */}
              {col.cards.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                  Arrastrá notas aquí
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}