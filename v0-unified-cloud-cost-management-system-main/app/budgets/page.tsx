"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import {
  mockBudgets,
  dailyCostTrend,
  monthlyCostTrend,
  formatCurrency,
  getBudgetStatus,
  getForecastStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function BudgetsPage() {
  const forecastStatus = getForecastStatus(monthlyCostTrend)
  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0)
  const overallStatus = getBudgetStatus(totalSpent, totalBudget)

  const budgetWithStatus = mockBudgets.map((b) => ({
    ...b,
    status: getBudgetStatus(b.spent, b.allocated),
    percentage: Math.round((b.spent / b.allocated) * 100),
  }))

  return (
    <AppShell title="Budgets & Trends">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {formatCurrency(totalBudget)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Monthly allocation</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Current Spend</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {formatCurrency(totalSpent)}
            </p>
            <p
              className={cn(
                "mt-2 text-sm",
                overallStatus === "critical"
                  ? "text-destructive"
                  : overallStatus === "warning"
                    ? "text-warning"
                    : "text-success"
              )}
            >
              {Math.round((totalSpent / totalBudget) * 100)}% of budget used
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Forecast Status</p>
            <div className="mt-1 flex items-center gap-2">
              {forecastStatus === "risky" ? (
                <>
                  <TrendingUp className="h-6 w-6 text-destructive" />
                  <span className="text-xl font-semibold text-destructive">
                    At Risk
                  </span>
                </>
              ) : forecastStatus === "rising" ? (
                <>
                  <TrendingUp className="h-6 w-6 text-warning" />
                  <span className="text-xl font-semibold text-warning">
                    Rising
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-6 w-6 text-success" />
                  <span className="text-xl font-semibold text-success">
                    Stable
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Based on trends</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Teams Over Budget</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {budgetWithStatus.filter((b) => b.status === "critical").length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              of {mockBudgets.length} teams
            </p>
          </div>
        </div>

        {/* Budget vs Actual Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold text-card-foreground">
            Budget vs Actual Cost (Monthly)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCostTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "actual" ? "Actual" : "Budget",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>
                      {value === "actual" ? "Actual Cost" : "Budget"}
                    </span>
                  )}
                />
                <Bar
                  dataKey="actual"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill="hsl(var(--muted))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Cost Trend */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Daily Cost Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyCostTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Daily Cost",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Threshold Progress */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Budget Thresholds
            </h3>
            <div className="space-y-4">
              {budgetWithStatus.map((budget) => (
                <div key={budget.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      {budget.name}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        budget.status === "critical"
                          ? "text-destructive"
                          : budget.status === "warning"
                            ? "text-warning"
                            : "text-muted-foreground"
                      )}
                    >
                      {budget.percentage}%
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full rounded-full transition-all",
                        budget.status === "critical"
                          ? "bg-destructive"
                          : budget.status === "warning"
                            ? "bg-warning"
                            : "bg-success"
                      )}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                    {/* Threshold markers */}
                    <div className="absolute top-0 h-full w-px bg-muted-foreground/30" style={{ left: "50%" }} />
                    <div className="absolute top-0 h-full w-px bg-muted-foreground/30" style={{ left: "75%" }} />
                    <div className="absolute top-0 h-full w-px bg-muted-foreground/30" style={{ left: "90%" }} />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(budget.spent)}</span>
                    <span>{formatCurrency(budget.allocated)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Early Warning Alerts */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold text-card-foreground">
            Early Warning Alerts
          </h3>
          <div className="space-y-3">
            {budgetWithStatus
              .filter((b) => b.status === "critical" || b.status === "warning")
              .map((budget) => (
                <div
                  key={budget.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4",
                    budget.status === "critical"
                      ? "border-destructive/30 bg-destructive/10"
                      : "border-warning/30 bg-warning/10"
                  )}
                >
                  {budget.status === "critical" ? (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        budget.status === "critical"
                          ? "text-destructive"
                          : "text-warning"
                      )}
                    >
                      {budget.name} team at {budget.percentage}% of budget
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {budget.status === "critical"
                        ? "Critical: Budget threshold exceeded 90%. Immediate action required."
                        : "Warning: Budget approaching 75% threshold. Review spending."}
                    </p>
                  </div>
                </div>
              ))}
            {budgetWithStatus.filter(
              (b) => b.status === "critical" || b.status === "warning"
            ).length === 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-success">All teams within budget thresholds</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
