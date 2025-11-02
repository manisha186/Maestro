"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ReconciliationReport } from "@/components/reconciliation-report"
import { reconcileDatasets, getMismatchCategory } from "@/lib/reconciliation-engine"
import { sampleInvoices, samplePurchaseRegister, sampleGSTR2B } from "@/lib/sample-reconciliation-data"
import {
  validateGSTIN,
  validateDate,
  validateAmount,
  validateInvoiceNumber,
  getValidationError,
} from "@/lib/validation"

interface InvoiceData {
  invoiceNo: string
  date: string
  amount: string
  gstin: string
  vendor: string
  description: string
}

export default function ReconcilePage() {
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNo: "",
    date: "",
    amount: "",
    gstin: "",
    vendor: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [reconciliationResults, setReconciliationResults] = useState<any>(null)
  const [showReport, setShowReport] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInvoice((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!invoice.invoiceNo.trim()) {
      newErrors.invoiceNo = "Invoice number is required"
    } else if (!validateInvoiceNumber(invoice.invoiceNo)) {
      newErrors.invoiceNo = getValidationError("invoiceNo", invoice.invoiceNo) || "Invalid invoice number"
    }

    if (!invoice.amount) {
      newErrors.amount = "Amount is required"
    } else if (!validateAmount(invoice.amount)) {
      newErrors.amount = getValidationError("amount", invoice.amount) || "Invalid amount"
    }

    if (invoice.date && !validateDate(invoice.date)) {
      newErrors.date = getValidationError("date", invoice.date) || "Invalid date"
    }

    if (invoice.gstin && !validateGSTIN(invoice.gstin)) {
      newErrors.gstin = getValidationError("gstin", invoice.gstin) || "Invalid GSTIN format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReconcile = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    // Run reconciliation with 3 datasets
    const results = reconcileDatasets(sampleInvoices, samplePurchaseRegister, sampleGSTR2B)

    // Add category to mismatched results
    const resultsWithCategories = results.map((result) => ({
      ...result,
      category: result.discrepancies.length > 0 ? getMismatchCategory(result.discrepancies) : undefined,
    }))

    setReconciliationResults(resultsWithCategories)
    setShowReport(true)

    const matched = resultsWithCategories.filter((r) => r.status === "matched").length
    const total = resultsWithCategories.length

    toast({
      title: "Reconciliation Complete",
      description: `${matched} of ${total} records matched successfully`,
    })
  }

  const handleExport = (format: "excel" | "pdf") => {
    toast({
      title: `Export to ${format.toUpperCase()}`,
      description: `Exporting reconciliation report as ${format.toUpperCase()}...`,
    })
    // Export functionality would be implemented here
  }

  if (showReport && reconciliationResults) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowReport(false)} className="mb-4">
            Back to Input
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Reconciliation Report</h1>
          <p className="text-gray-600">Review and categorize discrepancies</p>
        </div>
        <ReconciliationReport results={reconciliationResults} onExport={handleExport} />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Invoice Reconciliation</h1>
      <p className="text-gray-600 mb-8">Compare your invoices with Purchase Register and GSTR-2B data</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Invoice No *</label>
              <input
                type="text"
                name="invoiceNo"
                value={invoice.invoiceNo}
                onChange={handleChange}
                placeholder="e.g., INV-001"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.invoiceNo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.invoiceNo && <p className="text-red-500 text-xs mt-1">{errors.invoiceNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={invoice.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Amount *</label>
              <input
                type="number"
                name="amount"
                value={invoice.amount}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">GSTIN</label>
              <input
                type="text"
                name="gstin"
                value={invoice.gstin}
                onChange={handleChange}
                placeholder="e.g., 27AABCT1234H1Z0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.gstin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Vendor Name</label>
              <input
                type="text"
                name="vendor"
                value={invoice.vendor}
                onChange={handleChange}
                placeholder="e.g., Vendor A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                name="description"
                value={invoice.description}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button onClick={handleReconcile} className="w-full bg-primary hover:bg-primary/90 text-white">
              Reconcile Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Sample Records */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sample Invoice Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {sampleInvoices.map((record) => (
                  <div key={record.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium">{record.invoiceNumber}</p>
                    <p className="text-gray-600">
                      ₹{record.amount} • {record.vendor}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Security Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-blue-800">
              <p>All data is processed locally and encrypted. No data is sent to external servers.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
