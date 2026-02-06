"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import type { Resource } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ResourceTableProps {
  resources: Resource[]
}

export function ResourceTable({ resources }: ResourceTableProps) {
  const router = useRouter()

  const getStatusBadge = (status: Resource["status"]) => {
    const styles = {
      Value: "bg-success/20 text-success",
      "Needs Review": "bg-warning/20 text-warning",
      Waste: "bg-destructive/20 text-destructive",
    }
    return styles[status]
  }

  const getProviderBadge = (provider: Resource["provider"]) => {
    const styles = {
      AWS: "bg-chart-1/20 text-chart-1",
      Azure: "bg-chart-2/20 text-chart-2",
      GCP: "bg-chart-3/20 text-chart-3",
    }
    return styles[provider]
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resource ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Provider
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Region
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Owner
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Purpose
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monthly Cost
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Last Used
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resources.map((resource) => (
              <tr
                key={resource.id}
                onClick={() => router.push(`/resources/${resource.id}`)}
                className="cursor-pointer transition-colors hover:bg-secondary/30"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="font-mono text-sm text-card-foreground">
                    {resource.id}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded px-2 py-0.5 text-xs font-medium",
                      getProviderBadge(resource.provider)
                    )}
                  >
                    {resource.provider}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                  {resource.region}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-card-foreground">
                  {resource.team}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {resource.owner ? (
                    <span className="text-card-foreground">{resource.owner.split("@")[0]}</span>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-sm text-muted-foreground">
                  {resource.purpose}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-card-foreground">
                  {formatCurrency(resource.monthlyCost)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-foreground">
                  {resource.lastUsedDays === 0
                    ? "Today"
                    : `${resource.lastUsedDays} days`}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getStatusBadge(resource.status)
                    )}
                  >
                    {resource.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <ChevronRight className="inline-block h-4 w-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {resources.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No resources found matching your filters.
        </div>
      )}
    </div>
  )
}
