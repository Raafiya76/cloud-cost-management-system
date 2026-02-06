"use client"

import { DollarSign, TrendingUp, Trash2, Users } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import {
  ProviderCostChart,
  RegionCostChart,
  ValueWastePieChart,
} from "@/components/dashboard/cost-charts"
import {
  getTotalCost,
  getValueCost,
  getWasteCost,
  getUnassignedCount,
  formatCurrency,
  mockAlerts,
  costByProvider,
  costByRegion,
  mockResources,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const totalCost = getTotalCost()
  const valueCost = getValueCost()
  const wasteCost = getWasteCost()
  const unassignedCount = getUnassignedCount()
  
  const needsReviewCost = mockResources
    .filter((r) => r.status === "Needs Review")
    .reduce((sum, r) => sum + r.monthlyCost, 0)

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Cloud Cost"
            value={formatCurrency(totalCost)}
            change="+5.2% from last month"
            changeType="negative"
            icon={DollarSign}
            iconColor="text-primary"
          />
          <KpiCard
            title="Value-Generating Cost"
            value={formatCurrency(valueCost)}
            change="73% of total spend"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-success"
          />
          <KpiCard
            title="Waste Cost"
            value={formatCurrency(wasteCost)}
            change="Potential savings identified"
            changeType="negative"
            icon={Trash2}
            iconColor="text-destructive"
          />
          <KpiCard
            title="Unassigned Resources"
            value={String(unassignedCount)}
            change="Require owner assignment"
            changeType="neutral"
            icon={Users}
            iconColor="text-warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <ProviderCostChart data={costByProvider} />
          <RegionCostChart data={costByRegion} />
          <ValueWastePieChart
            valueCost={valueCost}
            wasteCost={wasteCost}
            needsReviewCost={needsReviewCost}
          />
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AlertsPanel alerts={mockAlerts} />
          
          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Resources
                </span>
                <span className="font-medium text-card-foreground">
                  {mockResources.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Resources
                </span>
                <span className="font-medium text-success">
                  {mockResources.filter((r) => r.status === "Value").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Needs Review
                </span>
                <span className="font-medium text-warning">
                  {mockResources.filter((r) => r.status === "Needs Review").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Identified as Waste
                </span>
                <span className="font-medium text-destructive">
                  {mockResources.filter((r) => r.status === "Waste").length}
                </span>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Cloud Providers
                  </span>
                  <div className="flex gap-2">
                    <span className="rounded bg-chart-1/20 px-2 py-0.5 text-xs font-medium text-chart-1">
                      AWS
                    </span>
                    <span className="rounded bg-chart-2/20 px-2 py-0.5 text-xs font-medium text-chart-2">
                      Azure
                    </span>
                    <span className="rounded bg-chart-3/20 px-2 py-0.5 text-xs font-medium text-chart-3">
                      GCP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
