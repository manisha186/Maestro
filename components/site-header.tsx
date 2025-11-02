"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/session-context"

export function SiteHeader() {
  const pathname = usePathname()
  const { tcAccepted, isAuthenticated } = useSession()

  if (!tcAccepted || !isAuthenticated) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-balance text-lg font-semibold">Maestro</span>
          </Link>
        </div>
      </header>
    )
  }

  const linkClass = (path: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      pathname === path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
    )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span className="text-balance text-lg font-semibold">Maestro</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <Link href="/reconcile" className={linkClass("/reconcile")}>
            Reconcile
          </Link>
          <Link href="/learn" className={linkClass("/learn")}>
            Learn Finance
          </Link>
          <Link href="/schemes" className={linkClass("/schemes")}>
            Schemes & Updates
          </Link>
          <Link href="/analytics" className={linkClass("/analytics")}>
            Analytics
          </Link>
        </nav>
        <div className="hidden md:block">
          <Button asChild variant="default">
            <Link href="/reconcile">Start Reconciling</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
