"use client"

import useSWR, { type useSWRConfig } from "swr"
import type { ReconciliationRecord } from "@/lib/reconcile"

const STORAGE_KEY = "recon:records"

function safeRead(): ReconciliationRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ReconciliationRecord[]) : []
  } catch {
    return []
  }
}

function safeWrite(records: ReconciliationRecord[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function useRecords() {
  return useSWR<ReconciliationRecord[]>(STORAGE_KEY, async () => safeRead(), {
    fallbackData: [],
  })
}

export function addRecord(record: ReconciliationRecord, mutate?: ReturnType<typeof useSWRConfig>["mutate"]) {
  const cur = safeRead()
  safeWrite([...cur, record])
  mutate?.(STORAGE_KEY)
}

export function updateRecord(
  id: string,
  updater: (r: ReconciliationRecord) => ReconciliationRecord,
  mutate?: ReturnType<typeof useSWRConfig>["mutate"],
) {
  const cur = safeRead()
  const next = cur.map((r) => (r.id === id ? updater(r) : r))
  safeWrite(next)
  mutate?.(STORAGE_KEY)
}

export function clearAll(mutate?: ReturnType<typeof useSWRConfig>["mutate"]) {
  safeWrite([])
  mutate?.(STORAGE_KEY)
}
