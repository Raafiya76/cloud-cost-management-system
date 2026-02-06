"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/mock-data"

interface ProviderChartProps {
  data: { provider: string; cost: number; percentage: number }[]
}

interface RegionChartProps {
  data: { region: string; cost: number }[]
}

interface ValueWasteChartProps {
  valueCost: number
  wasteCost: number
  needsReviewCost: number
}

const COLORS = {
  aws: "hsl(var(--chart-1))",
  azure: "hsl(var(--chart-2))",
  gcp: "hsl(var(--chart-3))",
  value: "hsl(var(--success))",
  waste: "hsl(var(--destructive))",
  review: "hsl(var(--warning))",
}

export function ProviderCostChart({ data }: ProviderChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fill:
      d.provider === "AWS"
        ? COLORS.aws
        : d.provider === "Azure"
          ? COLORS.azure
          : COLORS.gcp,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-card-foreground">
        Cost by Cloud Provider
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              type="number"
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              type="category"
              dataKey="provider"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function RegionCostChart({ data }: RegionChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-card-foreground">Cost by Region</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="region"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
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
            <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ValueWastePieChart({
  valueCost,
  wasteCost,
  needsReviewCost,
}: ValueWasteChartProps) {
  const data = [
    { name: "Value", value: valueCost, color: COLORS.value },
    { name: "Waste", value: wasteCost, color: COLORS.waste },
    { name: "Needs Review", value: needsReviewCost, color: COLORS.review },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-card-foreground">
        Value vs Waste Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
