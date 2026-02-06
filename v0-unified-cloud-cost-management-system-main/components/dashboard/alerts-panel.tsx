"use client"

import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Alert } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityIcon = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return AlertTriangle
      case "medium":
        return AlertCircle
      default:
        return Info
    }
  }

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10"
      case "medium":
        return "text-warning bg-warning/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold text-card-foreground">Recent Alerts</h3>
        <Link
          href="/actions"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {alerts.map((alert) => {
          const Icon = getSeverityIcon(alert.severity)
          return (
            <div key={alert.id} className="flex items-start gap-3 p-4">
              <div
                className={cn(
                  "rounded-lg p-2",
                  getSeverityColor(alert.severity)
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground">{alert.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {alert.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatTime(alert.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
