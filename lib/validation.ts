export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin.toUpperCase())
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export function validateAmount(amount: string): boolean {
  const num = Number.parseFloat(amount)
  return !isNaN(num) && num > 0
}

export function validateInvoiceNumber(invoiceNo: string): boolean {
  return invoiceNo.trim().length > 0 && invoiceNo.length <= 50
}

export function getValidationError(field: string, value: string): string | null {
  switch (field) {
    case "gstin":
      return value && !validateGSTIN(value) ? "Invalid GSTIN format (15 characters)" : null
    case "date":
      return value && !validateDate(value) ? "Invalid date format" : null
    case "amount":
      return value && !validateAmount(value) ? "Amount must be a positive number" : null
    case "invoiceNo":
      return value && !validateInvoiceNumber(value) ? "Invalid invoice number" : null
    default:
      return null
  }
}
