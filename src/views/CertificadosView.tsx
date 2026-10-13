import { useState } from 'react';
import {
  Search,
  Award,
  Download,
  Eye,
  ArrowLeft,
  X,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { profesores, certificados, asignaturasDictadas } from '@/data/mockData';
import { Badge } from '@/components/Badge';
import type { Certificado } from '@/types';

const estadoConfig: Record<string, { variant: 'success' | 'warning' | 'error'; icon: typeof CheckCircle2 }> = {
  Generado: { variant: 'success', icon: CheckCircle2 },
  Pendiente: { variant: 'warning', icon: Clock },
  Anulado: { variant: 'error', icon: XCircle },
};

export function CertificadosView() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [certPreview, setCertPreview] = useState<Certificado | null>(null);

  const tipos = ['Todos', ...new Set(certificados.map((c) => c.tipo))];

  const filtrados = certificados.filter((c) => {
    const prof = profesores.find((p) => p.id === c.profesorId);
    const matchBusqueda = prof
      ? `${prof.nombre} ${prof.apellido} ${c.codigoVerificacion} ${c.descripcion}`.toLowerCase().includes(busqueda.toLowerCase())
      : false;
    const matchTipo = filtroTipo === 'Todos' || c.tipo === filtroTipo;
    const matchEstado = filtroEstado === 'Todos' || c.estado === filtroEstado;
    return matchBusqueda && matchTipo && matchEstado;
  });

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Certificados</h2>
        <p className="text-brand-500 text-sm mt-1">Generación y emisión de certificados académicos</p>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Buscar por profesor, código o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {tipos.map((t) => <option key={t} value={t}>{t === 'Todos' ? 'Todos los tipos' : t}</option>)}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-900 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Generado">Generado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((c) => {
          const prof = profesores.find((p) => p.id === c.profesorId);
          const config = estadoConfig[c.estado];
          const EstadoIcon = config.icon;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm hover:shadow-md hover:border-accent-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent-700" />
                </div>
                <Badge variant={config.variant} size="sm">
                  <span className="flex items-center gap-1">
                    <EstadoIcon className="w-3 h-3" />
                    {c.estado}
                  </span>
                </Badge>
              </div>
              <h3 className="font-semibold text-brand-900">{c.tipo}</h3>
              <p className="text-sm text-brand-500 mt-0.5">{prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'}</p>
              <p className="text-xs text-brand-400 mt-2 leading-relaxed">{c.descripcion}</p>
              <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between">
                <span className="text-xs text-brand-400 font-mono">{c.codigoVerificacion}</span>
                <span className="text-xs text-brand-500">{c.fechaEmision}</span>
              </div>
              {c.estado === 'Generado' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCertPreview(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-100 text-brand-700 text-xs font-medium hover:bg-brand-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent-700 text-white text-xs font-medium hover:bg-accent-800 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Descargar
                  </button>
                </div>
              )}
              {c.estado === 'Pendiente' && (
                <button className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent-700 text-white text-xs font-medium hover:bg-accent-800 transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  Generar certificado
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-12 h-12 text-brand-300 mx-auto mb-3" />
          <p className="text-brand-500 text-sm">No se encontraron certificados.</p>
        </div>
      )}

      {certPreview && (
        <CertificadoPreview certificado={certPreview} onClose={() => setCertPreview(null)} />
      )}
    </div>
  );
}

function CertificadoPreview({ certificado, onClose }: { certificado: Certificado; onClose: () => void }) {
  const prof = profesores.find((p) => p.id === certificado.profesorId);
  const asignaturas = asignaturasDictadas.filter((a) => a.profesorId === certificado.profesorId);

  return (
    <div className="fixed inset-0 z-50 bg-brand-900/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-brand-900">Vista previa del certificado</h3>
          <button onClick={onClose} className="text-brand-400 hover:text-brand-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <div className="border-4 border-double border-accent-700 rounded-xl p-6 sm:p-10 bg-cream-50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent-700 flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-brand-500">Departamento de</p>
                  <p className="font-bold text-brand-900 text-sm">Ingeniería de Sistemas</p>
                </div>
              </div>

              <div className="w-24 h-0.5 bg-accent-700 mx-auto mb-6" />

              <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-2">CERTIFICADO</h1>
              <p className="text-accent-700 font-semibold uppercase tracking-wider text-sm">{certificado.tipo}</p>

              <div className="my-8">
                <p className="text-sm text-brand-600 leading-relaxed max-w-lg mx-auto">
                  El Departamento de Ingeniería de Sistemas certifica que el/la académico/a
                </p>
                <p className="text-xl font-bold text-brand-900 mt-3 mb-3">
                  {prof ? `${prof.nombre} ${prof.apellido}` : 'N/A'}
                </p>
                <p className="text-sm text-brand-600 leading-relaxed max-w-lg mx-auto">
                  RUT: {prof?.rut} — Categoría: {prof?.categoria}
                </p>
              </div>

              <p className="text-sm text-brand-700 leading-relaxed max-w-lg mx-auto text-left">
                {certificado.descripcion}
              </p>

              {certificado.tipo === 'Historial Académico' && asignaturas.length > 0 && (
                <div className="mt-6 text-left">
                  <p className="text-sm font-semibold text-brand-900 mb-2 text-center">Asignaturas incluidas en el certificado:</p>
                  <div className="bg-white rounded-lg p-4 border border-cream-200 max-h-48 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-cream-200">
                          <th className="text-left py-1.5 text-brand-600">Semestre</th>
                          <th className="text-left py-1.5 text-brand-600">Código</th>
                          <th className="text-left py-1.5 text-brand-600">Asignatura</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asignaturas.map((a) => (
                          <tr key={a.id} className="border-b border-cream-50 last:border-0">
                            <td className="py-1.5 text-brand-700">{a.semestre}</td>
                            <td className="py-1.5 text-brand-600">{a.codigo}</td>
                            <td className="py-1.5 text-brand-900 font-medium">{a.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center">
                  <div className="w-40 border-b border-brand-400 pb-1 mb-1" />
                  <p className="text-xs text-brand-600">Director del Departamento</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-accent-700 flex items-center justify-center">
                  <Award className="w-8 h-8 text-accent-700" />
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-brand-400 pb-1 mb-1" />
                  <p className="text-xs text-brand-600">Fecha: {certificado.fechaEmision}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-cream-200">
                <p className="text-xs text-brand-400">Código de verificación:</p>
                <p className="text-sm font-mono font-bold text-brand-700">{certificado.codigoVerificacion}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50 transition-colors"
            >
              Cerrar
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-700 text-white text-sm font-medium hover:bg-accent-800 transition-colors">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
