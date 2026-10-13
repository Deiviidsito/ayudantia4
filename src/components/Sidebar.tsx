import type { Vista } from '@/types';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  Award,
  GraduationCap,
  X,
} from 'lucide-react';

type SidebarProps = {
  vistaActiva: Vista;
  onNavigate: (vista: Vista) => void;
  isOpen: boolean;
  onClose: () => void;
};

const menuItems: { id: Vista; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Resumen general' },
  { id: 'profesores', label: 'Profesores', icon: Users, description: 'Directorio académico' },
  { id: 'encuesta', label: 'Encuesta Docente', icon: ClipboardList, description: 'Resultados históricos' },
  { id: 'asignaturas', label: 'Asignaturas Dictadas', icon: BookOpen, description: 'Histórico de cursos' },
  { id: 'certificados', label: 'Certificados', icon: Award, description: 'Generación y emisión' },
  { id: 'formacion', label: 'Plan de Formación', icon: GraduationCap, description: 'Actividades de perfeccionamiento' },
];

export function Sidebar({ vistaActiva, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-900/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-brand-900 text-white z-40
        flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-6 border-b border-brand-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Módulo de</h1>
              <h1 className="font-bold text-base leading-tight">Profesores</h1>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-brand-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = vistaActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left
                  ${isActive
                    ? 'bg-accent-700 text-white shadow-md'
                    : 'text-brand-300 hover:bg-brand-800 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-brand-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-accent-200' : 'text-brand-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-brand-800">
          <p className="text-xs text-brand-500">Departamento de</p>
          <p className="text-xs text-brand-300 font-medium">Ingeniería de Sistemas</p>
          <p className="text-xs text-brand-600 mt-2">Prototipo navegable v1.0</p>
        </div>
      </aside>
    </>
  );
}
