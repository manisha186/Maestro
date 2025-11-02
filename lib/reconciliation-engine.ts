export interface InvoiceRecord {
  id: string
  invoiceNumber: string
  date: string
  vendor: string
  amount: number
  gstAmount: number
  totalAmount: number
}

export interface PurchaseRegisterRecord {
  id: string
  invoiceNumber: string
  date: string
  vendor: string
  amount: number
  gstAmount: number
  totalAmount: number
}

export interface GSTR2BRecord {
  id: string
  invoiceNumber: string
  date: string
  vendor: string
  amount: number
  gstAmount: number
  totalAmount: number
  status: "accepted" | "pending" | "rejected"
}

export type ReconciliationStatus = "matched" | "mismatched" | "missing_invoice" | "extra_invoice"
export type MismatchCategory =
  | "amount_difference"
  | "gst_difference"
  | "date_difference"
  | "vendor_difference"
  | "other"

export interface ReconciliationResult {
  id: string
  invoiceNumber: string
  status: ReconciliationStatus
  invoiceData?: InvoiceRecord
  purchaseRegister?: PurchaseRegisterRecord
  gstr2b?: GSTR2BRecord
  discrepancies: {
    field: string
    invoiceValue: any
    prValue: any
    gstr2bValue: any
  }[]
  category?: MismatchCategory
  suggestion?: string
  resolvedAt?: string
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
}

export function reconcileDatasets(
  invoices: InvoiceRecord[],
  purchaseRegister: PurchaseRegisterRecord[],
  gstr2b: GSTR2BRecord[],
): ReconciliationResult[] {
  const results: ReconciliationResult[] = []
  const processedInvoices = new Set<string>()
  const processedPR = new Set<string>()
  const processedGSTR = new Set<string>()

  // Process all invoices
  invoices.forEach((invoice) => {
    const prMatch = purchaseRegister.find(
      (pr) => pr.invoiceNumber === invoice.invoiceNumber && pr.vendor === invoice.vendor,
    )
    const gstrMatch = gstr2b.find((g) => g.invoiceNumber === invoice.invoiceNumber && g.vendor === invoice.vendor)

    processedInvoices.add(invoice.invoiceNumber)
    if (prMatch) processedPR.add(prMatch.invoiceNumber)
    if (gstrMatch) processedGSTR.add(gstrMatch.invoiceNumber)

    const discrepancies: ReconciliationResult["discrepancies"] = []

    if (prMatch) {
      if (invoice.amount !== prMatch.amount) {
        discrepancies.push({
          field: "amount",
          invoiceValue: invoice.amount,
          prValue: prMatch.amount,
          gstr2bValue: gstrMatch?.amount,
        })
      }
      if (invoice.gstAmount !== prMatch.gstAmount) {
        discrepancies.push({
          field: "gst_amount",
          invoiceValue: invoice.gstAmount,
          prValue: prMatch.gstAmount,
          gstr2bValue: gstrMatch?.gstAmount,
        })
      }
      if (invoice.date !== prMatch.date) {
        discrepancies.push({
          field: "date",
          invoiceValue: invoice.date,
          prValue: prMatch.date,
          gstr2bValue: gstrMatch?.date,
        })
      }
    }

    const status: ReconciliationStatus =
      prMatch && !discrepancies.length ? "matched" : prMatch ? "mismatched" : "missing_invoice"

    results.push({
      id: generateId(),
      invoiceNumber: invoice.invoiceNumber,
      status,
      invoiceData: invoice,
      purchaseRegister: prMatch,
      gstr2b: gstrMatch,
      discrepancies,
      suggestion: generateSuggestion(status, discrepancies),
    })
  })

  // Find extra records in PR and GSTR2B
  purchaseRegister.forEach((pr) => {
    if (!processedPR.has(pr.invoiceNumber)) {
      results.push({
        id: generateId(),
        invoiceNumber: pr.invoiceNumber,
        status: "extra_invoice",
        purchaseRegister: pr,
        discrepancies: [],
        suggestion: "This invoice exists in Purchase Register but not in Invoice Data. Verify if it should be added.",
      })
    }
  })

  gstr2b.forEach((g) => {
    if (!processedGSTR.has(g.invoiceNumber)) {
      results.push({
        id: generateId(),
        invoiceNumber: g.invoiceNumber,
        status: "extra_invoice",
        gstr2b: g,
        discrepancies: [],
        suggestion: "This invoice exists in GSTR-2B but not in Invoice Data. Verify if it should be added.",
      })
    }
  })

  return results
}

function generateSuggestion(
  status: ReconciliationStatus,
  discrepancies: ReconciliationResult["discrepancies"],
): string {
  if (status === "matched") {
    return "All records match perfectly. No action required."
  }
  if (status === "missing_invoice") {
    return "Invoice not found in Purchase Register. Please verify and add if necessary."
  }
  if (status === "extra_invoice") {
    return "Invoice exists in Purchase Register but not in Invoice Data. Verify if it should be added."
  }
  if (discrepancies.length > 0) {
    const fields = discrepancies.map((d) => d.field).join(", ")
    return `Discrepancies found in: ${fields}. Please review and update the records.`
  }
  return "Review this record for potential issues."
}

export function getMismatchCategory(discrepancies: ReconciliationResult["discrepancies"]): MismatchCategory {
  if (discrepancies.some((d) => d.field === "amount")) return "amount_difference"
  if (discrepancies.some((d) => d.field === "gst_amount")) return "gst_difference"
  if (discrepancies.some((d) => d.field === "date")) return "date_difference"
  if (discrepancies.some((d) => d.field === "vendor")) return "vendor_difference"
  return "other"
}
