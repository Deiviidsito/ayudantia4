import { useState } from 'react';
import {
  Search,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  MapPin,
  Award,
} from 'lucide-react';
import { profesores, actividadesFormacion } from '@/data/mockData';
import { Badge } from '@/components/Badge';
import { BarChart } from '@/components/BarChart';
import { StatCard } from '@/components/StatCard';
import type { ActividadFormacion } from '@/types';

const estadoVariant: Record<string, 'success' | 'warning' | 'accent' | 'error'> = {
  Completada: 'success',
  'En curso': 'warning',
  Planificada: 'accent',
  Cancelada: 'error',
};

const areaColors: Record<string, string> = {
  Pedagogía: 'bg-blue-100 text-blue-800',
  Evaluación: 'bg-green-100 text-green-800',
  'Tecnología Educativa': 'bg-accent-100 text-accent-800',
  Investigación: 'bg-purple-100 text-purple-800',
  'Gestión Académica': 'bg-teal-100 text-teal-800',
};

export function FormacionView() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroArea, setFiltroArea] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [actividadDetalle, setActividadDetalle] = useState<ActividadFormacion | null>(null);

  const estados = ['Todos', 'Completada', 'En curso', 'Planificada', 'Cancelada'];
  const areas = ['Todas', ...new Set(actividadesFormacion.map((f) => f.area))];

  const filtradas = actividadesFormacion.filter((f) => {
    const prof = profesores.find((p) => p.id === f.profesorId);
    const matchBusqueda = prof
      ? `${prof.nombre} ${prof.apellido} ${f.nombre} ${f.institucion}`.toLowerCase().includes(busqueda.toLowerCase())
      : false;
    const matchEstado = filtroEstado === 'Todos' || f.estado === filtroEstado;
    const matchArea = filtroArea === 'Todas' || f.area === filtroArea;
    return matchBusqueda && matchEstado && matchArea;
  });

  const completadas = actividadesFormacion.filter((f) => f.estado === 'Completada');
  const enCurso = actividadesFormacion.filter((f) => f.estado === 'En curso');
  const planificadas = actividadesFormacion.filter((f) => f.estado === 'Planificada');
  const totalHoras = completadas.reduce((s, f) => s + f.horas, 0);

  const areaStats = [
    { label: 'Pedagogía', value: actividadesFormacion.filter((f) => f.area === 'Pedagogía').length, max: 5 },
    { label: 'Evaluación', value: actividadesFormacion.filter((f) => f.area === 'Evaluación').length, max: 5 },
    { label: 'Tecnología', value: actividadesFormacion.filter((f) => f.area === 'Tecnología Educativa').length, max: 5 },
    { label: 'Investigación', value: actividadesFormacion.filter((f) => f.area === 'Investigación').length, max: 5 },
    { label: 'Gestión', value: actividadesFormacion.filter((f) => f.area === 'Gestión Académica').length, max: 5 },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-900">Plan de Formación Docente</h2>
          <p className="text-brand-500 text-sm mt-1">Seguimiento de actividades de formación y perfeccionamiento</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-700 text-white text-sm font-medium hover:bg-accent-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Registrar actividad
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Completadas"
          value={completadas.length}
          subtitle={`${totalHoras} hrs totales`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="En curso"
          value={enCurso.length}
          subtitle="actividades activas"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Planificadas"
          value={planificadas.length}
          subtitle="próximas actividades"
        />
        <StatCard
          icon={<GraduationCap className="w-5 h-5" />}
          label="Profesores en formación"
          value={new Set(actividadesFormacion.filter((f) => f.estado !== 'Completada').map((f) => f.profesorId)).size}
          subtitle="con actividades pendientes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm lg:col-span-1">
          <h3 className="font-semibold text-brand-900 mb-4">Actividades por área</h3>
          <BarChart data={areaStats} color="bg-accent-600" />
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-brand-900 mb-4">Profesores con más horas de formación</h3>
          <div className="space-y-3">
            {profesores.map((p) => {
              const horas = actividadesFormacion
                .filter((f) => f.profesorId === p.id && f.estado === 'Completada')
                .reduce((s, f) => s + f.horas, 0);
              const actividades = actividadesFormacion.filter((f) => f.profesorId === p.id).length;
              return (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                  <img src={p.foto} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-900 truncate">{p.nombre} {p.apellido}</p>
                    <p className="text-xs text-brand-500">{actividades} actividades</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-brand-900 tabular-nums">{horas}</span>
                    <span className="text-xs text-brand-500 ml-1">hrs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Buscar por profesor, actividad o institución..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {estados.map((e) => <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e}</option>)}
          </select>
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {areas.map((a) => <option key={a} value={a}>{a === 'Todas' ? 'Todas las áreas' : a}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtradas.map((f) => {
          const prof = profesores.find((p) => p.id === f.profesorId);
          return (
            <div
              key={f.id}
              onClick={() => setActividadDetalle(f)}
              className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm hover:shadow-md hover:border-accent-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-accent-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-900 truncate">{f.nombre}</h3>
                    <p className="text-xs text-brand-500 mt-0.5">
                      {prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'} — {f.tipo}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${areaColors[f.area] || 'bg-brand-100 text-brand-700'}`}>
                        {f.area}
                      </span>
                      <span className="text-xs text-brand-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {f.institucion}
                      </span>
                      <span className="text-xs text-brand-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {f.horas} hrs
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-brand-400">{f.fechaInicio}</p>
                    <p className="text-xs text-brand-400">→ {f.fechaFin}</p>
                  </div>
                  <Badge variant={estadoVariant[f.estado]} size="sm">{f.estado}</Badge>
                  {f.certificado && <Award className="w-4 h-4 text-accent-600 shrink-0" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtradas.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-brand-300 mx-auto mb-3" />
          <p className="text-brand-500 text-sm">No se encontraron actividades de formación.</p>
        </div>
      )}

      {showModal && <RegistrarModal onClose={() => setShowModal(false)} />}
      {actividadDetalle && <DetalleModal actividad={actividadDetalle} onClose={() => setActividadDetalle(null)} />}
    </div>
  );
}

function RegistrarModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-brand-900/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h3 className="font-semibold text-brand-900">Registrar actividad de formación</h3>
          <button onClick={onClose} className="text-brand-400 hover:text-brand-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <FormField label="Profesor">
            <select className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="">Seleccionar profesor...</option>
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Nombre de la actividad">
            <input type="text" placeholder="Ej: Taller de Evaluación Auténtica" className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <select className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="">Seleccionar...</option>
                <option>Curso</option>
                <option>Diplomado</option>
                <option>Seminario</option>
                <option>Taller</option>
                <option>Congreso</option>
                <option>Postítulo</option>
              </select>
            </FormField>
            <FormField label="Área">
              <select className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="">Seleccionar...</option>
                <option>Pedagogía</option>
                <option>Evaluación</option>
                <option>Tecnología Educativa</option>
                <option>Investigación</option>
                <option>Gestión Académica</option>
              </select>
            </FormField>
          </div>
          <FormField label="Institución">
            <input type="text" placeholder="Ej: Dirección de Docencia UC" className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Fecha inicio">
              <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </FormField>
            <FormField label="Fecha fin">
              <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </FormField>
          </div>
          <FormField label="Horas">
            <input type="number" placeholder="Ej: 40" className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </FormField>
        </div>
        <div className="px-6 py-4 border-t border-cream-200 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg bg-accent-700 text-white text-sm font-medium hover:bg-accent-800 transition-colors">
            Guardar actividad
          </button>
        </div>
      </div>
    </div>
  );
}

function DetalleModal({ actividad, onClose }: { actividad: ActividadFormacion; onClose: () => void }) {
  const prof = profesores.find((p) => p.id === actividad.profesorId);
  return (
    <div className="fixed inset-0 z-50 bg-brand-900/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent-700" />
            <h3 className="font-semibold text-brand-900">Detalle de actividad</h3>
          </div>
          <button onClick={onClose} className="text-brand-400 hover:text-brand-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-brand-900">{actividad.nombre}</h2>
            <p className="text-sm text-brand-500 mt-0.5">{prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral" size="sm">{actividad.tipo}</Badge>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${areaColors[actividad.area]}`}>
              {actividad.area}
            </span>
            <Badge variant={estadoVariant[actividad.estado]} size="sm">{actividad.estado}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cream-100">
            <InfoItem icon={<MapPin className="w-4 h-4" />} label="Institución" value={actividad.institucion} />
            <InfoItem icon={<Clock className="w-4 h-4" />} label="Duración" value={`${actividad.horas} horas`} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Fecha inicio" value={actividad.fechaInicio} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Fecha fin" value={actividad.fechaFin} />
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-cream-100">
            {actividad.certificado ? (
              <>
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm text-brand-700">Certificado de participación disponible</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-brand-400" />
                <span className="text-sm text-brand-500">Sin certificado registrado</span>
              </>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-cream-200 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-brand-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-brand-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-brand-400">{label}</p>
        <p className="text-sm font-medium text-brand-900">{value}</p>
      </div>
    </div>
  );
}
