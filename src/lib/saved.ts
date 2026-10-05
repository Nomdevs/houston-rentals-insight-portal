import { useCallback, useState } from 'react'

const KEY = 'hr-demo-saved'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(load)
  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]))
      } catch {
        /* in-memory only */
      }
      return next
    })
  }, [])
  return { saved, toggle }
}
