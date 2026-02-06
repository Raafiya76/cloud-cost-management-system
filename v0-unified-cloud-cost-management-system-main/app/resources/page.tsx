"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { ResourceTable } from "@/components/resources/resource-table"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { mockResources, type Provider, type ResourceStatus } from "@/lib/mock-data"

export default function ResourcesPage() {
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ResourceStatus[]>([])

  // Extract unique values for filters
  const providers: Provider[] = ["AWS", "Azure", "GCP"]
  const teams = useMemo(
    () => [...new Set(mockResources.map((r) => r.team))].sort(),
    []
  )
  const regions = useMemo(
    () => [...new Set(mockResources.map((r) => r.region))].sort(),
    []
  )
  const statuses: ResourceStatus[] = ["Value", "Needs Review", "Waste"]

  // Filter resources
  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      if (selectedProviders.length > 0 && !selectedProviders.includes(resource.provider)) {
        return false
      }
      if (selectedTeams.length > 0 && !selectedTeams.includes(resource.team)) {
        return false
      }
      if (selectedRegions.length > 0 && !selectedRegions.includes(resource.region)) {
        return false
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(resource.status)) {
        return false
      }
      return true
    })
  }, [selectedProviders, selectedTeams, selectedRegions, selectedStatuses])

  const clearAllFilters = () => {
    setSelectedProviders([])
    setSelectedTeams([])
    setSelectedRegions([])
    setSelectedStatuses([])
  }

  return (
    <AppShell title="Resources">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium text-card-foreground">
              {filteredResources.length} resources
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Value:</span>
            <span className="font-medium text-card-foreground">
              {filteredResources.filter((r) => r.status === "Value").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Needs Review:</span>
            <span className="font-medium text-card-foreground">
              {filteredResources.filter((r) => r.status === "Needs Review").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Waste:</span>
            <span className="font-medium text-card-foreground">
              {filteredResources.filter((r) => r.status === "Waste").length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <ResourceFilters
          providers={providers}
          teams={teams}
          regions={regions}
          statuses={statuses}
          selectedProviders={selectedProviders}
          selectedTeams={selectedTeams}
          selectedRegions={selectedRegions}
          selectedStatuses={selectedStatuses}
          onProviderChange={setSelectedProviders}
          onTeamChange={setSelectedTeams}
          onRegionChange={setSelectedRegions}
          onStatusChange={setSelectedStatuses}
          onClearAll={clearAllFilters}
        />

        {/* Table */}
        <ResourceTable resources={filteredResources} />
      </div>
    </AppShell>
  )
}
