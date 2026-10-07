import { apiFetch } from "@/lib/api"

import type { DashboardResponse } from "./dashboard.types"

export async function getDashboard(
  periodId: number,
): Promise<DashboardResponse> {
  const response = await apiFetch(
    `/api/dashboard?periodoId=${periodId}`,
  )

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener la información del dashboard.",
    )
  }

  return response.json()
}