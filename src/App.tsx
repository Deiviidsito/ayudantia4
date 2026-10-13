import { useState } from 'react';
import { Menu } from 'lucide-react';
import type { Vista } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/views/DashboardView';
import { ProfesoresView } from '@/views/ProfesoresView';
import { EncuestaView } from '@/views/EncuestaView';
import { AsignaturasView } from '@/views/AsignaturasView';
import { CertificadosView } from '@/views/CertificadosView';
import { FormacionView } from '@/views/FormacionView';

const titulos: Record<Vista, string> = {
  dashboard: 'Dashboard',
  profesores: 'Profesores',
  encuesta: 'Encuesta Docente',
  asignaturas: 'Asignaturas Dictadas',
  certificados: 'Certificados',
  formacion: 'Plan de Formación Docente',
};

function App() {
  const [vista, setVista] = useState<Vista>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <Sidebar
        vistaActiva={vista}
        onNavigate={setVista}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-cream-50/90 backdrop-blur border-b border-cream-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-brand-700 hover:text-accent-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-brand-900">{titulos[vista]}</h2>
              <p className="text-xs text-brand-500 hidden sm:block">Departamento de Ingeniería de Sistemas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-brand-500">Coordinación de Docencia</p>
              <p className="text-xs font-medium text-brand-700">Periodo 2024-2</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-900 flex items-center justify-center text-white text-xs font-bold">
              CD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {vista === 'dashboard' && <DashboardView />}
          {vista === 'profesores' && <ProfesoresView />}
          {vista === 'encuesta' && <EncuestaView />}
          {vista === 'asignaturas' && <AsignaturasView />}
          {vista === 'certificados' && <CertificadosView />}
          {vista === 'formacion' && <FormacionView />}
        </main>
      </div>
    </div>
  );
}

export default App;
