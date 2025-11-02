import { OCRUpload } from "@/components/ocr-upload"

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Invoice Upload</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Upload an invoice image to extract fields via OCR and reconcile against sample records.
      </p>
      <OCRUpload />
    </main>
  )
}
