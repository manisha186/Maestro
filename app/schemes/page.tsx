"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SCHEMES = [
  {
    name: "PM-MUDRA Yojana",
    description: "Provides loans up to ₹10 lakhs for non-farm businesses without collateral.",
    eligibility: "MSMEs, startups, and entrepreneurs",
    link: "https://www.mudra.org.in",
  },
  {
    name: "PMEGP",
    description: "Prime Minister Employment Generation Programme offers subsidized loans for new businesses.",
    eligibility: "Unemployed individuals, groups, and NGOs",
    link: "https://www.kviconline.gov.in",
  },
  {
    name: "CGTMSE",
    description: "Credit Guarantee Trust for Micro and Small Enterprises provides credit guarantee coverage.",
    eligibility: "MSMEs with credit facility up to ₹1 crore",
    link: "https://www.cgtmse.in",
  },
  {
    name: "MSME Udyam Registration",
    description: "Free online registration for MSMEs to get recognition and access government benefits.",
    eligibility: "All micro, small, and medium enterprises",
    link: "https://udyamregistration.gov.in",
  },
]

const UPDATES = [
  {
    title: "GST Rate Changes - October 2025",
    description: "New GST rates effective from October 1, 2025. Check if your products are affected.",
    date: "2025-10-01",
  },
  {
    title: "RBI Repo Rate Reduced",
    description: "RBI reduced repo rate by 50 bps. This may affect your borrowing costs.",
    date: "2025-10-15",
  },
  {
    title: "New Export Incentive Scheme",
    description: "Government launches new incentive scheme for MSME exporters. Apply now!",
    date: "2025-10-10",
  },
]

export default function SchemesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Government Schemes & Updates</h1>

      {/* Schemes Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Available Schemes for MSMEs</h2>
        <div className="grid gap-4">
          {SCHEMES.map((scheme, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{scheme.description}</p>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Eligibility:</p>
                  <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-primary hover:underline font-medium"
                >
                  Learn More →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Updates Section */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Economy & Policy Updates</h2>
        <div className="grid gap-4">
          {UPDATES.map((update, index) => (
            <Card key={index} className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{update.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
