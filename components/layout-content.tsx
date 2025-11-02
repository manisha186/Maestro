"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
