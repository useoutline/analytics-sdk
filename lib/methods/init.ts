import { createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { trackEvents } from '@/methods/trackEvents'
import {
  PAGE_SESSION_KEY,
  OUTLINE_API_ENDPOINT,
  OUTLINE_VISITOR_UID_KEY,
} from '@/constants'
import { getRandomValue } from '@/methods/randomValues'

let isAlreadyInitialized = false

async function init(analyticsId: string, options?: InitOptions) {
  let hasErrored = false
  if (!isAlreadyInitialized) {
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

    let sessionId = sessionStorage.getItem(PAGE_SESSION_KEY)
    try {
      const events = await getTrackingEvents()
      if (!sessionId) sessionId = generateNewSessionId()
      state.setState({
        visitorUid,
        sessionId,
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
        logger.log('Page show event')
        if (event.persisted) {
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
      isAlreadyInitialized = true
    } catch (error: any) {
      logger.log('Error during init', error.message)
      console.error(error)
      hasErrored = true
    }
  } else if (options?.data) {
    state.setState({ data: options.data })
  }

  return {
    initError: hasErrored,
    start: !hasErrored ? startTracking : () => void 0,
    stop: !hasErrored ? stopTracking : () => void 0,
    sendEvent: !hasErrored
      ? sendEvent
      : (event: string, data?: Record<string, string | number>) => void 0,
    setData: (data: Record<string, string | number>) => {
      state.setState({ data })
    },
  }
}

function generateNewSessionId() {
  const newPageSessionId = `OAS-${getRandomValue()}`
  sessionStorage.setItem(PAGE_SESSION_KEY, newPageSessionId)
  state.setState({ sessionId: newPageSessionId })
  return newPageSessionId
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
