import { apiFetch } from "@/lib/api"

import type { Period } from "./periods.types"

export async function getPeriods(): Promise<Period[]> {
  const response = await apiFetch("/api/periodos")

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener los periodos académicos.",
    )
  }

  return response.json()
}