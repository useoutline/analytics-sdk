import { createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { removeEvents, trackEvents } from '@/methods/trackEvents'
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
  const page = getPageData()
  window.addEventListener('pagehide', () => {
    logger.log('Page hide event')
    page.meta = { event: 'pagehide' }
    endPageSession(page)
  })
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      logger.log('Page show event')
      startTracking()
      startPageSession()
    }
  })
  document.addEventListener('visibilitychange', () => {
    logger.log('Visibility change', document.visibilityState)
    if (document.visibilityState === 'hidden') {
      page.meta = { event: 'visibilitychange' }
      endPageSession(page)
    } else {
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
  }
}

function startTracking() {
  state.setState({ trackingState: 'tracking' })
  logger.log('Tracking started')
  trackEvents()
}

function stopTracking() {
  state.setState({ trackingState: 'stopped' })
  logger.log('Tracking stopped')
  removeEvents()
}

export { init }
