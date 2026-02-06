"use client"

import { Bell, ChevronDown, Search, User, Settings, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { mockAlerts } from "@/lib/mock-data"

interface TopNavbarProps {
  title: string
}

export function TopNavbar({ title }: TopNavbarProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <TrendingUp className="h-4 w-4 text-warning" />
      case "waste":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "governance":
        return <Users className="h-4 w-4 text-chart-1" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const activeAlerts = mockAlerts.filter(a => a.status === "active")

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            className="h-9 w-64 rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              Production
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Production</DropdownMenuItem>
            <DropdownMenuItem>Staging</DropdownMenuItem>
            <DropdownMenuItem>Development</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {activeAlerts.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border p-3">
              <h4 className="font-semibold text-card-foreground">Notifications</h4>
              <p className="text-xs text-muted-foreground">{activeAlerts.length} active alerts</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {activeAlerts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No active notifications
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex gap-3 border-b border-border p-3 last:border-0 hover:bg-muted/50">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{alert.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-border p-2">
              <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary p-0 text-primary-foreground hover:bg-primary/90">
              JD
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-card-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john.doe@company.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
