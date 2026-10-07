import { Outlet } from "react-router"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <header className="flex h-12 shrink-0 items-center gap-2">
          <SidebarTrigger className="ml-2" />
        </header>

        <div className="flex flex-1 flex-col p-2 pt-0">
          <main className="bg-background flex flex-1 rounded-xl">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}