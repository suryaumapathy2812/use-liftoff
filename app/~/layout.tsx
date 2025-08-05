import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FCFCFC]"> 
        <main className="px-6 py-6">
          <header className="h-12 flex items-center justify-between mb-6">
            <SidebarTrigger />
          </header>
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}