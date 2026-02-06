"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { Provider, ResourceStatus } from "@/lib/mock-data"

interface ResourceFiltersProps {
  providers: Provider[]
  teams: string[]
  regions: string[]
  statuses: ResourceStatus[]
  selectedProviders: Provider[]
  selectedTeams: string[]
  selectedRegions: string[]
  selectedStatuses: ResourceStatus[]
  onProviderChange: (providers: Provider[]) => void
  onTeamChange: (teams: string[]) => void
  onRegionChange: (regions: string[]) => void
  onStatusChange: (statuses: ResourceStatus[]) => void
  onClearAll: () => void
}

export function ResourceFilters({
  providers,
  teams,
  regions,
  statuses,
  selectedProviders,
  selectedTeams,
  selectedRegions,
  selectedStatuses,
  onProviderChange,
  onTeamChange,
  onRegionChange,
  onStatusChange,
  onClearAll,
}: ResourceFiltersProps) {
  const hasFilters =
    selectedProviders.length > 0 ||
    selectedTeams.length > 0 ||
    selectedRegions.length > 0 ||
    selectedStatuses.length > 0

  const toggleProvider = (provider: Provider) => {
    if (selectedProviders.includes(provider)) {
      onProviderChange(selectedProviders.filter((p) => p !== provider))
    } else {
      onProviderChange([...selectedProviders, provider])
    }
  }

  const toggleTeam = (team: string) => {
    if (selectedTeams.includes(team)) {
      onTeamChange(selectedTeams.filter((t) => t !== team))
    } else {
      onTeamChange([...selectedTeams, team])
    }
  }

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionChange(selectedRegions.filter((r) => r !== region))
    } else {
      onRegionChange([...selectedRegions, region])
    }
  }

  const toggleStatus = (status: ResourceStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            Provider
            {selectedProviders.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {selectedProviders.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Cloud Providers</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {providers.map((provider) => (
            <DropdownMenuCheckboxItem
              key={provider}
              checked={selectedProviders.includes(provider)}
              onCheckedChange={() => toggleProvider(provider)}
            >
              {provider}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            Team
            {selectedTeams.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {selectedTeams.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {teams.map((team) => (
            <DropdownMenuCheckboxItem
              key={team}
              checked={selectedTeams.includes(team)}
              onCheckedChange={() => toggleTeam(team)}
            >
              {team}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            Region
            {selectedRegions.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {selectedRegions.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Regions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {regions.map((region) => (
            <DropdownMenuCheckboxItem
              key={region}
              checked={selectedRegions.includes(region)}
              onCheckedChange={() => toggleRegion(region)}
            >
              {region}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            Status
            {selectedStatuses.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selectedStatuses.includes(status)}
              onCheckedChange={() => toggleStatus(status)}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Clear all
        </Button>
      )}
    </div>
  )
}
