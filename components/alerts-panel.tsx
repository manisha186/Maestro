"use client"

import { useRecords, updateRecord } from "@/lib/recon-store"
import { useSWRConfig } from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AlertsPanel() {
  const { data } = useRecords()
  const { mutate } = useSWRConfig()
  const records = (data ?? []).filter((r) => !r.resolved && (r.mismatches.length > 0 || !r.matched))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Alerts & Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts. All reconciliations look good.</p>
        ) : (
          records.map((r) => (
            <div key={r.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {r.extracted.invoiceNo} — {r.matched ? "Partial match" : "No match"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.mismatches.length} mismatch{r.mismatches.length === 1 ? "" : "es"}
                  </p>
                </div>
                <Button size="sm" onClick={() => updateRecord(r.id, (prev) => ({ ...prev, resolved: true }), mutate)}>
                  Mark resolved
                </Button>
              </div>
              <ul className="mt-2 list-inside list-disc text-sm">
                {r.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
