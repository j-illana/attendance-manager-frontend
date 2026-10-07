import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router"

import Layout from "@/app/layout"

import { AuthProvider } from "@/features/auth/auth-context"
import { ProtectedRoute } from "@/features/auth/protected-route"
import { PublicRoute } from "@/features/auth/public-route"

import Dashboard from "@/features/dashboard/pages/dashboard-page"
import ImportHistoryPage from "@/features/imports/pages/import-history-page"
import ImportPage from "@/features/imports/pages/import-page"
import LoginPage from "@/features/auth/pages/login-page"
import ProfessorDetailPage from "@/features/professors/pages/professor-detail-page"
import ProfessorsPage from "@/features/professors/pages/professors-page"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route
              path="/login"
              element={<LoginPage />}
            />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/profesores"
                element={<ProfessorsPage />}
              />

              <Route
                path="/profesores/:id"
                element={<ProfessorDetailPage />}
              />

              <Route
                path="/importaciones"
                element={<ImportPage />}
              />

              <Route
                path="/historial"
                element={<ImportHistoryPage />}
              />
            </Route>
          </Route>

          {/* Ruta desconocida */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App