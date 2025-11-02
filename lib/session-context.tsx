"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface SessionContextType {
  tcAccepted: boolean
  setTcAccepted: (value: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [tcAccepted, setTcAccepted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("reconcile")

  useEffect(() => {
    const stored = localStorage.getItem("maestro_session")
    if (stored) {
      const session = JSON.parse(stored)
      setTcAccepted(session.tcAccepted || false)
      setIsAuthenticated(session.isAuthenticated || false)
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem("maestro_session")
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  useEffect(() => {
    localStorage.setItem("maestro_session", JSON.stringify({ tcAccepted, isAuthenticated }))
  }, [tcAccepted, isAuthenticated])

  return (
    <SessionContext.Provider
      value={{
        tcAccepted,
        setTcAccepted,
        isAuthenticated,
        setIsAuthenticated,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    return {
      tcAccepted: false,
      setTcAccepted: () => {},
      isAuthenticated: false,
      setIsAuthenticated: () => {},
      currentPage: "reconcile",
      setCurrentPage: () => {},
    }
  }
  return context
}
