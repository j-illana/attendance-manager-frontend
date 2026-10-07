import { apiFetch } from "@/lib/api"

import type {
  LoginRequest,
  UserResponse,
} from "./auth.types"

export async function login(
  credentials: LoginRequest,
): Promise<UserResponse> {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error(
      "Correo electrónico o contraseña incorrectos.",
    )
  }

  return response.json()
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiFetch("/api/auth/me")

  if (!response.ok) {
    throw new Error("No hay una sesión activa.")
  }

  return response.json()
}

export async function logout(): Promise<void> {
  const response = await apiFetch("/api/auth/logout", {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(
      "No fue posible cerrar la sesión.",
    )
  }
}