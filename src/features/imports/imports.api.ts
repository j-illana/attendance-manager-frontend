import { apiFetch } from "@/lib/api"

import type {
  ImportExcelResponse,
  ImportHistoryItem,
} from "./imports.types"

export async function importExcel(
  periodId: number,
  file: File,
): Promise<ImportExcelResponse> {
  const formData = new FormData()

  formData.append("archivo", file)

  const response = await apiFetch(
    `/api/importaciones/excel?periodoId=${periodId}`,
    {
      method: "POST",
      body: formData,
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible importar el archivo.",
    )
  }

  return data
}

export async function getImportHistory(
  periodId?: number,
): Promise<ImportHistoryItem[]> {
  const params = new URLSearchParams()

  if (periodId !== undefined) {
    params.set(
      "periodoId",
      periodId.toString(),
    )
  }

  const query = params.toString()

  const response = await apiFetch(
    query
      ? `/api/importaciones?${query}`
      : "/api/importaciones",
  )

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener el historial de importaciones.",
    )
  }

  return response.json()
}