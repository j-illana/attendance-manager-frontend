import {
  NavLink,
  useNavigate,
} from "react-router"

import { LogOut } from "lucide-react"

import { useAuth } from "@/features/auth/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const navigate = useNavigate()
  const {
    user,
    logout,
  } = useAuth()

  async function handleLogout() {
    try {
      await logout()

      navigate("/login", {
        replace: true,
      })
    } catch {
      // Más adelante podemos mostrar un mensaje de error.
    }
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="px-2 py-2">
          <p className="font-semibold">
            Gestor de asistencia
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Administración
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink
                  to="/"
                  end
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                    >
                      Inicio
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/profesores">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                    >
                      Profesores
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/importaciones">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                    >
                      Importar Excel
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/historial">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                    >
                      Historial
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">
                {user?.nombre}{" "}
                {user?.apellidoPaterno}
              </p>

              <p className="text-muted-foreground truncate text-xs">
                {user?.correo}
              </p>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
            >
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}