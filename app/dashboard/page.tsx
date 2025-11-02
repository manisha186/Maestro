"use client"

import { DashboardCharts } from "@/components/dashboard-charts"
import { ReconciliationTable } from "@/components/reconciliation-table"
import { AlertsPanel } from "@/components/alerts-panel"
import { Button } from "@/components/ui/button"
import { useSWRConfig } from "swr"
import { clearAll } from "@/lib/recon-store"

export default function DashboardPage() {
  const { mutate } = useSWRConfig()
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Dashboard</h1>
        <Button variant="outline" onClick={() => clearAll(mutate)}>
          Clear All
        </Button>
      </header>

      <section className="grid gap-6">
        <DashboardCharts />
        <AlertsPanel />
        <ReconciliationTable />
      </section>
    </main>
  )
}
