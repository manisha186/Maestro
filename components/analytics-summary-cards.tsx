"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalyticsMetrics } from "@/lib/analytics-data"

interface AnalyticsSummaryCardsProps {
  metrics: AnalyticsMetrics
}

export function AnalyticsSummaryCards({ metrics }: AnalyticsSummaryCardsProps) {
  const cards = [
    {
      title: "Total Invoices Processed",
      value: metrics.totalInvoices.toLocaleString(),
      icon: "📄",
      color: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Discrepancies Found",
      value: metrics.totalDiscrepancies.toLocaleString(),
      icon: "⚠️",
      color: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Total Reconciled Amount",
      value: `₹${(metrics.totalReconciledAmount / 100000).toFixed(1)}L`,
      icon: "💰",
      color: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Mismatch Percentage",
      value: `${metrics.mismatchPercentage}%`,
      icon: "📊",
      color: "bg-yellow-50 dark:bg-yellow-950",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={`${card.color} border-0`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
