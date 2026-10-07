import {
  Navigate,
  Outlet,
} from "react-router"

import { useAuth } from "./auth-context"

export function ProtectedRoute() {
  const {
    user,
    isLoading,
  } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}