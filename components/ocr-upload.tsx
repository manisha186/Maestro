"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Tesseract from "tesseract.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { SAMPLE_RECORDS } from "@/lib/sample-records"
import { reconcile, type InvoiceExtract } from "@/lib/reconcile"
import { addRecord } from "@/lib/recon-store"
import { useSWRConfig } from "swr"

function parseFieldsFromText(text: string): Partial<InvoiceExtract> {
  const cleaned = text.replace(/\s+/g, " ")
  // Invoice No
  const invMatch = cleaned.match(/invoice\s*(no\.?|number)?[:\s-]*([A-Z0-9-]+)/i)
  // Date
  const dateMatch = cleaned.match(/(\b\d{2}[/-]\d{2}[/-]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b)/)
  // Amount
  const amountMatch =
    cleaned.match(/total\s*amount[:\s]*₹?\s*([0-9,]+(?:\.\d{1,2})?)/i) ||
    cleaned.match(/amount[:\s]*₹?\s*([0-9,]+(?:\.\d{1,2})?)/i)
  // GSTIN (15 chars alphanumeric)
  const gstMatch = cleaned.match(/\b[0-9A-Z]{15}\b/)

  return {
    invoiceNo: invMatch?.[2] ?? "",
    date: dateMatch?.[0] ?? "",
    amount: amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : Number.NaN,
    gstin: gstMatch?.[0] ?? "",
  }
}

export function OCRUpload() {
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draft, setDraft] = useState<InvoiceExtract>({
    invoiceNo: "",
    date: "",
    amount: Number.NaN,
    gstin: "",
    rawText: "",
  })

  async function handleOCR() {
    if (!file) return
    setError(null)
    setLoading(true)
    setProgress(0)
    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text" && m.progress) {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })
      const parsed = parseFieldsFromText(data.text || "")
      setDraft((d) => ({
        ...d,
        ...parsed,
        rawText: data.text || "",
      }))
      if (!parsed.invoiceNo) {
        setError("OCR completed, but invoice number was not detected. Please fill it in manually.")
      }
    } catch (e) {
      setError("OCR failed. You can still enter details manually.")
    } finally {
      setLoading(false)
    }
  }

  function handleReconcile() {
    if (!draft.invoiceNo || !draft.date || !draft.gstin || Number.isNaN(draft.amount)) {
      setError("Please complete all fields before reconciling.")
      return
    }
    const rec = reconcile(draft, SAMPLE_RECORDS)
    addRecord(rec, mutate)
    router.push("/dashboard")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Upload Invoice & OCR</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="file">Invoice file (JPG/PNG)</Label>
          <Input
            id="file"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-sm text-muted-foreground">
            For this prototype, please upload an image. PDFs aren’t supported yet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleOCR} disabled={!file || loading}>
            {loading ? "Running OCR..." : "Run OCR"}
          </Button>
          {loading && (
            <div className="flex w-full max-w-xs items-center gap-2">
              <Progress value={progress} aria-label="OCR progress" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid gap-4 rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Review & edit extracted fields</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input
                id="invoiceNo"
                value={draft.invoiceNo}
                onChange={(e) => setDraft((d) => ({ ...d, invoiceNo: e.target.value }))}
                placeholder="RR-INV-1001"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                placeholder="2025-10-01 or 01/10/2025"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={Number.isNaN(draft.amount) ? "" : draft.amount}
                onChange={(e) => setDraft((d) => ({ ...d, amount: Number.parseFloat(e.target.value || "0") }))}
                placeholder="4500.50"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={draft.gstin}
                onChange={(e) => setDraft((d) => ({ ...d, gstin: e.target.value.toUpperCase() }))}
                placeholder="07CCCCC2222C3Z7"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleReconcile} className="bg-primary text-primary-foreground hover:opacity-90">
              Reconcile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
