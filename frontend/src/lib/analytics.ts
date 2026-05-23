type GTag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GTag
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params)
}
