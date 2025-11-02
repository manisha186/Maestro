"use client"

import { useMemo } from "react"
import { useRecords } from "@/lib/recon-store"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatDate(d: string) {
  return d.slice(0, 10)
}

export function DashboardCharts() {
  const { data } = useRecords()
  const records = data ?? []

  const { byDay, accuracyOverTime, totals } = useMemo(() => {
    const dayMap = new Map<string, { total: number; perfect: number; partial: number; unmatched: number }>()
    for (const r of records) {
      const day = formatDate(r.createdAt)
      const entry = dayMap.get(day) ?? { total: 0, perfect: 0, partial: 0, unmatched: 0 }
      entry.total += 1
      if (r.matched && r.mismatches.length === 0) entry.perfect += 1
      else if (r.matched) entry.partial += 1
      else entry.unmatched += 1
      dayMap.set(day, entry)
    }
    const byDayArr = Array.from(dayMap.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({ date, ...v }))
    const accuracy = byDayArr.map((d) => ({
      date: d.date,
      accuracy: d.total ? Math.round((d.perfect / d.total) * 100) : 0,
    }))
    const totals = byDayArr.reduce(
      (acc, d) => {
        acc.total += d.total
        acc.perfect += d.perfect
        acc.partial += d.partial
        acc.unmatched += d.unmatched
        return acc
      },
      { total: 0, perfect: 0, partial: 0, unmatched: 0 },
    )
    return { byDay: byDayArr, accuracyOverTime: accuracy, totals }
  }, [records])

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle className="text-pretty">Reconciliation Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="var(--muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="var(--chart-1)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-pretty">Daily Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="total" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-pretty">Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Total processed</span>
            <span className="font-semibold">{totals.total}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Perfect matches</span>
            <span className="font-semibold text-primary">{totals.perfect}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Partial matches</span>
            <span className="font-semibold">{totals.partial}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Unmatched</span>
            <span className="font-semibold text-accent-foreground bg-accent/40 rounded px-2 py-0.5">
              {totals.unmatched}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
