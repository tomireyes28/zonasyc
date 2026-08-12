import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zonasyc-dark flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        {/* Acá adentro se va a inyectar el contenido de cada página */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}