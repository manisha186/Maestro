"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/session-context"

export function TermsModal() {
  const { tcAccepted, setTcAccepted } = useSession()
  const [scrolled, setScrolled] = useState(false)

  if (tcAccepted) return null

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 10) {
      setScrolled(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-foreground">Maestro - Terms & Conditions</h2>
          <p className="text-sm text-gray-600 mt-2">Please read and accept our terms before proceeding</p>
        </div>

        {/* Content */}
        <div onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
          <section>
            <h3 className="font-semibold text-foreground mb-2">1. Data Privacy & Security</h3>
            <p>
              All data entered in Maestro is processed locally on your device. No information is sent to external
              servers. Your financial data remains completely private and secure.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-2">2. Session Management</h3>
            <p>
              Your session is automatically cleared when you close this tab or browser window. You will need to re-enter
              your verification code on your next visit for security purposes.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-2">3. Financial Literacy Content</h3>
            <p>
              The financial literacy hub and government schemes information are provided for educational purposes only.
              Please consult with a qualified financial advisor before making investment decisions.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-2">4. Acceptable Use</h3>
            <p>
              You agree to use Maestro only for legitimate business reconciliation and financial learning purposes.
              Unauthorized access or misuse is prohibited.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-2">5. Disclaimer</h3>
            <p>
              Maestro is provided "as-is" without warranties. We are not liable for any errors, data loss, or financial
              decisions made based on this tool. Use at your own discretion.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-2">6. Changes to Terms</h3>
            <p>
              We reserve the right to update these terms at any time. Continued use of the platform constitutes
              acceptance of updated terms.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={() => window.close()} className="text-gray-700">
            Decline
          </Button>
          <Button
            onClick={() => setTcAccepted(true)}
            disabled={!scrolled}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {scrolled ? "Accept & Continue" : "Scroll to Accept"}
          </Button>
        </div>
      </div>
    </div>
  )
}
