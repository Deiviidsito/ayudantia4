import { useState } from 'react';
import { Search, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { profesores, asignaturasDictadas } from '@/data/mockData';
import { Badge } from '@/components/Badge';

export function AsignaturasView() {
  const [busqueda, setBusqueda] = useState('');
  const [profesorExpandido, setProfesorExpandido] = useState<string | null>(profesores[0]?.id ?? null);

  const profesoresConAsignaturas = profesores.map((p) => ({
    ...p,
    asignaturas: asignaturasDictadas
      .filter((a) => a.profesorId === p.id)
      .filter((a) =>
        `${a.nombre} ${a.codigo} ${a.programa}`.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort((a, b) => b.semestre.localeCompare(a.semestre)),
  })).filter((p) => busqueda === '' || p.asignaturas.length > 0 || `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Asignaturas Dictadas</h2>
        <p className="text-brand-500 text-sm mt-1">Histórico de asignaturas por profesor</p>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            placeholder="Buscar por profesor, asignatura, código o programa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {profesoresConAsignaturas.map((p) => {
          const isExpanded = profesorExpandido === p.id;
          const totalAsignaturas = p.asignaturas.length;
          const totalInscritos = p.asignaturas.reduce((s, a) => s + a.inscritos, 0);
          const totalAprobados = p.asignaturas.reduce((s, a) => s + a.aprobados, 0);
          const tasaAprobacion = totalInscritos > 0 ? Math.round((totalAprobados / totalInscritos) * 100) : 0;

          return (
            <div key={p.id} className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setProfesorExpandido(isExpanded ? null : p.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-colors text-left"
              >
                <img src={p.foto} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-900 truncate">{p.nombre} {p.apellido}</h3>
                  <p className="text-xs text-brand-500">{p.categoria} — {totalAsignaturas} asignaturas</p>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-brand-400">Inscritos</p>
                    <p className="text-lg font-bold text-brand-900 tabular-nums">{totalInscritos}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-brand-400">Aprobación</p>
                    <p className={`text-lg font-bold tabular-nums ${tasaAprobacion >= 80 ? 'text-green-700' : tasaAprobacion >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                      {tasaAprobacion}%
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-brand-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-brand-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-cream-100 slide-in">
                  {p.asignaturas.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-brand-400">Sin asignaturas que coincidan con la búsqueda.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-cream-50">
                          <tr>
                            <th className="text-left px-5 py-2.5 font-medium text-brand-600">Semestre</th>
                            <th className="text-left px-5 py-2.5 font-medium text-brand-600">Código</th>
                            <th className="text-left px-5 py-2.5 font-medium text-brand-600">Asignatura</th>
                            <th className="text-left px-5 py-2.5 font-medium text-brand-600 hidden md:table-cell">Programa</th>
                            <th className="text-center px-5 py-2.5 font-medium text-brand-600">Créd.</th>
                            <th className="text-center px-5 py-2.5 font-medium text-brand-600">Inscr.</th>
                            <th className="text-center px-5 py-2.5 font-medium text-brand-600">Aprob.</th>
                            <th className="text-center px-5 py-2.5 font-medium text-brand-600 hidden sm:table-cell">Reprob.</th>
                            <th className="text-center px-5 py-2.5 font-medium text-brand-600 hidden sm:table-cell">Retiros</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.asignaturas.map((a) => {
                            const tasa = a.inscritos > 0 ? Math.round((a.aprobados / a.inscritos) * 100) : 0;
                            return (
                              <tr key={a.id} className="border-b border-cream-50 last:border-0 hover:bg-cream-50/50 transition-colors">
                                <td className="px-5 py-3 text-brand-700 font-medium">{a.semestre}</td>
                                <td className="px-5 py-3 text-brand-600">{a.codigo}</td>
                                <td className="px-5 py-3 font-medium text-brand-900">{a.nombre}</td>
                                <td className="px-5 py-3 text-brand-600 hidden md:table-cell">{a.programa}</td>
                                <td className="px-5 py-3 text-center text-brand-600">{a.creditos}</td>
                                <td className="px-5 py-3 text-center text-brand-900 font-medium">{a.inscritos}</td>
                                <td className="px-5 py-3 text-center">
                                  <span className={`font-semibold ${tasa >= 80 ? 'text-green-700' : tasa >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                                    {a.aprobados} ({tasa}%)
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-center text-brand-600 hidden sm:table-cell">{a.reprobados}</td>
                                <td className="px-5 py-3 text-center text-brand-600 hidden sm:table-cell">{a.retiros}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {profesoresConAsignaturas.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-brand-300 mx-auto mb-3" />
          <p className="text-brand-500 text-sm">No se encontraron asignaturas.</p>
        </div>
      )}
    </div>
  );
}
