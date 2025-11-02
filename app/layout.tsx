import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SessionProvider } from "@/lib/session-context"
import { TermsModal } from "@/components/terms-modal"
import { PasswordEntry } from "@/components/password-entry"
import { LayoutContent } from "@/components/layout-content"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Maestro - MSME Co-Pilot",
  description: "Invoice reconciliation and financial literacy for MSMEs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <LayoutContent>{children}</LayoutContent>
            <TermsModal />
            <PasswordEntry />
          </Suspense>
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}
