"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Star,
  Flag,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockResources, formatCurrency, classifyResource, type Resource } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [resource, setResource] = useState<Resource | undefined>(
    mockResources.find((r) => r.id === id)
  )
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showCriticalModal, setShowCriticalModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showDecommissionModal, setShowDecommissionModal] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")

  if (!resource) {
    return (
      <AppShell title="Resource Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Resource not found</p>
          <Link href="/resources" className="mt-4 text-primary hover:underline">
            Back to Resources
          </Link>
        </div>
      </AppShell>
    )
  }

  const getStatusColor = (status: Resource["status"]) => {
    switch (status) {
      case "Value":
        return "bg-success/20 text-success border-success/30"
      case "Needs Review":
        return "bg-warning/20 text-warning border-warning/30"
      case "Waste":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const getStatusIcon = (status: Resource["status"]) => {
    switch (status) {
      case "Value":
        return CheckCircle
      case "Needs Review":
        return AlertTriangle
      case "Waste":
        return Trash2
    }
  }

  const getClassificationReason = () => {
    if (resource.isCritical) {
      return "Marked as business critical - classified as Value regardless of usage patterns."
    }
    if (resource.lastUsedDays > 30 && !resource.owner) {
      return "No owner assigned and inactive for more than 30 days - classified as Waste."
    }
    if (resource.lastUsedDays > 30) {
      return "Inactive for more than 30 days - requires review to determine if still needed."
    }
    if (resource.lastUsedDays > 14) {
      return "Usage declining over the past 2 weeks - flagged for review."
    }
    return "Active resource with regular usage - classified as Value."
  }

  const handleAssignOwner = () => {
    if (ownerEmail) {
      const updatedResource = { ...resource, owner: ownerEmail }
      updatedResource.status = classifyResource(updatedResource)
      setResource(updatedResource)
      setShowAssignModal(false)
      setOwnerEmail("")
    }
  }

  const handleMarkCritical = () => {
    const updatedResource = { ...resource, isCritical: !resource.isCritical }
    updatedResource.status = classifyResource(updatedResource)
    setResource(updatedResource)
    setShowCriticalModal(false)
  }

  const handleFlagForReview = () => {
    setResource({ ...resource, status: "Needs Review" })
    setShowFlagModal(false)
  }

  const handleDecommission = () => {
    setShowDecommissionModal(false)
    router.push("/resources")
  }

  const StatusIcon = getStatusIcon(resource.status)

  return (
    <AppShell title="Resource Details">
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {resource.purpose}
            </h2>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {resource.id}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2",
              getStatusColor(resource.status)
            )}
          >
            <StatusIcon className="h-4 w-4" />
            <span className="font-medium">{resource.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Metadata Card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Resource Metadata
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Type</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.type}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Provider</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.provider}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Region</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.region}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Team</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.team}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Owner</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.owner || (
                    <span className="italic text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Monthly Cost</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {formatCurrency(resource.monthlyCost)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Last Used</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.lastUsedDays === 0
                    ? "Today"
                    : `${resource.lastUsedDays} days ago`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">
                  Business Critical
                </dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {resource.isCritical ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Cost History Chart */}
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Cost History
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resource.costHistory}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
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
                      "Cost",
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
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Usage Pattern & Classification */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Usage Pattern
            </h3>
            <p className="text-sm text-muted-foreground">
              {resource.usagePattern}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  Classification Reason
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getClassificationReason()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setShowAssignModal(true)}
            variant="outline"
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Assign Owner
          </Button>
          <Button
            onClick={() => setShowCriticalModal(true)}
            variant="outline"
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            {resource.isCritical ? "Remove Critical" : "Mark as Critical"}
          </Button>
          <Button
            onClick={() => setShowFlagModal(true)}
            variant="outline"
            className="gap-2"
          >
            <Flag className="h-4 w-4" />
            Flag for Review
          </Button>
          <Button
            onClick={() => setShowDecommissionModal(true)}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Recommend Decommission
          </Button>
        </div>
      </div>

      {/* Assign Owner Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Owner</DialogTitle>
            <DialogDescription>
              Enter the email address of the owner to assign to this resource.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="email"
              placeholder="owner@company.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignOwner} disabled={!ownerEmail}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Critical Modal */}
      <Dialog open={showCriticalModal} onOpenChange={setShowCriticalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resource.isCritical
                ? "Remove Critical Status"
                : "Mark as Business Critical"}
            </DialogTitle>
            <DialogDescription>
              {resource.isCritical
                ? "This will remove the business critical flag from this resource. It may be reclassified based on usage patterns."
                : "Marking this resource as business critical will classify it as Value regardless of usage patterns."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCriticalModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkCritical}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag for Review Modal */}
      <Dialog open={showFlagModal} onOpenChange={setShowFlagModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag for Review</DialogTitle>
            <DialogDescription>
              This will mark the resource as "Needs Review" for further
              investigation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleFlagForReview}>Flag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decommission Modal */}
      <Dialog
        open={showDecommissionModal}
        onOpenChange={setShowDecommissionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recommend Decommission</DialogTitle>
            <DialogDescription>
              This action will create a decommission recommendation for this
              resource. The estimated monthly savings would be{" "}
              {formatCurrency(resource.monthlyCost)}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDecommissionModal(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDecommission}>
              Recommend Decommission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
