import { useState } from 'react';
import { Search, ClipboardList, ChevronRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { profesores, resultadosEncuesta } from '@/data/mockData';
import { Badge } from '@/components/Badge';
import { BarChart } from '@/components/BarChart';
import type { ResultadoEncuesta } from '@/types';

function colorNota(nota: number): 'success' | 'warning' | 'error' {
  if (nota >= 4.5) return 'success';
  if (nota >= 4.0) return 'warning';
  return 'error';
}

export function EncuestaView() {
  const [busqueda, setBusqueda] = useState('');
  const [semestreFiltro, setSemestreFiltro] = useState('Todos');
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState<ResultadoEncuesta | null>(null);

  const semestres = ['Todos', ...new Set(resultadosEncuesta.map((e) => e.semestre))].sort().reverse();

  const filtrados = resultadosEncuesta.filter((e) => {
    const prof = profesores.find((p) => p.id === e.profesorId);
    const matchBusqueda = prof
      ? `${prof.nombre} ${prof.apellido} ${e.asignatura} ${e.codigoAsignatura}`.toLowerCase().includes(busqueda.toLowerCase())
      : false;
    const matchSemestre = semestreFiltro === 'Todos' || e.semestre === semestreFiltro;
    return matchBusqueda && matchSemestre;
  });

  if (resultadoSeleccionado) {
    return <DetalleEncuesta resultado={resultadoSeleccionado} onBack={() => setResultadoSeleccionado(null)} />;
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Encuesta Docente</h2>
        <p className="text-brand-500 text-sm mt-1">Resultados históricos de la evaluación docente</p>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Buscar por profesor, asignatura o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <select
            value={semestreFiltro}
            onChange={(e) => setSemestreFiltro(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {semestres.map((s) => <option key={s} value={s}>{s === 'Todos' ? 'Todos los semestres' : s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 border-b border-cream-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-brand-700">Profesor</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-700">Asignatura</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-700 hidden md:table-cell">Semestre</th>
                <th className="text-center px-4 py-3 font-semibold text-brand-700">Promedio</th>
                <th className="text-center px-4 py-3 font-semibold text-brand-700 hidden sm:table-cell">Respuestas</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((e) => {
                const prof = profesores.find((p) => p.id === e.profesorId);
                return (
                  <tr
                    key={e.id}
                    onClick={() => setResultadoSeleccionado(e)}
                    className="border-b border-cream-100 last:border-0 hover:bg-cream-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {prof && (
                          <img src={prof.foto} alt="" className="w-8 h-8 rounded-full object-cover" />
                        )}
                        <span className="font-medium text-brand-900">
                          {prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-900 font-medium">{e.asignatura}</p>
                      <p className="text-xs text-brand-500">{e.codigoAsignatura}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-600 hidden md:table-cell">{e.semestre}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-12 py-1 rounded-md font-bold text-sm ${
                        e.promedioGeneral >= 4.5 ? 'bg-green-100 text-green-800' : e.promedioGeneral >= 4.0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {e.promedioGeneral.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-brand-600 hidden sm:table-cell">{e.respuestas}</td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-brand-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-10 h-10 text-brand-300 mx-auto mb-2" />
            <p className="text-sm text-brand-500">No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetalleEncuesta({ resultado, onBack }: { resultado: ResultadoEncuesta; onBack: () => void }) {
  const prof = profesores.find((p) => p.id === resultado.profesorId);
  const dimensionesData = resultado.dimensiones.map((d) => ({ label: d.nombre, value: d.puntaje, max: 5 }));

  return (
    <div className="space-y-6 fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-brand-600 hover:text-accent-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista
      </button>

      <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {prof && (
            <img src={prof.foto} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-cream-200" />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand-900">{resultado.asignatura}</h2>
            <p className="text-sm text-brand-500 mt-0.5">
              {prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'} — {resultado.codigoAsignatura}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="neutral" size="sm">{resultado.semestre}</Badge>
              <span className="text-xs text-brand-500">{resultado.respuestas} respuestas</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-brand-500 font-medium">Promedio general</p>
            <p className={`text-4xl font-bold ${resultado.promedioGeneral >= 4.5 ? 'text-green-700' : resultado.promedioGeneral >= 4.0 ? 'text-amber-700' : 'text-red-700'}`}>
              {resultado.promedioGeneral.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-semibold text-brand-900 mb-4">Evaluación por dimensión</h3>
          <BarChart data={dimensionesData} color="bg-accent-600" unit="" />
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-accent-600" />
            <h3 className="font-semibold text-brand-900">Comentario destacado</h3>
          </div>
          <div className="bg-cream-50 rounded-lg p-4 border-l-4 border-accent-600">
            <p className="text-sm text-brand-700 italic leading-relaxed">"{resultado.comentario}"</p>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-brand-900 mb-3">Resumen de dimensiones</h4>
            <div className="grid grid-cols-2 gap-3">
              {resultado.dimensiones.map((d) => (
                <div key={d.nombre} className="bg-cream-50 rounded-lg p-3">
                  <p className="text-xs text-brand-500">{d.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-brand-900">{d.puntaje.toFixed(1)}</span>
                    <Badge variant={colorNota(d.puntaje)} size="sm">
                      {d.puntaje >= 4.5 ? 'Destacado' : d.puntaje >= 4.0 ? 'Adecuado' : 'A mejorar'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
