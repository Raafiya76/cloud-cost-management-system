"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Shield,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  Cloud,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import {
  mockPolicyRules,
  teamCostData,
  costByRegion,
  costByProvider,
  formatCurrency,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function GovernancePage() {
  const activeRules = mockPolicyRules.filter((r) => r.status === "active")
  const totalViolations = mockPolicyRules.reduce((sum, r) => sum + r.violations, 0)

  return (
    <AppShell title="Governance">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Policies</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {mockPolicyRules.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/20 p-2">
                <ShieldCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Policies</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {activeRules.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/20 p-2">
                <ShieldX className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {totalViolations}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/20 p-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {Math.round(
                    ((mockPolicyRules.filter((r) => r.violations === 0).length /
                      mockPolicyRules.length) *
                      100)
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Accountability Views */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Team-wise Cost */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Team-wise Cost</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamCostData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="team"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Cost"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Region-wise Cost */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-chart-2" />
              <h3 className="font-semibold text-card-foreground">Region-wise Cost</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByRegion} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Cost"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provider-wise Cost */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-chart-3" />
              <h3 className="font-semibold text-card-foreground">Provider-wise Cost</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByProvider} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="provider"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Cost"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                    {costByProvider.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.provider === "AWS"
                            ? "hsl(var(--chart-1))"
                            : entry.provider === "Azure"
                              ? "hsl(var(--chart-2))"
                              : "hsl(var(--chart-3))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Policy Rules */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold text-card-foreground">Policy Rules</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Governance policies to ensure cost accountability and resource management
            </p>
          </div>
          <div className="divide-y divide-border">
            {mockPolicyRules.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      policy.status === "active"
                        ? "bg-success/20"
                        : "bg-muted"
                    )}
                  >
                    {policy.status === "active" ? (
                      <ShieldCheck className="h-5 w-5 text-success" />
                    ) : (
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-card-foreground">
                        {policy.name}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          policy.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {policy.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {policy.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {policy.violations > 0 ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        {policy.violations} violation{policy.violations > 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">
                        Compliant
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Status Summary */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Policy Compliance Summary
            </h3>
            <div className="space-y-3">
              {mockPolicyRules.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{policy.name}</span>
                  <div className="flex h-2 w-32 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full",
                        policy.violations === 0 ? "bg-success" : "bg-destructive"
                      )}
                      style={{
                        width: policy.violations === 0 ? "100%" : `${100 - policy.violations * 10}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Governance Indicators
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Resources with Owners
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  60% (6/10)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Resources under Budget
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  85%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tagged Resources
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  100%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Resources Reviewed
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  70%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
