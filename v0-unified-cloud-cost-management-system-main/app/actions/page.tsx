"use client"

import { useState } from "react"
import Link from "next/link"
import {
  UserPlus,
  TrendingDown,
  AlertTriangle,
  Search,
  ChevronRight,
  Check,
  X,
} from "lucide-react"
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
import { mockActionItems, formatCurrency, type ActionItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ActionsPage() {
  const [actions, setActions] = useState(mockActionItems)
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showDismissModal, setShowDismissModal] = useState(false)

  const getTypeIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "unassigned":
        return UserPlus
      case "inefficient":
        return TrendingDown
      case "budget-risk":
        return AlertTriangle
      case "review":
        return Search
    }
  }

  const getTypeColor = (type: ActionItem["type"]) => {
    switch (type) {
      case "unassigned":
        return "bg-warning/20 text-warning"
      case "inefficient":
        return "bg-destructive/20 text-destructive"
      case "budget-risk":
        return "bg-destructive/20 text-destructive"
      case "review":
        return "bg-primary/20 text-primary"
    }
  }

  const getTypeLabel = (type: ActionItem["type"]) => {
    switch (type) {
      case "unassigned":
        return "Unassigned"
      case "inefficient":
        return "Inefficient"
      case "budget-risk":
        return "Budget Risk"
      case "review":
        return "Review"
    }
  }

  const getPriorityColor = (priority: ActionItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive"
      case "medium":
        return "bg-warning/20 text-warning"
      case "low":
        return "bg-muted text-muted-foreground"
    }
  }

  const handleTakeAction = () => {
    if (selectedAction) {
      setActions(actions.filter((a) => a.id !== selectedAction.id))
      setShowConfirmModal(false)
      setSelectedAction(null)
    }
  }

  const handleDismiss = () => {
    if (selectedAction) {
      setActions(actions.filter((a) => a.id !== selectedAction.id))
      setShowDismissModal(false)
      setSelectedAction(null)
    }
  }

  const highPriorityCount = actions.filter((a) => a.priority === "high").length
  const totalSavings = actions.reduce((sum, a) => sum + a.costImpact, 0)

  return (
    <AppShell title="Actions">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pending Actions</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {actions.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">
              {highPriorityCount}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Potential Savings</p>
            <p className="mt-1 text-2xl font-semibold text-success">
              {formatCurrency(totalSavings)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Resolved Today</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {mockActionItems.length - actions.length}
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
            All ({actions.length})
          </span>
          <span className="rounded-lg bg-warning/20 px-3 py-1.5 text-sm font-medium text-warning">
            Unassigned ({actions.filter((a) => a.type === "unassigned").length})
          </span>
          <span className="rounded-lg bg-destructive/20 px-3 py-1.5 text-sm font-medium text-destructive">
            Budget Risk ({actions.filter((a) => a.type === "budget-risk").length})
          </span>
          <span className="rounded-lg bg-destructive/20 px-3 py-1.5 text-sm font-medium text-destructive">
            Inefficient ({actions.filter((a) => a.type === "inefficient").length})
          </span>
          <span className="rounded-lg bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary">
            Review ({actions.filter((a) => a.type === "review").length})
          </span>
        </div>

        {/* Actions List */}
        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = getTypeIcon(action.type)
            return (
              <div
                key={action.id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card/80"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("rounded-lg p-2.5", getTypeColor(action.type))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">
                          {action.title}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            getTypeColor(action.type)
                          )}
                        >
                          {getTypeLabel(action.type)}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                            getPriorityColor(action.priority)
                          )}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {action.reason}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Cost Impact:</span>
                          <span className="font-medium text-card-foreground">
                            {formatCurrency(action.costImpact)}/mo
                          </span>
                        </div>
                        {action.resourceId && (
                          <Link
                            href={`/resources/${action.resourceId}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            View Resource
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                      <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                        <p className="text-sm">
                          <span className="font-medium text-card-foreground">
                            Suggested Action:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {action.suggestedAction}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedAction(action)
                        setShowConfirmModal(true)
                      }}
                      className="gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Take Action
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAction(action)
                        setShowDismissModal(true)
                      }}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {actions.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <Check className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-card-foreground">
                All actions completed!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Great job! You have addressed all pending action items.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Action Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to take action on "{selectedAction?.title}"?
              This will mark the item as resolved.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm">
                <span className="font-medium text-card-foreground">
                  Suggested Action:
                </span>{" "}
                <span className="text-muted-foreground">
                  {selectedAction.suggestedAction}
                </span>
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium text-card-foreground">
                  Potential Savings:
                </span>{" "}
                <span className="text-success">
                  {formatCurrency(selectedAction.costImpact)}/month
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false)
                setSelectedAction(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleTakeAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Modal */}
      <Dialog open={showDismissModal} onOpenChange={setShowDismissModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to dismiss "{selectedAction?.title}"? This
              will remove the item from your action list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDismissModal(false)
                setSelectedAction(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDismiss}>
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
