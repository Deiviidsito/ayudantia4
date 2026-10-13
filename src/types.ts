export type Profesor = {
  id: string;
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  categoria: 'Titular' | 'Asociado' | 'Asistente' | 'Instructor' | 'Adjunto';
  departamento: string;
  fechaIngreso: string;
  telefono: string;
  oficina: string;
  foto: string;
  estado: 'Activo' | 'Licencia' | 'Sabático' | 'Jubilado';
};

export type ResultadoEncuesta = {
  id: string;
  profesorId: string;
  semestre: string;
  asignatura: string;
  codigoAsignatura: string;
  promedioGeneral: number;
  dimensiones: {
    nombre: string;
    puntaje: number;
  }[];
  respuestas: number;
  comentario: string;
};

export type AsignaturaDictada = {
  id: string;
  profesorId: string;
  semestre: string;
  codigo: string;
  nombre: string;
  programa: string;
  creditos: number;
  inscritos: number;
  aprobados: number;
  reprobados: number;
  retiros: number;
};

export type Certificado = {
  id: string;
  profesorId: string;
  tipo: 'Docencia' | 'Formación' | 'Antigüedad' | 'Historial Académico';
  fechaEmision: string;
  codigoVerificacion: string;
  estado: 'Generado' | 'Pendiente' | 'Anulado';
  descripcion: string;
};

export type ActividadFormacion = {
  id: string;
  profesorId: string;
  nombre: string;
  tipo: 'Curso' | 'Diplomado' | 'Seminario' | 'Taller' | 'Congreso' | 'Postítulo';
  estado: 'Planificada' | 'En curso' | 'Completada' | 'Cancelada';
  fechaInicio: string;
  fechaFin: string;
  horas: number;
  institucion: string;
  certificado: boolean;
  area: 'Pedagogía' | 'Evaluación' | 'Tecnología Educativa' | 'Investigación' | 'Gestión Académica';
};

export type Vista = 'dashboard' | 'profesores' | 'encuesta' | 'asignaturas' | 'certificados' | 'formacion';
