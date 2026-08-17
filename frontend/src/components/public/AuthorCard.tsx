interface AuthorProps {
  name: string;
  avatar_url: string | null;
}

export default function AuthorCard({ name, avatar_url }: AuthorProps) {
  return (
    <div className="max-w-175 mx-auto mt-16 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left transition-colors duration-300">
      
      {/* Avatar */}
      <div className="shrink-0">
        {avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={avatar_url} 
            alt={name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-800"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 flex items-center justify-center text-white text-3xl font-black shadow-md border-2 border-white dark:border-slate-800">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <h4 className="text-sm font-bold text-zonasyc-red uppercase tracking-wider mb-1">
          Escrito por
        </h4>
        <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {name}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
          Redactor en Zonasyc. Apasionado por la cultura pop, explorando las últimas tendencias en cine, series y el mundo del gaming.
        </p>
      </div>
    </div>
  );
}