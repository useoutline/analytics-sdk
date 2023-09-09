import { createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { trackEvents } from '@/methods/trackEvents'
import { getPageData } from '@/methods/getPageData'
import {
  PAGE_SESSION_KEY,
  OUTLINE_API_ENDPOINT,
  OUTLINE_VISITOR_UID_KEY,
} from '@/constants'
import { getRandomValue } from '@/methods/randomValues'

async function init(analyticsId: string, options?: InitOptions) {
  state.setState({
    analyticsId,
    debug: options?.debug,
    mock: options?.mock,
    data: options?.data,
  })
  logger.log('Initialized with id ', `"${analyticsId}"`)

  const apiVersion = options?.apiVersion || 'v1'
  const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
  createApiInstance(serverUrl, apiVersion)

  const persistedVisitorUid = localStorage.getItem(OUTLINE_VISITOR_UID_KEY)
  const visitorUid = persistedVisitorUid || `OAU-${getRandomValue()}`
  if (!persistedVisitorUid)
    localStorage.setItem(OUTLINE_VISITOR_UID_KEY, visitorUid)

  const persistedSessionId = sessionStorage.getItem(PAGE_SESSION_KEY)
  const pageSessionId = persistedSessionId || `OAS-${getRandomValue()}`
  if (!persistedSessionId)
    sessionStorage.setItem(PAGE_SESSION_KEY, pageSessionId)
  const events = await getTrackingEvents()
  state.setState({
    visitorUid,
    sessionId: pageSessionId,
    analyticsEvents: events,
  })

  startTracking()
  startPageSession()
  let pageLeftTime: number
  const maxSessionAllowed = 30 * 60 * 1000

  window.addEventListener('pagehide', () => {
    logger.log('Page hide event')
    pageLeftTime = Date.now()
    endPageSession({ meta: { event: 'pagehide' } })
  })
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      logger.log('Page show event')
      if (pageLeftTime && Date.now() - pageLeftTime > maxSessionAllowed) {
        generateNewSessionId()
      }
      startTracking()
      startPageSession()
    }
  })
  document.addEventListener('visibilitychange', () => {
    logger.log('Visibility change', document.visibilityState)
    pageLeftTime = Date.now()
    if (document.visibilityState === 'hidden') {
      endPageSession({ meta: { event: 'visibilitychange' } })
    } else {
      if (pageLeftTime && Date.now() - pageLeftTime > maxSessionAllowed) {
        generateNewSessionId()
      }
      startTracking()
      startPageSession()
    }
  })

  sendDefaultEvent('internal', 'pageview')
  enableSPATracking()

  return {
    start: startTracking,
    stop: stopTracking,
    sendEvent,
    setData: (data: Record<string, string | number>) => {
      state.setState({ data })
    },
  }
}

function generateNewSessionId() {
  const newPageSessionId = `OAS-${getRandomValue()}`
  sessionStorage.setItem(PAGE_SESSION_KEY, newPageSessionId)
  state.setState({ sessionId: newPageSessionId })
}

function startTracking() {
  state.setState({ trackingState: 'tracking' })
  logger.log('Tracking started')
  trackEvents()
}

function stopTracking() {
  state.setState({ trackingState: 'stopped' })
  logger.log('Tracking stopped')
  trackEvents({ remove: true })
}

export { init }
