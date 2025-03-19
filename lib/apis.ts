import state from '@/state'
import type { AnalyticsEvents, PageData, EventKind } from '@/types'

// Add proper type declaration
declare global {
  interface Navigator {
    brave?: {
      isBrave: Promise<() => boolean>
    }
  }
}

// Smaller detection helper for Brave browser
// Just check for the existence of the property without unnecessary polyfills
const isBraveBrowser = (): boolean => !!navigator.brave

// Smaller detection helper for Arc browser
const isArcBrowser = (): boolean => {
  try {
    return !!window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--arc-palette-title')
  } catch (e) {
    return false
  }
}

const api: {
  baseUrl: string
} = {
  baseUrl: '',
}

function createApiInstance(baseURL: string, apiVersion: string) {
  api.baseUrl = new URL(
    `${apiVersion}/${state.value.analyticsId}`,
    baseURL
  ).href
}

// Cap timeout to save bandwidth and improve UX
const API_TIMEOUT = 5000

// Optimized headers creation - avoids creating unnecessary headers
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add browser detection headers only if needed
  if (isBraveBrowser()) {
    headers['X-Outline-Browser'] = 'Brave'
  } else if (isArcBrowser()) {
    headers['X-Outline-Browser'] = 'Arc'
  }

  return headers
}

// Optimized API request with fetch timeout
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${api.baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

async function getTrackingEvents(): Promise<AnalyticsEvents> {
  try {
    const data = await apiRequest<{ events: AnalyticsEvents }>('/events', {
      method: 'GET',
    })
    return data.events
  } catch (error) {
    // Return empty array on error to prevent crashes
    console.error('Failed to fetch tracking events:', error)
    return []
  }
}

// Use more efficient payload structure
function trackEvent(
  eventType: EventKind,
  event: string,
  page?: PageData,
  data?: Record<string, string | number>
) {
  if (state.value.mock) return

  const uid = state.value.visitorUid
  const payload = {
    uid,
    event,
    type: eventType,
    capturedAt: Date.now(),
  }

  // Only add these properties if they exist to reduce payload size
  if (page) {
    // @ts-ignore
    payload.page = page
  }

  if (data) {
    // @ts-ignore
    payload.data = data
  }

  // Use beacon API for better performance when available
  // Especially beneficial when user is leaving the page
  if (navigator.sendBeacon && eventType === 'internal') {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
      navigator.sendBeacon(`${api.baseUrl}/event`, blob)
      return
    } catch (e) {
      // Fall back to fetch if beacon fails
    }
  }

  // Fall back to regular fetch
  fetch(`${api.baseUrl}/event`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getHeaders(),
  }).catch((error) => {
    // Silent fail, analytics should never break the app
  })
}

function trackSession(
  page: PageData,
  startTimestamp: number,
  endTimestamp: number
) {
  if (state.value.mock) return

  const uid = state.value.visitorUid
  const payload = {
    uid,
    page,
    visitedAt: startTimestamp,
    leftAt: endTimestamp,
    capturedAt: Date.now(),
  }

  // Add data only if it exists
  if (state.value.data) {
    // @ts-ignore
    payload.data = state.value.data
  }

  // Try to use beacon API for session data when user is leaving the page
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
      navigator.sendBeacon(`${api.baseUrl}/session`, blob)
      return
    } catch (e) {
      // Fall back to fetch if beacon fails
    }
  }

  // Fall back to regular fetch
  fetch(`${api.baseUrl}/session`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getHeaders(),
  }).catch((error) => {
    // Silent fail, analytics should never break the app
  })
}

export { createApiInstance, getTrackingEvents, trackEvent, trackSession }
