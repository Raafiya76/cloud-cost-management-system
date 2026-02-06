"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Server,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Server },
  { name: "Budgets & Trends", href: "/budgets", icon: TrendingUp },
  { name: "Governance", href: "/governance", icon: Shield },
  { name: "Actions", href: "/actions", icon: Zap },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">CL</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">CostLens</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Main
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-muted-foreground">Environment</p>
          <p className="mt-1 text-sm font-medium text-sidebar-foreground">Production</p>
        </div>
      </div>
    </aside>
  )
}
