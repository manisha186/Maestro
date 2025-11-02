export type SampleRecord = {
  id: string
  invoiceNo: string
  date: string // ISO yyyy-mm-dd
  amount: number
  gstin: string
  vendor: string
}

export const SAMPLE_RECORDS: SampleRecord[] = [
  {
    id: "rec-001",
    invoiceNo: "RR-INV-1001",
    date: "2025-09-15",
    amount: 12999.0,
    gstin: "22AAAAA0000A1Z5",
    vendor: "Acme Supplies",
  },
  {
    id: "rec-002",
    invoiceNo: "RR-INV-1002",
    date: "2025-09-20",
    amount: 2400.0,
    gstin: "27BBBBB1111B2Z6",
    vendor: "Blue Metro Traders",
  },
  {
    id: "rec-003",
    invoiceNo: "RR-INV-1003",
    date: "2025-10-01",
    amount: 4500.5,
    gstin: "07CCCCC2222C3Z7",
    vendor: "North Star Retail",
  },
]
