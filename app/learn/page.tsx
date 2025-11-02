"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FINANCE_TERMS = [
  {
    term: "Invoice",
    definition: "A document issued by a seller to a buyer requesting payment for goods or services provided.",
    example: "When you buy materials from a supplier, they send you an invoice with the amount due.",
  },
  {
    term: "GSTIN",
    definition:
      "Goods and Services Tax Identification Number - a unique 15-digit identifier for GST registration in India.",
    example: "Your business GSTIN is used to file GST returns and claim input tax credits.",
  },
  {
    term: "Reconciliation",
    definition: "The process of comparing two sets of records to ensure they match and identify discrepancies.",
    example: "Matching your invoices with bank statements to ensure all transactions are accounted for.",
  },
  {
    term: "Vendor",
    definition: "A supplier or business that provides goods or services to your company.",
    example: "Your office supplies vendor, raw material supplier, or service provider.",
  },
  {
    term: "Mismatch",
    definition: "A discrepancy between expected and actual values in financial records.",
    example: "Invoice amount in your records is ₹5000 but the vendor sent ₹5500.",
  },
  {
    term: "Cash Flow",
    definition: "The movement of money in and out of your business.",
    example: "Tracking when you receive payments from customers and when you pay suppliers.",
  },
]

export default function LearnPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Financial Literacy Hub</h1>
      <p className="text-gray-600 mb-8">Learn essential financial concepts to manage your MSME better.</p>

      <div className="grid gap-4">
        {FINANCE_TERMS.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{item.term}</span>
                <span className="text-2xl text-primary">{expandedIndex === index ? "−" : "+"}</span>
              </CardTitle>
            </CardHeader>
            {expandedIndex === index && (
              <CardContent className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Definition:</p>
                  <p className="text-sm text-gray-600">{item.definition}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                  <p className="text-sm text-gray-600">{item.example}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Pro Tips for MSMEs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>• Keep all invoices organized and reconcile regularly (weekly or monthly)</p>
          <p>• Maintain clear records of all transactions for GST compliance</p>
          <p>• Monitor cash flow to ensure you have enough working capital</p>
          <p>• Build relationships with reliable vendors for better terms</p>
          <p>• Use tools like Maestro to automate reconciliation and save time</p>
        </CardContent>
      </Card>
    </main>
  )
}
