import {
  Users,
  ClipboardList,
  BookOpen,
  Award,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { BarChart, LineChart } from '@/components/Chart';
import { Badge } from '@/components/Badge';
import {
  profesores,
  resultadosEncuesta,
  asignaturasDictadas,
  actividadesFormacion,
  certificados,
} from '@/data/mockData';

export function DashboardView() {
  const encuestas2024 = resultadosEncuesta.filter((e) => e.semestre.startsWith('2024'));
  const promedioGeneral = (encuestas2024.reduce((sum, e) => sum + e.promedioGeneral, 0) / encuestas2024.length).toFixed(2);
  const formacionEnCurso = actividadesFormacion.filter((f) => f.estado === 'En curso');
  const formacionCompletada = actividadesFormacion.filter((f) => f.estado === 'Completada');
  const certificadosPendientes = certificados.filter((c) => c.estado === 'Pendiente');

  const promedioPorProfesor = profesores.map((p) => {
    const encuestas = resultadosEncuesta.filter((e) => e.profesorId === p.id);
    if (encuestas.length === 0) return { label: `${p.nombre.split(' ')[0]} ${p.apellido.split(' ')[0]}`, value: 0 };
    const prom = encuestas.reduce((sum, e) => sum + e.promedioGeneral, 0) / encuestas.length;
    return { label: `${p.nombre.split(' ')[0]} ${p.apellido.split(' ')[0]}`, value: prom };
  }).filter((p) => p.value > 0);

  const tendenciaEncuesta = [
    { label: '2022-2', value: 4.3 },
    { label: '2023-1', value: 4.4 },
    { label: '2023-2', value: 4.5 },
    { label: '2024-1', value: 4.6 },
    { label: '2024-2', value: 4.7 },
  ];

  const estadoProfesores = profesores.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formacionPorArea = [
    { label: 'Pedagogía', value: actividadesFormacion.filter((f) => f.area === 'Pedagogía').length, max: 10 },
    { label: 'Evaluación', value: actividadesFormacion.filter((f) => f.area === 'Evaluación').length, max: 10 },
    { label: 'Tecnología Educativa', value: actividadesFormacion.filter((f) => f.area === 'Tecnología Educativa').length, max: 10 },
    { label: 'Investigación', value: actividadesFormacion.filter((f) => f.area === 'Investigación').length, max: 10 },
    { label: 'Gestión Académica', value: actividadesFormacion.filter((f) => f.area === 'Gestión Académica').length, max: 10 },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Dashboard</h2>
        <p className="text-brand-500 text-sm mt-1">Resumen general del módulo de profesores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Profesores activos"
          value={profesores.filter((p) => p.estado === 'Activo').length}
          subtitle={`${profesores.length} académicos en total`}
        />
        <StatCard
          icon={<ClipboardList className="w-5 h-5" />}
          label="Promedio encuesta 2024"
          value={promedioGeneral}
          subtitle={`${encuestas2024.length} encuestas registradas`}
          trend="0.1 pts vs 2023"
          trendUp
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Asignaturas dictadas"
          value={asignaturasDictadas.length}
          subtitle="Histórico acumulado"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Certificados emitidos"
          value={certificados.filter((c) => c.estado === 'Generado').length}
          subtitle={`${certificadosPendientes.length} pendientes`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-brand-900">Tendencia Encuesta Docente</h3>
              <p className="text-xs text-brand-500 mt-0.5">Promedio general por semestre</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-600" />
          </div>
          <LineChart data={tendenciaEncuesta} />
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-brand-900">Promedio por profesor</h3>
              <p className="text-xs text-brand-500 mt-0.5">Encuesta docente 2024</p>
            </div>
            <Users className="w-5 h-5 text-accent-600" />
          </div>
          <BarChart data={promedioPorProfesor} color="bg-accent-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-semibold text-brand-900 mb-4">Estado de profesores</h3>
          <div className="space-y-3">
            {Object.entries(estadoProfesores).map(([estado, count]) => {
              const variant = estado === 'Activo' ? 'success' : estado === 'Sabático' ? 'accent' : estado === 'Licencia' ? 'warning' : 'neutral';
              return (
                <div key={estado} className="flex items-center justify-between">
                  <Badge variant={variant as 'success' | 'accent' | 'warning' | 'neutral'} size="sm">{estado}</Badge>
                  <span className="text-sm font-semibold text-brand-900 tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-accent-600" />
            <h3 className="font-semibold text-brand-900">Plan de Formación</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">{formacionCompletada.length} completadas</p>
                <p className="text-xs text-brand-500">actividades finalizadas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">{formacionEnCurso.length} en curso</p>
                <p className="text-xs text-brand-500">actividades en desarrollo</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-cream-200">
            <BarChart data={formacionPorArea} color="bg-accent-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-accent-600" />
            <h3 className="font-semibold text-brand-900">Actividades recientes</h3>
          </div>
          <div className="space-y-3">
            {certificados.slice(0, 5).map((c) => {
              const prof = profesores.find((p) => p.id === c.profesorId);
              return (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-accent-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-900 truncate">
                      {prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'}
                    </p>
                    <p className="text-xs text-brand-500 truncate">{c.tipo}</p>
                  </div>
                  <Badge variant={c.estado === 'Generado' ? 'success' : 'warning'} size="sm">{c.estado}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
