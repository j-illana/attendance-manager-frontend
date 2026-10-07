import { apiFetch } from "@/lib/api"

import type {
  ProfessorSummary,
  ProfessorDetail,
} from "./professors.types"

interface GetProfessorsParams {
  periodId: number
  search?: string
}

export async function getProfessors({
  periodId,
  search,
}: GetProfessorsParams): Promise<ProfessorSummary[]> {
  const params = new URLSearchParams({
    periodoId: periodId.toString(),
  })

  if (search?.trim()) {
    params.set(
      "buscar",
      search.trim(),
    )
  }

  const response = await apiFetch(
    `/api/profesores?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener los profesores.",
    )
  }

  return response.json()
}

export async function getProfessor(
  professorId: number,
  periodId: number,
): Promise<ProfessorDetail> {
  const response = await apiFetch(
    `/api/profesores/${professorId}?periodoId=${periodId}`,
  )

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener la información del profesor.",
    )
  }

  return response.json()
}