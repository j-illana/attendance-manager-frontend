export interface ProfessorAttendanceSummary {
  id: number
  nombreCompleto: string
  asistencias: number
  debeAsistir: number
  porcentajeAsistencia: number
}

export interface DashboardResponse {
  totalProfesores: number
  porcentajeAsistenciaGeneral: number
  mayorAsistencia: ProfessorAttendanceSummary[]
  menorAsistencia: ProfessorAttendanceSummary[]
}