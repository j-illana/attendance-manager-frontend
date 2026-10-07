export interface ImportExcelResponse {
  message: string
  archivo: string
  hoja: string
  filas: number
  registrosGuardados: number
  periodoId: number
}

export interface ImportExcelError {
  message: string
}

export interface ImportHistoryItem {
  id: number
  nombreArchivo: string
  fechaImportacion: string
  periodoId: number
  periodo: string
}