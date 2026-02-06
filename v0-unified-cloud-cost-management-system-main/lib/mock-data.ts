// Types
export type ResourceStatus = "Value" | "Needs Review" | "Waste"
export type Provider = "AWS" | "Azure" | "GCP"
export type ForecastStatus = "rising" | "stable" | "risky"

export interface Resource {
  id: string
  provider: Provider
  region: string
  team: string
  owner: string | null
  purpose: string
  monthlyCost: number
  lastUsedDays: number
  status: ResourceStatus
  type: string
  costHistory: { month: string; cost: number }[]
  usagePattern: string
  isCritical: boolean
}

export interface Alert {
  id: string
  type: "budget" | "waste" | "unassigned" | "review"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  timestamp: string
  resourceId?: string
  costImpact?: number
}

export interface Budget {
  id: string
  name: string
  allocated: number
  spent: number
  forecast: number
  team?: string
}

export interface PolicyRule {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  violations: number
}

export interface ActionItem {
  id: string
  type: "unassigned" | "inefficient" | "budget-risk" | "review"
  title: string
  reason: string
  costImpact: number
  suggestedAction: string
  resourceId?: string
  priority: "high" | "medium" | "low"
}

// Classification rules (no AI)
export function classifyResource(resource: Partial<Resource>): ResourceStatus {
  const { lastUsedDays, owner, isCritical } = resource
  
  // If overprovisioned but marked critical → Value
  if (isCritical) return "Value"
  
  // If lastUsedDays > 30 and no owner → Waste
  if (lastUsedDays && lastUsedDays > 30 && !owner) return "Waste"
  
  // If lastUsedDays > 30 with owner → Needs Review
  if (lastUsedDays && lastUsedDays > 30) return "Needs Review"
  
  // If unclear usage → Needs Review
  if (lastUsedDays && lastUsedDays > 14) return "Needs Review"
  
  return "Value"
}

// Mock Resources
export const mockResources: Resource[] = [
  {
    id: "res-001",
    provider: "AWS",
    region: "us-east-1",
    team: "Engineering",
    owner: "john.doe@company.com",
    purpose: "Production API Server",
    monthlyCost: 2450,
    lastUsedDays: 0,
    status: "Value",
    type: "EC2 Instance",
    costHistory: [
      { month: "Aug", cost: 2300 },
      { month: "Sep", cost: 2350 },
      { month: "Oct", cost: 2400 },
      { month: "Nov", cost: 2420 },
      { month: "Dec", cost: 2450 },
      { month: "Jan", cost: 2450 },
    ],
    usagePattern: "Consistent high utilization (85-95%)",
    isCritical: true,
  },
  {
    id: "res-002",
    provider: "Azure",
    region: "westus2",
    team: "Data Science",
    owner: "jane.smith@company.com",
    purpose: "ML Training Cluster",
    monthlyCost: 4800,
    lastUsedDays: 5,
    status: "Value",
    type: "Virtual Machine",
    costHistory: [
      { month: "Aug", cost: 4200 },
      { month: "Sep", cost: 4500 },
      { month: "Oct", cost: 4600 },
      { month: "Nov", cost: 4700 },
      { month: "Dec", cost: 4800 },
      { month: "Jan", cost: 4800 },
    ],
    usagePattern: "Burst usage during training jobs",
    isCritical: true,
  },
  {
    id: "res-003",
    provider: "GCP",
    region: "us-central1",
    team: "Marketing",
    owner: null,
    purpose: "Legacy Analytics DB",
    monthlyCost: 1200,
    lastUsedDays: 45,
    status: "Waste",
    type: "Cloud SQL",
    costHistory: [
      { month: "Aug", cost: 1200 },
      { month: "Sep", cost: 1200 },
      { month: "Oct", cost: 1200 },
      { month: "Nov", cost: 1200 },
      { month: "Dec", cost: 1200 },
      { month: "Jan", cost: 1200 },
    ],
    usagePattern: "No queries in 45 days",
    isCritical: false,
  },
  {
    id: "res-004",
    provider: "AWS",
    region: "eu-west-1",
    team: "DevOps",
    owner: "mike.wilson@company.com",
    purpose: "CI/CD Pipeline",
    monthlyCost: 890,
    lastUsedDays: 1,
    status: "Value",
    type: "EKS Cluster",
    costHistory: [
      { month: "Aug", cost: 750 },
      { month: "Sep", cost: 800 },
      { month: "Oct", cost: 850 },
      { month: "Nov", cost: 870 },
      { month: "Dec", cost: 890 },
      { month: "Jan", cost: 890 },
    ],
    usagePattern: "Regular daily builds and deployments",
    isCritical: true,
  },
  {
    id: "res-005",
    provider: "Azure",
    region: "eastus",
    team: "Engineering",
    owner: null,
    purpose: "Test Environment",
    monthlyCost: 650,
    lastUsedDays: 38,
    status: "Waste",
    type: "App Service",
    costHistory: [
      { month: "Aug", cost: 650 },
      { month: "Sep", cost: 650 },
      { month: "Oct", cost: 650 },
      { month: "Nov", cost: 650 },
      { month: "Dec", cost: 650 },
      { month: "Jan", cost: 650 },
    ],
    usagePattern: "Idle - no deployments in 38 days",
    isCritical: false,
  },
  {
    id: "res-006",
    provider: "GCP",
    region: "asia-east1",
    team: "Product",
    owner: "sarah.chen@company.com",
    purpose: "Customer Portal Backend",
    monthlyCost: 3200,
    lastUsedDays: 0,
    status: "Value",
    type: "Compute Engine",
    costHistory: [
      { month: "Aug", cost: 2800 },
      { month: "Sep", cost: 2900 },
      { month: "Oct", cost: 3000 },
      { month: "Nov", cost: 3100 },
      { month: "Dec", cost: 3150 },
      { month: "Jan", cost: 3200 },
    ],
    usagePattern: "High traffic, consistent load",
    isCritical: true,
  },
  {
    id: "res-007",
    provider: "AWS",
    region: "ap-south-1",
    team: "Sales",
    owner: "david.kumar@company.com",
    purpose: "CRM Integration",
    monthlyCost: 420,
    lastUsedDays: 22,
    status: "Needs Review",
    type: "Lambda Functions",
    costHistory: [
      { month: "Aug", cost: 450 },
      { month: "Sep", cost: 440 },
      { month: "Oct", cost: 430 },
      { month: "Nov", cost: 425 },
      { month: "Dec", cost: 420 },
      { month: "Jan", cost: 420 },
    ],
    usagePattern: "Declining invocations",
    isCritical: false,
  },
  {
    id: "res-008",
    provider: "Azure",
    region: "northeurope",
    team: "HR",
    owner: null,
    purpose: "Old HR Portal",
    monthlyCost: 380,
    lastUsedDays: 60,
    status: "Waste",
    type: "Web App",
    costHistory: [
      { month: "Aug", cost: 380 },
      { month: "Sep", cost: 380 },
      { month: "Oct", cost: 380 },
      { month: "Nov", cost: 380 },
      { month: "Dec", cost: 380 },
      { month: "Jan", cost: 380 },
    ],
    usagePattern: "No traffic - migrated to new system",
    isCritical: false,
  },
  {
    id: "res-009",
    provider: "GCP",
    region: "us-west1",
    team: "Engineering",
    owner: "alex.johnson@company.com",
    purpose: "Staging Database",
    monthlyCost: 1100,
    lastUsedDays: 18,
    status: "Needs Review",
    type: "Cloud Spanner",
    costHistory: [
      { month: "Aug", cost: 1000 },
      { month: "Sep", cost: 1050 },
      { month: "Oct", cost: 1080 },
      { month: "Nov", cost: 1090 },
      { month: "Dec", cost: 1100 },
      { month: "Jan", cost: 1100 },
    ],
    usagePattern: "Sporadic usage for testing",
    isCritical: false,
  },
  {
    id: "res-010",
    provider: "AWS",
    region: "us-west-2",
    team: "Data Science",
    owner: null,
    purpose: "Archived Data Storage",
    monthlyCost: 280,
    lastUsedDays: 90,
    status: "Waste",
    type: "S3 Bucket",
    costHistory: [
      { month: "Aug", cost: 280 },
      { month: "Sep", cost: 280 },
      { month: "Oct", cost: 280 },
      { month: "Nov", cost: 280 },
      { month: "Dec", cost: 280 },
      { month: "Jan", cost: 280 },
    ],
    usagePattern: "No access in 90 days",
    isCritical: false,
  },
]

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    type: "budget",
    title: "Budget threshold exceeded",
    description: "Engineering team has reached 92% of monthly budget",
    severity: "high",
    timestamp: "2026-01-31T10:30:00Z",
    costImpact: 8500,
  },
  {
    id: "alert-002",
    type: "waste",
    title: "Waste detected",
    description: "3 resources identified as waste, potential savings $2,510/month",
    severity: "medium",
    timestamp: "2026-01-31T09:15:00Z",
    costImpact: 2510,
  },
  {
    id: "alert-003",
    type: "unassigned",
    title: "Unassigned resources",
    description: "4 resources without owner assignment",
    severity: "medium",
    timestamp: "2026-01-30T14:45:00Z",
  },
  {
    id: "alert-004",
    type: "review",
    title: "Resources need review",
    description: "2 resources marked for review due to declining usage",
    severity: "low",
    timestamp: "2026-01-30T11:00:00Z",
  },
]

// Mock Budgets
export const mockBudgets: Budget[] = [
  { id: "budget-001", name: "Engineering", allocated: 15000, spent: 13800, forecast: 14500, team: "Engineering" },
  { id: "budget-002", name: "Data Science", allocated: 8000, spent: 5200, forecast: 5800, team: "Data Science" },
  { id: "budget-003", name: "DevOps", allocated: 5000, spent: 890, forecast: 950, team: "DevOps" },
  { id: "budget-004", name: "Marketing", allocated: 3000, spent: 1200, forecast: 1200, team: "Marketing" },
  { id: "budget-005", name: "Product", allocated: 6000, spent: 3200, forecast: 3400, team: "Product" },
]

// Mock Policy Rules
export const mockPolicyRules: PolicyRule[] = [
  {
    id: "policy-001",
    name: "Owner Required",
    description: "All resources must have an assigned owner",
    status: "active",
    violations: 4,
  },
  {
    id: "policy-002",
    name: "Review Inactive Resources",
    description: "Resources inactive for 30+ days require review",
    status: "active",
    violations: 3,
  },
  {
    id: "policy-003",
    name: "High-Cost Approval",
    description: "Resources exceeding $2000/month require approval",
    status: "active",
    violations: 0,
  },
  {
    id: "policy-004",
    name: "Tag Compliance",
    description: "All resources must have environment and project tags",
    status: "inactive",
    violations: 0,
  },
]

// Mock Action Items
export const mockActionItems: ActionItem[] = [
  {
    id: "action-001",
    type: "unassigned",
    title: "Assign owner to Legacy Analytics DB",
    reason: "Resource has no owner and hasn't been used in 45 days",
    costImpact: 1200,
    suggestedAction: "Assign an owner or decommission the resource",
    resourceId: "res-003",
    priority: "high",
  },
  {
    id: "action-002",
    type: "unassigned",
    title: "Assign owner to Test Environment",
    reason: "Resource has no owner and idle for 38 days",
    costImpact: 650,
    suggestedAction: "Assign an owner or terminate the environment",
    resourceId: "res-005",
    priority: "high",
  },
  {
    id: "action-003",
    type: "budget-risk",
    title: "Engineering budget at risk",
    reason: "Current spend is 92% of budget with 8 days remaining",
    costImpact: 8500,
    suggestedAction: "Review and reduce non-critical resource usage",
    priority: "high",
  },
  {
    id: "action-004",
    type: "inefficient",
    title: "Old HR Portal still running",
    reason: "Resource migrated to new system but old instance still active",
    costImpact: 380,
    suggestedAction: "Decommission the old HR portal",
    resourceId: "res-008",
    priority: "medium",
  },
  {
    id: "action-005",
    type: "review",
    title: "Review CRM Integration usage",
    reason: "Lambda invocations declining over 5 months",
    costImpact: 420,
    suggestedAction: "Verify if integration is still needed",
    resourceId: "res-007",
    priority: "low",
  },
  {
    id: "action-006",
    type: "inefficient",
    title: "Archived Data Storage unused",
    reason: "S3 bucket has no access in 90 days",
    costImpact: 280,
    suggestedAction: "Move to Glacier or delete if not needed",
    resourceId: "res-010",
    priority: "medium",
  },
]

// Daily cost trend data
export const dailyCostTrend = [
  { date: "Jan 1", cost: 480 },
  { date: "Jan 5", cost: 520 },
  { date: "Jan 10", cost: 510 },
  { date: "Jan 15", cost: 550 },
  { date: "Jan 20", cost: 580 },
  { date: "Jan 25", cost: 620 },
  { date: "Jan 30", cost: 650 },
]

// Monthly cost trend data
export const monthlyCostTrend = [
  { month: "Aug", actual: 12500, budget: 14000 },
  { month: "Sep", actual: 13200, budget: 14000 },
  { month: "Oct", actual: 13800, budget: 14500 },
  { month: "Nov", actual: 14100, budget: 15000 },
  { month: "Dec", actual: 14500, budget: 15000 },
  { month: "Jan", actual: 15370, budget: 15000 },
]

// Cost by provider
export const costByProvider = [
  { provider: "AWS", cost: 4040, percentage: 26.3 },
  { provider: "Azure", cost: 5830, percentage: 37.9 },
  { provider: "GCP", cost: 5500, percentage: 35.8 },
]

// Cost by region
export const costByRegion = [
  { region: "US East", cost: 3100 },
  { region: "US West", cost: 1380 },
  { region: "Europe", cost: 1270 },
  { region: "Asia Pacific", cost: 3620 },
]

// Team cost data
export const teamCostData = [
  { team: "Engineering", cost: 4650, budget: 15000 },
  { team: "Data Science", cost: 5080, budget: 8000 },
  { team: "DevOps", cost: 890, budget: 5000 },
  { team: "Marketing", cost: 1200, budget: 3000 },
  { team: "Product", cost: 3200, budget: 6000 },
  { team: "Sales", cost: 420, budget: 2000 },
  { team: "HR", cost: 380, budget: 1000 },
]

// Utility functions
export function getTotalCost(): number {
  return mockResources.reduce((sum, r) => sum + r.monthlyCost, 0)
}

export function getValueCost(): number {
  return mockResources.filter((r) => r.status === "Value").reduce((sum, r) => sum + r.monthlyCost, 0)
}

export function getWasteCost(): number {
  return mockResources.filter((r) => r.status === "Waste").reduce((sum, r) => sum + r.monthlyCost, 0)
}

export function getUnassignedCount(): number {
  return mockResources.filter((r) => !r.owner).length
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getBudgetStatus(spent: number, allocated: number): "safe" | "warning" | "critical" {
  const percentage = (spent / allocated) * 100
  if (percentage >= 90) return "critical"
  if (percentage >= 75) return "warning"
  return "safe"
}

export function getForecastStatus(trend: typeof monthlyCostTrend): ForecastStatus {
  const lastThree = trend.slice(-3)
  const isRising = lastThree.every((m, i) => i === 0 || m.actual > lastThree[i - 1].actual)
  const overBudget = lastThree[lastThree.length - 1].actual > lastThree[lastThree.length - 1].budget
  
  if (overBudget && isRising) return "risky"
  if (isRising) return "rising"
  return "stable"
}
