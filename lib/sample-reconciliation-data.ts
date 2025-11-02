import type { InvoiceRecord, PurchaseRegisterRecord, GSTR2BRecord } from "./reconciliation-engine"

export const sampleInvoices: InvoiceRecord[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    date: "2024-10-01",
    vendor: "ABC Supplies",
    amount: 10000,
    gstAmount: 1800,
    totalAmount: 11800,
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    date: "2024-10-05",
    vendor: "XYZ Corp",
    amount: 25000,
    gstAmount: 4500,
    totalAmount: 29500,
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    date: "2024-10-10",
    vendor: "Tech Solutions",
    amount: 15000,
    gstAmount: 2700,
    totalAmount: 17700,
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    date: "2024-10-15",
    vendor: "Global Traders",
    amount: 50000,
    gstAmount: 9000,
    totalAmount: 59000,
  },
]

export const samplePurchaseRegister: PurchaseRegisterRecord[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    date: "2024-10-01",
    vendor: "ABC Supplies",
    amount: 10000,
    gstAmount: 1800,
    totalAmount: 11800,
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    date: "2024-10-05",
    vendor: "XYZ Corp",
    amount: 25500, // Mismatch
    gstAmount: 4500,
    totalAmount: 30000,
  },
  {
    id: "3",
    invoiceNumber: "INV-005",
    date: "2024-10-12",
    vendor: "Extra Vendor",
    amount: 8000,
    gstAmount: 1440,
    totalAmount: 9440,
  },
]

export const sampleGSTR2B: GSTR2BRecord[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    date: "2024-10-01",
    vendor: "ABC Supplies",
    amount: 10000,
    gstAmount: 1800,
    totalAmount: 11800,
    status: "accepted",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    date: "2024-10-06", // Date mismatch
    vendor: "XYZ Corp",
    amount: 25000,
    gstAmount: 4500,
    totalAmount: 29500,
    status: "accepted",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    date: "2024-10-10",
    vendor: "Tech Solutions",
    amount: 15000,
    gstAmount: 2700,
    totalAmount: 17700,
    status: "pending",
  },
]
