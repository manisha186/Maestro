import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid gap-6 py-8 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-balance text-3xl font-semibold md:text-4xl">Maestro: Your MSME Co-Pilot</h1>
          <p className="text-pretty text-muted-foreground">
            Reconcile invoices locally, learn financial concepts, and stay updated on government schemes—all in one
            secure, private platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href="/reconcile">Start Reconciling</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/learn">Learn Finance</Link>
            </Button>
          </div>
        </div>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">What You Get:</h3>
            <ul className="list-inside list-disc text-sm leading-relaxed space-y-2">
              <li>Local invoice reconciliation with editable fields</li>
              <li>Smart mismatch detection and alerts</li>
              <li>Financial literacy hub for MSMEs</li>
              <li>Government schemes & economy updates</li>
              <li>100% private—no data leaves your device</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
