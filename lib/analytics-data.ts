// Sample analytics data for Maestro Analytics
export interface AnalyticsMetrics {
  totalInvoices: number
  totalDiscrepancies: number
  totalReconciledAmount: number
  mismatchPercentage: number
}

export interface MonthlyTrend {
  month: string
  processed: number
  reconciled: number
  discrepancies: number
}

export interface CategoryBreakdown {
  name: string
  value: number
}

export interface TimeSeriesData {
  date: string
  amount: number
  discrepancies: number
}

// Generate sample data based on time period
export function getAnalyticsData(period: "today" | "week" | "month") {
  const baseMetrics = {
    today: {
      totalInvoices: 24,
      totalDiscrepancies: 3,
      totalReconciledAmount: 145000,
      mismatchPercentage: 12.5,
    },
    week: {
      totalInvoices: 156,
      totalDiscrepancies: 18,
      totalReconciledAmount: 892500,
      mismatchPercentage: 11.5,
    },
    month: {
      totalInvoices: 487,
      totalDiscrepancies: 52,
      totalReconciledAmount: 2845000,
      mismatchPercentage: 10.7,
    },
  }

  return baseMetrics[period]
}

export const monthlyTrendData: MonthlyTrend[] = [
  { month: "Jan", processed: 120, reconciled: 108, discrepancies: 12 },
  { month: "Feb", processed: 145, reconciled: 132, discrepancies: 13 },
  { month: "Mar", processed: 168, reconciled: 155, discrepancies: 13 },
  { month: "Apr", processed: 192, reconciled: 178, discrepancies: 14 },
  { month: "May", processed: 215, reconciled: 198, discrepancies: 17 },
  { month: "Jun", processed: 243, reconciled: 225, discrepancies: 18 },
]

export const categoryBreakdown: CategoryBreakdown[] = [
  { name: "Vendor Invoices", value: 45 },
  { name: "Purchase Orders", value: 30 },
  { name: "Credit Notes", value: 15 },
  { name: "Debit Notes", value: 10 },
]

export const discrepancyTypes: CategoryBreakdown[] = [
  { name: "Amount Mismatch", value: 35 },
  { name: "Date Variance", value: 25 },
  { name: "Quantity Difference", value: 20 },
  { name: "Missing Items", value: 20 },
]

export const dailyTrendData: TimeSeriesData[] = [
  { date: "Mon", amount: 125000, discrepancies: 2 },
  { date: "Tue", amount: 142000, discrepancies: 3 },
  { date: "Wed", amount: 118000, discrepancies: 1 },
  { date: "Thu", amount: 156000, discrepancies: 4 },
  { date: "Fri", amount: 189000, discrepancies: 5 },
  { date: "Sat", amount: 95000, discrepancies: 2 },
  { date: "Sun", amount: 78000, discrepancies: 1 },
]
