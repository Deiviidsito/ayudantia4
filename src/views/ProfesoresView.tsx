import { useState } from 'react';
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  ChevronRight,
  X,
  Users,
} from 'lucide-react';
import { profesores, resultadosEncuesta, asignaturasDictadas, actividadesFormacion } from '@/data/mockData';
import { Badge } from '@/components/Badge';
import { BarChart } from '@/components/BarChart';
import type { Profesor } from '@/types';

const estadoVariant: Record<string, 'success' | 'warning' | 'accent' | 'neutral'> = {
  Activo: 'success',
  Licencia: 'warning',
  Sabático: 'accent',
  Jubilado: 'neutral',
};

export function ProfesoresView() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<Profesor | null>(null);

  const profesoresFiltrados = profesores.filter((p) => {
    const matchBusqueda = `${p.nombre} ${p.apellido} ${p.email}`.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    const matchEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    return matchBusqueda && matchCategoria && matchEstado;
  });

  const categorias = ['Todas', ...new Set(profesores.map((p) => p.categoria))];
  const estados = ['Todos', ...new Set(profesores.map((p) => p.estado))];

  if (profesorSeleccionado) {
    return (
      <ProfesorDetalle
        profesor={profesorSeleccionado}
        onBack={() => setProfesorSeleccionado(null)}
      />
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Profesores</h2>
        <p className="text-brand-500 text-sm mt-1">Directorio académico del departamento</p>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profesoresFiltrados.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfesorSeleccionado(p)}
            className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm hover:shadow-md hover:border-accent-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <img
                src={p.foto}
                alt={p.nombre}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-cream-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-900 truncate group-hover:text-accent-700 transition-colors">
                  {p.nombre} {p.apellido}
                </h3>
                <p className="text-xs text-brand-500 mt-0.5">{p.categoria}</p>
                <div className="mt-2">
                  <Badge variant={estadoVariant[p.estado]} size="sm">{p.estado}</Badge>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-300 group-hover:text-accent-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
            <div className="mt-4 space-y-1.5 pt-3 border-t border-cream-100">
              <div className="flex items-center gap-2 text-xs text-brand-500">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{p.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-500">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Oficina {p.oficina}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {profesoresFiltrados.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-brand-300 mx-auto mb-3" />
          <p className="text-brand-500 text-sm">No se encontraron profesores con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}

function ProfesorDetalle({ profesor, onBack }: { profesor: Profesor; onBack: () => void }) {
  const encuestas = resultadosEncuesta.filter((e) => e.profesorId === profesor.id);
  const asignaturas = asignaturasDictadas.filter((a) => a.profesorId === profesor.id);
  const formacion = actividadesFormacion.filter((f) => f.profesorId === profesor.id);

  const promedioEncuesta = encuestas.length > 0
    ? (encuestas.reduce((s, e) => s + e.promedioGeneral, 0) / encuestas.length).toFixed(2)
    : '—';

  const totalAlumnos = asignaturas.reduce((s, a) => s + a.inscritos, 0);
  const totalHorasFormacion = formacion.filter((f) => f.estado === 'Completada').reduce((s, f) => s + f.horas, 0);

  const encuestaData = encuestas.map((e) => ({ label: e.semestre, value: e.promedioGeneral })).reverse();

  return (
    <div className="space-y-6 fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-brand-600 hover:text-accent-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al listado
      </button>

      <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-900 to-brand-700 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C2410C 0%, transparent 60%)' }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <img
              src={profesor.foto}
              alt={profesor.nombre}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-brand-900">{profesor.nombre} {profesor.apellido}</h2>
              <p className="text-sm text-brand-500 mt-0.5">{profesor.categoria} — {profesor.departamento}</p>
              <div className="mt-2">
                <Badge variant={estadoVariant[profesor.estado]} size="sm">{profesor.estado}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-cream-100">
            <InfoField icon={<Mail className="w-4 h-4" />} label="Email" value={profesor.email} />
            <InfoField icon={<Phone className="w-4 h-4" />} label="Teléfono" value={profesor.telefono} />
            <InfoField icon={<MapPin className="w-4 h-4" />} label="Oficina" value={profesor.oficina} />
            <InfoField icon={<Calendar className="w-4 h-4" />} label="Fecha ingreso" value={profesor.fechaIngreso} />
          </div>

          <div className="mt-4">
            <InfoField icon={<Filter className="w-4 h-4" />} label="RUT" value={profesor.rut} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm">
          <p className="text-xs text-brand-500 font-medium">Promedio Encuesta Docente</p>
          <p className="text-3xl font-bold text-brand-900 mt-1">{promedioEncuesta}</p>
          <p className="text-xs text-brand-400 mt-1">{encuestas.length} evaluaciones</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm">
          <p className="text-xs text-brand-500 font-medium">Total asignaturas dictadas</p>
          <p className="text-3xl font-bold text-brand-900 mt-1">{asignaturas.length}</p>
          <p className="text-xs text-brand-400 mt-1">{totalAlumnos} estudiantes inscritos</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm">
          <p className="text-xs text-brand-500 font-medium">Horas de formación</p>
          <p className="text-3xl font-bold text-brand-900 mt-1">{totalHorasFormacion}</p>
          <p className="text-xs text-brand-400 mt-1">{formacion.filter((f) => f.estado === 'Completada').length} actividades completadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-semibold text-brand-900 mb-4">Evolución Encuesta Docente</h3>
          {encuestaData.length > 0 ? (
            <BarChart data={encuestaData} color="bg-accent-600" />
          ) : (
            <p className="text-sm text-brand-400">Sin datos de encuesta.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-semibold text-brand-900 mb-4">Asignaturas recientes</h3>
          <div className="space-y-3">
            {asignaturas.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">{a.nombre}</p>
                  <p className="text-xs text-brand-500">{a.codigo} — {a.semestre}</p>
                </div>
                <span className="text-xs text-brand-600 font-medium shrink-0 ml-3">{a.inscritos} inscritos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
        <h3 className="font-semibold text-brand-900 mb-4">Actividades de formación</h3>
        <div className="space-y-3">
          {formacion.length === 0 && <p className="text-sm text-brand-400">Sin actividades registradas.</p>}
          {formacion.map((f) => {
            const variant = f.estado === 'Completada' ? 'success' : f.estado === 'En curso' ? 'warning' : f.estado === 'Planificada' ? 'accent' : 'error';
            return (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">{f.nombre}</p>
                  <p className="text-xs text-brand-500">{f.tipo} — {f.institucion} — {f.horas} hrs</p>
                </div>
                <Badge variant={variant as 'success' | 'warning' | 'accent' | 'error'} size="sm">{f.estado}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
