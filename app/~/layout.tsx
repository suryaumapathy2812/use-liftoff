import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="px-4 py-4"> 
        <main>
          <header className="h-12 flex items-center justify-between mb-4">
            <SidebarTrigger />
          </header>
          <div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}