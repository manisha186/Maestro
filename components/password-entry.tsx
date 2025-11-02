"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/session-context"
import { useToast } from "@/hooks/use-toast"

export function PasswordEntry() {
  const { isAuthenticated, setIsAuthenticated } = useSession()
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (code.length >= 4) {
        setIsAuthenticated(true)
        toast({
          title: "Verified",
          description: "Access granted. Your session is local and secure.",
        })
      } else {
        toast({
          title: "Invalid Code",
          description: "Please enter a valid verification code.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Required</h2>
        <p className="text-gray-600 mb-6">Enter your verification code to access Maestro</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Demo: Use any 4+ digit code</p>
          </div>

          <Button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? "Verifying..." : "Verify & Access"}
          </Button>
        </form>
      </div>
    </div>
  )
}
