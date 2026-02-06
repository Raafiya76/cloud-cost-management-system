"use client"

import React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { TopNavbar } from "@/components/top-navbar"

interface AppShellProps {
  children: React.ReactNode
  title: string
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64">
        <TopNavbar title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
