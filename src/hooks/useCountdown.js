import { useEffect, useState } from 'react'

function calc(target) {
  // Remaining time is computed from the absolute target timestamp, so it is
  // independent of the visitor's time zone, and it never goes below zero.
  const ms = Math.max(0, target - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0
  }
}

export function useCountdown(targetISO) {
  const target = new Date(targetISO).getTime()
  const [t, setT] = useState(() => calc(target))
  useEffect(() => {
    setT(calc(target))
    const id = setInterval(() => {
      const next = calc(target)
      setT(next)
      if (next.done) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}
