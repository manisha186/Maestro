"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsSummaryCards } from "@/components/analytics-summary-cards"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { getAnalyticsData } from "@/lib/analytics-data"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("month")
  const metrics = getAnalyticsData(period)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maestro Analytics</h1>
          <p className="text-muted-foreground">Power BI-style insights for your reconciliation workflow</p>
        </div>

        {/* Time Period Filter */}
        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((p) => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              variant={period === p ? "default" : "outline"}
              className={period === p ? "bg-primary text-primary-foreground" : ""}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <AnalyticsSummaryCards metrics={metrics} />
      </div>

      {/* Charts Grid */}
      <div className="mb-8">
        <AnalyticsCharts />
      </div>

      {/* Power BI Branding Section */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Powered by Power BI-style Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Maestro Analytics provides real-time insights into your invoice reconciliation process. All data is
            processed locally on your device for maximum security and privacy.
          </p>
          <div className="rounded-lg border border-primary/20 bg-background p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Power BI Integration (Coming Soon)</p>
            <p className="text-sm text-foreground">
              Embed your Power BI dashboard here for advanced analytics and reporting. Contact support to set up your
              integration.
            </p>
            <div className="mt-3 h-32 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground text-sm">
              [Power BI Embed Placeholder]
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
