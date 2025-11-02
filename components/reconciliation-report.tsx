"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReconciliationResult, MismatchCategory } from "@/lib/reconciliation-engine"
import { Download, FileText } from "lucide-react"

interface ReconciliationReportProps {
  results: ReconciliationResult[]
  onExport?: (format: "excel" | "pdf") => void
}

export function ReconciliationReport({ results, onExport }: ReconciliationReportProps) {
  const [activeTab, setActiveTab] = useState<"matched" | "mismatched" | "missing">("matched")
  const [selectedCategory, setSelectedCategory] = useState<MismatchCategory | "all">("all")

  const matched = results.filter((r) => r.status === "matched")
  const mismatched = results.filter((r) => r.status === "mismatched")
  const missing = results.filter((r) => r.status === "missing_invoice" || r.status === "extra_invoice")

  const filteredMismatched =
    selectedCategory === "all" ? mismatched : mismatched.filter((r) => r.category === selectedCategory)

  const stats = {
    total: results.length,
    matched: matched.length,
    mismatched: mismatched.length,
    missing: missing.length,
    matchPercentage: ((matched.length / results.length) * 100).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Matched</p>
              <p className="text-2xl font-bold text-green-600">{stats.matched}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Mismatched</p>
              <p className="text-2xl font-bold text-orange-600">{stats.mismatched}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Missing</p>
              <p className="text-2xl font-bold text-red-600">{stats.missing}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reconciliation Details</CardTitle>
              <CardDescription>Match Rate: {stats.matchPercentage}%</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onExport?.("excel")} className="gap-2">
                <Download className="w-4 h-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport?.("pdf")} className="gap-2">
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("matched")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "matched"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Matched ({matched.length})
            </button>
            <button
              onClick={() => setActiveTab("mismatched")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "mismatched"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mismatched ({mismatched.length})
            </button>
            <button
              onClick={() => setActiveTab("missing")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "missing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Missing ({missing.length})
            </button>
          </div>

          {/* Category Filter for Mismatched */}
          {activeTab === "mismatched" && (
            <div className="mb-4 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {["amount_difference", "gst_difference", "date_difference", "vendor_difference", "other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as MismatchCategory)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-3">
            {activeTab === "matched" &&
              matched.map((result) => (
                <div key={result.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-green-900">{result.invoiceNumber}</p>
                      <p className="text-sm text-green-700">{result.suggestion}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">Matched</span>
                  </div>
                </div>
              ))}

            {activeTab === "mismatched" &&
              filteredMismatched.map((result) => (
                <div key={result.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-orange-900">{result.invoiceNumber}</p>
                      <p className="text-sm text-orange-700">{result.suggestion}</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-semibold rounded">
                      {result.category?.replace(/_/g, " ")}
                    </span>
                  </div>
                  {result.discrepancies.length > 0 && (
                    <div className="mt-2 text-xs text-orange-600 space-y-1">
                      {result.discrepancies.map((disc, idx) => (
                        <p key={idx}>
                          {disc.field}: Invoice {disc.invoiceValue} vs PR {disc.prValue}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {activeTab === "missing" &&
              missing.map((result) => (
                <div key={result.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-red-900">{result.invoiceNumber}</p>
                      <p className="text-sm text-red-700">{result.suggestion}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded">
                      {result.status === "missing_invoice" ? "Missing" : "Extra"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
