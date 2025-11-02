"use client"

import { useRecords, updateRecord } from "@/lib/recon-store"
import { useSWRConfig } from "swr"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReconciliationTable() {
  const { data } = useRecords()
  const { mutate } = useSWRConfig()
  const records = data ?? []

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2 md:flex-row">
        <CardTitle className="text-pretty">Reconciled Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">Invoice No</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">GSTIN</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Mismatches</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                    No records yet. Upload an invoice to get started.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2">{r.extracted.invoiceNo}</td>
                    <td className="px-3 py-2">{r.extracted.date}</td>
                    <td className="px-3 py-2">{r.extracted.amount.toFixed(2)}</td>
                    <td className="px-3 py-2">{r.extracted.gstin}</td>
                    <td className="px-3 py-2">
                      {r.matched && r.mismatches.length === 0 ? (
                        <Badge className="bg-primary text-primary-foreground">Matched</Badge>
                      ) : r.matched ? (
                        <Badge variant="outline">Partial</Badge>
                      ) : (
                        <Badge variant="destructive">Unmatched</Badge>
                      )}
                      {r.resolved && <span className="ml-2 text-xs text-muted-foreground">(resolved)</span>}
                    </td>
                    <td className="px-3 py-2">
                      {r.mismatches.length > 0 ? (
                        <ul className="list-inside list-disc">
                          {r.mismatches.map((m, i) => (
                            <li key={i}>{`${m.field}: expected ${m.expected} vs ${m.actual}`}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        {!r.resolved ? (
                          <Button
                            size="sm"
                            onClick={() => updateRecord(r.id, (prev) => ({ ...prev, resolved: true }), mutate)}
                          >
                            Mark resolved
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRecord(r.id, (prev) => ({ ...prev, resolved: false }), mutate)}
                          >
                            Unresolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
