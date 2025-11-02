import { SAMPLE_RECORDS, type SampleRecord } from "@/lib/sample-records"

export type InvoiceExtract = {
  invoiceNo: string
  date: string // ISO yyyy-mm-dd
  amount: number
  gstin: string
  vendor?: string
  rawText?: string
}

export type Mismatch = {
  field: "invoiceNo" | "date" | "amount" | "gstin"
  expected: string | number
  actual: string | number
}

export type ReconciliationRecord = {
  id: string
  extracted: InvoiceExtract
  matched: boolean
  matchedRecord?: SampleRecord
  mismatches: Mismatch[]
  suggestions: string[]
  resolved: boolean
  createdAt: string // ISO
}

function normalizeDate(input: string): string {
  // Accept dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
  const d1 = input.match(/^(\d{2})[/-](\d{2})[/-](\d{2,4})$/)
  if (d1) {
    const [_, dd, mm, yy] = d1
    const year = yy.length === 2 ? `20${yy}` : yy
    return `${year}-${mm}-${dd}`
  }
  const iso = input.match(/^\d{4}-\d{2}-\d{2}$/)
  if (iso) return input
  // Fallback: return as-is
  return input
}

function nearlyEqual(a: number, b: number, tolerance = 1): boolean {
  return Math.abs(a - b) <= tolerance
}

function generateSuggestions(mismatches: Mismatch[], hadMatch: boolean): string[] {
  const sug: string[] = []
  if (!hadMatch) {
    sug.push("No exact invoice match found. Check if the invoice number is mistyped or missing prefix/suffix.")
  }
  for (const m of mismatches) {
    if (m.field === "amount") {
      sug.push("Amount differs slightly. Verify rounding, discounts, or tax calculations.")
    }
    if (m.field === "date") {
      sug.push("Date mismatch. Confirm invoice date vs. booking date; adjust for dd/mm vs. mm/dd.")
    }
    if (m.field === "gstin") {
      sug.push("GSTIN mismatch. Validate the 15-character GSTIN and letter case.")
    }
  }
  if (sug.length === 0) {
    sug.push("Everything looks good. Mark as resolved to archive.")
  }
  return Array.from(new Set(sug))
}

export function reconcile(extracted: InvoiceExtract, records: SampleRecord[] = SAMPLE_RECORDS): ReconciliationRecord {
  const baseId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const normalizedDate = normalizeDate(extracted.date)
  const found = records.find((r) => r.invoiceNo.toLowerCase() === extracted.invoiceNo.toLowerCase())

  const mismatches: Mismatch[] = []
  let matched = Boolean(found)
  const matchedRecord: SampleRecord | undefined = found

  if (found) {
    // date
    if (normalizeDate(found.date) !== normalizedDate) {
      mismatches.push({ field: "date", expected: found.date, actual: normalizedDate })
    }
    // amount with tolerance
    if (!nearlyEqual(found.amount, extracted.amount, 1)) {
      mismatches.push({ field: "amount", expected: found.amount, actual: extracted.amount })
    }
    // gstin
    if (found.gstin.toUpperCase() !== extracted.gstin.toUpperCase()) {
      mismatches.push({ field: "gstin", expected: found.gstin, actual: extracted.gstin })
    }
    // If significant mismatches, consider as not fully matched
    if (mismatches.length >= 2) matched = false
  } else {
    matched = false
  }

  const suggestions = generateSuggestions(mismatches, Boolean(found))

  return {
    id: baseId,
    extracted: { ...extracted, date: normalizedDate },
    matched,
    matchedRecord,
    mismatches,
    suggestions,
    resolved: matched && mismatches.length === 0, // auto-resolve if perfect
    createdAt: new Date().toISOString(),
  }
}
