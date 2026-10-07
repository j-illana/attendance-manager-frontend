export interface ProfessorSummary {
  id: number
  nombreCompleto: string
  cantidadNrc: number
  porcentajeAsistencia: number
}

export interface ProfessorAttendanceSummary {
  asistencias: number
  justificantes: number
  inasistenciasSinJustificar: number
  debeAsistir: number
  porcentajeAsistencia: number
}

export interface ProfessorSchedule {
  id: number
  clavesProgramas: string
  nrc: string
  claveMateria: string
  materia: string
  seccion: string | null
  dia: string
  horaInicio: string
  horaFin: string
  salon: string
  asistencias: number
  debeAsistir: number
  justificantes: number
  porcentajeAsistencia: number
}

export interface ProfessorDetail {
  id: number
  nombre: string
  segundoNombre: string | null
  apellidoPaterno: string
  apellidoMaterno: string | null
  nombreCompleto: string
  resumen: ProfessorAttendanceSummary
  horarios: ProfessorSchedule[]
}